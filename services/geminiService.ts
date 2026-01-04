import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type } from '@google/genai';
import { floatTo16BitPCM, base64ToArrayBuffer, RECORDER_WORKLET_CODE } from '../utils/audioUtils';
import { scheduleWithWebhook, logCallback, logCallStart } from '../utils/mockBackend';

export interface LogEntry {
  type: 'info' | 'tool_req' | 'tool_res' | 'error' | 'webhook';
  message: string;
  data?: any;
}

interface ConnectOptions {
  systemInstruction: string;
  voiceName: string;
  onAudioData: (buffer: AudioBuffer) => void;
  onTranscript: (role: 'user' | 'model', text: string) => void;
  onToolUse: (toolName: string, status: 'started' | 'finished', result?: any) => void;
  onLog: (entry: LogEntry) => void;
  onError: (error: string) => void;
}

// --- Tool Definitions ---

const scheduleAppointmentTool: FunctionDeclaration = {
  name: 'scheduleAppointment',
  description: 'Send booking details to the external scheduling system to check availability and book.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Customer's full name" },
      phone: { type: Type.STRING, description: "Customer's phone number" },
      email: { type: Type.STRING, description: "Customer's email address" },
      date: { type: Type.STRING, description: "Requested date for appointment (Format: YYYY-MM-DD)" },
      time: { type: Type.STRING, description: "Requested time window" },
      request: { type: Type.STRING, description: "Short description of the issue or service needed" }
    },
    required: ['name', 'phone', 'email', 'date', 'time', 'request']
  }
};

const logCallbackTool: FunctionDeclaration = {
  name: 'logCallback',
  description: 'Log a request for a callback (Overflow agent only).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      phone: { type: Type.STRING },
      reason: { type: Type.STRING },
      priority: { type: Type.STRING, enum: ['NORMAL', 'URGENT'] }
    },
    required: ['name', 'phone', 'reason']
  }
};

export class GeminiLiveService {
  private ai: GoogleGenAI;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private isConnected = false;
  private nextStartTime = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sessionPromise: Promise<any> | null = null;

  constructor() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key not found. Please select a key or check configuration.");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async connect(options: ConnectOptions) {
    if (this.isConnected) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // Optimization: Load module only if context exists
      if (this.audioContext) {
        await this.audioContext.audioWorklet.addModule(
            'data:text/javascript;base64,' + btoa(RECORDER_WORKLET_CODE)
        );
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        autoGainControl: true,
        noiseSuppression: true
      }});

      const tools = [scheduleAppointmentTool, logCallbackTool];

      this.sessionPromise = this.ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: options.voiceName } },
          },
          systemInstruction: options.systemInstruction,
          tools: [{ functionDeclarations: tools }],
          inputAudioTranscription: {},
          outputAudioTranscription: {}, 
        },
        callbacks: {
          onopen: () => {
            options.onLog({ type: 'info', message: 'Session Connected' });
            this.isConnected = true;
            logCallStart(); // Log stats
            this.startAudioInput();
          },
          onmessage: async (message: LiveServerMessage) => {
            // Audio Output
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && this.audioContext) {
              const audioBuffer = await this.decodeAudio(audioData);
              options.onAudioData(audioBuffer);
              this.playAudio(audioBuffer);
            }

            // Transcripts
            const inputTranscript = message.serverContent?.inputTranscription?.text;
            if (inputTranscript) {
                options.onTranscript('user', inputTranscript);
            }

            const outputTranscript = message.serverContent?.outputTranscription?.text;
            if (outputTranscript) {
                options.onTranscript('model', outputTranscript);
            }

            // Function Calls
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                options.onToolUse(fc.name, 'started');
                options.onLog({ 
                    type: 'tool_req', 
                    message: `INVOKING TOOL: ${fc.name}`, 
                    data: fc.args 
                });

                let result: any = {};
                
                try {
                  const args = fc.args as any;
                  if (fc.name === 'scheduleAppointment') {
                    options.onLog({ type: 'webhook', message: 'Sending POST request...', data: { url: 'https://n8n-aipulse.up.railway.app/webhook-test/test', payload: args } });
                    
                    result = await scheduleWithWebhook({
                        name: args.name,
                        phone: args.phone,
                        email: args.email,
                        date: args.date,
                        time: args.time,
                        request: args.request
                    });

                    options.onLog({ type: 'webhook', message: 'Webhook Response', data: result });

                  } else if (fc.name === 'logCallback') {
                    result = logCallback(args);
                  }
                  options.onToolUse(fc.name, 'finished', result);
                  options.onLog({ type: 'tool_res', message: `Tool ${fc.name} Finished`, data: result });

                } catch (e) {
                  const errMessage = (e as Error).message;
                  result = { error: errMessage };
                  options.onLog({ type: 'error', message: `Tool Execution Failed: ${errMessage}` });
                }

                this.sessionPromise?.then(session => {
                  session.sendToolResponse({
                    functionResponses: [{
                      id: fc.id,
                      name: fc.name,
                      response: result 
                    }]
                  });
                });
              }
            }
          },
          onclose: () => {
            options.onLog({ type: 'info', message: 'Session Closed' });
            this.disconnect();
          },
          onerror: (err) => {
            options.onError(err.message || "Unknown error");
            options.onLog({ type: 'error', message: `Session Error: ${err.message}` });
            this.disconnect();
          }
        }
      });
    } catch (error: any) {
        options.onError(error.message);
        this.disconnect();
    }
  }

  private startAudioInput() {
    if (!this.audioContext || !this.mediaStream) return;

    const source = this.audioContext.createMediaStreamSource(this.mediaStream);
    this.workletNode = new AudioWorkletNode(this.audioContext, 'recorder-processor');

    this.workletNode.port.onmessage = (event) => {
      const pcmData = floatTo16BitPCM(event.data);
      const base64 = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
      
      this.sessionPromise?.then(session => {
         session.sendRealtimeInput({
            media: {
                mimeType: 'audio/pcm;rate=24000',
                data: base64
            }
         });
      });
    };

    source.connect(this.workletNode);
    this.workletNode.connect(this.audioContext.destination); 
  }

  private async decodeAudio(base64: string): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error("No context");
    const arrayBuffer = base64ToArrayBuffer(base64);
    
    // Decode PCM16 (24kHz typically from Gemini) to Float32 for Web Audio
    const pcm16 = new Int16Array(arrayBuffer);
    const float32 = new Float32Array(pcm16.length);
    for(let i=0; i<pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768.0;
    }

    const buffer = this.audioContext.createBuffer(1, float32.length, 24000); 
    buffer.getChannelData(0).set(float32);
    return buffer;
  }

  private playAudio(buffer: AudioBuffer) {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    const startTime = Math.max(now, this.nextStartTime);
    
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start(startTime);
    
    this.nextStartTime = startTime + buffer.duration;
  }

  disconnect() {
    this.isConnected = false;
    
    if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(t => t.stop());
        this.mediaStream = null;
    }
    
    if (this.workletNode) {
        this.workletNode.disconnect();
        this.workletNode = null;
    }
    
    if (this.audioContext) {
        if (this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
        this.audioContext = null;
    }
    
    this.sessionPromise = null;
    this.nextStartTime = 0;
  }
}
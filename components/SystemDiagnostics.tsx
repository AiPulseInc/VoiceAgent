import React, { useState, useRef, useEffect } from 'react';
import { GeminiLiveService } from '../services/geminiService';
import { scheduleWithWebhook } from '../utils/mockBackend';
import { CheckCircle, XCircle, Loader2, ShieldCheck, Mic, Server, Activity, ArrowLeft, Play, Globe, Send, Terminal, AlertTriangle } from 'lucide-react';

interface TestStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  icon: React.ElementType;
}

interface WebhookForm {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  request: string;
}

interface SystemDiagnosticsProps {
  onBack: () => void;
  webhookUrl: string; // NEW: Prop from parent
}

const SystemDiagnostics: React.FC<SystemDiagnosticsProps> = ({ onBack, webhookUrl }) => {
  // --- Connectivity Test State ---
  const [steps, setSteps] = useState<TestStep[]>([
    { id: 'auth', label: 'API Authorization', status: 'pending', icon: ShieldCheck },
    { id: 'mic', label: 'Microphone Hardware', status: 'pending', icon: Mic },
    { id: 'socket', label: 'Gemini Live Connection', status: 'pending', icon: Server },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const serviceRef = useRef<GeminiLiveService | null>(null);

  // --- Webhook Test State ---
  const [webhookForm, setWebhookForm] = useState<WebhookForm>({
    name: 'Alex Driver',
    phone: '555-0199',
    email: 'alex.driver@example.com',
    date: new Date().toISOString().split('T')[0], // Today YYYY-MM-DD
    time: '14:00',
    request: 'System Check'
  });
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [webhookLog, setWebhookLog] = useState<string[]>([]);

  const addToLog = (msg: string) => setWebhookLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const updateStep = (id: string, updates: Partial<TestStep>) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // --- Connectivity Logic ---
  const runTests = async () => {
    setIsRunning(true);
    setSteps(prev => prev.map(s => ({ ...s, status: 'pending', message: undefined })));
    
    // 1. Auth Check
    updateStep('auth', { status: 'running' });
    try {
      const apiKey = process.env.API_KEY;
      let hasKey = !!apiKey;
      if (!hasKey && window.aistudio) {
        hasKey = await window.aistudio.hasSelectedApiKey();
      }
      if (!hasKey) throw new Error("No API Key found");
      await new Promise(r => setTimeout(r, 500));
      updateStep('auth', { status: 'success', message: 'Valid credential found' });
    } catch (e) {
      updateStep('auth', { status: 'error', message: 'Missing API Key' });
      setIsRunning(false);
      return;
    }

    // 2. Mic Check
    updateStep('mic', { status: 'running' });
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
        updateStep('mic', { status: 'success', message: 'Access granted' });
    } catch (e) {
        updateStep('mic', { status: 'error', message: 'Permission denied or no device' });
        setIsRunning(false);
        return;
    }

    // 3. Socket Check
    updateStep('socket', { status: 'running' });
    try {
        serviceRef.current = new GeminiLiveService();
        await serviceRef.current.connect({
            systemInstruction: "Ping",
            voiceName: "Zephyr",
            webhookUrl: webhookUrl, // Pass for consistency, though unused in ping
            onAudioData: () => {},
            onTranscript: () => {},
            onToolUse: () => {},
            onLog: () => {}, // No-op for this test
            onError: (err) => { throw new Error(err); }
        });
        await new Promise(r => setTimeout(r, 1500)); // Let it sit for a moment
        serviceRef.current.disconnect();
        updateStep('socket', { status: 'success', message: 'Connection established' });
    } catch (e: any) {
        updateStep('socket', { status: 'error', message: e.message || 'Connection failed' });
    } finally {
        setIsRunning(false);
    }
  };

  // --- Webhook Logic ---
  const testWebhook = async () => {
      setWebhookStatus('sending');
      setWebhookLog([]); // Clear logs
      addToLog("🚀 Starting Webhook Test...");
      
      const payload = { ...webhookForm };
      addToLog(`📦 Payload Prepared:\n${JSON.stringify(payload, null, 2)}`);
      addToLog(`📡 Target: ${webhookUrl}`);

      try {
          const result = await scheduleWithWebhook(payload, webhookUrl);
          
          if (result && result.result) {
              addToLog(`✅ Response Received: ${JSON.stringify(result)}`);
              setWebhookStatus('success');
          } else {
             addToLog(`⚠️ Response empty or malformed: ${JSON.stringify(result)}`);
             setWebhookStatus('error');
          }
      } catch (e: any) {
          addToLog(`❌ Error: ${e.message}`);
          setWebhookStatus('error');
      }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6 sm:p-10 font-sans text-gray-200">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-800 transition text-gray-400 hover:text-white">
                <ArrowLeft size={24} />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Activity className="text-blue-500" />
                    System Diagnostics
                </h1>
                <p className="text-sm text-gray-500">Verify connectivity and external integrations</p>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Connectivity */}
        <div className="space-y-6">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-white">Connectivity Check</h2>
                    <button 
                        onClick={runTests} 
                        disabled={isRunning}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition ${isRunning ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                    >
                        {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                        <span>Run Diagnostics</span>
                    </button>
                </div>

                <div className="space-y-4">
                    {steps.map((step) => (
                        <div key={step.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-950/50 border border-gray-800">
                            <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-lg ${
                                    step.status === 'success' ? 'bg-green-900/20 text-green-400' :
                                    step.status === 'error' ? 'bg-red-900/20 text-red-400' :
                                    'bg-gray-800 text-gray-400'
                                }`}>
                                    <step.icon size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-200">{step.label}</p>
                                    {step.message && <p className={`text-xs ${step.status === 'error' ? 'text-red-400' : 'text-gray-500'}`}>{step.message}</p>}
                                </div>
                            </div>
                            <div>
                                {step.status === 'running' && <Loader2 size={20} className="animate-spin text-blue-500" />}
                                {step.status === 'success' && <CheckCircle size={20} className="text-green-500" />}
                                {step.status === 'error' && <XCircle size={20} className="text-red-500" />}
                                {step.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-gray-700" />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue-900/10 border border-blue-800/50 p-6 rounded-xl">
                <div className="flex items-start space-x-3">
                    <Globe className="text-blue-400 shrink-0 mt-1" size={20} />
                    <div>
                        <h3 className="text-sm font-bold text-blue-300 mb-1">About the Webhook</h3>
                        <p className="text-xs text-blue-200/70 leading-relaxed">
                            The agent uses the <code>scheduleAppointment</code> tool to send data to an external n8n workflow. 
                            Use the panel on the right to manually trigger this tool with the exact same payload structure the AI agent uses.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: Webhook Tester */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg flex flex-col h-full">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Send size={18} className="text-purple-400" />
                    Webhook Integration Test
                </h2>
                <p className="text-sm text-gray-500 mt-1">Simulate agent data transmission</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                    <label className="text-xs text-gray-400">Customer Name</label>
                    <input 
                        type="text" 
                        value={webhookForm.name} 
                        onChange={e => setWebhookForm({...webhookForm, name: e.target.value})}
                        className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" 
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-gray-400">Phone</label>
                    <input 
                        type="text" 
                        value={webhookForm.phone} 
                        onChange={e => setWebhookForm({...webhookForm, phone: e.target.value})}
                        className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" 
                    />
                </div>
                <div className="col-span-2 space-y-1">
                    <label className="text-xs text-gray-400">Email</label>
                    <input 
                        type="email" 
                        value={webhookForm.email} 
                        onChange={e => setWebhookForm({...webhookForm, email: e.target.value})}
                        className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" 
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-gray-400">Date (YYYY-MM-DD)</label>
                    <input 
                        type="text" 
                        value={webhookForm.date} 
                        onChange={e => setWebhookForm({...webhookForm, date: e.target.value})}
                        className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" 
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-gray-400">Time</label>
                    <input 
                        type="text" 
                        value={webhookForm.time} 
                        onChange={e => setWebhookForm({...webhookForm, time: e.target.value})}
                        className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" 
                    />
                </div>
                <div className="col-span-2 space-y-1">
                    <label className="text-xs text-gray-400">Service Request</label>
                    <textarea 
                        value={webhookForm.request} 
                        onChange={e => setWebhookForm({...webhookForm, request: e.target.value})}
                        rows={2}
                        className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none resize-none" 
                    />
                </div>
            </div>

            <button 
                onClick={testWebhook}
                disabled={webhookStatus === 'sending'}
                className={`w-full py-3 rounded-lg font-bold text-sm mb-6 flex items-center justify-center space-x-2 transition ${
                    webhookStatus === 'sending' ? 'bg-purple-900/50 text-purple-300 cursor-wait' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/30'
                }`}
            >
                {webhookStatus === 'sending' ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                <span>Send Test Payload to n8n</span>
            </button>

            {/* Log Console */}
            <div className="flex-1 bg-black rounded-lg border border-gray-800 p-4 font-mono text-xs overflow-hidden flex flex-col">
                <div className="flex items-center space-x-2 text-gray-500 border-b border-gray-800 pb-2 mb-2">
                    <Terminal size={12} />
                    <span className="uppercase tracking-wider">Transaction Log</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 text-gray-300">
                    {webhookLog.length === 0 ? (
                        <span className="text-gray-600 italic">Ready to log events...</span>
                    ) : (
                        webhookLog.map((log, i) => (
                            <div key={i} className="break-all whitespace-pre-wrap">{log}</div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDiagnostics;
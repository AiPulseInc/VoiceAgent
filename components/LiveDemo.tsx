import React, { useEffect, useState, useRef, useCallback } from 'react';
import { GeminiLiveService, LogEntry } from '../services/geminiService';
import { AGENT_CONFIGS } from '../constants';
import { AgentType, ChatMessage } from '../types';
import Visualizer from './Visualizer';
import { X, Mic, MicOff, Phone, Settings, Terminal, ChevronDown, ChevronUp } from 'lucide-react';

interface LiveDemoProps {
  agentType: AgentType;
  onClose: () => void;
}

const LiveDemo: React.FC<LiveDemoProps> = ({ agentType, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentTool, setCurrentTool] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<LogEntry[]>([]);
  const [showDebug, setShowDebug] = useState(true);
  
  const serviceRef = useRef<GeminiLiveService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const config = agentType === AgentType.BOOKING ? AGENT_CONFIGS.BOOKING : AGENT_CONFIGS.OVERFLOW;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
     logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [debugLogs]);

  const startSession = useCallback(async () => {
    try {
      setError(null);
      setDebugLogs([]);
      serviceRef.current = new GeminiLiveService();

      // --- TIMEZONE INJECTION ---
      const now = new Date();
      const warsawFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Warsaw',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      });
      const currentDateTime = warsawFormatter.format(now);
      
      const timeContext = `
      
      [SYSTEM CONTEXT]
      - You are operating in the Europe/Warsaw Timezone.
      - The current date and time is: ${currentDateTime}.
      - Use this specific timestamp to resolve relative references like "tomorrow", "today", or "next Monday" into exact YYYY-MM-DD dates.
      `;
      // --------------------------

      await serviceRef.current.connect({
        systemInstruction: config.systemInstruction + timeContext,
        voiceName: config.voice,
        onAudioData: () => {
            // Visualizer handled by CSS
        },
        onTranscript: (role, text) => {
          setMessages(prev => {
             const last = prev[prev.length - 1];
             if (last && last.role === role && text.includes(last.text)) {
                 const newMsg = { ...last, text: text };
                 return [...prev.slice(0, -1), newMsg];
             }
             return [...prev, { role, text, timestamp: new Date() }];
          });
        },
        onToolUse: (toolName, status, result) => {
          if (status === 'started') {
            setCurrentTool(toolName);
          } else {
            setCurrentTool(null);
            if (result && Object.keys(result).length > 0) {
                 setMessages(prev => [...prev, { role: 'system', text: `Tool ${toolName} completed`, timestamp: new Date() }]);
            }
          }
        },
        onLog: (entry) => {
            setDebugLogs(prev => [...prev, entry]);
        },
        onError: (err) => setError(err)
      });
      setIsActive(true);
    } catch (e) {
      setError("Failed to start session.");
    }
  }, [config]);

  const endSession = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.disconnect();
      serviceRef.current = null;
    }
    setIsActive(false);
    onClose();
  }, [onClose]);

  // Initial connect on mount
  useEffect(() => {
    const timer = setTimeout(() => {
        startSession();
    }, 500);
    return () => {
        clearTimeout(timer);
        if (serviceRef.current) serviceRef.current.disconnect();
    };
  }, [startSession]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="flex w-full max-w-5xl h-[90vh] gap-4">
        
        {/* Main Chat Interface */}
        <div className="flex-1 bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <div>
                        <h3 className="font-bold text-white">{config.name}</h3>
                        <p className="text-xs text-gray-400">Powered by Gemini Live</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => setShowDebug(!showDebug)}
                        className={`text-xs flex items-center space-x-1 px-2 py-1 rounded border ${showDebug ? 'bg-blue-900/50 border-blue-500 text-blue-200' : 'border-gray-600 text-gray-400'}`}
                    >
                        <Terminal size={12} />
                        <span>Debug Log</span>
                    </button>
                    <button onClick={endSession} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
                {messages.length === 0 && !error && (
                    <div className="text-center text-gray-500 mt-20">
                        <p>{isActive ? "Connected! Say 'Hello' to start." : "Connecting to secure line..."}</p>
                        <p className="text-xs mt-2">Microphone is active.</p>
                    </div>
                )}
                
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                            msg.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : msg.role === 'system'
                            ? 'bg-gray-800 text-xs text-gray-400 italic border border-gray-700'
                            : 'bg-gray-700 text-gray-200'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                
                {/* Tool Activity Indicator */}
                {currentTool && (
                    <div className="flex justify-center">
                        <div className="bg-gray-800 text-orange-400 text-xs px-3 py-1 rounded-full flex items-center space-x-2 border border-orange-500/30 animate-pulse">
                            <Settings size={12} className="animate-spin" />
                            <span>System accessing: {currentTool}...</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Controls */}
            <div className="bg-gray-800 p-6 flex flex-col items-center space-y-4 border-t border-gray-700">
                <div className="w-full flex justify-between items-center px-4">
                    <div className="text-xs text-gray-500 flex items-center space-x-2">
                        <Visualizer isActive={isActive} />
                        <span>{isActive ? 'Listening...' : 'Paused'}</span>
                    </div>
                    <span className="text-xs text-gray-600 uppercase tracking-widest">{config.voice}</span>
                </div>

                <div className="flex items-center space-x-6">
                    <button 
                        className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-700 text-white hover:bg-gray-600 transition"
                        onClick={() => {}}
                    >
                        {isActive ? <Mic size={24} /> : <MicOff size={24} />}
                    </button>
                    <button 
                        onClick={endSession}
                        className="w-14 h-14 rounded-full flex items-center justify-center bg-red-600 text-white hover:bg-red-700 transition shadow-lg shadow-red-900/50"
                    >
                        <Phone size={24} className="fill-current" />
                    </button>
                </div>
            </div>
        </div>

        {/* Debug Side Panel */}
        {showDebug && (
            <div className="w-80 bg-black rounded-2xl border border-gray-800 flex flex-col overflow-hidden shadow-2xl">
                <div className="bg-gray-900 p-3 border-b border-gray-800 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-300 font-mono text-xs font-bold uppercase tracking-wider">
                        <Terminal size={14} className="text-blue-500" />
                        Live Agent Logs
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono text-xs">
                    {debugLogs.length === 0 && (
                        <div className="text-gray-600 italic text-center mt-10">Waiting for events...</div>
                    )}
                    
                    {debugLogs.map((log, i) => (
                        <div key={i} className={`p-2 rounded border ${
                            log.type === 'tool_req' ? 'bg-blue-900/20 border-blue-800 text-blue-300' :
                            log.type === 'tool_res' ? 'bg-green-900/20 border-green-800 text-green-300' :
                            log.type === 'webhook' ? 'bg-purple-900/20 border-purple-800 text-purple-300' :
                            log.type === 'chat' ? 'bg-gray-800/50 border-gray-700 text-gray-300' :
                            log.type === 'error' ? 'bg-red-900/20 border-red-800 text-red-300' :
                            'bg-gray-900 border-gray-800 text-gray-400'
                        }`}>
                            <div className="flex justify-between items-start mb-1 opacity-50">
                                <span>{log.type.toUpperCase()}</span>
                            </div>
                            <div className="mb-1 font-semibold break-words">{log.message}</div>
                            {log.data && (
                                <pre className="bg-black/50 p-2 rounded overflow-x-auto text-[10px] text-gray-300">
                                    {JSON.stringify(log.data, null, 2)}
                                </pre>
                            )}
                        </div>
                    ))}
                    <div ref={logsEndRef} />
                </div>
                
                <div className="p-2 bg-gray-900 border-t border-gray-800 text-[10px] text-gray-500 text-center">
                    n8n Webhook: .../webhook-test/test
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default LiveDemo;
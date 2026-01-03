import React, { useState, useEffect } from 'react';
import AgentCard from './components/AgentCard';
import LiveDemo from './components/LiveDemo';
import SystemDiagnostics from './components/SystemDiagnostics';
import { AgentType } from './types';
import { getDashboardStats } from './utils/mockBackend';
import { Wrench, PhoneCall, ShieldCheck, Activity, Key, Stethoscope } from 'lucide-react';

const App: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<AgentType | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'diagnostics'>('landing');
  const [stats, setStats] = useState(getDashboardStats());
  const [keyStatus, setKeyStatus] = useState<'checking' | 'valid' | 'needed'>('checking');

  // Poll stats for dashboard liveliness
  useEffect(() => {
    const interval = setInterval(() => {
        setStats(getDashboardStats());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Check API Key status on mount
  useEffect(() => {
    const checkKey = async () => {
      // 1. Check environment variable first (Highest Priority)
      if (process.env.API_KEY) {
        setKeyStatus('valid');
        return;
      }

      // 2. Check AI Studio context
      if (window.aistudio) {
        try {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setKeyStatus(hasKey ? 'valid' : 'needed');
        } catch (e) {
          console.error("Error checking API key:", e);
          setKeyStatus('needed');
        }
      } else {
        setKeyStatus('needed'); 
      }
    };
    checkKey();
  }, []);

  const handleTestAgent = async (type: AgentType) => {
    // 1. If we have a hardcoded/env key, proceed immediately
    if (process.env.API_KEY) {
        setActiveDemo(type);
        return;
    }

    // 2. Otherwise try AI Studio flow
    if (window.aistudio) {
      try {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
           await window.aistudio.openSelectKey();
           setKeyStatus('valid');
        }
      } catch (e) {
        console.error("Key selection failed:", e);
        return;
      }
    }
    setActiveDemo(type);
  };

  const handleKeySelect = async () => {
     if (window.aistudio) {
        await window.aistudio.openSelectKey();
        setKeyStatus('valid');
     }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => setCurrentView('landing')}
            >
              <div className="bg-red-600 p-2 rounded-lg">
                <Wrench className="text-white h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">RapidTire <span className="text-red-500">AI</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
              <button onClick={() => setCurrentView('landing')} className="hover:text-white transition">Agents</button>
              <button onClick={() => setCurrentView('landing')} className="hover:text-white transition">Benefits</button>
              <button onClick={() => setCurrentView('landing')} className="hover:text-white transition">How it Works</button>
              <button onClick={() => setCurrentView('landing')} className="text-red-400 hover:text-red-300 transition">Live Stats</button>
              
              {/* New Diagnostics Button */}
              <button 
                onClick={() => setCurrentView('diagnostics')} 
                className={`flex items-center space-x-1 transition ${currentView === 'diagnostics' ? 'text-white' : 'hover:text-white'}`}
              >
                <Stethoscope size={16} />
                <span>Diagnostics</span>
              </button>

              {keyStatus === 'needed' && !process.env.API_KEY && (
                  <button 
                    onClick={handleKeySelect}
                    className="flex items-center space-x-2 bg-yellow-600/20 text-yellow-500 px-3 py-1 rounded border border-yellow-600/50 hover:bg-yellow-600/30 transition text-xs"
                  >
                    <Key size={12} />
                    <span>Select API Key</span>
                  </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content View Switcher */}
      {currentView === 'diagnostics' ? (
        <SystemDiagnostics onBack={() => setCurrentView('landing')} />
      ) : (
        <>
          {/* Hero Section */}
          <header className="relative bg-gray-900 py-24 sm:py-32 overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-transparent z-10" />
                <img 
                    src="https://images.unsplash.com/photo-1578844251758-2f71da645217?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
                    alt="Workshop background" 
                    className="w-full h-full object-cover opacity-30"
                />
            </div>
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
                  Peak Season?<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Don't Miss a Single Call.</span>
                </h1>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  Deploy intelligent voice agents to handle tire-change bookings, manage service bay allocation, and triage after-hours emergencies automatically.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#agents" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition">
                    Try Demo Agents
                  </a>
                  <div className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-300">
                    <span className="flex h-3 w-3 relative mr-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    System Operational
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Agents Section */}
          <section id="agents" className="py-20 bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">Meet Your New Workforce</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">Choose an agent to interact with. They are powered by the Gemini Live API, capable of handling complex booking logic and safety triage.</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <AgentCard type={AgentType.BOOKING} onTest={handleTestAgent} />
                <AgentCard type={AgentType.OVERFLOW} onTest={handleTestAgent} />
              </div>
            </div>
          </section>

          {/* Live Dashboard Mockup */}
          <section id="dashboard" className="py-12 bg-gray-900 border-y border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Activity className="text-green-500" />
                        Live Shop Activity
                    </h2>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Simulated Backend Data</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <p className="text-gray-400 text-sm mb-1">Total Bookings Today</p>
                        <p className="text-3xl font-bold text-white">{stats.bookingsCount}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <p className="text-gray-400 text-sm mb-1">Callbacks Logged</p>
                        <p className="text-3xl font-bold text-white">{stats.callbacksCount}</p>
                    </div>
                     <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <p className="text-gray-400 text-sm mb-1">Bay Efficiency</p>
                        <p className="text-3xl font-bold text-white">94%</p>
                    </div>
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-8">
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Recent Bookings</h3>
                        <div className="space-y-3">
                            {stats.recentBookings.length === 0 ? <p className="text-gray-500 text-sm">No bookings yet.</p> : stats.recentBookings.map((b) => (
                                <div key={b.id} className="flex justify-between items-center text-sm border-b border-gray-700 pb-2 last:border-0">
                                    <span className="text-gray-300">{b.customerName}</span>
                                    <span className="text-blue-400 bg-blue-900/20 px-2 py-0.5 rounded text-xs">{b.serviceType}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Recent Callback Requests</h3>
                        <div className="space-y-3">
                            {stats.recentCallbacks.length === 0 ? <p className="text-gray-500 text-sm">No callbacks pending.</p> : stats.recentCallbacks.map((c) => (
                                <div key={c.id} className="flex justify-between items-center text-sm border-b border-gray-700 pb-2 last:border-0">
                                    <span className="text-gray-300">{c.name}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs ${c.priority === 'URGENT' ? 'text-red-400 bg-red-900/20' : 'text-gray-400 bg-gray-700'}`}>{c.reason}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          </section>

          {/* How it Works */}
          <section id="how-it-works" className="py-20 bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white">How It Works</h2>
                </div>
                
                <div className="grid md:grid-cols-4 gap-8">
                    {[
                        { icon: PhoneCall, title: "Customer Calls", desc: "Calls are routed to the AI agent instantly, zero hold time." },
                        { icon: Wrench, title: "Details Collected", desc: "Agent identifies vehicle, service need, and specialized requirements." },
                        { icon: ShieldCheck, title: "Logic & Safety", desc: "AI checks bay availability and triages unsafe driving conditions." },
                        { icon: Activity, title: "Action Taken", desc: "Appointment is booked directly into the system or callback is logged." }
                    ].map((item, i) => (
                        <div key={i} className="text-center">
                            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500 border border-gray-700">
                                <item.icon size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                            <p className="text-gray-400 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© 2024 RapidTire Auto Service Demo. Powered by Gemini Live API.</p>
        </div>
      </footer>

      {/* Live Demo Modal - Only available on landing page for now, or globally if needed */}
      {activeDemo && (
        <LiveDemo 
            agentType={activeDemo} 
            onClose={() => setActiveDemo(null)} 
        />
      )}
    </div>
  );
};

export default App;
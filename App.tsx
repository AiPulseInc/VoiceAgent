import React, { useState, useEffect } from 'react';
import AgentCard from './components/AgentCard';
import LiveDemo from './components/LiveDemo';
import SystemDiagnostics from './components/SystemDiagnostics';
import { AgentType } from './types';
import { getDashboardStats } from './utils/mockBackend';
import { 
  Wrench, PhoneCall, ShieldCheck, Activity, Key, Stethoscope, 
  Moon, Sun, Globe, Zap, Clock, TrendingUp, 
  Database, BarChart3, Timer, Award, PieChart,
  Facebook, Twitter, Linkedin, Instagram, MapPin, Mail, Sparkles, Download, Loader2
} from 'lucide-react';

// Translation Dictionary
const TRANSLATIONS = {
  en: {
    heroTitle: "Peak Season?\nDon't Miss a Single Call.",
    heroSubtitle: "Deploy intelligent voice agents to handle tire-change bookings, manage service bay allocation, and triage after-hours emergencies automatically.",
    cta: "Try Demo Agents",
    genImage: "Generate AI Background",
    downloadImage: "Save Image",
    systemStatus: "System Operational",
    agentsTitle: "Meet Your New Workforce",
    agentsDesc: "Choose an agent to interact with. They are powered by the Gemini Live API, capable of handling complex booking logic and safety triage.",
    
    // Benefits
    benefitsTitle: "Why Automated Voice?",
    benefit1Title: "24/7 Availability",
    benefit1Desc: "Never miss a customer, even at 3 AM or during lunch breaks.",
    benefit2Title: "Infinite Scalability",
    benefit2Desc: "Handle 100 simultaneous calls during peak snow days without extra staff.",
    benefit3Title: "Cost Efficiency",
    benefit3Desc: "Reduce overhead costs by automating routine bookings and FAQs.",
    benefit4Title: "Zero Hold Time",
    benefit4Desc: "Customers get instant answers. No more 'please hold' music.",
    benefit5Title: "Consistent Quality",
    benefit5Desc: "Every customer receives the same polite, accurate service script.",
    benefit6Title: "Data Driven",
    benefit6Desc: "Capture reasons for every call to optimize your business strategy.",

    // Dashboard
    dashboardTitle: "Live Shop Activity",
    totalCalls: "Total Calls Processed",
    bookings: "Confirmed Bookings",
    callbacks: "Callbacks Logged",
    recentBookings: "Recent Bookings",
    recentCallbacks: "Recent Callback Requests",
    noData: "No data yet.",

    // How it works
    howItWorksTitle: "How It Works",
    step1Title: "Customer Calls",
    step1Desc: "Calls are routed via VoIP or PSTN directly to our neural voice engine. Latency is minimized to <500ms for a completely natural, human-like conversation feel.",
    step2Title: "Gathering Details",
    step2Desc: "The agent conducts a fluid dialogue to establish vehicle make, tire size, and preferred dates, without forcing customers through menu options.",
    step3Title: "Logic & Safety",
    step3Desc: "Backend logic checks real-time bay availability. Safety protocols automatically flag dangerous keywords (e.g., 'wobbling', 'blowout') to prioritize emergency handling.",
    step4Title: "Action Taken",
    step4Desc: "Appointments are instantly written to your Workshop Management Software (WMS). Complex or high-priority issues are flagged for immediate human manager review.",
    step5Title: "Seamless Sync",
    step5Desc: "Two-way synchronization ensures the AI always knows your current schedule. If a bay opens up due to a cancellation, the AI knows immediately.",
    step6Title: "Smart Analytics",
    step6Desc: "Every interaction is transcribed and analyzed. Dashboard metrics reveal peak call times, common customer questions, and lost revenue opportunities.",

    // Footer
    footerDesc: "Empowering automotive businesses with next-generation voice AI. Handle peak season volume with ease.",
    footerAddress: "RapidTire HQ",
    footerStreet: "ul. Złota 44, 00-120",
    footerCity: "Warszawa, Poland",
    footerContact: "Contact Us",
    footerLegal: "Legal",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Service",
    footerCookies: "Cookie Settings",
    footerLinks: "Quick Links",

    navAgents: "Agents",
    navDashboard: "Live Activity",
    navBenefits: "Benefits",
    navHow: "How it works",
    navDiagnostics: "Diagnostics",
    selectKey: "Select API Key",
    ver: "Version 0.51"
  },
  pl: {
    heroTitle: "Szczyt Sezonu?\nNie Przegap Żadnego Telefonu.",
    heroSubtitle: "Wdróż inteligentnych agentów głosowych do obsługi rezerwacji wymiany opon, zarządzania stanowiskami i automatycznej segregacji zgłoszeń awaryjnych.",
    cta: "Wypróbuj Agentów",
    genImage: "Generuj Tło AI",
    downloadImage: "Zapisz Obraz",
    systemStatus: "System Operacyjny",
    agentsTitle: "Poznaj Swoją Nową Kadrę",
    agentsDesc: "Wybierz agenta do rozmowy. Są napędzani przez Gemini Live API, zdolni do obsługi złożonej logiki rezerwacji i segregacji bezpieczeństwa.",
    
    // Benefits
    benefitsTitle: "Dlaczego Automatyzacja Głosu?",
    benefit1Title: "Dostępność 24/7",
    benefit1Desc: "Nigdy nie przegap klienta, nawet o 3 w nocy czy podczas przerw obiadowych.",
    benefit2Title: "Nieskończona Skalowalność",
    benefit2Desc: "Obsłuż 100 jednoczesnych połączeń w dni śnieżne bez dodatkowego personelu.",
    benefit3Title: "Efektywność Kosztowa",
    benefit3Desc: "Obniż koszty stałe, automatyzując rutynowe rezerwacje i pytania FAQ.",
    benefit4Title: "Zero Oczekiwania",
    benefit4Desc: "Klienci otrzymują natychmiastowe odpowiedzi. Koniec z muzyką na czekanie.",
    benefit5Title: "Stała Jakość",
    benefit5Desc: "Każdy klient otrzymuje tę samą uprzejmą i dokładną obsługę.",
    benefit6Title: "Oparte na Danych",
    benefit6Desc: "Rejestruj powody każdego połączenia, aby optymalizować strategię biznesową.",

    // Dashboard
    dashboardTitle: "Aktywność Warsztatu na Żywo",
    totalCalls: "Przetworzone Połączenia",
    bookings: "Potwierdzone Rezerwacje",
    callbacks: "Zalogowane Oddzwonienia",
    recentBookings: "Ostatnie Rezerwacje",
    recentCallbacks: "Ostatnie Prośby o Kontakt",
    noData: "Brak danych.",

    // How it works
    howItWorksTitle: "Jak To Działa",
    step1Title: "Klient Dzwoni",
    step1Desc: "Połączenia są kierowane przez VoIP bezpośrednio do silnika głosowego. Opóźnienie wynosi <500ms, co zapewnia całkowicie naturalne, ludzkie odczucie rozmowy.",
    step2Title: "Zbieranie Szczegółów",
    step2Desc: "Agent prowadzi swobodny dialog, aby ustalić markę pojazdu, rozmiar opon i preferowane terminy, bez zmuszania klientów do wybierania opcji w menu.",
    step3Title: "Logika i Bezpieczeństwo",
    step3Desc: "System sprawdza dostępność stanowisk w czasie rzeczywistym. Protokoły bezpieczeństwa wykrywają słowa kluczowe (np. 'bicie', 'wybuch') i priorytetyzują awarie.",
    step4Title: "Podjęcie Działania",
    step4Desc: "Wizyty są natychmiast zapisywane w Twoim systemie warsztatowym (WMS). Złożone lub priorytetowe problemy są oznaczane do przeglądu przez menedżera.",
    step5Title: "Płynna Synchronizacja",
    step5Desc: "Dwukierunkowa synchronizacja zapewnia, że AI zawsze zna Twój aktualny grafik. Jeśli zwolni się miejsce, AI wie o tym natychmiast.",
    step6Title: "Inteligentna Analityka",
    step6Desc: "Każda interakcja jest transkrybowana i analizowana. Pulpit nawigacyjny ujawnia szczytowe godziny połączeń, częste pytania i utracone szanse sprzedaży.",

    // Footer
    footerDesc: "Wspieramy branżę motoryzacyjną nową generacją głosowego AI. Obsłuż szczyt sezonu z łatwością.",
    footerAddress: "Siedziba RapidTire",
    footerStreet: "ul. Złota 44, 00-120",
    footerCity: "Warszawa, Polska",
    footerContact: "Kontakt",
    footerLegal: "Prawne",
    footerPrivacy: "Polityka Prywatności",
    footerTerms: "Regulamin Usług",
    footerCookies: "Ustawienia Cookies",
    footerLinks: "Szybkie Linki",

    navAgents: "Agenci",
    navDashboard: "Aktywność",
    navBenefits: "Korzyści",
    navHow: "Jak to działa",
    navDiagnostics: "Diagnostyka",
    selectKey: "Wybierz Klucz API",
    ver: "Version 0.51"
  }
};

const App: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<AgentType | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'diagnostics'>('landing');
  const [stats, setStats] = useState(getDashboardStats());
  const [keyStatus, setKeyStatus] = useState<'checking' | 'valid' | 'needed'>('checking');
  
  // Theme & Language State
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState<'en' | 'pl'>('en');

  // Placeholder for Image Gen - keeping consistent with previous state although not main focus
  const [heroImage, setHeroImage] = useState<string>("https://images.unsplash.com/photo-1578844251758-2f71da645217?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const t = TRANSLATIONS[language];

  // Apply theme class to wrapper
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  const scrollToSection = (id: string) => {
    setCurrentView('landing');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  // Simplified image handler to maintain compatibility without full image service code
  const handleGenerateImage = async () => {
      // Placeholder for actual implementation if requested
      setIsGeneratingImage(true);
      setTimeout(() => setIsGeneratingImage(false), 1000);
  };

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = heroImage;
    link.download = 'rapidtire-hero-ai.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => { setCurrentView('landing'); window.scrollTo(0,0); }}
            >
              <div className="bg-red-600 p-2 rounded-lg">
                <Wrench className="text-white h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">RapidTire <span className="text-red-500">AI</span></span>
            </div>
            
            <div className="flex items-center space-x-4 md:space-x-8 text-sm font-medium text-gray-600 dark:text-gray-300">
              <button onClick={() => scrollToSection('agents')} className="hover:text-red-600 dark:hover:text-white transition hidden md:block">{t.navAgents}</button>
              <button onClick={() => scrollToSection('dashboard')} className="hover:text-red-600 dark:hover:text-white transition hidden md:block">{t.navDashboard}</button>
              <button onClick={() => scrollToSection('benefits')} className="hover:text-red-600 dark:hover:text-white transition hidden md:block">{t.navBenefits}</button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-red-600 dark:hover:text-white transition hidden md:block">{t.navHow}</button>
              
              <button 
                onClick={() => setCurrentView('diagnostics')} 
                className={`flex items-center space-x-1 transition ${currentView === 'diagnostics' ? 'text-red-600 dark:text-white' : 'hover:text-red-600 dark:hover:text-white'}`}
              >
                <Stethoscope size={16} />
                <span className="hidden sm:inline">{t.navDiagnostics}</span>
              </button>

              {/* Tools: Theme & Lang */}
              <div className="flex items-center space-x-2 border-l border-gray-300 dark:border-gray-700 pl-4">
                 <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-400"
                 >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                 </button>
                 <button 
                    onClick={() => setLanguage(prev => prev === 'en' ? 'pl' : 'en')}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-400 font-bold text-xs flex items-center gap-1"
                 >
                    <Globe size={18} />
                    {/* Show the TARGET language */}
                    <span>{language === 'en' ? 'PL' : 'EN'}</span>
                 </button>
              </div>

              {keyStatus === 'needed' && !process.env.API_KEY && (
                  <button 
                    onClick={handleKeySelect}
                    className="hidden sm:flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-600/20 text-yellow-700 dark:text-yellow-500 px-3 py-1 rounded border border-yellow-200 dark:border-yellow-600/50 hover:bg-yellow-200 dark:hover:bg-yellow-600/30 transition text-xs"
                  >
                    <Key size={12} />
                    <span>{t.selectKey}</span>
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
          <header className="relative bg-white dark:bg-gray-900 min-h-[calc(100vh-4rem)] flex items-center overflow-hidden group py-12">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/95 dark:to-transparent z-10" />
                <img 
                    src={heroImage}
                    alt="Workshop background" 
                    className="w-full h-full object-cover transition-all duration-1000 object-center"
                />
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-4xl">
                <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8 whitespace-pre-line leading-tight">
                  {t.heroTitle}
                </h1>
                <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl">
                  {t.heroSubtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => scrollToSection('agents')} className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition shadow-xl shadow-red-600/20">
                    {t.cta}
                  </button>
                  <div className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                    <span className="flex h-3 w-3 relative mr-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    {t.systemStatus}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Agents Section */}
          <section id="agents" className="py-20 bg-gray-50 dark:bg-gray-950 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t.agentsTitle}</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t.agentsDesc}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <AgentCard type={AgentType.BOOKING} language={language} onTest={handleTestAgent} />
                <AgentCard type={AgentType.OVERFLOW} language={language} onTest={handleTestAgent} />
              </div>
            </div>
          </section>

          {/* Live Dashboard Mockup (Moved before Benefits) */}
          <section id="dashboard" className="py-12 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Activity className="text-green-500" />
                        {t.dashboardTitle}
                    </h2>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Simulated Backend Data</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t.totalCalls}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalCalls}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t.bookings}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.bookingsCount}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t.callbacks}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.callbacksCount}</p>
                    </div>
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50">
                        <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wide">{t.recentBookings}</h3>
                        <div className="space-y-3">
                            {stats.recentBookings.length === 0 ? <p className="text-gray-500 text-sm">{t.noData}</p> : stats.recentBookings.map((b) => (
                                <div key={b.id} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
                                    <span className="text-gray-700 dark:text-gray-300">{b.customerName}</span>
                                    <span className="text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 px-2 py-0.5 rounded text-xs">{b.serviceType}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50">
                        <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wide">{t.recentCallbacks}</h3>
                        <div className="space-y-3">
                            {stats.recentCallbacks.length === 0 ? <p className="text-gray-500 text-sm">{t.noData}</p> : stats.recentCallbacks.map((c) => (
                                <div key={c.id} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
                                    <span className="text-gray-700 dark:text-gray-300">{c.name}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs ${c.priority === 'URGENT' ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20' : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'}`}>{c.reason}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          </section>

          {/* Benefits Section (Expanded) */}
          <section id="benefits" className="py-20 bg-gray-50 dark:bg-gray-950 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t.benefitsTitle}</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: Clock, title: t.benefit1Title, desc: t.benefit1Desc, color: "text-blue-500" },
                        { icon: Zap, title: t.benefit2Title, desc: t.benefit2Desc, color: "text-yellow-500" },
                        { icon: TrendingUp, title: t.benefit3Title, desc: t.benefit3Desc, color: "text-green-500" },
                        { icon: Timer, title: t.benefit4Title, desc: t.benefit4Desc, color: "text-purple-500" },
                        { icon: Award, title: t.benefit5Title, desc: t.benefit5Desc, color: "text-red-500" },
                        { icon: PieChart, title: t.benefit6Title, desc: t.benefit6Desc, color: "text-indigo-500" }
                    ].map((item, i) => (
                        <div key={i} className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-gray-50 dark:bg-gray-900 ${item.color} shadow-sm`}>
                                <item.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
          </section>

          {/* How it Works (Expanded) */}
          <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t.howItWorksTitle}</h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: PhoneCall, title: t.step1Title, desc: t.step1Desc },
                        { icon: Wrench, title: t.step2Title, desc: t.step2Desc },
                        { icon: ShieldCheck, title: t.step3Title, desc: t.step3Desc },
                        { icon: Activity, title: t.step4Title, desc: t.step4Desc },
                        { icon: Database, title: t.step5Title, desc: t.step5Desc },
                        { icon: BarChart3, title: t.step6Title, desc: t.step6Desc }
                    ].map((item, i) => (
                        <div key={i} className="text-center group p-4">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-600 dark:text-red-500 border border-gray-200 dark:border-gray-700 shadow-lg group-hover:scale-110 transition-transform">
                                <item.icon size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
          </section>
        </>
      )}

      {/* Footer (Expanded) */}
      <footer className="bg-white dark:bg-gray-950 pt-16 pb-8 border-t border-gray-200 dark:border-gray-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Wrench className="text-white h-4 w-4" />
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">RapidTire <span className="text-red-500">AI</span></span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t.footerDesc}
              </p>
              <div className="flex space-x-4 pt-2">
                <a href="#" className="text-gray-400 hover:text-blue-500 transition"><Facebook size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition"><Twitter size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-blue-700 transition"><Linkedin size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition"><Instagram size={20} /></a>
              </div>
            </div>

            {/* Links Column */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-xs">{t.footerLinks}</h3>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection('agents')} className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition">{t.navAgents}</button></li>
                <li><button onClick={() => scrollToSection('dashboard')} className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition">{t.navDashboard}</button></li>
                <li><button onClick={() => scrollToSection('benefits')} className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition">{t.navBenefits}</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition">{t.navHow}</button></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-xs">{t.footerLegal}</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition">{t.footerPrivacy}</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition">{t.footerTerms}</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition">{t.footerCookies}</a></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-xs">{t.footerContact}</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 text-gray-600 dark:text-gray-400">
                  <MapPin size={18} className="shrink-0 mt-0.5 text-red-500" />
                  <span>
                    {t.footerAddress}<br/>
                    {t.footerStreet}<br/>
                    {t.footerCity}
                  </span>
                </li>
                <li className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                  <Mail size={18} className="shrink-0 text-red-500" />
                  <a href="mailto:contact@rapidtire.ai" className="hover:text-white transition">contact@rapidtire.ai</a>
                </li>
                 <li className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                  <PhoneCall size={18} className="shrink-0 text-red-500" />
                  <span>+48 22 555 01 99</span>
                </li>
              </ul>
            </div>

          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
            <p>&copy; 2026 RapidTire Auto Service Demo. Powered by Google Gemini Live.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
               <span>{t.ver}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Live Demo Modal */}
      {activeDemo && (
        <LiveDemo 
            agentType={activeDemo} 
            language={language}
            onClose={() => setActiveDemo(null)} 
        />
      )}
    </div>
  );
};

export default App;
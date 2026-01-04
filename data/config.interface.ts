import { AgentType } from '../types';

export interface AgentConfig {
  name: string;
  voice: string;
  systemInstruction: string;
}

export interface AgentCardContent {
  name: string;
  description: string;
  capabilities: { text: string; color: string }[];
}

export interface ThemeConfig {
  primaryColor: string; // e.g. 'red', 'teal', 'blue' (used for dynamic class construction where safe)
  primaryText: string;  // 'text-red-600'
  primaryBg: string;    // 'bg-red-600'
  primaryBorder: string; // 'border-red-600'
  lightBg: string;      // 'bg-red-50'
  icon: string;         // Name of the Lucide icon to render (e.g. 'Wrench', 'Stethoscope')
}

export interface ContentDictionary {
  heroTitle: string;
  heroSubtitle: string;
  cta: string;
  systemStatus: string;
  agentsTitle: string;
  agentsDesc: string;
  
  // Benefits
  benefitsTitle: string;
  benefit1Title: string;
  benefit1Desc: string;
  benefit2Title: string;
  benefit2Desc: string;
  benefit3Title: string;
  benefit3Desc: string;
  benefit4Title: string;
  benefit4Desc: string;
  benefit5Title: string;
  benefit5Desc: string;
  benefit6Title: string;
  benefit6Desc: string;

  // Dashboard
  dashboardTitle: string;
  totalCalls: string;
  bookings: string;
  callbacks: string;
  recentBookings: string;
  recentCallbacks: string;
  noData: string;

  // How it works
  howItWorksTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  step5Title: string;
  step5Desc: string;
  step6Title: string;
  step6Desc: string;

  // Footer
  footerDesc: string;
  footerAddress: string;
  footerStreet: string;
  footerCity: string;
  footerContact: string;
  footerLegal: string;
  footerPrivacy: string;
  footerTerms: string;
  footerCookies: string;
  footerLinks: string;

  navAgents: string;
  navDashboard: string;
  navBenefits: string;
  navHow: string;
  navDiagnostics: string;
  selectKey: string;
  ver: string;

  // Agent Cards
  agents: {
    [AgentType.BOOKING]: AgentCardContent;
    [AgentType.OVERFLOW]: AgentCardContent;
  }
}

export interface DemoConfig {
  id: string;
  name: string;
  theme: ThemeConfig;
  images: {
    hero: string;
  };
  webhookUrl: string;
  agents: {
    [AgentType.BOOKING]: AgentConfig;
    [AgentType.OVERFLOW]: AgentConfig;
  };
  content: {
    en: ContentDictionary;
    pl: ContentDictionary;
  };
}
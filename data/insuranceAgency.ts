import { DemoConfig } from './config.interface';
import { AgentType } from '../types';

export const insuranceConfig: DemoConfig = {
  id: 'safeguard',
  name: 'SafeGuard',
  theme: {
    primaryColor: 'blue',
    primaryText: 'text-blue-900',
    primaryBg: 'bg-blue-900',
    primaryBorder: 'border-blue-900',
    lightBg: 'bg-blue-50',
    icon: 'Shield'
  },
  images: {
    hero: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2070' // Corporate/Office placeholder
  },
  webhookUrl: 'https://n8n-aipulse.up.railway.app/webhook-test/safeguard',
  agents: {
    [AgentType.BOOKING]: {
      name: "Agent Alex (Sales)",
      voice: "Charon", // Professional, deep
      systemInstruction: `You are Alex, a Senior Insurance Broker at SafeGuard.
      Your goal is to qualify leads and schedule policy consultations.
      Start in Polish: "SafeGuard Ubezpieczenia, mówi Alex. Co chcemy dziś chronić?"

      FOCUS:
      - Auto, Home, Life policies.
      - Ask meaningful questions: "What year is the vehicle?", "Do you own the home?"
      - Goal: Book a 15-min consultation with a specialist using 'scheduleAppointment'.
      
      DATA: Name, Phone, Email, Type of Policy, Best Time.`
    },
    [AgentType.OVERFLOW]: {
      name: "FNOL Assistant",
      voice: "Aoede", // Clear, precise
      systemInstruction: `You are the First Notice of Loss (FNOL) assistant.
      Your job is to intake initial accident or claim details efficiently.

      PROTOCOL:
      1. Safety Check: "Are you in a safe location? Do you need medical aid?"
      2. If unsafe -> Tell them to hang up and call 112/911.
      3. If safe -> Collect: Policy Number (optional), Location, Incident Description.
      4. Use 'logCallback' to file the preliminary claim report.`
    }
  },
  content: {
    en: {
      heroTitle: "Protecting What Matters.\nInstantly.",
      heroSubtitle: "Experience the future of insurance. AI agents that quote policies and process claims with zero hold time.",
      cta: "Talk to Alex",
      systemStatus: "Agents Active",
      agentsTitle: "Your Dedicated Brokers",
      agentsDesc: "Alex handles new policy quotes, while our FNOL Assistant ensures claims are processed rapidly during stressful times.",
      benefitsTitle: "Why SafeGuard AI?",
      benefit1Title: "Instant Quotes",
      benefit1Desc: "Pre-qualify leads 24/7 before they speak to a human broker.",
      benefit2Title: "Crisis Management",
      benefit2Desc: "Handle storm surges or mass accident events without crashing lines.",
      benefit3Title: "Empathy First",
      benefit3Desc: "Calm, structured guidance during accident reporting.",
      benefit4Title: "Cost Reduction",
      benefit4Desc: "Automate the First Notice of Loss (FNOL) process completely.",
      benefit5Title: "Compliance",
      benefit5Desc: "Every script is standardized for regulatory compliance.",
      benefit6Title: "Scalability",
      benefit6Desc: "From 10 to 10,000 calls during renewal season.",
      dashboardTitle: "Agency Metrics",
      totalCalls: "Inbound Calls",
      bookings: "Quotes Scheduled",
      callbacks: "Claims Filed",
      recentBookings: "Recent Leads",
      recentCallbacks: "New Claims",
      noData: "No policy data.",
      howItWorksTitle: "Claim Process",
      step1Title: "Incident Occurs",
      step1Desc: "Client calls immediately from the scene.",
      step2Title: "Safety Check",
      step2Desc: "AI verifies client safety before proceeding with data collection.",
      step3Title: "Data Intake",
      step3Desc: "Captures location, photos (via link), and statement.",
      step4Title: "Filing",
      step4Desc: "Creates a ticket in the claim management system.",
      step5Title: "Assignment",
      step5Desc: "Assigns an adjuster based on complexity.",
      step6Title: "Resolution",
      step6Desc: "Faster payouts due to structured data entry.",
      footerDesc: "Next-gen insurance infrastructure.",
      footerAddress: "SafeGuard Towers",
      footerStreet: "Wall Street 10",
      footerCity: "New York / Warsaw",
      footerContact: "Claims Dept",
      footerLegal: "Regulatory Info",
      footerPrivacy: "Privacy Policy",
      footerTerms: "Terms of Service",
      footerCookies: "Cookies",
      footerLinks: "Broker Links",
      navAgents: "Brokers",
      navDashboard: "Live Stats",
      navBenefits: "Value",
      navHow: "Claims",
      navDiagnostics: "Tech Check",
      selectKey: "API Key",
      ver: "v2.0 Enterprise",
      agents: {
        [AgentType.BOOKING]: {
          name: "Broker Alex",
          description: "Expert in Auto, Home, and Life coverage.",
          capabilities: [
            { text: "Policy quoting", color: "text-blue-500" },
            { text: "Risk assessment", color: "text-blue-500" },
            { text: "Renewal handling", color: "text-blue-500" }
          ]
        },
        [AgentType.OVERFLOW]: {
          name: "Claims Assistant",
          description: "Immediate support for accidents and loss.",
          capabilities: [
            { text: "First Notice of Loss", color: "text-indigo-500" },
            { text: "Safety verification", color: "text-indigo-500" },
            { text: "Towing coordination", color: "text-indigo-500" }
          ]
        }
      }
    },
    pl: {
      heroTitle: "Chronimy To, Co Ważne.\nNatychmiast.",
      heroSubtitle: "Poznaj przyszłość ubezpieczeń. Agenci AI, którzy wyceniają polisy i przetwarzają szkody bez oczekiwania na linii.",
      cta: "Porozmawiaj z Alexem",
      systemStatus: "Agenci Aktywni",
      agentsTitle: "Twoi Dedykowani Brokerzy",
      agentsDesc: "Alex zajmuje się nowymi polisami, podczas gdy Asystent Szkód zapewnia szybkie wsparcie w stresujących momentach.",
      benefitsTitle: "Dlaczego SafeGuard AI?",
      benefit1Title: "Szybkie Wyceny",
      benefit1Desc: "Kwalifikacja leadów 24/7 przed rozmową z człowiekiem.",
      benefit2Title: "Zarządzanie Kryzysem",
      benefit2Desc: "Obsługa masowych zgłoszeń po burzach bez blokowania linii.",
      benefit3Title: "Empatia Przede Wszystkim",
      benefit3Desc: "Spokojne, ustrukturyzowane wsparcie podczas zgłaszania wypadku.",
      benefit4Title: "Redukcja Kosztów",
      benefit4Desc: "Pełna automatyzacja procesu zgłaszania szkody (FNOL).",
      benefit5Title: "Zgodność",
      benefit5Desc: "Każdy skrypt jest standaryzowany pod kątem regulacji.",
      benefit6Title: "Skalowalność",
      benefit6Desc: "Od 10 do 10 000 połączeń w sezonie odnowień.",
      dashboardTitle: "Metryki Agencji",
      totalCalls: "Połączenia",
      bookings: "Umówione Wyceny",
      callbacks: "Zgłoszone Szkody",
      recentBookings: "Nowe Leady",
      recentCallbacks: "Nowe Szkody",
      noData: "Brak danych polis.",
      howItWorksTitle: "Proces Szkody",
      step1Title: "Zdarzenie",
      step1Desc: "Klient dzwoni natychmiast z miejsca zdarzenia.",
      step2Title: "Weryfikacja Bezpieczeństwa",
      step2Desc: "AI sprawdza bezpieczeństwo klienta przed pobraniem danych.",
      step3Title: "Pobranie Danych",
      step3Desc: "Rejestruje lokalizację i opis zdarzenia.",
      step4Title: "Rejestracja",
      step4Desc: "Tworzy zgłoszenie w systemie likwidacji szkód.",
      step5Title: "Przydział",
      step5Desc: "Przydziela rzeczoznawcę na podstawie złożoności.",
      step6Title: "Rozwiązanie",
      step6Desc: "Szybsze wypłaty dzięki uporządkowanym danym.",
      footerDesc: "Infrastruktura ubezpieczeniowa nowej generacji.",
      footerAddress: "SafeGuard Towers",
      footerStreet: "Wall Street 10",
      footerCity: "Nowy Jork / Warszawa",
      footerContact: "Dział Szkód",
      footerLegal: "Regulacje",
      footerPrivacy: "Prywatność",
      footerTerms: "Warunki Usługi",
      footerCookies: "Ciasteczka",
      footerLinks: "Dla Brokera",
      navAgents: "Brokerzy",
      navDashboard: "Statystyki",
      navBenefits: "Wartość",
      navHow: "Szkody",
      navDiagnostics: "Tech Check",
      selectKey: "Klucz API",
      ver: "v2.0 Enterprise",
      agents: {
        [AgentType.BOOKING]: {
          name: "Broker Alex",
          description: "Ekspert od ubezpieczeń Auto, Dom i Życie.",
          capabilities: [
            { text: "Wycena polis", color: "text-blue-500" },
            { text: "Ocena ryzyka", color: "text-blue-500" },
            { text: "Obsługa wznowień", color: "text-blue-500" }
          ]
        },
        [AgentType.OVERFLOW]: {
          name: "Asystent Szkód",
          description: "Natychmiastowe wsparcie w razie wypadku.",
          capabilities: [
            { text: "Zgłoszenie szkody (FNOL)", color: "text-indigo-500" },
            { text: "Weryfikacja bezpieczeństwa", color: "text-indigo-500" },
            { text: "Koordynacja holowania", color: "text-indigo-500" }
          ]
        }
      }
    }
  }
};
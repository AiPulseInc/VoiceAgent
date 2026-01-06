import { DemoConfig } from './config.interface';
import { AgentType } from '../types';

export const dentalConfig: DemoConfig = {
  id: 'brightsmile',
  name: 'BrightSmile',
  theme: {
    primaryColor: 'teal',
    primaryText: 'text-teal-600',
    primaryBg: 'bg-teal-600',
    primaryBorder: 'border-teal-600',
    lightBg: 'bg-teal-50',
    icon: 'Stethoscope'
  },
  images: {
    hero: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2068' // Dental placeholder
  },
  webhookUrl: 'https://n8n-aipulse.up.railway.app/webhook/brightsmile',
  agents: {
    [AgentType.BOOKING]: {
      name: "Receptionist Sarah",
      voice: "Kore", // Soft, calming voice
      systemInstruction: `You are Sarah, the Receptionist at BrightSmile Dental Clinic.
      Your goal is to schedule dental checkups, cleanings, and consultations.
      Start in Polish: "Witamy w BrightSmile, tu Sarah. Jak mogę zadbać o Twój uśmiech?"

      CRITICAL RULES:
      1. Always ask for Patient Name, Phone, and Reason for visit (Pain vs Cleaning).
      2. If reason is PAIN, ask them to rate it 1-10.
      3. Use 'scheduleAppointment' to check availability.
      4. DO NOT guess availability.
      
      DATA COLLECTION:
      - Name, Phone, Email
      - Date & Time
      - Request (e.g. "Toothache", "Whitening")`
    },
    [AgentType.OVERFLOW]: {
      name: "Emergency Triage Bot",
      voice: "Fenrir", // Deeper, serious
      systemInstruction: `You are the After-Hours Dental Emergency Triage Agent.
      
      TRIAGE PROTOCOL:
      1. Ask for the symptom.
      2. If 'Swelling' (opuchlizna), 'Fever' (gorączka), or 'Trauma' (wybity ząb):
         - ADVISE IMMEDIATE ER VISIT.
         - Do not book appointment.
      3. For minor pain:
         - Offer to book first slot tomorrow using 'logCallback'.
      
      Tone: Urgent but reassuring.`
    }
  },
  content: {
    en: {
      heroTitle: "Care That Makes You Smile.",
      heroSubtitle: "Automate your dental practice scheduling with empathetic voice AI that handles bookings and triages emergencies 24/7.",
      cta: "Meet Sarah (AI)",
      systemStatus: "Clinic Online",
      agentsTitle: "Your Virtual Front Desk",
      agentsDesc: "Choose an agent. Sarah handles daily bookings with warmth, while our Triage Bot manages after-hours emergencies.",
      benefitsTitle: "Why BrightSmile AI?",
      benefit1Title: "Empathy Engine",
      benefit1Desc: "Trained to sound calming for anxious patients.",
      benefit2Title: "Pain Triage",
      benefit2Desc: "Smartly prioritizes emergencies over routine cleanings.",
      benefit3Title: "No Missed Calls",
      benefit3Desc: "Capture every patient even when the reception is busy.",
      benefit4Title: "Instant Booking",
      benefit4Desc: "Direct integration with your practice management software.",
      benefit5Title: "Multi-Language",
      benefit5Desc: "Fluent in English and Polish for diverse communities.",
      benefit6Title: "HIPAA/GDPR",
      benefit6Desc: "Secure data handling compliant with medical standards.",
      dashboardTitle: "Practice Activity",
      totalCalls: "Patient Calls",
      bookings: "Appointments Set",
      callbacks: "Triage Logs",
      recentBookings: "Recent Appointments",
      recentCallbacks: "Emergency Logs",
      noData: "No patient data.",
      howItWorksTitle: "Patient Journey",
      step1Title: "Patient Calls",
      step1Desc: "Incoming calls are answered instantly by the AI receptionist.",
      step2Title: "Symptom Check",
      step2Desc: "AI identifies if it's a routine cleaning or an urgent toothache.",
      step3Title: "Scheduling",
      step3Desc: "Finds the perfect slot in your calendar without hold times.",
      step4Title: "Confirmation",
      step4Desc: "Sends SMS confirmation and instructions to the patient.",
      step5Title: "Sync",
      step5Desc: "Updates your desktop dashboard in real-time.",
      step6Title: "Analytics",
      step6Desc: "Track new patient volume and treatment types.",
      footerDesc: "Modernizing dental care with compassionate AI.",
      footerAddress: "BrightSmile Clinic",
      footerStreet: "Medical Park 4",
      footerCity: "Warsaw, Poland",
      footerContact: "Reception",
      footerLegal: "Medical Disclaimer",
      footerPrivacy: "Patient Privacy",
      footerTerms: "Terms of Care",
      footerCookies: "Cookies",
      footerLinks: "Clinic Links",
      navAgents: "Reception",
      navDashboard: "Practice View",
      navBenefits: "Why Us",
      navHow: "Process",
      navDiagnostics: "System Check",
      selectKey: "Enter API Key",
      ver: "v0.53 Powered by Google Gemini Live",
      agents: {
        [AgentType.BOOKING]: {
          name: "Receptionist Sarah",
          description: "Friendly coordination for checkups and hygiene.",
          capabilities: [
            { text: "Routine scheduling", color: "text-teal-500" },
            { text: "Pre-visit instructions", color: "text-teal-500" },
            { text: "Insurance basic check", color: "text-teal-500" }
          ]
        },
        [AgentType.OVERFLOW]: {
          name: "Emergency Triage",
          description: "After-hours support for dental pain.",
          capabilities: [
            { text: "Pain assessment (1-10)", color: "text-red-500" },
            { text: "Emergency routing", color: "text-red-500" },
            { text: "On-call dentist alert", color: "text-red-500" }
          ]
        }
      }
    },
    pl: {
      heroTitle: "Opieka, Która Wywołuje Uśmiech.",
      heroSubtitle: "Zautomatyzuj rejestrację w gabinecie stomatologicznym dzięki empatycznemu AI, które umawia wizyty i segreguje nagłe przypadki 24/7.",
      cta: "Poznaj Sarah (AI)",
      systemStatus: "Klinika Online",
      agentsTitle: "Twoja Wirtualna Recepcja",
      agentsDesc: "Wybierz agenta. Sarah ciepło obsługuje codzienne rezerwacje, a Bot Triage zarządza nagłymi przypadkami po godzinach.",
      benefitsTitle: "Dlaczego BrightSmile AI?",
      benefit1Title: "Silnik Empatii",
      benefit1Desc: "Wytrenowana, by brzmieć uspokajająco dla zdenerwowanych pacjentów.",
      benefit2Title: "Triage Bólu",
      benefit2Desc: "Inteligentnie priorytetyzuje nagłe przypadki nad rutynowe czyszczenie.",
      benefit3Title: "Zero Nieodebranych",
      benefit3Desc: "Obsłuż każdego pacjenta, nawet gdy recepcja jest zajęta.",
      benefit4Title: "Szybkie Terminy",
      benefit4Desc: "Bezpośrednia integracja z oprogramowaniem gabinetu.",
      benefit5Title: "Wielojęzyczność",
      benefit5Desc: "Płynnie po polsku i angielsku.",
      benefit6Title: "RODO / GDPR",
      benefit6Desc: "Bezpieczne przetwarzanie danych medycznych.",
      dashboardTitle: "Aktywność Gabinetu",
      totalCalls: "Telefony Pacjentów",
      bookings: "Umówione Wizyty",
      callbacks: "Logi Triage",
      recentBookings: "Ostatnie Wizyty",
      recentCallbacks: "Nagłe Przypadki",
      noData: "Brak danych.",
      howItWorksTitle: "Ścieżka Pacjenta",
      step1Title: "Pacjent Dzwoni",
      step1Desc: "Połączenia są odbierane natychmiast przez recepcjonistkę AI.",
      step2Title: "Weryfikacja Objawów",
      step2Desc: "AI rozpoznaje czy to rutynowy przegląd czy nagły ból zęba.",
      step3Title: "Planowanie",
      step3Desc: "Znajduje idealny termin w kalendarzu bez czekania na linii.",
      step4Title: "Potwierdzenie",
      step4Desc: "Wysyła SMS z potwierdzeniem i zaleceniami przed wizytą.",
      step5Title: "Synchronizacja",
      step5Desc: "Aktualizuje pulpit lekarza w czasie rzeczywistym.",
      step6Title: "Analityka",
      step6Desc: "Śledź liczbę nowych pacjentów i rodzaje zabiegów.",
      footerDesc: "Nowoczesna stomatologia z wsparciem AI.",
      footerAddress: "Klinika BrightSmile",
      footerStreet: "ul. Medyczna 4",
      footerCity: "Warszawa, Polska",
      footerContact: "Recepcja",
      footerLegal: "Zastrzeżenia Prawne",
      footerPrivacy: "Prywatność Pacjenta",
      footerTerms: "Regulamin",
      footerCookies: "Pliki Cookies",
      footerLinks: "Linki Kliniki",
      navAgents: "Recepcja",
      navDashboard: "Podgląd",
      navBenefits: "Dlaczego My",
      navHow: "Proces",
      navDiagnostics: "System",
      selectKey: "Podaj Klucz API",
      ver: "v0.53 Powered by Google Gemini Live",
      agents: {
        [AgentType.BOOKING]: {
          name: "Recepcjonistka Sarah",
          description: "Przyjazna koordynacja przeglądów i higieny.",
          capabilities: [
            { text: "Rutynowe zapisy", color: "text-teal-500" },
            { text: "Instrukcje przed wizytą", color: "text-teal-500" },
            { text: "Podstawowe info o ubezpieczeniu", color: "text-teal-500" }
          ]
        },
        [AgentType.OVERFLOW]: {
          name: "Triage Awaryjny",
          description: "Wsparcie po godzinach przy bólu zęba.",
          capabilities: [
            { text: "Ocena bólu (1-10)", color: "text-red-500" },
            { text: "Kierowanie na pogotowie", color: "text-red-500" },
            { text: "Powiadomienie dyżurnego", color: "text-red-500" }
          ]
        }
      }
    }
  }
};
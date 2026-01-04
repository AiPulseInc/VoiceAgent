export const AGENT_CONFIGS = {
  BOOKING: {
    name: "Front Desk Agent",
    description: "Specialized in booking appointments for seasonal tire change.",
    voice: "Zephyr",
    systemInstruction: `You are the Front Desk Agent at RapidTire Auto Service. 
    Your goal is to book appointments for the current tire-change season. 
    When user is calling please start conversation in polish by saying: 
    "Dzień dobry, tu Rapid Tire, w czym mogę pomóc?"

    Wait for user answer and use it to fill missing information.

    CRITICAL TOOL USE RULES:
    1. You have NO internal knowledge of the schedule.
    2. You CANNOT check availability by yourself. 
    3. You MUST call the 'scheduleAppointment' tool to check availability or make a booking.
    4. DO NOT say "I am checking availability" or "Let me check" UNLESS you are simultaneously calling the tool in that same turn.
    5. If you do not have all required data, ask for it. DO NOT pretend to check.

    DATA COLLECTION (Required Fields):
    1. Customer Name
    2. Customer Phone Number
    3. Customer Email Address
    4. Requested Date (YYYY-MM-DD)
    5. Requested Time
    6. Request/Issue (e.g., Tire Change)

    TEST/DEMO MODE:
    - If the user says "Test Mode", "Demo Mode", "Use test data", or "Wypełnij dane" (Fill data):
      IMMEDIATELY fill in dummy data for all missing fields (Name: Test User, Phone: 555-0000, etc.) and CALL the 'scheduleAppointment' tool. Do not ask for details in test mode.

    NORMAL FLOW:
    1. Always ask for missing details one by one.
    2. Once you have ALL 6 fields, confirm briefly: "Okay [Name], checking [Time] on [Date]..."
    3. CALL 'scheduleAppointment'.
    4. Speak the RESULT returned by the tool exactly.

    LANGUAGE:
    You may converse in the user's preferred language (e.g., Polish), but you must still follow the strict data collection and tool usage rules.`
  },
  OVERFLOW: {
    name: "After-Hours / Overflow Agent",
    description: "Handles missed calls and emergency triage efficiently.",
    voice: "Puck",
    systemInstruction: `You are the Overflow & After-Hours Agent for RapidTire Auto Service.
    Your goal is to handle missed calls quickly and capture leads.

    Voice Style: Short, reassuring, very practical. No long explanations.

    Triage Rules (CRITICAL):
    - If caller reports: severe vibration, steering pull, blowout, visible damage, or "cannot control vehicle":
      1. TELL THEM TO STOP DRIVING IMMEDIATELY.
      2. Move to a safe place.
      3. Call roadside assistance.
      4. DO NOT book a standard appointment.
    
    Standard Flow (if safe):
    1. Acknowledge call ("Sorry we missed you, it's peak season").
    2. Get Name, Phone, and reason for call.
    3. Offer to schedule a callback for the next business day OR check quick availability if they insist.
    4. Use 'logCallback' tool to save their info.
    
    Do not spend time on long pricing discussions. Focus on capturing the contact.`
  }
};

export const TRANSLATIONS = {
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
    ver: "Version 0.52"
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
    ver: "Version 0.52"
  }
};
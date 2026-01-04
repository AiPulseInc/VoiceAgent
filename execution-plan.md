# Architecture Plan: Multi-Vertical AI Agent Platform

## 1. Executive Summary
We will transform the current single-purpose "RapidTire" application into a configuration-driven platform. 
Instead of duplicating code, we will inject **Configuration Objects** into a shared application shell. 
This allows us to maintain one codebase while serving three distinct industries with unique branding, logic, and backend integrations.

## 2. Technical Architecture

### A. File Structure Changes
We will NOT create separate src folders. We will organize by **Logic** vs **Content**.

```text
src/
├── data/                  <-- NEW FOLDER: The "Brains" & "Skins"
│   ├── config.interface.ts <-- Defines the shape of a vertical
│   ├── autoService.ts      <-- Extracted RapidTire logic
│   ├── dentalClinic.ts     <-- New BrightSmile logic
│   └── insuranceAgency.ts  <-- New SafeGuard logic
├── components/
│   ├── MainEntry.tsx       <-- NEW: Landing page with 3 selection cards
│   ├── App.tsx             <-- REFACTOR: Accepts 'config' prop
│   └── ... (Existing components remain shared)
├── services/
│   └── geminiService.ts    <-- REFACTOR: Accepts dynamic Webhook URL
└── ...
```

### B. The `DemoConfig` Interface
Every vertical must adhere to this contract to ensure the App can render it correctly.

```typescript
export interface DemoConfig {
  id: string;
  name: string;
  theme: {
    primary: string;    // e.g., 'red-600', 'teal-500'
    secondary: string;  // e.g., 'gray-900', 'white'
    icon: any;          // Lucide Icon
  };
  images: {
    hero: string;
    card: string;       // For the MainEntry selection
  };
  webhookUrl: string;   // Unique n8n endpoint
  agents: {
    booking: AgentConfig;  // System Prompt & Voice
    overflow: AgentConfig; // System Prompt & Voice
  };
  content: TranslationDictionary; // All UI text (Hero, Benefits, etc.)
}
```

## 3. Implementation Phases

### Phase 1: Safe Extraction (Refactoring)
**Goal:** Move RapidTire logic out of `App.tsx` and `constants.ts` into `data/autoService.ts` without breaking the app.
1.  Create `data/config.interface.ts`.
2.  Create `data/autoService.ts` and move all current `TRANSLATIONS` and `AGENT_CONFIGS` there.
3.  Modify `App.tsx` to accept a `config` prop.
4.  **Test:** Ensure RapidTire works exactly as it does now.

### Phase 2: Dynamic Backend
**Goal:** Make the Gemini Service agnostic to the industry.
1.  Update `GeminiLiveService.connect()` to accept `webhookUrl`.
2.  Update `scheduleWithWebhook` in `mockBackend.ts` to accept a `url` argument instead of using a hardcoded string.
3.  The payload structure (Name, Phone, Date, Request) remains standardized (Option A), but the **destination URL** changes based on the config.

### Phase 3: Content Creation (The "New Skins")
We will create `dentalClinic.ts` and `insuranceAgency.ts` with the specific details below.

#### Vertical A: Auto Service (Existing)
*   **Webhook:** `https://n8n-aipulse.up.railway.app/webhook-test/rapidtire`
*   **Image:** `images/rapidtire.jpeg`
*   **Theme:** Red/Gray.

#### Vertical B: Dental Clinic ("BrightSmile")
*   **Webhook:** `https://n8n-aipulse.up.railway.app/webhook-test/brightsmile`
*   **Image:** `images/brightsmile.jpeg`
*   **Theme:** Teal/White (Clinical, Clean).
*   **System Prompts:**
    *   *Receptionist:* "Sarah". Friendly, calming. Focus: Hygiene, Whitening, Checkups.
    *   *Emergency:* "Triage Bot". Focus: Pain level (1-10), swelling, bleeding.
*   **Key Translations (PL):**
    *   "Tire Change" -> "Wizyta Kontrolna" (Checkup) or "Ból Zęba" (Toothache).
    *   "Bay" -> "Gabinet" (Office/Chair).

#### Vertical C: Insurance Co. ("SafeGuard")
*   **Webhook:** `https://n8n-aipulse.up.railway.app/webhook-test/safeguard`
*   **Image:** `images/apexagency.jpeg`
*   **Theme:** Navy Blue/Gold (Trustworthy, Corporate).
*   **System Prompts:**
    *   *Sales:* "Alex". Professional. Focus: Quotes for Auto, Home, Life.
    *   *Claims:* "RapidResponse". Focus: Accident location, safety, police report number.
*   **Key Translations (PL):**
    *   "Booking" -> "Zgłoszenie Szkody" (Claim) or "Nowa Polisa" (New Policy).

### Phase 4: Entry Point
1.  Create `MainEntry.tsx`.
2.  Render a grid layout with the 3 images and titles.
3.  On click -> Mount `App` with the selected `DemoConfig`.

## 4. Content Detail: Prompts & Translations

### 🦷 Dental Clinic Config (`data/dentalClinic.ts`)

**Booking Agent (Receptionist):**
> "You are Sarah, the Receptionist at BrightSmile Dental.
> **Tone:** Warm, calming, professional.
> **Goal:** Schedule cleanings or checkups.
> **Script:** Start with 'BrightSmile Dental, Sarah speaking. How can we make you smile today?'
> **Rules:** Ask for patient name, phone, and reason (Pain vs Cleaning). If pain is severe, ask them to rate it 1-10."

**Overflow Agent (Emergency Triage):**
> "You are the After-Hours Dental Triage Agent.
> **Tone:** Direct, urgent, reassuring.
> **Goal:** Assess dental emergencies.
> **Triage:** If user mentions 'swelling', 'fever', or 'trauma', advise immediate ER visit. Otherwise, book first slot tomorrow."

### 🛡️ Insurance Config (`data/insuranceAgency.ts`)

**Booking Agent (Sales Representative):**
> "You are Alex, a Senior Broker at SafeGuard Insurance.
> **Tone:** Professional, knowledgeable, trustworthy.
> **Goal:** Schedule a consultation for a new policy quote (Auto/Home/Life).
> **Script:** 'SafeGuard Insurance. I'm Alex. Are you looking to protect your home, car, or family today?'"

**Overflow Agent (Claims Assistant):**
> "You are the First Notice of Loss (FNOL) Assistant.
> **Tone:** Empathetic, calm, structured.
> **Goal:** Log initial accident details.
> **Critical Safety:** First ask: 'Are you safe? Do you need medical assistance?'
> **Data:** Collect Policy Number (if known), Location, and Incident Description."

## 5. Webhook Strategy (Option A - Standardized)

To avoid complex code changes, we will map industry terms to the standard JSON payload:

| JSON Field | Auto Context | Dental Context | Insurance Context |
| :--- | :--- | :--- | :--- |
| `name` | Driver Name | Patient Name | Policyholder Name |
| `request` | "Tire Change" | "Root Canal" | "Fender Bender" |
| `date` | Service Date | Appointment Date | Incident Date |

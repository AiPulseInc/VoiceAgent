# Sprints Plan: Multi-Vertical AI Platform

This document breaks down the architecture plan into 4 logical sprints. 
**Crucial Rule:** Do not proceed to the next sprint until the current sprint's Test Procedure is marked PASSED.

---

## Sprint 1: The Abstraction Layer (Refactoring)
**Goal:** Decouple the "Auto Service" logic from the core UI components so the App becomes a generic "Shell".

### Implementation Steps
1.  **Create Interface:** Define `data/config.interface.ts` containing the `DemoConfig` type definition.
2.  **Extract Data:** Create `data/autoService.ts`. Move `AGENT_CONFIGS` and `TRANSLATIONS` from `constants.ts` into this file, adhering to the new interface.
3.  **Refactor App.tsx:** 
    - Remove direct imports of `TRANSLATIONS` and `AGENT_CONFIGS`.
    - Add `config` as a prop to the `App` component.
    - Replace hardcoded text (e.g., "RapidTire") with `config.name` and `config.content.*`.
    - Replace hardcoded colors (e.g., `text-red-600`) with dynamic Tailwind classes from `config.theme`.
4.  **Update Entry:** Modify `index.tsx` to import `autoServiceConfig` and pass it to `<App />`.

### 🧪 Test Procedure (Sprint 1)
- [ ] **Build Check:** Does the app compile without TypeScript errors?
- [ ] **Visual Regression:** Does the "RapidTire" demo look *exactly* the same as before?
    - Check Hero title.
    - Check "Agents" cards.
    - Check "Dashboard" labels.
- [ ] **Language Toggle:** Does switching between EN/PL still work using the data from the new config file?

---

## Sprint 2: Dynamic Backend & Service Layer
**Goal:** Enable the Gemini Service and Mock Backend to target different webhooks based on the active configuration.

### Implementation Steps
1.  **Refactor GeminiService:** Update `connect()` method signature to accept `webhookUrl` string.
2.  **Refactor MockBackend:** Update `scheduleWithWebhook(data)` to `scheduleWithWebhook(data, url)`. Remove the hardcoded RapidTire URL from inside the fetch call.
3.  **Wiring:** 
    - In `App.tsx`, pass `config.webhookUrl` down to `<LiveDemo />`.
    - In `LiveDemo.tsx`, pass this URL into `service.connect()`.
    - In `geminiService.ts`, pass the URL into the `scheduleAppointment` tool handler.
4.  **Diagnostics Update:** Update `SystemDiagnostics.tsx` to use the dynamic URL or allow the user to input a test URL.

### 🧪 Test Procedure (Sprint 2)
- [ ] **Voice Agent Connection:** Start a session. Does it connect successfully?
- [ ] **Tool Execution:** Ask the agent to "Book a tire change". 
    - Open Developer Tools -> Network.
    - Verify the request is sent to `.../webhook-test/rapidtire`.
- [ ] **Diagnostics:** Go to "Diagnostics". Run the Webhook test. Does it still succeed?

---

## Sprint 3: Content Generation (The Skins)
**Goal:** Create the data files for the two new verticals (Dental & Insurance).

### Implementation Steps
1.  **Dental Vertical:** Create `data/dentalClinic.ts`.
    - **Theme:** Teal/White.
    - **Prompt:** Receptionist "Sarah" (Friendly/Calming).
    - **Translations:** "Patient" instead of "Customer", "Cleaning" instead of "Tire Change".
2.  **Insurance Vertical:** Create `data/insuranceAgency.ts`.
    - **Theme:** Navy/Gold.
    - **Prompt:** Agent "Alex" (Professional/Corporate).
    - **Translations:** "Policyholder" instead of "Customer", "Claim" instead of "Tire Change".
3.  **Asset Handling:** Define placeholder image paths in the config files.

### 🧪 Test Procedure (Sprint 3)
- [ ] **Data Integrity:** Verify `dentalClinic.ts` and `insuranceAgency.ts` strictly adhere to `DemoConfig` interface (no missing fields).
- [ ] **Temporary Mount:** Manually change `index.tsx` to import `dentalConfig` instead of `autoConfig`.
    - Does the App turn Teal?
    - Does the Title say "BrightSmile"?
    - **Crucial:** Does the Agent speak the Dental prompt? ("How can we make you smile today?")

---

## Sprint 4: The Gateway (Main Entry)
**Goal:** Create the Landing Page to allow users to switch contexts at runtime.

### Implementation Steps
1.  **Create Component:** `components/MainEntry.tsx`.
    - Layout: 3 Columns/Cards.
    - Content: Pulls Name, Icon, and Description from the 3 config files.
    - Action: `onSelect(config)`.
2.  **State Management:**
    - In `index.tsx` (or a new `Root.tsx`), manage a state `selectedConfig`.
    - If `null`, show `MainEntry`.
    - If set, show `App config={selectedConfig} onBack={() => setSelectedConfig(null)}`.
3.  **Navigation:** Add a "Back to Home" button in `App.tsx` (top left nav) to reset the selection.

### 🧪 Test Procedure (Sprint 4)
- [ ] **Selection Flow:** 
    1. Open App -> See 3 Cards.
    2. Click "Dental" -> App loads Dental skin.
    3. Click "Back" -> Returns to 3 Cards.
    4. Click "Insurance" -> App loads Insurance skin.
- [ ] **State Isolation:** 
    1. Start a chat in Auto mode.
    2. Go back.
    3. Go to Dental.
    4. Ensure the previous Auto chat session is gone and a new Dental session starts clean.


# Master Prompt: RapidTire AI Voice Agent Demo

**Role:** Act as a Senior Frontend Engineer and AI Integration Specialist.
**Objective:** Build a high-fidelity, bilingual (English/Polish) React application that demonstrates a real-time voice AI agent for an automotive workshop using the Google Gemini Multimodal Live API via WebSockets.

## 1. Project Overview & Tech Stack

Build a single-page application (SPA) using **React 19**, **TypeScript**, and **Tailwind CSS**.

*   **Audio Pipeline:** Native Web Audio API (`AudioContext`, `AudioWorklet`) for raw PCM streaming. **Do not** use third-party audio recorders.
*   **AI SDK:** Use `@google/genai` (v1.34.0+) for the Gemini Live API.
*   **Icons:** `lucide-react`.
*   **Styling:** Tailwind CSS (configured for `class`-based Dark Mode).
*   **Environment:** The app must run in a browser environment.

## 2. File Structure & Architecture

Create the following directory structure and files:

*   `index.html`: Tailwind CDN setup, font imports (Inter), and root div.
*   `index.tsx`: Entry point.
*   `App.tsx`: Main layout, state management (Language, Theme), and navigation.
*   `types.ts`: Shared interfaces (`AgentType`, `Booking`, `ChatMessage`).
*   `constants.ts`: Agent system instructions and prompts.
*   `services/geminiService.ts`: Core class handling WebSocket connection, audio streaming, and tool execution.
*   `components/`:
    *   `LiveDemo.tsx`: The main modal for voice interaction, chat history, and visualizer.
    *   `AgentCard.tsx`: UI for selecting the "Booking" or "Overflow" agent.
    *   `SystemDiagnostics.tsx`: A diagnostics panel to test Mic/API/Webhook connectivity.
    *   `Visualizer.tsx`: Simple animated audio bars.
*   `utils/`:
    *   `audioUtils.ts`: PCM encoding/decoding logic (Float32 <-> Int16) and Base64 conversion.
    *   `mockBackend.ts`: In-memory simulated database for the dashboard.

## 3. Detailed Functional Requirements

### A. The Gemini Live Service (`geminiService.ts`)
This is the core engine. It must:
1.  **Connection:** Establish a `live.connect` session with `gemini-2.5-flash-native-audio-preview-09-2025`.
2.  **Audio Input:** Use `navigator.mediaDevices.getUserMedia` (16kHz, mono). Use an inline `AudioWorklet` (defined as a string) to capture raw PCM audio, convert Float32 to Int16, Base64 encode it, and send to Gemini.
3.  **Audio Output:** Receive raw PCM chunks (Base64) from Gemini (typically 24kHz). Decode Base64 -> Convert Int16 to Float32 -> Queue in an `AudioBufferSourceNode` for gapless playback.
4.  **Tool Calling:** Define `scheduleAppointment` and `logCallback` tools. When Gemini calls a tool:
    *   Log the request.
    *   Execute the fetch request to the webhook (use `https://n8n-aipulse.up.railway.app/webhook-test/test` as the endpoint).
    *   Send the result back to Gemini via `session.sendToolResponse`.

### B. UI/UX & Layout (`App.tsx`)
1.  **Global Theme:** Default to Dark Mode, but allow toggling to Light Mode.
2.  **Bilingual Support:** State variable `language` ('en' | 'pl'). All text (Nav, Hero, Benefits, Dashboard) must be translatable via a dictionary object.
3.  **Hero Section:** Full viewport height (`min-h-[calc(100vh-4rem)]`). Large typography (7xl). Background image with overlay.
4.  **Dashboard Section:** A "Live Activity" dashboard showing simulated stats (Total Calls, Bookings, Callbacks). Poll `utils/mockBackend.ts` every 2 seconds to update these stats.
5.  **Navigation:** Smooth scroll to "Agents", "Live Activity", "Benefits", "How it works".

### C. Live Demo Modal (`LiveDemo.tsx`)
1.  **Interface:** A modal overlay. Left side: Chat transcript (User = Blue, Agent = Gray). Right side (or debug toggle): A "Terminal" view showing raw logs (Tool requests, Webhook JSON payloads).
2.  **Controls:** Microphone Toggle (Mute/Unmute), End Call (Red button).
3.  **Visualizer:** A dynamic bar visualizer that animates when active.

### D. System Diagnostics (`SystemDiagnostics.tsx`)
A dedicated screen to:
1.  Check for API Key presence.
2.  Request/Test Microphone permissions.
3.  Test the WebSocket connection to Gemini (Open/Close).
4.  **Webhook Tester:** A manual form to send a POST request to the n8n webhook and display the raw JSON response log.

## 4. Specific Content & Prompts (`constants.ts`)

**Agent 1: Booking Agent ("Zephyr")**
*   **Goal:** Book tire changes.
*   **Rule:** NEVER guess availability. MUST call `scheduleAppointment` tool to check.
*   **Prompt:** "You are the Front Desk Agent at RapidTire. Start in Polish: 'Dzień dobry...'. Collect Name, Phone, Date, Time, Request. Call tool. Confirm."

**Agent 2: Overflow Agent ("Puck")**
*   **Goal:** After-hours triage.
*   **Rule:** Safety first. If user mentions "wobble", "blowout", or "danger", tell them to stop driving. Otherwise, take a message using `logCallback`.

## 5. Technical Constraints (Crucial)

*   **Audio Decoding:** Do **not** use `audioContext.decodeAudioData` for streaming chunks (it fails on partial headers). You must manually convert the Int16Array bytes to Float32Array for the Web Audio API.
*   **Audio Worklet:** Write the processor code as a constant string in `audioUtils.ts` and load it via a Blob URL to avoid file path resolution errors in bundlers.
*   **API Key:** Use `process.env.API_KEY`. If not found, check `window.aistudio` (AI Studio embedding compatibility), or show a UI button to "Select API Key".
*   **Tool Calling:** The frontend is the execution environment. The AI calculates the tool call, sends the instruction, pauses audio, waits for the frontend to run the fetch, and resumes upon receiving the toolResponse.

## 6. Implementation Data

**Translations (PL/EN sample):**
*   Ensure the "How It Works" section has steps: "Customer Calls", "Gathering Details", "Logic & Safety", "Action Taken".
*   Ensure Agent Cards have translated titles (e.g., "Recepcja / Rezerwacje" for PL).

**Webhook Endpoint:**
`https://n8n-aipulse.up.railway.app/webhook-test/test`

**Dependencies (package.json equivalent):**
```json
{
  "dependencies": {
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "lucide-react": "^0.300.0",
    "@google/genai": "^0.1.0"
  }
}
```

Instruction: Generate the complete project files based on the structure and requirements above. Prioritize the GeminiLiveService class logic and the Audio Pipeline first, as those are the most complex.
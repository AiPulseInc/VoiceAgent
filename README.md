# RapidTire Auto Service - AI Voice Agent Demo

A high-fidelity demonstration of a Voice AI implementation for a busy automotive workshop. This project utilizes the **Google Gemini Multimodal Live API** to create real-time, low-latency voice agents capable of handling appointment bookings and emergency triage calls via a web interface.

## 🌟 Key Features

*   **Real-time Voice Conversation:** Uses WebSocket-based streaming (Gemini Live API) for natural, interruptible conversations.
*   **Dual Agent Personas:**
    *   **Booking Agent ("Zephyr"):** Specialized in calendar management, service durations, and checking bay availability.
    *   **Overflow Agent ("Puck"):** Specialized in after-hours lead capture and safety triage for emergency tire situations.
*   **Tool Calling & Webhooks:** The agents are grounded in reality; they do not hallucinate schedules. They call real external webhooks (n8n integration) to check availability and confirm bookings.
*   **System Diagnostics:** A built-in dashboard to test microphone hardware, API connectivity, and webhook payloads independently of the AI.
*   **Live Dashboard Mockup:** Visualizes the "backend" state, showing bookings and callbacks as they are processed by the AI.

## 🛠️ Technology Stack

*   **Frontend Framework:** React 19 (via ESM imports), TypeScript.
*   **Styling:** Tailwind CSS.
*   **AI Model:** Google Gemini 2.5 Flash Native Audio Preview (`gemini-2.5-flash-native-audio-preview-09-2025`).
*   **SDK:** `@google/genai`.
*   **Audio Processing:**
    *   **Input:** Custom `AudioWorklet` for 16kHz PCM audio capture.
    *   **Output:** 24kHz PCM audio playback via Web Audio API.
    *   **Format:** Raw PCM 16-bit (no WAV/MP3 headers used in streaming).
*   **Integration:** REST API calls to n8n workflows (via Railway).

## 🧠 Application Logic & Architecture

### 1. The Audio Pipeline (`GeminiLiveService.ts`)
Unlike standard REST APIs, the Live API requires a persistent WebSocket connection.
1.  **Connection:** The app connects to Gemini via WebSocket using the API Key.
2.  **Input Stream:** The browser microphone captures audio -> `AudioWorklet` downsamples it to 16kHz -> Converts Float32 to Int16 -> Base64 encodes it -> Streams to Gemini.
3.  **Output Stream:** Gemini sends back chunks of raw PCM audio -> App decodes Base64 -> Converts Int16 to Float32 -> Queues it in an `AudioBufferSourceNode` for gapless playback.

### 2. Tool Use & Webhooks
The agent is instructed via `systemInstruction` (in `constants.ts`) to never guess availability.
1.  **Intent Detection:** When a user provides name, phone, date, and issue, Gemini recognizes the intent to book.
2.  **Function Call:** Gemini pauses audio generation and sends a `toolCall` message (`scheduleAppointment`).
3.  **Execution:** The frontend intercepts this call, executes a `fetch` request to the configured n8n webhook URL.
4.  **Response:** The webhook returns a JSON status (e.g., "Confirmed", "Bay Unavailable").
5.  **Continuation:** The frontend sends this JSON back to Gemini via `toolResponse`.
6.  **Reply:** Gemini generates a natural language response based on the tool's output (e.g., "Great, you're booked for Tuesday...").

## 📂 Component Structure

*   **`App.tsx`**: Main entry point. Handles routing between the Landing Page and Diagnostics panel. Manages global API key state.
*   **`services/geminiService.ts`**: The core engine. Manages WebSocket connection, audio encoding/decoding, and the event loop for handling tool calls.
*   **`components/LiveDemo.tsx`**: The modal interface where the conversation happens. Displays the chat transcript, visualizer, and debug logs.
*   **`components/SystemDiagnostics.tsx`**: A testing suite. Allows the user to verify their microphone and simulate webhook payloads manually to ensure the "backend" is alive before talking to the AI.
*   **`utils/audioUtils.ts`**: Low-level audio helpers. Contains the `RecorderProcessor` string (AudioWorklet) to avoid external file dependencies.
*   **`constants.ts`**: Contains the critical `systemInstruction` prompts that define the personalities and strict rules for the agents.

## 🚀 Setup & Usage

1.  **Environment Variables:**
    The application requires a Google Gemini API Key.
    *   If running locally, set `process.env.API_KEY`.
    *   If running in a browser environment (like StackBlitz), the app includes a "Select API Key" flow using `window.aistudio`.

2.  **Permissions:**
    The browser will request Microphone access upon starting the Diagnostics or the Live Demo.

3.  **Webhook Configuration:**
    The app is pre-configured to point to a demo n8n webhook (`https://n8n-aipulse.up.railway.app...`). To use your own backend, update the URL in `utils/mockBackend.ts`.

## 🔮 Beyond MVP: Future Functionalities

To transition this from a demo to a production-grade enterprise solution, the following features would be implemented:

1.  **Telephony Integration (Twilio/Vonage):**
    *   Currently, this is a "Web Call" (Browser-to-AI).
    *   **Upgrade:** Use a WebSocket relay server (Node.js/Python) to connect a real phone number (Twilio Stream) directly to the Gemini Live API. This allows customers to call via regular GSM/Landlines.

2.  **Database Persistence:**
    *   Currently, bookings are stored in a volatile in-memory array (`utils/mockBackend.ts`).
    *   **Upgrade:** Connect the webhook to a real SQL database (PostgreSQL) or a CRM (HubSpot/Salesforce) to manage real customer records.

3.  **Interrupt Handling & Latency:**
    *   **Upgrade:** Implement aggressive echo cancellation and "barge-in" handling server-side to allow the user to interrupt the AI more naturally during long sentences.

4.  **Authentication:**
    *   **Upgrade:** Add an Admin Dashboard with login (Auth0/Firebase) for shop managers to view transcripts, listen to call recordings, and configure agent prompts.

5.  **Multi-Language Support:**
    *   The prompt currently instructs the agent to speak Polish if addressed in Polish.
    *   **Upgrade:** Explicitly detect locale metadata to switch system instructions dynamically for better cultural nuance.

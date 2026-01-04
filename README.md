# RapidTire Auto Service - AI Voice Agent Demo

A high-fidelity demonstration of a Voice AI implementation for a busy automotive workshop. This project utilizes the **Google Gemini Multimodal Live API** to create real-time, low-latency voice agents capable of handling appointment bookings and emergency triage calls via a web interface.

Now features full **Bilingual Support (English/Polish)** and **Dark Mode**.

## 🌟 Key Features

*   **Real-time Voice Conversation:** Uses WebSocket-based streaming (Gemini Live API) for natural, interruptible conversations with <500ms latency.
*   **Dual Agent Personas:**
    *   **Booking Agent ("Zephyr"):** Specialized in calendar management, service durations, and checking bay availability.
    *   **Overflow Agent ("Puck"):** Specialized in after-hours lead capture and safety triage for emergency tire situations.
*   **Bilingual UI & AI:**
    *   Full interface translation between English and Polish.
    *   Agents are prompted to detect the user's language and switch fluency automatically (e.g., answering "Dzień dobry" if addressed in Polish).
*   **Adaptive UI:**
    *   **Dark/Light Mode:** Fully responsive theme switching.
    *   **Smooth Navigation:** Interactive scroll-to-section navigation.
*   **Tool Calling & Webhooks:** The agents are grounded in reality; they do not hallucinate schedules. They call real external webhooks (n8n integration) to check availability and confirm bookings.
*   **Live Dashboard Analytics:**
    *   Visualizes "backend" state: Active Bookings, Callbacks, and Total Call Volume.
    *   **Connection Tracking:** Now logs every voice session initiation to track total engagement, not just successful bookings.
*   **System Diagnostics:** A built-in dashboard to test microphone hardware, API connectivity, and webhook payloads independently of the AI.

## 🛠️ Technology Stack

*   **Frontend Framework:** React 19 (via ESM imports), TypeScript.
*   **Styling:** Tailwind CSS (configured for `class`-based Dark Mode).
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

*   **`App.tsx`**: Main entry point. Handles global state (Theme, Language, Stats), routing, and the landing page layout including the new "Benefits" and "How It Works" sections.
*   **`services/geminiService.ts`**: The core engine. Manages WebSocket connection, audio encoding/decoding, call logging metrics, and the event loop for handling tool calls.
*   **`components/LiveDemo.tsx`**: The modal interface where the conversation happens. Displays the chat transcript, visualizer, and debug logs. Adapts UI text based on selected language.
*   **`components/AgentCard.tsx`**: Reusable card component for agent selection, supports translation props.
*   **`components/SystemDiagnostics.tsx`**: A testing suite. Allows the user to verify their microphone and simulate webhook payloads manually.
*   **`utils/audioUtils.ts`**: Low-level audio helpers. Contains the `RecorderProcessor` string (AudioWorklet) to avoid external file dependencies.
*   **`utils/mockBackend.ts`**: In-memory store for dashboard visualization. Tracks `bookings`, `callbacks`, and `totalCalls`.

## 🚀 Setup & Usage

1.  **Environment Variables:**
    The application requires a Google Gemini API Key.
    *   If running locally, set `process.env.API_KEY`.
    *   If running in a browser environment (like StackBlitz), the app includes a "Select API Key" flow using `window.aistudio` or falls back to a demo key if configured.

2.  **Permissions:**
    The browser will request Microphone access upon starting the Diagnostics or the Live Demo.

3.  **Webhook Configuration:**
    The app is pre-configured to point to a demo n8n webhook (`https://n8n-aipulse.up.railway.app...`). To use your own backend, update the URL in `utils/mockBackend.ts`.

## 🔮 Beyond MVP: Future Functionalities

To transition this from a demo to a production-grade enterprise solution, the following features would be implemented:

1.  **Telephony Integration (Twilio/Vonage):**
    *   **Upgrade:** Use a WebSocket relay server (Node.js/Python) to connect a real phone number (Twilio Stream) directly to the Gemini Live API. This allows customers to call via regular GSM/Landlines.

2.  **Database Persistence:**
    *   **Upgrade:** Connect the webhook to a real SQL database (PostgreSQL) or a CRM (HubSpot/Salesforce) to manage real customer records instead of the in-memory mock backend.

3.  **Interrupt Handling & Latency:**
    *   **Upgrade:** Implement aggressive echo cancellation and "barge-in" handling server-side to allow the user to interrupt the AI more naturally during long sentences.

4.  **Authentication:**
    *   **Upgrade:** Add an Admin Dashboard with login (Auth0/Firebase) for shop managers to view transcripts, listen to call recordings, and configure agent prompts.
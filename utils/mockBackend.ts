import { Booking, ServiceType, LoggedCallback } from '../types';

// In-memory store for Dashboard visualization
let bookings: Booking[] = [];
let callbacks: LoggedCallback[] = [];
let totalCalls = 0; // New metric for all initiated calls

interface WebhookPayload {
    name: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    request: string;
}

// Called when Gemini session opens
export const logCallStart = () => {
    totalCalls++;
    console.log("📞 Call Started. Total:", totalCalls);
};

export const scheduleWithWebhook = async (data: WebhookPayload) => {
    // LOG START
    console.log("🚀 [Webhook] Preparing to send POST request to n8n");
    console.log("📦 [Webhook] Payload:", data);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); 

    try {
        const response = await fetch('https://n8n-aipulse.up.railway.app/webhook-test/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log(`📡 [Webhook] Response Status: ${response.status} ${response.statusText}`);

        const rawText = await response.text();
        
        if (!response.ok) {
             console.error("❌ [Webhook] Server error");
             throw new Error(`Server returned ${response.status}: ${rawText.slice(0, 100)}`);
        }

        if (!rawText.trim()) {
            throw new Error("Server returned an empty response body.");
        }

        let json;
        try {
            json = JSON.parse(rawText);
        } catch (e) {
            throw new Error(`Failed to parse JSON response: ${rawText.slice(0, 50)}...`);
        }

        console.log("✅ [Webhook] Success. Parsed JSON:", json);
        
        // Side effect: Add to local dashboard Mock for visualization
        if (json.status && (String(json.status).toLowerCase().includes('confirmed') || String(json.status).toLowerCase().includes('potwierdzona'))) {
            bookings.push({
                id: Math.random().toString(36).substring(7),
                customerName: data.name,
                phoneNumber: data.phone,
                carDetails: data.request,
                serviceType: ServiceType.TIRE_CHANGE, // Default for display
                bayId: 'A',
                startTime: new Date().toISOString(),
                durationMinutes: 40
            });
        }

        return { result: json.status };

    } catch (error: any) {
        clearTimeout(timeoutId);
        console.error("❌ [Webhook] Request failed completely:", error);
        
        if (error.name === 'AbortError') {
            return { result: "System scheduling timed out (15s). Please try again." };
        }
        
        return { result: `Connection error: ${error.message}.` };
    }
};

export const logCallback = (data: Omit<LoggedCallback, 'id' | 'timestamp'>) => {
    const callback: LoggedCallback = {
        ...data,
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString()
    };
    callbacks.push(callback);
    console.log("Callback Logged:", callback);
    return { success: true, id: callback.id };
}

export const getDashboardStats = () => ({
    totalCalls, // Exported to UI
    bookingsCount: bookings.length,
    callbacksCount: callbacks.length,
    recentBookings: bookings.slice(-3),
    recentCallbacks: callbacks.slice(-3)
});
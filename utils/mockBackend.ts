import { Booking, ServiceType, LoggedCallback } from '../types';
import { BAYS, SERVICES } from '../constants';

// In-memory store
let bookings: Booking[] = [];
let callbacks: LoggedCallback[] = [];

// Helper to check if a bay supports a service
const baySupportsService = (bayId: string, serviceType: ServiceType, isAdvanced: boolean): boolean => {
  const bay = BAYS.find(b => b.id === bayId);
  if (!bay) return false;
  
  if (isAdvanced || SERVICES[serviceType].requiredBayType === 'ADVANCED') {
    return bay.type === 'ADVANCED';
  }
  // Standard services can go in any bay, but we prefer standard bays to save advanced ones
  return true;
};

export const checkAvailability = (dateStr: string, serviceType: ServiceType, isAdvanced: boolean = false) => {
  // Mock availability logic retained for Dashboard simulation if needed, 
  // though Agent will now use Webhook.
  
  const availableSlots: { time: string; bayId: string }[] = [];
  const startHour = 8;
  const endHour = 18;
  
  for (let hour = startHour; hour < endHour; hour++) {
    const time = `${hour < 10 ? '0' : ''}${hour}:00`;
    for (const bay of BAYS) {
      if (baySupportsService(bay.id, serviceType, isAdvanced)) {
        const isTaken = Math.random() < 0.3; 
        if (!isTaken) {
            const isBooked = bookings.some(b => b.startTime.includes(`${dateStr}T${time}`) && b.bayId === bay.id);
            if(!isBooked) {
                availableSlots.push({ time: `${dateStr}T${time}:00`, bayId: bay.id });
            }
        }
      }
    }
  }
  const uniqueTimes = Array.from(new Set(availableSlots.map(s => s.time))).sort().slice(0, 4);
  return uniqueTimes;
};

// --- NEW WEBHOOK LOGIC ---

interface WebhookPayload {
    name: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    request: string;
}

export const scheduleWithWebhook = async (data: WebhookPayload) => {
    // LOG START
    console.log("🚀 [Webhook] Preparing to send POST request to n8n");
    console.log("📦 [Webhook] Payload:", data);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased timeout to 15s

    try {
        const response = await fetch('https://n8n-aipulse.up.railway.app/webhook-test/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' // Explicitly ask for JSON
            },
            body: JSON.stringify(data),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log(`📡 [Webhook] Response Status: ${response.status} ${response.statusText}`);

        // Read raw text first to avoid crashing on empty bodies
        const rawText = await response.text();
        console.log("📄 [Webhook] Raw Response Body:", rawText ? rawText : "(Empty String)");

        if (!response.ok) {
             console.error("❌ [Webhook] Server error");
             throw new Error(`Server returned ${response.status}: ${rawText.slice(0, 100)}`);
        }

        if (!rawText.trim()) {
            throw new Error("Server returned an empty response body. (Check n8n 'Respond to Webhook' node)");
        }

        let json;
        try {
            json = JSON.parse(rawText);
        } catch (e) {
            throw new Error(`Failed to parse JSON response: ${rawText.slice(0, 50)}...`);
        }

        console.log("✅ [Webhook] Success. Parsed JSON:", json);
        
        // Side effect: We add it to our local dashboard Mock just so the UI looks alive 
        // even though the logic is now external.
        if (json.status && (String(json.status).toLowerCase().includes('confirmed') || String(json.status).toLowerCase().includes('potwierdzona'))) {
            bookings.push({
                id: Math.random().toString(36).substring(7),
                customerName: data.name,
                phoneNumber: data.phone,
                carDetails: data.request, // Mapping request to car details for display
                serviceType: ServiceType.TIRE_CHANGE, // Default for display
                bayId: 'A',
                startTime: new Date().toISOString(),
                durationMinutes: 40
            });
        }

        // Return the raw status message from n8n
        return { result: json.status };

    } catch (error: any) {
        clearTimeout(timeoutId);
        console.error("❌ [Webhook] Request failed completely:", error);
        
        if (error.name === 'AbortError') {
            return { result: "System scheduling timed out (15s). Please try again." };
        }
        
        // Detailed error for debugging context in chat
        return { result: `Connection error: ${error.message}.` };
    }
};

// -------------------------

export const bookAppointment = (bookingData: Omit<Booking, 'id'>) => {
  const newBooking: Booking = {
    ...bookingData,
    id: Math.random().toString(36).substring(7),
  };
  bookings.push(newBooking);
  console.log("New Booking Created:", newBooking);
  return { success: true, bookingId: newBooking.id, details: newBooking };
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
    bookingsCount: bookings.length,
    callbacksCount: callbacks.length,
    recentBookings: bookings.slice(-3),
    recentCallbacks: callbacks.slice(-3)
});
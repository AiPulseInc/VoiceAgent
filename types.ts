export enum AgentType {
  BOOKING = 'BOOKING',
  OVERFLOW = 'OVERFLOW',
}

export interface Booking {
  id: string;
  customerName: string;
  phoneNumber: string;
  carDetails: string;
  serviceType: ServiceType;
  bayId: string;
  startTime: string; // ISO string
  durationMinutes: number;
}

export enum ServiceType {
  WHEEL_SWAP = 'WHEEL_SWAP', // 25 min, Bay A/B
  TIRE_CHANGE = 'TIRE_CHANGE', // 40 min, Bay A/B
  MOUNTING = 'MOUNTING', // 75 min, Bay C
}

export interface ServiceDefinition {
  id: ServiceType;
  label: string;
  duration: number;
  requiredBayType: 'STANDARD' | 'ADVANCED';
}

export interface Bay {
  id: string;
  name: string;
  type: 'STANDARD' | 'ADVANCED';
}

export interface LoggedCallback {
  id: string;
  name: string;
  phone: string;
  reason: string;
  timestamp: string;
  priority: 'NORMAL' | 'URGENT';
}

export type MessageRole = 'user' | 'model' | 'system';

export interface ChatMessage {
  role: MessageRole;
  text: string;
  timestamp: Date;
}

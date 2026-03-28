// src/types/api.ts
export type SupportedLanguage = 'sv' | 'en';
export type EventStatus = 'upcoming' | 'past' | 'full';

export interface ApiEvent {
  eventId: string;
  eventType: string;
  language: SupportedLanguage;
  title: string;
  description: string;
  agenda: string;
  imageUrl: string;
  startDateTime: string;  // ISO 8601
  endDateTime: string;    // ISO 8601
  location: string;
  geo: { latitude: number; longitude: number };
  defaultTicketSeatCount: number;
  maxTicketSeatCount: number;
  isAlmostSoldOut: boolean;
  isSoldOut: boolean;
  isActive: boolean;
  contactEmail: string;
  termsUrl: string;
  privacyUrl: string;
  foodOptions?: {
    options: Array<{ optionId: string; description: string }>;
    acceptAllergies: boolean;
  };
  price?: {
    ticketPrice: number;
    vatAmount: number;
    vatPercentage: number;
    minimumTicketsForInvoicing: number;
    saleIsOpen: boolean;
  };
}

export interface ApiRegistrationRequest {
  eventId: string;
  name: string;
  email: string;
  employer: string;
}

export interface ApiErrorResponse {
  error: string;
  field?: keyof ApiRegistrationRequest;
}

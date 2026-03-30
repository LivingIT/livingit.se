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
  city: string;
  geo: { latitude: number; longitude: number; googlePlaceId?: string | null };
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
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  claimedSeatCount: number;
  foodChoiceOptionId?: string;
  foodChoiceAllergies?: string;
  termsAccepted?: boolean;
}

export interface ApiErrorResponse {
  error: string;
  field?: keyof ApiRegistrationRequest;
}

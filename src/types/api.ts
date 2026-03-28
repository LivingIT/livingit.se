// src/types/api.ts
export type SupportedLanguage = 'sv' | 'en';
export type EventStatus = 'upcoming' | 'past' | 'full';

export interface ApiEvent {
  slug: string;
  language: SupportedLanguage;
  title: string;
  date: string;        // ISO 8601
  location: string;
  description: string;
  capacity: number;
  registrationCount: number;
  status: EventStatus;
}

export interface ApiRegistrationRequest {
  slug: string;
  name: string;
  email: string;
  employer: string;
}

export interface ApiErrorResponse {
  error: string;
  field?: keyof ApiRegistrationRequest;
}

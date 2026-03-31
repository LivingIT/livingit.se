// src/i18n/index.ts
import { sv } from './sv';
import { en } from './en';
import type { SupportedLanguage } from '../types/api';
export type { Translations } from './sv';
export type { SupportedLanguage } from '../types/api';

const translations = { sv, en };

export function getTranslations(lang: SupportedLanguage) {
  return translations[lang];
}

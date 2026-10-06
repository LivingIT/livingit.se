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

/**
 * Given the current pathname, returns the equivalent path for each
 * supported locale. Swedish is the unprefixed default locale; English
 * pages are mirrored under /en/... with the same slug.
 */
export function getLocalizedPaths(pathname: string): Record<SupportedLanguage, string> {
  const withoutEnPrefix = pathname.replace(/^\/en(\/|$)/, '/');
  const canonicalPath = withoutEnPrefix === '' ? '/' : withoutEnPrefix;

  return {
    sv: canonicalPath,
    en: canonicalPath === '/' ? '/en' : `/en${canonicalPath}`,
  };
}

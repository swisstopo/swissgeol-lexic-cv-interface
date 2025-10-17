/**
 * Cookie utilities for GDPR-compliant consent management
 * Handles user consent preferences with secure cookie settings
 */

interface CookieOptions {
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

interface ConsentPreferences {
  hasConsented: boolean;
  consentGiven: boolean;
  timestamp: number;
  version: string;
}

/**
 * Set a cookie with secure options and GDPR compliance
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof window === 'undefined') return;

  const {
    expires = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months default
    path = '/',
    domain,
    secure = window.location.protocol === 'https:',
    sameSite = 'Lax'
  } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=${path}`;

  if (domain) cookieString += `; domain=${domain}`;
  if (secure) cookieString += '; secure';
  cookieString += `; sameSite=${sameSite}`;

  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;

  const nameEQ = name + '=';
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }

  return null;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string): void {
  if (typeof window === 'undefined') return;

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Check if user has already expressed consent
 */
export function hasConsentedBefore(): boolean {
  const consentCookie = getCookie('ga_consent');
  return consentCookie !== null;
}

/**
 * Save user consent preferences to cookie
 */
export function saveConsentPreference(hasConsent: boolean): void {
  const preferences: ConsentPreferences = {
    hasConsented: true,
    consentGiven: hasConsent,
    timestamp: Date.now(),
    version: '1.0'
  };

  setCookie('ga_consent', JSON.stringify(preferences), {
    expires: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months
    sameSite: 'Strict',
    secure: true
  });
}

/**
 * Get user consent preferences from cookie
 */
export function getConsentPreference(): ConsentPreferences | null {
  const consentCookie = getCookie('ga_consent');
  if (!consentCookie) return null;

  try {
    return JSON.parse(consentCookie) as ConsentPreferences;
  } catch {
    return null;
  }
}

/**
 * Check if disclaimer should be shown based on consent status
 */
export function shouldShowDisclaimer(): boolean {
  return !hasConsentedBefore();
}

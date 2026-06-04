export const GOOGLE_ANALYTICS_ID = "G-2PKPXM4HT1";
export const META_PIXEL_ID = "1657411968860109";
export const COOKIE_CONSENT_STORAGE_KEY = "heromint_cookie_consent";
export const COOKIE_CONSENT_EVENT = "heromint-cookie-consent-updated";
export const COOKIE_PREFERENCES_EVENT = "heromint-open-cookie-preferences";

export interface CookieConsentValue {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

export function readCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null;

  try {
    const storedValue = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    return storedValue ? JSON.parse(storedValue) as CookieConsentValue : null;
  } catch {
    return null;
  }
}

export function saveCookieConsent(value: Omit<CookieConsentValue, "updatedAt">) {
  const consent: CookieConsentValue = {
    ...value,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}

declare global {
  interface Window {
    [key: `ga-disable-${string}`]: boolean;
  }
}

"use client";

import { COOKIE_PREFERENCES_EVENT } from "@/lib/cookie-consent";

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(COOKIE_PREFERENCES_EVENT))}
      className="text-left text-sm text-[#94A3B8] transition-colors hover:text-white"
    >
      Preferências de cookies
    </button>
  );
}


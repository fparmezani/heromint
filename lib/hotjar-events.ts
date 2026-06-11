"use client";

type HotjarWindow = Window & typeof globalThis & {
  hj?: (command: "event", eventName: string) => void;
};

function normalizeHotjarEventName(name: string) {
  return name.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 250);
}

export function trackHotjarEvent(name: string, metadata?: Record<string, string | number | boolean | null | undefined>) {
  if (typeof window === "undefined") return;

  const hotjar = (window as HotjarWindow).hj;
  if (typeof hotjar !== "function") return;

  hotjar("event", normalizeHotjarEventName(name));

  if (!metadata) return;

  for (const [key, value] of Object.entries(metadata)) {
    if (value === undefined || value === null || value === "") continue;
    hotjar("event", normalizeHotjarEventName(`${name}_${key}_${String(value)}`));
  }
}

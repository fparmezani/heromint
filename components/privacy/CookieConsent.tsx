"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  COOKIE_PREFERENCES_EVENT,
  readCookieConsent,
  saveCookieConsent,
  type CookieConsentValue,
} from "@/lib/cookie-consent";

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const storedConsent = readCookieConsent();
    const initialPromptTimer = !storedConsent
      ? window.setTimeout(() => setOpen(true), 0)
      : undefined;

    const openPreferences = () => {
      const current = readCookieConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setCustomizing(true);
      setOpen(true);
    };

    window.addEventListener(COOKIE_PREFERENCES_EVENT, openPreferences);
    return () => {
      if (initialPromptTimer) window.clearTimeout(initialPromptTimer);
      window.removeEventListener(COOKIE_PREFERENCES_EVENT, openPreferences);
    };
  }, []);

  const persist = (value: Omit<CookieConsentValue, "updatedAt">) => {
    saveCookieConsent(value);
    setOpen(false);
    setCustomizing(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 md:p-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[#334155] bg-[#0F172A] p-5 shadow-2xl shadow-black/50">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Privacidade e cookies</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
              Usamos cookies necessários para o funcionamento do site. Com sua autorização,
              também usamos cookies de análise para entender o uso da HeroMint. Você pode
              aceitar, recusar ou configurar suas preferências. Consulte nossa{" "}
              <Link href="/politica-de-cookies" className="text-[#60A5FA] hover:underline">
                Política de Cookies
              </Link>.
            </p>
          </div>

          {customizing && (
            <div className="grid gap-3 rounded-xl border border-[#1E293B] bg-[#020617]/60 p-4">
              <PreferenceRow
                title="Cookies necessários"
                description="Essenciais para navegação, login e segurança. Permanecem ativos."
                checked
                disabled
              />
              <PreferenceRow
                title="Cookies de análise"
                description="Permitem ativar Google Analytics e Hotjar para medir visitas e melhorar o site."
                checked={analytics}
                onChange={setAnalytics}
              />
              <PreferenceRow
                title="Cookies de marketing"
                description="Permitem ativar o Meta Pixel para medir campanhas e conversões. Não ativamos essa categoria sem sua autorização."
                checked={marketing}
                onChange={setMarketing}
              />
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            {!customizing && (
              <button
                type="button"
                onClick={() => setCustomizing(true)}
                className="rounded-xl border border-[#334155] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E293B]"
              >
                Configurar
              </button>
            )}
            <button
              type="button"
              onClick={() => persist({ necessary: true, analytics: false, marketing: false })}
              className="rounded-xl border border-[#334155] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E293B]"
            >
              Recusar opcionais
            </button>
            {customizing ? (
              <button
                type="button"
                onClick={() => persist({ necessary: true, analytics, marketing })}
                className="rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8]"
              >
                Salvar preferências
              </button>
            ) : (
              <button
                type="button"
                onClick={() => persist({ necessary: true, analytics: true, marketing: true })}
                className="rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8]"
              >
                Aceitar todos
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PreferenceRow({
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="mt-1 block text-xs leading-relaxed text-[#94A3B8]">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
        className="mt-1 h-4 w-4 accent-[#2563EB]"
      />
    </label>
  );
}

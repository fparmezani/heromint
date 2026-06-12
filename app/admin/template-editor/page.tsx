"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CardTemplate } from "@/components/preview/CardTemplate";
import { THEME_ELEMENT_DEFS, type ElementOverride, type ThemeOverrides } from "@/lib/template-overrides";
import { Save, RefreshCw, ChevronDown, Eye, EyeOff } from "lucide-react";

// ─── Mock data per theme ───────────────────────────────────────────────────────
const MOCK_DATA: Record<string, Record<string, string>> = {
  "futebol-panini": {
    nome: "LEANDRO",
    dataNascimento: "1990-05-09",
    altura: "180",
    peso: "75",
    time: "Flamengo",
    pais: "Brasil",
  },
  "futebol-2026": {
    nome: "LEANDRO",
    dataNascimento: "1990-05-09",
    altura: "180",
    peso: "75",
    time: "Flamengo",
    posicao: "Atacante",
  },
};

const MOCK_PHOTO = "/mock-player.png";

const THEMES = [
  { id: "futebol-panini", label: "Futebol Panini" },
  { id: "futebol-2026",   label: "Futebol 2026" },
];

// ─── Control ranges ────────────────────────────────────────────────────────────
const CONTROL_CONFIG: Record<string, { min: number; max: number; step: number; unit: string }> = {
  top:      { min: -100, max: 200, step: 1,   unit: "px" },
  left:     { min: -100, max: 200, step: 1,   unit: "px" },
  right:    { min: -100, max: 200, step: 1,   unit: "px" },
  bottom:   { min: -100, max: 200, step: 1,   unit: "px" },
  width:    { min: 0,    max: 200, step: 1,   unit: "px" },
  height:   { min: 0,    max: 200, step: 1,   unit: "px" },
  fontSize: { min: 6,    max: 80,  step: 1,   unit: "px" },
  opacity:  { min: 0,    max: 1,   step: 0.05, unit: "" },
};

// ─── Types ─────────────────────────────────────────────────────────────────────
type AllOverrides = Record<string, ThemeOverrides>;

// ─── Slider component ──────────────────────────────────────────────────────────
function Slider({
  label,
  prop,
  value,
  onChange,
}: {
  label: string;
  prop: string;
  value: number | string | undefined;
  onChange: (val: number) => void;
}) {
  const cfg = CONTROL_CONFIG[prop];
  if (!cfg) return null;
  const num = typeof value === "number" ? value : typeof value === "string" ? parseFloat(value) : (cfg.min + cfg.max) / 2;
  const display = prop === "opacity" ? Math.round(num * 100) + "%" : num + "px";

  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs text-[#94A3B8] mb-1">
        <span>{label}</span>
        <span className="font-mono text-[#FBBF24]">{display}</span>
      </div>
      <input
        type="range"
        min={cfg.min}
        max={cfg.max}
        step={cfg.step}
        value={isNaN(num) ? (cfg.min + cfg.max) / 2 : num}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full accent-[#FBBF24] bg-[#1E293B]"
      />
    </div>
  );
}

// ─── Element panel ─────────────────────────────────────────────────────────────
function ElementPanel({
  def,
  override,
  onChange,
}: {
  def: { id: string; label: string; controls: string[] };
  override: ElementOverride;
  onChange: (id: string, patch: Partial<ElementOverride>) => void;
}) {
  const [open, setOpen] = useState(false);
  const visible = override.visible !== false;

  return (
    <div className="rounded-xl border border-[#1E293B] bg-[#0F172A] overflow-hidden mb-2">
      <div
        className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-[#1E293B]/50 select-none"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange(def.id, { visible: !visible });
            }}
            className={`rounded-md p-1 transition-colors ${visible ? "text-[#22C55E]" : "text-[#475569]"}`}
            title={visible ? "Ocultar" : "Mostrar"}
          >
            {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <span className={`text-sm font-medium ${visible ? "text-white" : "text-[#475569]"}`}>
            {def.label}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[#475569] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && def.controls.length > 1 && (
        <div className="px-3 pb-3 border-t border-[#1E293B] pt-2">
          {def.controls
            .filter((c) => c !== "visible")
            .map((c) => (
              <Slider
                key={c}
                label={c.charAt(0).toUpperCase() + c.slice(1)}
                prop={c}
                value={(override as Record<string, unknown>)[c] as number | string | undefined}
                onChange={(val) => onChange(def.id, { [c]: val })}
              />
            ))}
        </div>
      )}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function TemplateEditorPage() {
  const [selectedTheme, setSelectedTheme] = useState("futebol-panini");
  const [allOverrides, setAllOverrides] = useState<AllOverrides>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load overrides from Supabase on mount
  useEffect(() => {
    fetch("/api/admin/template-overrides")
      .then((r) => r.json())
      .then((data) => {
        if (data.overrides) setAllOverrides(data.overrides);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const currentOverrides: ThemeOverrides = allOverrides[selectedTheme] ?? {};
  const defs = THEME_ELEMENT_DEFS[selectedTheme] ?? [];

  const handleElementChange = useCallback(
    (elementId: string, patch: Partial<ElementOverride>) => {
      setAllOverrides((prev) => ({
        ...prev,
        [selectedTheme]: {
          ...(prev[selectedTheme] ?? {}),
          [elementId]: {
            ...((prev[selectedTheme] ?? {})[elementId] ?? {}),
            ...patch,
          },
        },
      }));
    },
    [selectedTheme]
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/template-overrides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeId: selectedTheme,
          config: allOverrides[selectedTheme] ?? {},
        }),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      setSavedMsg("Salvo! Mudanças ativas em produção.");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => setSavedMsg(""), 3000);
    } catch (e) {
      console.error(e);
      setSavedMsg("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setAllOverrides((prev) => ({ ...prev, [selectedTheme]: {} }));
  };

  // Build themeOverrides prop for CardTemplate
  const themeOverridesForCard: Record<string, Record<string, unknown>> = {};
  for (const [theme, overrides] of Object.entries(allOverrides)) {
    themeOverridesForCard[theme] = overrides as Record<string, unknown>;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Header */}
      <div className="border-b border-[#1E293B] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Editor de Templates</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Ajuste elementos dos cards e salve. Mudanças vão direto para produção.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && (
            <span className="text-xs text-[#22C55E] font-medium">{savedMsg}</span>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#334155] text-sm text-[#94A3B8] hover:bg-[#1E293B] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Resetar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#FBBF24] text-[#0F172A] text-sm font-bold hover:bg-[#F59E0B] disabled:opacity-50 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-[#64748B]">
          Carregando configurações...
        </div>
      ) : (
        <div className="flex h-[calc(100vh-65px)]">
          {/* ── Left: element controls ── */}
          <div className="w-80 border-r border-[#1E293B] flex flex-col overflow-hidden">
            {/* Theme selector */}
            <div className="p-4 border-b border-[#1E293B]">
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-2">
                Card
              </label>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTheme === t.id
                        ? "bg-[#FBBF24] text-[#0F172A]"
                        : "bg-[#0F172A] border border-[#1E293B] text-[#94A3B8] hover:bg-[#1E293B]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Elements list */}
            <div className="flex-1 overflow-y-auto p-4">
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-3">
                Elementos
              </label>
              {defs.length === 0 && (
                <p className="text-sm text-[#475569]">
                  Nenhum elemento configurável para este card ainda.
                </p>
              )}
              {defs.map((def) => (
                <ElementPanel
                  key={def.id}
                  def={def}
                  override={currentOverrides[def.id] ?? {}}
                  onChange={handleElementChange}
                />
              ))}
            </div>
          </div>

          {/* ── Right: live preview ── */}
          <div className="flex-1 flex flex-col items-center justify-center bg-[#0A0F1E] overflow-auto p-8">
            <div className="mb-6 text-center">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Preview ao vivo
              </span>
              <p className="text-xs text-[#475569] mt-1">
                Alterações refletem aqui instantaneamente
              </p>
            </div>

            <div style={{ width: 280, aspectRatio: "2/3" }}>
              <CardTemplate
                themeId={selectedTheme}
                photoUrl={MOCK_PHOTO}
                generatedImageUrl={MOCK_PHOTO}
                formData={MOCK_DATA[selectedTheme] ?? {}}
                showWatermark={false}
                themeOverrides={themeOverridesForCard}
              />
            </div>

            <p className="mt-4 text-xs text-[#334155]">
              Usando foto e dados mock para visualização
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

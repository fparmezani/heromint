import type { CSSProperties } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ElementOverride {
  visible?: boolean;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  width?: number | string;
  height?: number | string;
  fontSize?: number | string;
  opacity?: number;
  transform?: string;
}

/** All overrides for one theme, keyed by element ID */
export type ThemeOverrides = Record<string, ElementOverride>;

/** Full overrides map for all themes */
export type TemplateOverridesMap = Record<string, ThemeOverrides>;

// ─── Element definitions (used by admin editor) ───────────────────────────────

export interface ElementDef {
  id: string;
  label: string;
  controls: Array<"visible" | "top" | "left" | "right" | "bottom" | "width" | "height" | "fontSize" | "opacity">;
}

export const THEME_ELEMENT_DEFS: Record<string, ElementDef[]> = {
  "futebol-panini": [
    { id: "bg-numbers",  label: 'Numeros "26" fundo',    controls: ["visible", "opacity", "right", "top", "fontSize"] },
    { id: "flag-circle", label: "Bandeira Brasil",        controls: ["visible", "opacity", "top", "right", "width", "height"] },
    { id: "brasil-text", label: 'Texto "BRASIL" lateral', controls: ["visible", "opacity", "right", "fontSize"] },
    { id: "player-name", label: "Nome do jogador",        controls: ["visible", "opacity", "fontSize"] },
    { id: "info-panel",  label: "Painel inferior (nome/stats)", controls: ["visible", "opacity"] },
    { id: "border",      label: "Borda branca",           controls: ["visible", "opacity"] },
  ],
  "futebol-2026": [
    { id: "outer-frame",     label: "Moldura dourada externa",          controls: ["visible", "opacity"] },
    { id: "inner-frame",     label: "Moldura dourada interna",          controls: ["visible", "opacity"] },
    { id: "corners",         label: "Ornamentos de canto",              controls: ["visible", "opacity"] },
    { id: "badge-2026",      label: "Badge '2026' (topo esquerda)",     controls: ["visible", "opacity", "top", "left", "fontSize"] },
    { id: "top-right-group", label: "Grupo topo direita (taça+copa+bandeira+código)", controls: ["visible", "opacity", "top", "right"] },
    { id: "trophy-icon",     label: "Ícone da taça",                   controls: ["visible", "opacity", "width", "height"] },
    { id: "copa-text",       label: "Texto 'COPA 2026'",               controls: ["visible", "opacity", "fontSize"] },
    { id: "country-flag",    label: "Bandeira do país (círculo)",       controls: ["visible", "opacity", "width", "height"] },
    { id: "country-code",    label: "Código do país (ex: BRA)",        controls: ["visible", "opacity", "fontSize"] },
    { id: "nameplate",       label: "Placa do nome (fundo)",            controls: ["visible", "opacity", "bottom", "left", "right"] },
    { id: "player-name",     label: "Nome do jogador",                  controls: ["visible", "fontSize", "opacity"] },
    { id: "stats-text",      label: "Estatísticas (data/altura/peso)", controls: ["visible", "opacity", "fontSize"] },
    { id: "club-crest",      label: "Escudo do clube (flutuante)",       controls: ["visible", "opacity", "width", "height", "top", "left"] },
    { id: "team-name",       label: "Nome do time",                     controls: ["visible", "opacity", "fontSize"] },
    { id: "star-icon",       label: "Estrela dourada (flutuante)",      controls: ["visible", "opacity", "width", "height", "top", "right"] },
  ],
};

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Merges a base CSSProperties with an ElementOverride.
 * If visible === false, returns display:none.
 * All other override keys are spread into the base style.
 */
export function applyOverride(
  base: CSSProperties,
  override: ElementOverride | undefined
): CSSProperties {
  if (!override) return base;
  const { visible, ...rest } = override;
  if (visible === false) return { ...base, display: "none" };
  const normalized: CSSProperties = {};
  for (const [k, v] of Object.entries(rest)) {
    if (typeof v === "number" && !["opacity", "zIndex", "flex", "order"].includes(k)) {
      (normalized as Record<string, unknown>)[k] = `${v}px`;
    } else {
      (normalized as Record<string, unknown>)[k] = v;
    }
  }
  return { ...base, ...normalized };
}

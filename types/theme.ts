export type ThemeId =
  | "futebol-2026"
  | "futebol-panini"
  | "hero-card"
  | "profissional-premium"
  | "reino-medieval"
  | "escola-de-magia"
  | "baby-hero"
  | "family-pack"
  | "pet-star"
  | "battle-card"
  | "avatar-poster";

export type ThemeBadge = "Popular" | "Novo" | "Premium" | "Família";

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  badge: ThemeBadge;
  icon: string;
  gradient: string;
  bgColor: string;
  fields: ThemeField[];
}

export interface ThemeField {
  key: string;
  label: string;
  type: "text" | "select" | "number" | "date";
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

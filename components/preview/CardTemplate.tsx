"use client";

import { useEffect, useState } from "react";
import { WatermarkOverlay } from "./WatermarkOverlay";
import { shouldBypassWatermark } from "@/lib/environment";

interface CardTemplateProps {
  themeId: string;
  photoUrl: string;
  generatedImageUrl?: string;
  formData: Record<string, string>;
  showWatermark?: boolean;
}

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='768'%3E%3Crect fill='%231E293B' width='512' height='768'/%3E%3Ctext x='256' y='384' font-size='32' fill='%2394A3B8' text-anchor='middle' dominant-baseline='middle'%3EAguardando imagem...%3C/text%3E%3C/svg%3E";

// Deterministic stat based on string + seed (stable across renders)
function stat(str: string, seed: number, min = 70, max = 99): number {
  let h = seed * 2654435761;
  for (let i = 0; i < (str ?? "").length; i++) {
    h = Math.imul(h ^ (str ?? "").charCodeAt(i), 2654435761);
  }
  return min + (Math.abs(h) % (max - min + 1));
}

function countryFlag(pais = ""): string {
  const p = pais.toLowerCase();
  if (p.includes("brasil") || p.includes("brazil")) return "🇧🇷";
  if (p.includes("argentina")) return "🇦🇷";
  if (p.includes("portugal")) return "🇵🇹";
  if (p.includes("alemanha") || p.includes("germany")) return "🇩🇪";
  if (p.includes("espanha") || p.includes("spain")) return "🇪🇸";
  if (p.includes("fran")) return "🇫🇷";
  if (p.includes("italia")) return "🇮🇹";
  if (p.includes("uruguai")) return "🇺🇾";
  return "🌎";
}
function countryCode(pais = ""): string {
  const p = pais.toLowerCase();
  if (p.includes("brasil") || p.includes("brazil")) return "BRA";
  if (p.includes("argentina")) return "ARG";
  if (p.includes("portugal")) return "POR";
  if (p.includes("alemanha")) return "GER";
  if (p.includes("espanha")) return "ESP";
  return pais.slice(0, 3).toUpperCase() || "BRA";
}
function posCode(pos = ""): string {
  const m: Record<string, string> = {
    Goleiro: "GK",
    Lateral: "LAT",
    Zagueiro: "ZAG",
    Volante: "VOL",
    Meia: "MEI",
    Atacante: "ATA",
    Centroavante: "CA",
  };
  return m[pos] ?? (pos.slice(0, 3).toUpperCase() || "ATA");
}

// Corner ornament SVG
function Corner({ color, rotate }: { color: string; rotate: number }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path
        d="M2 20 L2 4 Q2 2 4 2 L20 2"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="2" cy="2" r="2" fill={color} />
    </svg>
  );
}
function Corners({ color }: { color: string }) {
  return (
    <>
      <div style={{ position: "absolute", top: 6, left: 6, zIndex: 30 }}>
        <Corner color={color} rotate={0} />
      </div>
      <div style={{ position: "absolute", top: 6, right: 6, zIndex: 30 }}>
        <Corner color={color} rotate={90} />
      </div>
      <div style={{ position: "absolute", bottom: 6, left: 6, zIndex: 30 }}>
        <Corner color={color} rotate={270} />
      </div>
      <div style={{ position: "absolute", bottom: 6, right: 6, zIndex: 30 }}>
        <Corner color={color} rotate={180} />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. FUTEBOL 2026
// ─────────────────────────────────────────────────────────────────────────────
function FutebolCard({
  photoUrl,
}: {
  photoUrl: string;
}) {
  return (
    <img
      src={photoUrl}
      alt=""
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "top",
        display: "block",
        borderRadius: 0,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1.1 FUTEBOL PANINI — collectible sticker style
// ─────────────────────────────────────────────────────────────────────────────
function FutebolPaniniCard({
  photoUrl,
  f,
}: {
  photoUrl: string;
  f: Record<string, string>;
}) {
  const flag = countryFlag(f?.pais || "");
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };
  const formatHeight = (height: string) => {
    if (!height) return "";
    return `${parseFloat(height).toFixed(2).replace(".", ",")}m`;
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        background: "linear-gradient(135deg, #00B4A6 0%, #00A693 100%)", // Turquoise background
      }}
    >
      {/* Large background numbers */}
      <div
        style={{
          position: "absolute",
          right: -20,
          top: "10%",
          fontSize: "clamp(120px, 25vw, 180px)",
          fontWeight: 900,
          color: "rgba(0,150,120,0.3)",
          lineHeight: 0.8,
          fontFamily: "Impact, Arial Black, sans-serif",
          zIndex: 1,
        }}
      >
        26
      </div>

      {/* Brazilian flag circle */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          zIndex: 15,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        {flag}
      </div>

      {/* Vertical BRASIL text */}
      <div
        style={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%) rotate(90deg)",
          transformOrigin: "center",
          color: "white",
          fontSize: 14,
          fontWeight: 900,
          letterSpacing: 3,
          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          zIndex: 15,
        }}
      >
        BRASIL
      </div>

      {/* Photo container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "75%",
          overflow: "hidden",
        }}
      >
        {photoUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
                display: "block",
              }}
            />
            {/* Gradient fade to info panel */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "30%",
                background:
                  "linear-gradient(to top, rgba(0,180,166,0.9) 0%, rgba(0,180,166,0.3) 50%, transparent 100%)",
              }}
            />
          </>
        )}
      </div>

      {/* Player info panel */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#00B4A6",
          padding: "12px 16px 8px",
          zIndex: 15,
        }}
      >
        {/* Player name */}
        <div
          style={{
            color: "white",
            fontWeight: 900,
            fontSize: "clamp(16px, 5vw, 22px)",
            textAlign: "center",
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: 1,
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          {f?.nome || "JOGADOR"}
        </div>

        {/* Player stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            fontWeight: 700,
            color: "white",
            marginBottom: 4,
          }}
        >
          {f?.dataNascimento && <span>{formatDate(f.dataNascimento)}</span>}
          {f?.altura && <span>| {formatHeight(f.altura)}</span>}
          {f?.peso && <span>| {f.peso} kg</span>}
        </div>

        {/* Team */}
        {f?.time && (
          <div
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 10,
              textAlign: "center",
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {f?.time}
          </div>
        )}
      </div>

      {/* Clean border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 18,
          border: "3px solid white",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          zIndex: 20,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. HERO CARD — dark fantasy RPG
// ─────────────────────────────────────────────────────────────────────────────
function HeroCard({
  photoUrl,
  f,
}: {
  photoUrl: string;
  f: Record<string, string>;
}) {
  const nome = f.nome ?? "HERÓI";
  const rarityColor: Record<string, string> = {
    Lendário: "#FBBF24",
    Épico: "#A78BFA",
    Raro: "#60A5FA",
    Mítico: "#F43F5E",
    Comum: "#9CA3AF",
  };
  const col = rarityColor[f.raridade] ?? "#A78BFA";
  const level = stat(nome, 1, 75, 99);
  const stats = [
    { icon: "⚔️", label: "ATAQUE", val: stat(nome, 2) },
    { icon: "🛡️", label: "DEFESA", val: stat(nome, 3, 65, 95) },
    { icon: "🔮", label: "MAGIA", val: stat(nome, 4, 60, 90) },
    { icon: "⚡", label: "AGILIDADE", val: stat(nome, 5) },
    { icon: "✨", label: "CARISMA", val: stat(nome, 6) },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        background: "linear-gradient(160deg, #0d0118 0%, #1a0535 100%)",
      }}
    >
      {/* Radial glow background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 35%, ${col}22 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      {/* Rarity border with glow */}
      <div
        style={{
          position: "absolute",
          inset: 3,
          borderRadius: 18,
          border: `2px solid ${col}`,
          boxShadow: `inset 0 0 28px ${col}28, 0 0 22px ${col}22`,
          zIndex: 20,
          pointerEvents: "none",
        }}
      />
      <Corners color={col} />

      {/* Top row: gem + rarity left | NÍVEL right */}
      <div
        style={{
          position: "relative",
          zIndex: 15,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 14px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: `${col}28`,
              border: `1.5px solid ${col}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            💎
          </div>
          <span
            style={{
              color: col,
              fontWeight: 800,
              fontSize: 7,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            {f.raridade ?? "ÉPICO"}
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 7,
              fontWeight: 600,
              letterSpacing: 1.5,
              display: "block",
            }}
          >
            NÍVEL
          </span>
          <span
            style={{
              color: col,
              fontWeight: 900,
              fontSize: 24,
              lineHeight: 1,
            }}
          >
            {level}
          </span>
        </div>
      </div>

      {/* Photo — 50% height */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          margin: "5px 10px 0",
          borderRadius: 10,
          overflow: "hidden",
          height: "44%",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, #0d0118 0%, rgba(13,1,24,0.15) 50%, transparent 75%)`,
          }}
        />
      </div>

      {/* Gold ornate line */}
      <div
        style={{
          height: 1.5,
          background: `linear-gradient(90deg, transparent, ${col}99, ${col}, ${col}99, transparent)`,
          margin: "3px 10px",
          position: "relative",
          zIndex: 11,
        }}
      />

      {/* Name + class + stats */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          margin: "0 10px 8px",
          borderRadius: 10,
          background: "rgba(0,0,0,0.52)",
          border: `1px solid ${col}30`,
        }}
      >
        <div style={{ padding: "5px 10px 8px" }}>
          <p
            style={{
              color: col,
              fontWeight: 900,
              fontSize: "clamp(11px, 4vw, 17px)",
              textAlign: "center",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: 1,
              textShadow: `0 0 14px ${col}80`,
            }}
          >
            {nome}
          </p>
          <p
            style={{
              color: "rgba(180,140,255,0.55)",
              fontSize: 7,
              textAlign: "center",
              margin: "1px 0 5px",
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            {f.classe ?? "GUERREIRO"}
          </p>
          <div
            style={{
              height: 1,
              background: `${col}30`,
              marginBottom: 4,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {stats.map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <span style={{ fontSize: 9 }}>{s.icon}</span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 8,
                      fontWeight: 600,
                      letterSpacing: 1,
                    }}
                  >
                    {s.label}
                  </span>
                </div>
                <span
                  style={{
                    color: "white",
                    fontWeight: 900,
                    fontSize: 11,
                  }}
                >
                  {s.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PROFISSIONAL PREMIUM — clean dark executive
// ─────────────────────────────────────────────────────────────────────────────
function ProfissionalCard({
  photoUrl,
  f,
}: {
  photoUrl: string;
  f: Record<string, string>;
}) {
  const traitsRaw = (f.especialidade ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const traits =
    traitsRaw.length >= 3
      ? traitsRaw.slice(0, 3)
      : ["Líder", "Estratégico", "Inovador"];
  const traitIcons = ["⭐", "📊", "🎯"];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        background: "linear-gradient(160deg, #0a0f1a 0%, #111827 50%, #0a0f1a 100%)",
      }}
    >
      {/* Subtle radial */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(37,99,235,0.12) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Blue/purple gradient top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, #2563eb, #7c3aed, #2563eb)",
          zIndex: 21,
        }}
      />

      {/* Border */}
      <div
        style={{
          position: "absolute",
          inset: 3,
          borderRadius: 18,
          border: "1.5px solid rgba(37,99,235,0.45)",
          boxShadow: "inset 0 0 22px rgba(37,99,235,0.08)",
          zIndex: 20,
          pointerEvents: "none",
        }}
      />

      {/* Photo — 52% height */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "70%",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, #0a0f1a 0%, rgba(10,15,26,0.15) 55%, transparent 75%)",
          }}
        />
      </div>

      {/* Info */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "8px 14px 10px",
        }}
      >
        <p
          style={{
            color: "white",
            fontWeight: 900,
            fontSize: "clamp(11px, 4.5vw, 19px)",
            margin: 0,
            letterSpacing: 0.5,
            textShadow: "0 0 20px rgba(37,99,235,0.3)",
          }}
        >
          {f.nome ?? ""}
        </p>
        <p
          style={{
            margin: "2px 0 6px",
            fontWeight: 700,
            fontSize: 8,
            letterSpacing: 1.5,
            background: "linear-gradient(90deg, #2563eb, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {(f.cargo ?? "PROFISSIONAL").toUpperCase()}
        </p>

        {/* Separator */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, rgba(37,99,235,0.4), rgba(124,58,237,0.4))",
            marginBottom: 7,
          }}
        />

        {/* 3 trait badges */}
        <div
          style={{
            display: "flex",
            gap: 4,
            justifyContent: "space-between",
            marginBottom: 7,
          }}
        >
          {traits.map((t, i) => (
            <div
              key={t}
              style={{
                flex: 1,
                background: "rgba(37,99,235,0.1)",
                border: "1px solid rgba(37,99,235,0.28)",
                borderRadius: 7,
                padding: "5px 2px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <span style={{ fontSize: 11 }}>{traitIcons[i]}</span>
              <span
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 7,
                  textAlign: "center",
                  lineHeight: 1.2,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {t}
              </span>
            </div>
          ))}
        </div>

        {f.fraseProfissional && (
          <p
            style={{
              color: "rgba(255,255,255,0.42)",
              fontStyle: "italic",
              fontSize: 8,
              textAlign: "center",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            &ldquo;{f.fraseProfissional}&rdquo;
          </p>
        )}
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, #7c3aed, #2563eb, #7c3aed)",
          zIndex: 21,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. REINO MEDIEVAL — parchment/medieval
// ─────────────────────────────────────────────────────────────────────────────
function ReinoMedievalCard({
  photoUrl,
  f,
}: {
  photoUrl: string;
  f: Record<string, string>;
}) {
  const nome = f.nome ?? "CAVALEIRO";
  const stats = [
    { icon: "⚔️", label: "FORÇA", val: stat(nome, 1) },
    { icon: "🛡️", label: "HONRA", val: stat(nome, 2, 80, 99) },
    { icon: "🏃", label: "DESTREZA", val: stat(nome, 3, 65, 90) },
    { icon: "📖", label: "SABEDORIA", val: stat(nome, 4, 60, 88) },
    { icon: "❤️", label: "LEALDADE", val: stat(nome, 5, 75, 99) },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        background: "linear-gradient(160deg, #1a0e00 0%, #2d1800 50%, #1a0e00 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(180,130,30,0.16) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Gold border */}
      <div
        style={{
          position: "absolute",
          inset: 3,
          borderRadius: 18,
          border: "2.5px solid #8B6914",
          boxShadow:
            "inset 0 0 30px rgba(139,105,20,0.22), 0 0 15px rgba(139,105,20,0.15)",
          zIndex: 20,
          pointerEvents: "none",
        }}
      />
      <Corners color="#c9a227" />

      {/* Lion crest top left */}
      <div
        style={{ position: "absolute", top: 12, left: 12, zIndex: 15, fontSize: 26 }}
      >
        🦁
      </div>

      {/* Fleur top right */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 15,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "rgba(139,105,20,0.22)",
          border: "1.5px solid rgba(201,162,39,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
        }}
      >
        ⚜️
      </div>

      {/* Photo — 45% height */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "45%",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            display: "block",
          }}
        />
        {/* Fade to warm brown at bottom */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, #1a0e00 0%, rgba(26,14,0,0.3) 45%, transparent 70%)",
          }}
        />
      </div>

      {/* Bottom parchment panel */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "70%",
          background: "linear-gradient(160deg, #2c1a04, #3d2408)",
          zIndex: 11,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Gold top line */}
        <div
          style={{
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #c9a227, #f5d060, #c9a227, transparent)",
            flexShrink: 0,
          }}
        />

        <div style={{ padding: "6px 12px 10px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <p
              style={{
                color: "#f5d060",
                fontWeight: 900,
                fontSize: "clamp(11px, 4.2vw, 17px)",
                textAlign: "center",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: 1,
                textShadow: "0 0 14px rgba(245,208,96,0.4)",
              }}
            >
              {nome}
            </p>
            <p
              style={{
                color: "rgba(245,208,96,0.55)",
                fontSize: 7,
                textAlign: "center",
                margin: "2px 0 4px",
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              {f.reino
                ? `${f.classe ?? ""} • ${f.reino}`
                : f.classe ?? "CAVALEIRO DO REINO"}
            </p>
            <div
              style={{
                height: 1,
                background: "rgba(201,162,39,0.28)",
                marginBottom: 4,
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {stats.map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <span style={{ fontSize: 9 }}>{s.icon}</span>
                  <span
                    style={{
                      color: "rgba(245,208,96,0.7)",
                      fontSize: 8,
                      fontWeight: 600,
                      letterSpacing: 1,
                    }}
                  >
                    {s.label}
                  </span>
                </div>
                <span
                  style={{
                    color: "#f5d060",
                    fontWeight: 900,
                    fontSize: 11,
                  }}
                >
                  {s.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ESCOLA DE MAGIA — dark mystical
// ─────────────────────────────────────────────────────────────────────────────
function EscolaMagiaCard({
  photoUrl,
  f,
}: {
  photoUrl: string;
  f: Record<string, string>;
}) {
  const nome = f.nome ?? "MAGO";
  const houseColors: Record<string, string> = {
    "Casa da Chama": "#C0392B",
    "Casa da Sombra": "#8B5CF6",
    "Casa da Luz": "#F39C12",
    "Casa do Vento": "#27AE60",
    "Casa da Terra": "#92400E",
    "Casa das Águas": "#2980B9",
  };
  const col = houseColors[f.casaFicticia ?? ""] ?? "#22C55E";
  const houseIcons: Record<string, string> = {
    "Casa da Chama": "🔥",
    "Casa da Sombra": "🐍",
    "Casa da Luz": "✨",
    "Casa do Vento": "🌪️",
    "Casa da Terra": "🌿",
    "Casa das Águas": "💧",
  };
  const icon = houseIcons[f.casaFicticia ?? ""] ?? "🐍";
  const houseShort = (f.casaFicticia ?? "")
    .replace("Casa da ", "")
    .replace("Casa do ", "")
    .replace("Casa das ", "");

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        background: "linear-gradient(160deg, #050f08 0%, #071a0c 50%, #050f08 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, ${col}1a 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      {/* House-color border */}
      <div
        style={{
          position: "absolute",
          inset: 3,
          borderRadius: 18,
          border: `2px solid ${col}70`,
          boxShadow: `inset 0 0 28px ${col}18`,
          zIndex: 20,
          pointerEvents: "none",
        }}
      />
      <Corners color={col} />

      {/* House crest top left */}
      <div
        style={{ position: "absolute", top: 11, left: 11, zIndex: 15 }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: `${col}22`,
            border: `2px solid ${col}65`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          {icon}
        </div>
      </div>

      {/* House short name top right */}
      <div
        style={{ position: "absolute", top: 14, right: 14, zIndex: 15 }}
      >
        <span
          style={{
            color: col,
            fontSize: 7,
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          {houseShort}
        </span>
      </div>

      {/* Photo — 44% height */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "44%",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, #050f08 0%, transparent 58%)",
          }}
        />
      </div>

      {/* Info panel */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          margin: "3px 10px 8px",
          borderRadius: 10,
          background: "rgba(0,0,0,0.58)",
          border: `1px solid ${col}32`,
        }}
      >
        <div
          style={{
            height: 1.5,
            background: `linear-gradient(90deg, transparent, ${col}, transparent)`,
          }}
        />
        <div style={{ padding: "6px 10px 10px" }}>
          <p
            style={{
              color: "white",
              fontWeight: 900,
              fontSize: "clamp(11px, 4vw, 17px)",
              textAlign: "center",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {nome}
          </p>
          <p
            style={{
              color: col,
              fontSize: 7,
              textAlign: "center",
              margin: "1px 0 6px",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {f.casaFicticia ?? ""}
          </p>
          <div
            style={{
              height: 1,
              background: `${col}28`,
              marginBottom: 6,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {f.poder && (
              <div style={{ display: "flex", gap: 8 }}>
                <span
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: 8,
                    minWidth: 48,
                  }}
                >
                  PODER:
                </span>
                <span
                  style={{ color: "white", fontSize: 8, fontWeight: 700 }}
                >
                  {f.poder}
                </span>
              </div>
            )}
            {f.nivelMagico && (
              <div style={{ display: "flex", gap: 8 }}>
                <span
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: 8,
                    minWidth: 48,
                  }}
                >
                  NÍVEL:
                </span>
                <span
                  style={{ color: "white", fontSize: 8, fontWeight: 700 }}
                >
                  {f.nivelMagico}
                </span>
              </div>
            )}
            {f.animalGuia && (
              <div style={{ display: "flex", gap: 8 }}>
                <span
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: 8,
                    minWidth: 48,
                  }}
                >
                  ANIMAL:
                </span>
                <span
                  style={{ color: "white", fontSize: 8, fontWeight: 700 }}
                >
                  {f.animalGuia}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. BABY HERO — bright superhero colorful
// ─────────────────────────────────────────────────────────────────────────────
function BabyHeroCard({
  photoUrl,
  f,
}: {
  photoUrl: string;
  f: Record<string, string>;
}) {
  const nome = f.nomeCrianca ?? "HERÓI";
  const coragem = stat(nome, 1, 85, 99);
  const alegria = stat(nome, 2, 90, 100);
  const energia = stat(nome, 3, 85, 99);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        background: "linear-gradient(160deg, #0a1a3d 0%, #0d2260 50%, #0a1a3d 100%)",
      }}
    >
      {/* Gold radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 28%, rgba(251,191,36,0.14) 0%, transparent 62%)",
          pointerEvents: "none",
        }}
      />

      {/* Orange/gold border */}
      <div
        style={{
          position: "absolute",
          inset: 3,
          borderRadius: 18,
          border: "2.5px solid #f59e0b",
          boxShadow: "inset 0 0 22px rgba(251,191,36,0.16)",
          zIndex: 20,
          pointerEvents: "none",
        }}
      />
      <Corners color="#f59e0b" />

      {/* Stars top center */}
      <div
        style={{
          position: "relative",
          zIndex: 15,
          display: "flex",
          justifyContent: "center",
          gap: 3,
          paddingTop: 13,
        }}
      >
        {["⭐", "⭐", "⭐"].map((s, i) => (
          <span key={i} style={{ fontSize: 13 }}>
            {s}
          </span>
        ))}
      </div>

      {/* Photo — 44% height */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "44%",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, #0a1a3d 0%, transparent 58%)",
          }}
        />
      </div>

      {/* Info */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          margin: "3px 10px 8px",
          borderRadius: 10,
          background:
            "linear-gradient(160deg, rgba(251,191,36,0.1), rgba(239,68,68,0.1))",
          border: "1.5px solid rgba(251,191,36,0.38)",
        }}
      >
        <div
          style={{
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #f59e0b, #ef4444, #f59e0b, transparent)",
          }}
        />
        <div style={{ padding: "5px 10px 8px" }}>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 7,
              textAlign: "center",
              margin: "0 0 1px",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            PEQUENO HERÓI
          </p>
          <p
            style={{
              color: "#fbbf24",
              fontWeight: 900,
              fontSize: "clamp(12px, 5vw, 21px)",
              textAlign: "center",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: 1,
              textShadow: "0 0 16px rgba(251,191,36,0.55)",
            }}
          >
            {nome}
          </p>
          {f.idade && (
            <p
              style={{
                color: "rgba(255,255,255,0.42)",
                fontSize: 7,
                textAlign: "center",
                margin: "1px 0 4px",
              }}
            >
              {f.idade} anos
            </p>
          )}
          <div
            style={{
              height: 1,
              background: "rgba(251,191,36,0.22)",
              margin: "3px 0 4px",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {(
              [
                ["⚡", "CORAGEM", coragem],
                ["😊", "ALEGRIA", alegria],
                ["🔥", "ENERGIA", energia],
              ] as [string, string, number][]
            ).map(([icon, lbl, val]) => (
              <div
                key={lbl}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <span style={{ fontSize: 10 }}>{icon}</span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.62)",
                      fontSize: 8,
                      fontWeight: 600,
                    }}
                  >
                    {lbl}
                  </span>
                </div>
                <span
                  style={{
                    color: "#fbbf24",
                    fontWeight: 900,
                    fontSize: 11,
                  }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
          {f.poderFofo && (
            <p
              style={{
                color: "rgba(255,255,255,0.48)",
                fontSize: 7,
                textAlign: "center",
                margin: "5px 0 0",
                fontStyle: "italic",
                letterSpacing: 1,
              }}
            >
              PODER: {f.poderFofo.toUpperCase()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. FAMILY PACK — warm gold/brown
// ─────────────────────────────────────────────────────────────────────────────
function FamilyPackCard({
  photoUrl,
  f,
}: {
  photoUrl: string;
  f: Record<string, string>;
}) {
  const members = (f.membrosFamilia ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const roles = ["PAI", "MÃE", "FILHO", "PET"];
  const filledMembers = [...members, ...Array(4).fill("")].slice(0, 4);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        background: "linear-gradient(160deg, #120800 0%, #1e0f00 50%, #120800 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(201,162,39,0.11) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Gold border */}
      <div
        style={{
          position: "absolute",
          inset: 3,
          borderRadius: 18,
          border: "2.5px solid #8B6914",
          boxShadow: "inset 0 0 25px rgba(139,105,20,0.15)",
          zIndex: 20,
          pointerEvents: "none",
        }}
      />
      <Corners color="#c9a227" />

      {/* Header */}
      <div
        style={{
          position: "relative",
          zIndex: 15,
          padding: "13px 14px 0",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#f5d060",
            fontWeight: 900,
            fontSize: "clamp(11px, 4.5vw, 17px)",
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: 1,
            textShadow: "0 0 12px rgba(245,208,96,0.3)",
          }}
        >
          FAMÍLIA {(f.nomeFamilia ?? "").toUpperCase()}
        </p>
        <p
          style={{
            color: "rgba(245,208,96,0.48)",
            fontSize: 7,
            margin: "1px 0 0",
            letterSpacing: 2.5,
            textTransform: "uppercase",
          }}
        >
          {f.fraseFamilia ?? "NOSSA MAIOR AVENTURA"}
        </p>
      </div>

      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(201,162,39,0.5), transparent)",
          margin: "6px 14px",
          position: "relative",
          zIndex: 11,
        }}
      />

      {/* 2x2 photo grid */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 5,
          margin: "0 10px",
        }}
      >
        {([0, 1, 2, 3] as const).map((i) => (
          <div
            key={i}
            style={{
              borderRadius: 8,
              overflow: "hidden",
              background: "rgba(201,162,39,0.1)",
              border: "1px solid rgba(201,162,39,0.28)",
              aspectRatio: "1",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {i === 0 ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top",
                    position: "absolute",
                    inset: 0,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(18,8,0,0.82) 0%, transparent 60%)",
                  }}
                />
              </>
            ) : (
              <div style={{ fontSize: 24, opacity: 0.35 }}>👤</div>
            )}
            <div
              style={{
                position: "absolute",
                bottom: 3,
                left: 0,
                right: 0,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,0.82)",
                  fontSize: 7,
                  fontWeight: 700,
                  margin: 0,
                  textShadow: "0 1px 4px rgba(0,0,0,0.9)",
                }}
              >
                {(filledMembers[i] || roles[i]).toUpperCase()}
              </p>
              <p
                style={{
                  color: "rgba(245,208,96,0.5)",
                  fontSize: 6,
                  margin: 0,
                }}
              >
                {roles[i]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Heart */}
      <div
        style={{
          position: "relative",
          zIndex: 15,
          textAlign: "center",
          padding: "4px 0 2px",
        }}
      >
        <span style={{ fontSize: 15 }}>💛</span>
      </div>

      {/* Motto */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          margin: "2px 10px 8px",
          borderRadius: 8,
          background: "rgba(201,162,39,0.1)",
          border: "1px solid rgba(201,162,39,0.22)",
          padding: "5px 8px",
        }}
      >
        <p
          style={{
            color: "#f5d060",
            fontWeight: 700,
            fontSize: 8,
            textAlign: "center",
            margin: 0,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {f.fraseFamilia ?? "JUNTOS SOMOS IMBATÍVEIS!"}
        </p>
        {f.ano && (
          <p
            style={{
              color: "rgba(245,208,96,0.38)",
              fontSize: 6,
              textAlign: "center",
              margin: "2px 0 0",
            }}
          >
            {f.ano}
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. PET STAR — dark purple royal
// ─────────────────────────────────────────────────────────────────────────────
function PetStarCard({
  photoUrl,
  f,
}: {
  photoUrl: string;
  f: Record<string, string>;
}) {
  const nome = f.nomePet ?? "PET";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        background: "linear-gradient(160deg, #0d0025 0%, #1a004d 50%, #0d0025 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 38%, rgba(201,162,39,0.16) 0%, transparent 62%)",
          pointerEvents: "none",
        }}
      />

      {/* Gold border */}
      <div
        style={{
          position: "absolute",
          inset: 3,
          borderRadius: 18,
          border: "2.5px solid #8B6914",
          boxShadow: "inset 0 0 25px rgba(139,105,20,0.22)",
          zIndex: 20,
          pointerEvents: "none",
        }}
      />
      <Corners color="#c9a227" />

      {/* Paw top center */}
      <div
        style={{
          position: "relative",
          zIndex: 15,
          textAlign: "center",
          paddingTop: 12,
        }}
      >
        <span style={{ fontSize: 24 }}>🐾</span>
      </div>

      {/* Photo with crown — 47% height */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "47%",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, #0d0025 0%, transparent 58%)",
          }}
        />
        {/* Crown overlay */}
        <div
          style={{
            position: "absolute",
            top: 5,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 24,
          }}
        >
          👑
        </div>
      </div>

      {/* Info */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          margin: "3px 10px 8px",
          borderRadius: 10,
          background: "rgba(0,0,0,0.52)",
          border: "1px solid rgba(201,162,39,0.32)",
        }}
      >
        <div
          style={{
            height: 1.5,
            background:
              "linear-gradient(90deg, transparent, #c9a227, transparent)",
          }}
        />
        <div style={{ padding: "6px 10px 8px" }}>
          <p
            style={{
              color: "#f5d060",
              fontWeight: 900,
              fontSize: "clamp(12px, 4.5vw, 19px)",
              textAlign: "center",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: 1,
              textShadow: "0 0 14px rgba(245,208,96,0.45)",
            }}
          >
            {nome}
          </p>
          <p
            style={{
              color: "rgba(245,208,96,0.5)",
              fontSize: 7,
              textAlign: "center",
              margin: "1px 0 5px",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {f.tipo
              ? `O ${f.tipo.toUpperCase()} DA CASA`
              : "O REI DA CASA"}
          </p>
          <div
            style={{
              height: 1,
              background: "rgba(201,162,39,0.22)",
              marginBottom: 4,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {(
              [
                ["🐾", "FOFO", stat(nome, 1, 95, 100)],
                ["🐾", "LEALDADE", stat(nome, 2, 95, 100)],
                ["🐾", "PROTEÇÃO", stat(nome, 3, 85, 99)],
                ["🐾", "CARISMA", stat(nome, 4, 88, 99)],
              ] as [string, string, number][]
            ).map(([icon, lbl, val]) => (
              <div
                key={lbl}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <span style={{ fontSize: 9 }}>{icon}</span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.62)",
                      fontSize: 8,
                      fontWeight: 600,
                    }}
                  >
                    {lbl}
                  </span>
                </div>
                <span
                  style={{
                    color: "#f5d060",
                    fontWeight: 900,
                    fontSize: 11,
                  }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. BATTLE CARD — dark split red/blue
// ─────────────────────────────────────────────────────────────────────────────
function BattleCard({
  photoUrl,
  f,
}: {
  photoUrl: string;
  f: Record<string, string>;
}) {
  const p1 = f.nomeJogador1 ?? "JOGADOR";
  const p2 = f.nomeRival ?? "RIVAL";
  const s1 = {
    atk: stat(p1, 1, 80, 95),
    def: stat(p1, 2, 75, 92),
    vel: stat(p1, 3, 78, 95),
    int: stat(p1, 4, 80, 92),
  };
  const s2 = {
    atk: stat(p2, 1, 80, 98),
    def: stat(p2, 2, 78, 95),
    vel: stat(p2, 3, 75, 93),
    int: stat(p2, 4, 78, 95),
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        background: "#0a0000",
      }}
    >
      {/* Split background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(220,38,38,0.18) 0%, #0a0000 50%, rgba(37,99,235,0.18) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Red border */}
      <div
        style={{
          position: "absolute",
          inset: 3,
          borderRadius: 18,
          border: "2px solid rgba(220,38,38,0.55)",
          boxShadow: "inset 0 0 25px rgba(220,38,38,0.1)",
          zIndex: 20,
          pointerEvents: "none",
        }}
      />
      <Corners color="#ef4444" />

      {/* Photo top — 40% height */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "40%",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, #0a0000 0%, transparent 52%)",
          }}
        />
        {/* VS overlay center */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "rgba(0,0,0,0.62)",
              borderRadius: 8,
              padding: "2px 10px",
              boxShadow: "0 0 20px rgba(245,158,11,0.4)",
            }}
          >
            <span
              style={{
                color: "#f59e0b",
                fontWeight: 900,
                fontSize: 30,
                lineHeight: 1,
                textShadow: "0 0 22px rgba(245,158,11,0.85)",
                fontFamily: "Impact, Anton, sans-serif",
              }}
            >
              VS
            </span>
          </div>
        </div>
      </div>

      {/* 2-column player stats */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          margin: "3px 10px 0",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 4,
        }}
      >
        {/* Player 1 */}
        <div
          style={{
            background: "rgba(220,38,38,0.1)",
            border: "1px solid rgba(220,38,38,0.32)",
            borderRadius: 8,
            padding: "5px 7px",
          }}
        >
          <p
            style={{
              color: "white",
              fontWeight: 900,
              fontSize: "clamp(8px, 3vw, 12px)",
              margin: "0 0 1px",
              textTransform: "uppercase",
            }}
          >
            {p1}
          </p>
          <p
            style={{
              color: "rgba(220,38,38,0.7)",
              fontSize: 6,
              margin: "0 0 3px",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {f.papelJogador1 ?? "ATACANTE"}
          </p>
          {(
            [
              ["Ataque", s1.atk],
              ["Defesa", s1.def],
              ["Velocidade", s1.vel],
              ["Inteligência", s1.int],
            ] as [string, number][]
          ).map(([l, v]) => (
            <div
              key={l}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span style={{ color: "rgba(255,255,255,0.48)", fontSize: 7 }}>
                {l}
              </span>
              <span style={{ color: "white", fontWeight: 700, fontSize: 8 }}>
                {v}
              </span>
            </div>
          ))}
        </div>

        {/* Player 2 */}
        <div
          style={{
            background: "rgba(37,99,235,0.1)",
            border: "1px solid rgba(37,99,235,0.32)",
            borderRadius: 8,
            padding: "5px 7px",
          }}
        >
          <p
            style={{
              color: "white",
              fontWeight: 900,
              fontSize: "clamp(8px, 3vw, 12px)",
              margin: "0 0 1px",
              textTransform: "uppercase",
            }}
          >
            {p2}
          </p>
          <p
            style={{
              color: "rgba(37,99,235,0.7)",
              fontSize: 6,
              margin: "0 0 3px",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {f.papelRival ?? "DEFENSOR"}
          </p>
          {(
            [
              ["Força", s2.atk],
              ["Estratégia", s2.def],
              ["Resistência", s2.vel],
              ["Carisma", s2.int],
            ] as [string, number][]
          ).map(([l, v]) => (
            <div
              key={l}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span style={{ color: "rgba(255,255,255,0.48)", fontSize: 7 }}>
                {l}
              </span>
              <span style={{ color: "white", fontWeight: 700, fontSize: 8 }}>
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* BATALHA ÉPICA footer */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          margin: "4px 10px 8px",
          borderRadius: 8,
          background: "rgba(220,38,38,0.15)",
          border: "1px solid rgba(220,38,38,0.32)",
          padding: "4px",
        }}
      >
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #ef4444, transparent)",
            marginBottom: 3,
          }}
        />
        <p
          style={{
            color: "#ef4444",
            fontWeight: 900,
            fontSize: 9,
            textAlign: "center",
            margin: 0,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          ⚡ BATALHA ÉPICA ⚡
        </p>
        {f.estiloBatalha && (
          <p
            style={{
              color: "rgba(255,255,255,0.38)",
              fontSize: 7,
              textAlign: "center",
              margin: "1px 0 0",
            }}
          >
            {f.estiloBatalha}
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. AVATAR / POSTER CINEMÁTICO
// ─────────────────────────────────────────────────────────────────────────────
function AvatarPosterCard({
  photoUrl,
  f,
}: {
  photoUrl: string;
  f: Record<string, string>;
}) {
  const nome = f.nome ?? "AVATAR";
  const energyColors: Record<string, string> = {
    Fogo: "#ef4444",
    Gelo: "#60a5fa",
    Raio: "#fbbf24",
    Sombra: "#7c3aed",
    Luz: "#f59e0b",
    Vento: "#34d399",
    Terra: "#92400e",
  };
  const col = energyColors[f.energiaPrincipal ?? ""] ?? "#7c3aed";
  const badges = [
    { icon: "👁️", label: "FOCO" },
    { icon: "⚡", label: "DISCIPLINA" },
    { icon: "🛡️", label: "RESILIÊNCIA" },
    { icon: "🔭", label: "VISÃO" },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        background: "linear-gradient(160deg, #020817 0%, #060c20 50%, #020817 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 65%, ${col}16 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      {/* Subtle colored border */}
      <div
        style={{
          position: "absolute",
          inset: 3,
          borderRadius: 18,
          border: `1.5px solid ${col}45`,
          boxShadow: `inset 0 0 30px ${col}10`,
          zIndex: 20,
          pointerEvents: "none",
        }}
      />

      {/* Photo — 62% height */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "62%",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            display: "block",
          }}
        />
        {/* Diagonal gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, #020817 0%, rgba(2,8,23,0.25) 45%, transparent 68%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${col}18 0%, transparent 55%)`,
          }}
        />

        {/* Energy/style badge on photo */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "rgba(0,0,0,0.62)",
            backdropFilter: "blur(6px)",
            borderRadius: 6,
            padding: "2px 8px",
            border: `1px solid ${col}42`,
          }}
        >
          <span
            style={{
              color: col,
              fontSize: 7,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            {f.estiloVisual ?? f.energiaPrincipal ?? "PREMIUM"}
          </span>
        </div>
      </div>

      {/* Name + tagline */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "6px 12px 0",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "white",
            fontWeight: 900,
            fontSize: "clamp(14px, 6vw, 26px)",
            margin: 0,
            letterSpacing: 2,
            textTransform: "uppercase",
            textShadow: `0 0 32px ${col}65, 0 2px 8px rgba(0,0,0,0.8)`,
            lineHeight: 1,
          }}
        >
          {nome}
        </p>
        <p
          style={{
            color: col,
            fontSize: 7,
            margin: "3px 0 0",
            letterSpacing: 2.5,
            textTransform: "uppercase",
          }}
        >
          {f.fraseCurta ?? "FOCADO. DISCIPLINADO. IMBATÍVEL."}
        </p>
      </div>

      {/* 4 icon badges */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-around",
          padding: "7px 10px 10px",
        }}
      >
        {badges.map((b) => (
          <div
            key={b.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: `${col}18`,
                border: `1.5px solid ${col}52`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
              }}
            >
              {b.icon}
            </div>
            <span
              style={{
                color: `${col}88`,
                fontSize: 6,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export function CardTemplate({
  themeId,
  photoUrl,
  generatedImageUrl,
  formData: f = {},
  showWatermark = true,
}: CardTemplateProps) {
  const effectivePhoto = generatedImageUrl || photoUrl || PLACEHOLDER_IMAGE;
  const [isPreviewObscured, setIsPreviewObscured] = useState(false);
  
  // Remove marca d'água em ambiente sandbox para testes
  const shouldShowWatermark = showWatermark && !shouldBypassWatermark();

  useEffect(() => {
    if (!shouldShowWatermark) return;

    let revealTimeout: number | undefined;
    const obscureTemporarily = () => {
      setIsPreviewObscured(true);
      window.clearTimeout(revealTimeout);
      revealTimeout = window.setTimeout(() => setIsPreviewObscured(false), 1800);
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPreviewObscured(true);
      } else {
        obscureTemporarily();
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "PrintScreen") obscureTemporarily();
    };

    window.addEventListener("blur", obscureTemporarily);
    window.addEventListener("focus", obscureTemporarily);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      window.clearTimeout(revealTimeout);
      window.removeEventListener("blur", obscureTemporarily);
      window.removeEventListener("focus", obscureTemporarily);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [shouldShowWatermark]);

  const inner = ({
    "futebol-2026": <FutebolCard photoUrl={effectivePhoto} />,
    "futebol-panini": <FutebolPaniniCard photoUrl={effectivePhoto} f={f} />,
    "futebol-familia": (
      <div className="w-full">
        <img src={effectivePhoto} alt="Família no futebol" className="w-full h-auto rounded-xl" />
      </div>
    ),
    "hero-card": <HeroCard photoUrl={effectivePhoto} f={f} />,
    "profissional-premium": <ProfissionalCard photoUrl={effectivePhoto} f={f} />,
    "reino-medieval": <ReinoMedievalCard photoUrl={effectivePhoto} f={f} />,
    "escola-de-magia": <EscolaMagiaCard photoUrl={effectivePhoto} f={f} />,
    "baby-hero": <BabyHeroCard photoUrl={effectivePhoto} f={f} />,
    "family-pack": <FamilyPackCard photoUrl={effectivePhoto} f={f} />,
    "pet-star": <PetStarCard photoUrl={effectivePhoto} f={f} />,
    "battle-card": <BattleCard photoUrl={effectivePhoto} f={f} />,
    "avatar-poster": <AvatarPosterCard photoUrl={effectivePhoto} f={f} />,
  } as Record<string, React.ReactNode>)[themeId] ?? (
    <FutebolCard photoUrl={effectivePhoto} />
  );

  const isLandscape = themeId === "futebol-familia";

  return (
    <div
      onContextMenu={(event) => {
        if (!shouldShowWatermark) return;
        event.preventDefault();
        setIsPreviewObscured(true);
        window.setTimeout(() => setIsPreviewObscured(false), 1800);
      }}
      onDragStart={(event) => {
        if (shouldShowWatermark) event.preventDefault();
      }}
      style={{
        position: "relative",
        aspectRatio: isLandscape ? "16/9" : "2/3",
        width: "100%",
        maxWidth: isLandscape ? 896 : 300,
        margin: "0 auto",
        borderRadius: 22,
        overflow: "hidden",
        boxShadow:
          "0 0 80px rgba(124,58,237,0.4), 0 0 160px rgba(37,99,235,0.15), 0 30px 60px rgba(0,0,0,0.7)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          filter: isPreviewObscured ? "blur(22px)" : "none",
          transition: "filter 120ms ease",
          userSelect: "none",
        }}
      >
        {inner}
      </div>
      {shouldShowWatermark && <WatermarkOverlay />}
      {shouldShowWatermark && isPreviewObscured && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0F172A]/55 px-5 text-center text-sm font-bold tracking-wider text-white">
          PREVIEW PROTEGIDO
        </div>
      )}
    </div>
  );
}

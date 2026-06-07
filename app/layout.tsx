import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AnalyticsConsent } from "@/components/privacy/AnalyticsConsent";
import { CookieConsent } from "@/components/privacy/CookieConsent";
import { HotjarConsent } from "@/components/privacy/HotjarConsent";
import { MetaPixelConsent } from "@/components/privacy/MetaPixelConsent";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HeroMint — Forje Sua Versão Épica",
  description: "Transforme sua foto em cards, figurinhas, avatares e pôsteres épicos gerados por IA. Seja um jogador, um herói, um mago ou quem você quiser ser.",
  keywords: ["figurinhas digitais", "cards de jogador", "IA", "avatar épico", "HeroMint"],
  openGraph: {
    title: "HeroMint — Forje Sua Versão Épica",
    description: "Transforme sua foto em uma lenda com IA avançada",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body className="min-h-screen bg-[#020617] text-white antialiased">
        <AuthProvider>{children}</AuthProvider>
        <AnalyticsConsent />
        <HotjarConsent />
        <MetaPixelConsent />
        <CookieConsent />
      </body>
    </html>
  );
}

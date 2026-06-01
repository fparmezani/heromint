import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const GOOGLE_ANALYTICS_ID = "G-2PKPXM4HT1";

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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALYTICS_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Lock,
  ShieldCheck,
  Sparkles,
  Star,
  Upload,
  Zap,
} from "lucide-react";

const examples = [
  {
    name: "Miguel",
    before: "/futebol/image-cards/miguel-before.jpg",
    after: "/futebol/image-cards/miguel-after.png",
  },
  {
    name: "Jonas",
    before: "/futebol/image-cards/jonas-before.jpg",
    after: "/futebol/image-cards/jonas-after.png",
  },
  {
    name: "Joao Gabriel",
    before: "/futebol/image-cards/joao-gabriel-before.jpg",
    after: "/futebol/image-cards/joao-gabriel-after.png",
  },
  {
    name: "Carlos",
    before: "/futebol/image-cards/carlos-before.jpg",
    after: "/futebol/image-cards/carlos-after.png",
  },
];

const heroExample = examples[0];

const steps = [
  {
    icon: Upload,
    title: "Envie sua foto",
    text: "Escolha uma foto frontal, bem iluminada e com o rosto visivel.",
  },
  {
    icon: Brain,
    title: "A IA transforma",
    text: "O sistema cria um card Futebol 2026 com visual premium.",
  },
  {
    icon: Star,
    title: "Receba seu card",
    text: "Veja o preview, finalize o pagamento e baixe a arte final.",
  },
];

const themeCards = [
  { title: "Futebol 2026", status: "Disponivel", active: true },
  { title: "Futebol Panini", status: "Disponivel", active: true },
  { title: "Familia", status: "Em breve" },
  { title: "Super-herois", status: "Em breve" },
  { title: "Basquete", status: "Em breve" },
  { title: "+ muitos mais", status: "Em breve" },
];

export const metadata: Metadata = {
  title: "Card Futebol 2026 com IA | HeroMint",
  description:
    "Transforme sua foto em um card de craque com IA. Envie uma foto, personalize os dados e receba um card Futebol 2026 em alta qualidade.",
  openGraph: {
    title: "Transforme sua foto em um Card de Craque",
    description:
      "Crie um card Futebol 2026 personalizado com IA, visual premium e entrega digital.",
    type: "website",
    url: "https://heromint.net/futebol",
    images: ["https://heromint.net/futebol/image-cards/miguel-after.png"],
  },
};

export default function FootballSalesPage() {
  return (
    <main className="overflow-hidden bg-[#030303] text-white">
      <HeroSection />
      <HowItWorks />
      <RealExamples />
      <ThemesSection />
      <FinalCta />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[#d9a928]/25 pt-16 lg:pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_24%,rgba(217,169,40,0.28),transparent_34%),radial-gradient(circle_at_28%_72%,rgba(20,83,45,0.22),transparent_28%),linear-gradient(180deg,#050505_0%,#090807_55%,#020202_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.72)_38%,rgba(0,0,0,0.25)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black to-transparent" />

      <div className="section-container relative z-10 grid items-center gap-7 py-7 lg:min-h-[780px] lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:py-20">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d9a928]/30 bg-[#d9a928]/10 px-3 py-1.5 lg:mb-6 lg:px-4 lg:py-2">
            <Sparkles className="h-4 w-4 text-[#f6c547]" />
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#f6c547] lg:text-xs lg:tracking-[0.18em]">
              Feito com inteligencia artificial
            </span>
          </div>

          <h1 className="font-impact text-[42px] leading-[0.92] tracking-wide text-white min-[390px]:text-[46px] md:text-[78px] lg:text-[88px]">
            CRIE SEU CARD
            <br />
            DE FUTEBOL
            <br />
            <span className="text-[#f6c547]">COM IA</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 lg:mt-6 lg:text-lg">
            Envie uma foto, escolha seu time e veja seu preview em minutos.
            Depois finalize para baixar o card em alta resolucao.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:mt-9">
            <Link
              href="/criar/futebol-2026"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#ffd76a] to-[#c99318] px-7 py-4 text-base font-black uppercase tracking-wide text-black shadow-[0_0_30px_rgba(217,169,40,0.38)] transition hover:scale-[1.02]"
            >
              Criar meu card agora
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#exemplos"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d9a928]/40 bg-black/40 px-7 py-4 text-base font-bold text-[#f6c547] transition hover:bg-[#d9a928]/10"
            >
              Ver exemplos reais
            </Link>
          </div>

          <MobileQuickSteps />
          <MobileHeroExample />

          <div className="mt-5 grid max-w-xl grid-cols-3 gap-2 lg:mt-7 lg:gap-4">
            <MiniBenefit icon={Zap} title="Rapido" text="Preview em minutos" />
            <MiniBenefit icon={ShieldCheck} title="Seguro" text="Pagamento protegido" />
            <MiniBenefit icon={Star} title="Exclusivo" text="Card personalizado" />
          </div>

          <div className="mt-5 flex items-center gap-3 text-sm text-white/80 lg:mt-6">
            <AvatarStack />
            <span>Exemplos criados com imagens reais de referencia.</span>
          </div>
        </div>

        <div className="relative hidden min-h-[610px] lg:block">
          <div className="absolute left-[1%] top-20 z-10 w-[36%] rotate-[-4deg]">
            <p className="mb-3 text-center font-impact text-2xl uppercase tracking-wide text-white">
              Antes
            </p>
            <PhotoPanel src={heroExample.before} alt="Foto original antes do card" />
          </div>

          <div className="absolute left-[39%] top-[45%] z-20 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f6c547]/50 bg-[#d9a928]/20 p-3 text-[#f6c547] shadow-[0_0_35px_rgba(217,169,40,0.55)] md:block">
            <ArrowRight className="h-9 w-9" />
          </div>

          <div className="absolute right-0 top-0 z-30 w-[58%] rotate-[3deg]">
            <p className="mb-3 text-center font-impact text-3xl uppercase tracking-wide text-white">
              Depois
            </p>
            <GeneratedCardPanel src={heroExample.after} alt="Card Futebol 2026 gerado pelo HeroMint" featured />
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="como-funciona" className="border-b border-[#d9a928]/20 bg-[#070707] py-12">
      <div className="section-container">
        <h2 className="mb-9 text-center font-impact text-4xl uppercase tracking-wide text-white">
          Como funciona
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative rounded-2xl border border-[#d9a928]/20 bg-[#0d0d0d] p-6">
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f6c547] font-black text-[#f6c547]">
                    {index + 1}
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d9a928]/12">
                    <Icon className="h-6 w-6 text-[#f6c547]" />
                  </div>
                </div>
                <h3 className="text-lg font-black uppercase text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{step.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MobileQuickSteps() {
  return (
    <div className="mt-4 grid grid-cols-3 gap-2 lg:hidden">
      {["Foto", "Dados", "Preview"].map((step, index) => (
        <div key={step} className="rounded-xl border border-[#d9a928]/20 bg-black/35 p-2.5 text-center">
          <div className="mx-auto mb-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#d9a928]/15 text-xs font-black text-[#f6c547]">
            {index + 1}
          </div>
          <p className="text-[11px] font-black uppercase text-white">{step}</p>
        </div>
      ))}
    </div>
  );
}

function MobileHeroExample() {
  return (
    <div className="mt-4 rounded-2xl border border-[#d9a928]/25 bg-black/35 p-3 lg:hidden">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f6c547]">
          Foto comum vira card
        </p>
        <ArrowRight className="h-4 w-4 text-[#f6c547]" />
      </div>
      <div className="grid grid-cols-[0.8fr_1fr] items-end gap-3">
        <div>
          <p className="mb-1 text-center text-[11px] font-black uppercase text-white/80">Antes</p>
          <PhotoPanel src={heroExample.before} alt="Foto original antes do card" />
        </div>
        <div>
          <p className="mb-1 text-center text-[11px] font-black uppercase text-[#f6c547]">Depois</p>
          <GeneratedCardPanel src={heroExample.after} alt="Card Futebol 2026 gerado pelo HeroMint" />
        </div>
      </div>
    </div>
  );
}

function RealExamples() {
  return (
    <section id="exemplos" className="border-b border-[#d9a928]/20 bg-black py-14">
      <div className="section-container">
        <div className="mb-10 text-center">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f6c547]">
            Antes e depois
          </p>
          <h2 className="mt-3 font-impact text-4xl uppercase tracking-wide text-white md:text-5xl">
            Exemplos reais gerados pelo HeroMint
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
            A imagem da esquerda e a foto original. A imagem da direita e o
            card gerado pelo sistema.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {examples.map((example) => (
            <BeforeAfterPair key={example.name} example={example} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/criar/futebol-2026"
            className="inline-flex items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#ffd76a] to-[#c99318] px-7 py-4 text-base font-black uppercase tracking-wide text-black transition hover:scale-[1.02]"
          >
            Fazer meu card
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ThemesSection() {
  return (
    <section className="border-b border-[#d9a928]/20 bg-[#070707] py-14">
      <div className="section-container">
        <h2 className="mb-9 text-center font-impact text-4xl uppercase tracking-wide text-white">
          Temas disponiveis
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {themeCards.map((theme, index) => (
            <div
              key={theme.title}
              className={`rounded-2xl border p-5 text-center transition ${
                theme.active
                  ? "border-[#f6c547] bg-[#d9a928]/10 shadow-[0_0_25px_rgba(217,169,40,0.16)]"
                  : "border-white/10 bg-white/[0.03] opacity-65"
              }`}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-black font-impact text-3xl text-[#f6c547]">
                {index + 1}
              </div>
              <h3 className="font-black uppercase text-white">{theme.title}</h3>
              <p className={`mt-2 text-xs font-bold ${theme.active ? "text-[#f6c547]" : "text-white/45"}`}>
                {theme.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[#080704] py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_50%,rgba(217,169,40,0.22),transparent_28%)]" />
      <div className="section-container relative z-10 grid items-center gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <h2 className="font-impact text-5xl uppercase leading-none tracking-wide text-white md:text-6xl">
            Pronto para virar uma <span className="text-[#f6c547]">estrela?</span>
          </h2>
          <p className="mt-4 text-lg text-white/75">
            Envie sua foto agora e receba seu card epico em minutos.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold text-[#f6c547]">
            <span className="inline-flex items-center gap-2">
              <Zap className="h-4 w-4" /> Entrega rapida
            </span>
            <span className="inline-flex items-center gap-2">
              <Lock className="h-4 w-4" /> Pagamento seguro
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Preview protegido
            </span>
          </div>
        </div>

        <Link
          href="/criar/futebol-2026"
          className="inline-flex items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#ffd76a] to-[#c99318] px-8 py-4 text-base font-black uppercase tracking-wide text-black transition hover:scale-[1.02]"
        >
          Criar meu card agora
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}

function BeforeAfterPair({ example }: { example: typeof examples[number] }) {
  return (
    <div className="rounded-[1.75rem] border border-[#d9a928]/20 bg-[#0d0d0d] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-black uppercase text-white">{example.name}</h3>
          <p className="text-xs text-white/55">foto original + card gerado</p>
        </div>
        <span className="rounded-full bg-[#d9a928]/12 px-3 py-1 text-xs font-black uppercase text-[#f6c547]">
          Futebol 2026
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-black uppercase text-white">Antes</span>
            <span className="text-xs text-white/45">foto enviada</span>
          </div>
          <PhotoPanel src={example.before} alt={`Foto original de ${example.name}`} />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-black uppercase text-white">Depois</span>
            <span className="text-xs text-[#f6c547]">card final</span>
          </div>
          <GeneratedCardPanel src={example.after} alt={`Card gerado de ${example.name}`} />
        </div>
      </div>
    </div>
  );
}

function MiniBenefit({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Zap;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-[#d9a928]/15 bg-black/20 p-2 text-center lg:flex-row lg:items-start lg:gap-3 lg:border-0 lg:bg-transparent lg:p-0 lg:text-left">
      <Icon className="h-5 w-5 shrink-0 text-[#f6c547] lg:mt-1 lg:h-6 lg:w-6" />
      <div>
        <div className="text-[11px] font-black uppercase text-white lg:text-sm">{title}</div>
        <div className="text-[10px] leading-tight text-white/70 lg:text-xs lg:leading-normal">{text}</div>
      </div>
    </div>
  );
}

function AvatarStack() {
  return (
    <div className="flex -space-x-2">
      {examples.map((example) => (
        <div key={example.name} className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-black bg-[#111]">
          <Image
            src={example.before}
            alt={`Avatar ${example.name}`}
            fill
            sizes="36px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

function PhotoPanel({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/15 bg-[#111]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 320px, 45vw"
        className="object-cover"
      />
    </div>
  );
}

function GeneratedCardPanel({
  src,
  alt,
  featured = false,
}: {
  src: string;
  alt: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden rounded-[1.5rem] border bg-black shadow-[0_0_38px_rgba(217,169,40,0.28)] ${
        featured ? "border-[#f6c547] p-3" : "border-[#d9a928]/70 p-2"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(246,197,71,0.28),transparent_30%)]" />
      <div className="relative h-full w-full overflow-hidden rounded-[1.1rem] bg-black">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={featured ? "(min-width: 1024px) 460px, 55vw" : "(min-width: 1024px) 320px, 45vw"}
          className="object-cover"
        />
      </div>
    </div>
  );
}

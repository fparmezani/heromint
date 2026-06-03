import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

const beforeAfterExamples = [
  {
    before: "/futebol/antes-menino-01.jpg",
    name: "GABRIEL SILVA",
    birth: "10-06-2011",
    height: "1,52m",
    weight: "45 kg",
    team: "Flamengo",
    accent: "from-emerald-400 to-yellow-300",
  },
  {
    before: "/futebol/antes-menino-02.jpg",
    name: "LUCAS ALVES",
    birth: "21-08-2010",
    height: "1,58m",
    weight: "49 kg",
    team: "São Paulo",
    accent: "from-yellow-300 to-blue-400",
  },
  {
    before: "/futebol/antes-menino-03.jpg",
    name: "MATEUS ROCHA",
    birth: "04-03-2012",
    height: "1,47m",
    weight: "41 kg",
    team: "Corinthians",
    accent: "from-green-400 to-cyan-300",
  },
  {
    before: "/futebol/antes-menino-04.jpg",
    name: "PEDRO LIMA",
    birth: "15-11-2011",
    height: "1,55m",
    weight: "46 kg",
    team: "Palmeiras",
    accent: "from-lime-300 to-emerald-500",
  },
];

const benefits = [
  {
    icon: Camera,
    title: "Foto simples vira card premium",
    text: "Você envia uma foto frontal e a HeroMint cria uma versão com cara de coleção esportiva.",
  },
  {
    icon: Sparkles,
    title: "Visual Futebol 2026",
    text: "Bordas, símbolos, uniforme amarelo, dados do jogador e clima de grande campeonato.",
  },
  {
    icon: Download,
    title: "Preview antes de pagar",
    text: "Veja a prévia protegida antes da compra. A versão final é liberada em alta qualidade.",
  },
];

const trustItems = [
  "Modelo Futebol 2026",
  "1 imagem por R$ 9,90",
  "Pacote com 5 versões",
  "Pagamento seguro via Stripe",
];

const faq = [
  {
    question: "A pessoa precisa estar com camisa de futebol?",
    answer:
      "Não. A ideia é transformar uma foto comum em um card com uniforme do Brasil e visual de jogador.",
  },
  {
    question: "Posso usar foto de criança?",
    answer:
      "Sim, desde que você seja o responsável legal ou tenha autorização do responsável legal para usar a imagem.",
  },
  {
    question: "O card final vem com moldura e dados?",
    answer:
      "Sim. A entrega final é o card completo do modelo Futebol 2026, com moldura, elementos visuais, nome e dados preenchidos no formulário.",
  },
  {
    question: "Por que não mostrar muitos modelos?",
    answer:
      "Para facilitar a decisão. Esta página foca no card Futebol 2026, que é o produto principal da campanha.",
  },
];

export const metadata: Metadata = {
  title: "Card Futebol 2026 com IA | HeroMint",
  description:
    "Transforme uma foto comum em um card Futebol 2026 com IA. Modelo premium com uniforme do Brasil, moldura esportiva, dados do jogador e preview antes da compra.",
  openGraph: {
    title: "Crie seu Card Futebol 2026 com IA",
    description:
      "Sua foto transformada em card premium de futebol com visual de coleção.",
    type: "website",
    url: "https://heromint.net/futebol",
    images: ["https://heromint.net/futebol/futebol-2026-modelo-premium.png"],
  },
};

export default function FootballSalesPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0">
          <div className="absolute left-1/3 top-16 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />
          <div className="absolute right-0 top-44 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />
        </div>

        <div className="section-container relative z-10 grid items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FBBF24]/30 bg-[#FBBF24]/10 px-4 py-2">
              <Trophy className="h-4 w-4 text-[#FBBF24]" />
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#FBBF24]">
                Modelo principal HeroMint
              </span>
            </div>

            <h1 className="font-impact text-[54px] leading-[0.92] tracking-wide text-white md:text-[76px] lg:text-[88px]">
              CARD FUTEBOL 2026
              <br />
              COM SUA <span className="gradient-text">FOTO.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#CBD5E1]">
              Transforme uma foto comum em um card premium de jogador, com uniforme do Brasil,
              moldura esportiva, símbolos de campeonato e dados personalizados. Um presente
              rápido, diferente e com forte apelo visual.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/criar/futebol-2026" className="btn-primary px-7 text-base animate-glow-pulse">
                Criar meu card Futebol 2026
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="#antes-depois" className="btn-secondary px-7 text-base">
                Ver exemplos
                <Camera className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {trustItems.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full border border-[#1E293B] bg-[#0F172A] px-3 py-2 text-xs text-[#CBD5E1]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#22C55E]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-8 rounded-full bg-yellow-400/20 blur-3xl" />
            <div className="relative mx-auto max-w-sm rounded-[2rem] border border-[#FBBF24]/25 bg-[#0F172A] p-3 shadow-2xl shadow-yellow-500/10">
              <Image
                src="/futebol/futebol-2026-modelo-premium.png"
                alt="Modelo de card Futebol 2026 HeroMint"
                width={1024}
                height={1536}
                priority
                className="h-auto w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#1E293B] bg-[#0B1220] py-5">
        <div className="section-container grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          {[
            ["1", "modelo em destaque"],
            ["2026", "visual esportivo"],
            ["Preview", "antes de pagar"],
            ["Alta", "qualidade final"],
          ].map(([value, label]) => (
            <div key={label}>
              <div className="font-impact text-3xl text-white">{value}</div>
              <div className="text-xs uppercase tracking-[0.18em] text-[#94A3B8]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="antes-depois" className="py-18 md:py-24">
        <div className="section-container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#22C55E]">Antes e depois</p>
            <h2 className="mt-3 font-impact text-4xl tracking-wide text-white md:text-6xl">
              DA FOTO SIMPLES PARA O <span className="gradient-text">CARD DE CRAQUE</span>
            </h2>
            <p className="mt-4 text-[#94A3B8]">
              Exemplos visuais para deixar claro o propósito: a pessoa envia uma foto comum e recebe
              um card Futebol 2026 completo, com moldura, dados e visual de coleção.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {beforeAfterExamples.map((example, index) => (
              <BeforeAfterCard key={example.name} example={example} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#1E293B] bg-[#0B1220] py-18 md:py-24">
        <div className="section-container grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#FBBF24]">O que está sendo vendido</p>
            <h2 className="mt-3 font-impact text-4xl tracking-wide text-white md:text-6xl">
              UM CARD COMPLETO, NÃO APENAS UMA FOTO COM CAMISA.
            </h2>
            <p className="mt-4 text-[#94A3B8]">
              A página agora mostra o produto certo: card Futebol 2026 com composição visual,
              moldura, símbolos, nome, país, dados e acabamento de coleção. Isso evita o problema
              de parecer que o resultado é só uma imagem solta.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="rounded-3xl border border-[#1E293B] bg-[#0F172A] p-5">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB]/15">
                    <Icon className="h-6 w-6 text-[#60A5FA]" />
                  </div>
                  <h3 className="font-bold text-white">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{benefit.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-18 md:py-24">
        <div className="section-container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#60A5FA]">Como funciona</p>
            <h2 className="mt-3 font-impact text-4xl tracking-wide text-white md:text-5xl">
              CRIE SEU CARD EM 3 PASSOS
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["1", "Preencha os dados", "Nome, país, time, nascimento, altura, peso e posição."],
              ["2", "Envie a foto", "Use uma imagem frontal, bem iluminada e com autorização de uso."],
              ["3", "Baixe o card final", "Veja a prévia, finalize o pagamento e acesse o arquivo em alta qualidade."],
            ].map(([step, title, text]) => (
              <div key={step} className="rounded-3xl border border-[#1E293B] bg-[#0F172A] p-6">
                <div className="font-impact text-5xl text-[#2563EB]">{step}</div>
                <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#1E293B] bg-[#0B1220] py-18 md:py-24">
        <div className="section-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#FBBF24]">Dúvidas rápidas</p>
            <h2 className="mt-3 font-impact text-4xl tracking-wide text-white md:text-5xl">
              TUDO CLARO ANTES DE COMEÇAR
            </h2>
            <p className="mt-4 text-[#94A3B8]">
              Menos opções, mais clareza. A campanha leva direto para o produto principal.
            </p>
          </div>
          <div className="space-y-3">
            {faq.map((item) => (
              <div key={item.question} className="rounded-2xl border border-[#1E293B] bg-[#0F172A] p-5">
                <h3 className="font-bold text-white">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/20 via-[#7C3AED]/15 to-[#FBBF24]/10" />
        <div className="section-container relative z-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
            <ShieldCheck className="h-8 w-8 text-[#22C55E]" />
          </div>
          <h2 className="font-impact text-5xl tracking-wide text-white md:text-7xl">
            PRONTO PARA CRIAR SEU CARD FUTEBOL 2026?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#CBD5E1]">
            Envie uma foto, preencha os dados do jogador e veja sua versão em card de futebol.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/criar/futebol-2026" className="btn-primary px-8 text-base animate-glow-pulse">
              Começar agora
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-[#94A3B8]">
            <Clock className="h-4 w-4" />
            Preview antes da compra e entrega digital após confirmação.
          </div>
        </div>
      </section>
    </div>
  );
}

function BeforeAfterCard({
  example,
  index,
}: {
  example: typeof beforeAfterExamples[number];
  index: number;
}) {
  return (
    <div className="rounded-[2rem] border border-[#1E293B] bg-[#0F172A] p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white">Exemplo {index + 1}</h3>
          <p className="text-xs text-[#94A3B8]">foto de referência + card simulado</p>
        </div>
        <span className="rounded-full bg-[#22C55E]/10 px-3 py-1 text-xs font-bold text-[#22C55E]">
          Futebol 2026
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-bold text-white">Antes</span>
            <span className="text-xs text-[#94A3B8]">foto enviada</span>
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#020617]">
            <Image
              src={example.before}
              alt={`Foto antes de ${example.name}`}
              fill
              sizes="(min-width: 1024px) 280px, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-bold text-white">Depois</span>
            <span className="text-xs text-[#FBBF24]">card final</span>
          </div>
          <MockFootballCard example={example} />
        </div>
      </div>
    </div>
  );
}

function MockFootballCard({ example }: { example: typeof beforeAfterExamples[number] }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-[#FBBF24] bg-[#061222] shadow-2xl shadow-yellow-500/10">
      <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${example.accent} opacity-30`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(34,197,94,0.25),transparent_34%),linear-gradient(160deg,rgba(2,6,23,0.2),rgba(2,6,23,0.95))]" />
      <div className="absolute left-3 top-3 z-20 font-impact text-4xl tracking-wide text-[#FBBF24] drop-shadow">
        2026
      </div>
      <div className="absolute right-3 top-3 z-20 text-right">
        <Trophy className="ml-auto h-8 w-8 fill-white text-white" />
        <div className="mt-1 font-impact text-xl leading-none text-white">COPA</div>
        <div className="font-impact text-xl leading-none text-white">2026</div>
      </div>
      <div className="absolute right-3 top-24 z-20 flex flex-col items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-green-700 text-lg">
          🇧🇷
        </div>
        <div className="font-impact text-3xl tracking-wider text-white [writing-mode:vertical-rl]">BRA</div>
      </div>

      <div className="absolute inset-x-5 bottom-[28%] top-20 overflow-hidden rounded-t-[1.5rem]">
        <Image
          src={example.before}
          alt={`Pessoa transformada em card ${example.name}`}
          fill
          sizes="(min-width: 1024px) 260px, 50vw"
          className="object-cover object-top saturate-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061222] via-transparent to-transparent" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-impact text-7xl text-green-500/90">
          10
        </div>
      </div>

      <div className="absolute inset-x-3 bottom-3 z-30 rounded-2xl border border-[#FBBF24]/50 bg-[#071426]/95 p-3 text-center">
        <div className="font-impact text-3xl leading-none tracking-wide text-white">{example.name}</div>
        <div className="mt-2 text-xs font-semibold text-[#CBD5E1]">
          {example.birth} <span className="text-[#FBBF24]">|</span> {example.height}{" "}
          <span className="text-[#FBBF24]">|</span> {example.weight}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="rounded-md border border-white/20 bg-white px-2 py-1 text-[10px] font-black text-[#061222]">
            FC
          </div>
          <div className="font-impact text-xl tracking-wide text-white">{example.team}</div>
          <Star className="h-6 w-6 fill-[#FBBF24] text-[#FBBF24]" />
        </div>
      </div>
    </div>
  );
}

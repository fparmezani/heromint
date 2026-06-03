import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";

const products = [
  {
    name: "Futebol 2026",
    href: "/criar/futebol-2026",
    tag: "Mais vendido",
    price: "a partir de R$ 9,90",
    description:
      "Um card premium de jogador com uniforme do Brasil, dados do atleta, país, time e visual de coleção esportiva.",
    bullets: ["Retrato de jogador", "Alta resolução após pagamento", "Ideal para presente e redes sociais"],
    gradient: "from-green-500 to-yellow-400",
    icon: Trophy,
  },
  {
    name: "Futebol Panini",
    href: "/criar/futebol-panini",
    tag: "Estilo figurinha",
    price: "a partir de R$ 9,90",
    description:
      "Uma figurinha colecionável inspirada nos álbuns clássicos, com estética limpa, divertida e nostálgica.",
    bullets: ["Visual de figurinha", "Fundo moderno", "Perfeito para coleção personalizada"],
    gradient: "from-cyan-500 to-emerald-400",
    icon: BadgeCheck,
  },
];

const benefits = [
  {
    icon: Camera,
    title: "Você envia uma foto simples",
    text: "Não precisa de estúdio, uniforme ou edição. Uma foto frontal e bem iluminada já é suficiente.",
  },
  {
    icon: Sparkles,
    title: "A IA transforma em arte esportiva",
    text: "O sistema cria uma versão de jogador mantendo a identidade da pessoa e aplicando o estilo escolhido.",
  },
  {
    icon: Download,
    title: "Receba a imagem final",
    text: "Após o pagamento, a imagem definitiva fica disponível na sua área para baixar em alta qualidade.",
  },
];

const trustItems = [
  "Preview antes da compra",
  "Pagamento seguro via Stripe",
  "Entrega digital",
  "Suporte em suporte@heromint.net",
];

const faq = [
  {
    question: "Preciso usar camisa de futebol na foto?",
    answer: "Não. A HeroMint transforma sua foto comum em uma imagem esportiva com uniforme no estilo do tema escolhido.",
  },
  {
    question: "Posso escolher meu time?",
    answer: "Sim. No formulário de criação você escolhe o time entre os clubes brasileiros disponíveis.",
  },
  {
    question: "A imagem é grátis?",
    answer: "Você vê uma prévia protegida antes do pagamento. A imagem final em alta qualidade é liberada após a confirmação da compra.",
  },
  {
    question: "Qual modelo devo escolher?",
    answer: "Escolha Futebol 2026 para um card premium de jogador. Escolha Futebol Panini para uma figurinha mais clássica e nostálgica.",
  },
];

export const metadata: Metadata = {
  title: "Card de Futebol com IA | HeroMint",
  description:
    "Transforme sua foto em card de jogador ou figurinha estilo Panini. Crie seu card de futebol com IA, veja a prévia e baixe em alta qualidade após o pagamento.",
  openGraph: {
    title: "Crie seu card de futebol com IA",
    description:
      "Futebol 2026 e Futebol Panini: transforme sua foto em uma imagem esportiva premium.",
    type: "website",
    url: "https://heromint.net/futebol",
    images: ["https://heromint.net/hero-football-card-showcase.png"],
  },
};

export default function FootballSalesPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />
          <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-yellow-500/10 blur-3xl" />
        </div>

        <div className="section-container relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FBBF24]/30 bg-[#FBBF24]/10 px-4 py-2">
              <Zap className="h-4 w-4 text-[#FBBF24]" />
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#FBBF24]">
                Card de futebol com IA
              </span>
            </div>

            <h1 className="font-impact text-[54px] leading-[0.92] tracking-wide text-white md:text-[76px] lg:text-[88px]">
              TRANSFORME SUA FOTO
              <br />
              EM UM <span className="gradient-text">CARD DE CRAQUE.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#CBD5E1]">
              Crie uma imagem de futebol personalizada em poucos minutos. Escolha entre o visual
              premium <strong className="text-white">Futebol 2026</strong> ou a nostalgia do{" "}
              <strong className="text-white">Futebol Panini</strong>, veja a prévia e libere a versão
              final em alta qualidade.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/criar/futebol-2026" className="btn-primary px-7 text-base animate-glow-pulse">
                Criar Futebol 2026
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/criar/futebol-panini" className="btn-secondary px-7 text-base">
                Criar Panini
                <Trophy className="h-4 w-4" />
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

          <div className="relative min-h-[430px] md:min-h-[560px]">
            <div className="absolute inset-0 rounded-full bg-yellow-400/10 blur-3xl" />
            <Image
              src="/hero-football-card-showcase.png"
              alt="Exemplo de card de futebol HeroMint"
              fill
              priority
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-[#1E293B] bg-[#0B1220] py-5">
        <div className="section-container grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          {[
            ["2", "modelos liberados"],
            ["1 ou 5", "imagens por pacote"],
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

      <section className="py-18 md:py-24">
        <div className="section-container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#22C55E]">Escolha seu estilo</p>
            <h2 className="mt-3 font-impact text-4xl tracking-wide text-white md:text-6xl">
              DOIS FORMATOS PARA VENDER A <span className="gradient-text">MESMA EMOÇÃO</span>
            </h2>
            <p className="mt-4 text-[#94A3B8]">
              Você não compra só uma imagem. Você compra uma lembrança personalizada para postar,
              presentear, imprimir e guardar.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {products.map((product) => {
              const Icon = product.icon;
              return (
                <Link
                  key={product.name}
                  href={product.href}
                  className="group relative overflow-hidden rounded-3xl border border-[#1E293B] bg-[#0F172A] p-6 transition-all hover:-translate-y-1 hover:border-[#2563EB]/70 hover:shadow-2xl hover:shadow-[#2563EB]/10"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${product.gradient}`} />
                  <div className="flex items-start justify-between gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${product.gradient}`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <span className="rounded-full bg-[#1E293B] px-3 py-1 text-xs font-bold text-[#FBBF24]">
                      {product.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-white">{product.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-[#22C55E]">{product.price}</p>
                  <p className="mt-4 text-sm leading-relaxed text-[#CBD5E1]">{product.description}</p>
                  <ul className="mt-5 space-y-2">
                    {product.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                        <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 inline-flex items-center gap-2 font-bold text-white">
                    Criar este modelo
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-18 md:py-24 bg-[#020617]">
        <div className="section-container grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#FBBF24]">Antes e depois</p>
            <h2 className="mt-3 font-impact text-4xl tracking-wide text-white md:text-6xl">
              UMA FOTO NORMAL. UM RESULTADO DE <span className="gradient-text">COLEÇÃO.</span>
            </h2>
            <p className="mt-4 text-[#94A3B8]">
              A proposta é simples: você envia a foto, informa nome, país, time e dados do card.
              A HeroMint cria uma versão esportiva pronta para impressionar.
            </p>
            <div className="mt-6 grid gap-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="flex gap-4 rounded-2xl border border-[#1E293B] bg-[#0F172A] p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/15">
                      <Icon className="h-5 w-5 text-[#60A5FA]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{benefit.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#94A3B8]">{benefit.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-[#1E293B] bg-[#0F172A] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-bold text-white">Antes</span>
                <span className="text-xs text-[#94A3B8]">foto enviada</span>
              </div>
              <div className="flex aspect-[3/4] items-center justify-center rounded-2xl border border-dashed border-[#334155] bg-[#020617] p-6 text-center">
                <div>
                  <Camera className="mx-auto h-12 w-12 text-[#64748B]" />
                  <p className="mt-4 text-sm text-[#94A3B8]">Sua foto comum, frontal e bem iluminada.</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-[#FBBF24]/30 bg-[#0F172A] p-4 shadow-2xl shadow-yellow-500/10">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-bold text-white">Depois</span>
                <span className="text-xs text-[#FBBF24]">card HeroMint</span>
              </div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#020617]">
                <Image
                  src="/ngenerated-images/FERNANDO-TEMPLATE.jpg"
                  alt="Exemplo de resultado de card de futebol"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-18 md:py-24">
        <div className="section-container">
          <div className="rounded-[2rem] border border-[#1E293B] bg-gradient-to-br from-[#0F172A] to-[#020617] p-6 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#22C55E]">
                  Feito para converter
                </p>
                <h2 className="mt-3 font-impact text-4xl tracking-wide text-white md:text-5xl">
                  PRESENTE RÁPIDO, POSTAGEM FORTE, LEMBRANÇA ÚNICA.
                </h2>
                <p className="mt-4 text-[#94A3B8]">
                  A landing foi pensada para quem chega do Google procurando uma ideia diferente:
                  uma imagem personalizada, com tema de futebol, pronta para virar memória.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Para pais e filhos", "Crie cards de crianças, adultos e torcedores apaixonados."],
                  ["Para presente", "Uma surpresa diferente para aniversário, Dia dos Pais ou amigos."],
                  ["Para redes sociais", "Imagem chamativa para postar no Instagram, WhatsApp e grupos."],
                  ["Para coleção", "Escolha 1 imagem ou pacote com 5 versões diferentes."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl border border-[#1E293B] bg-[#020617]/70 p-4">
                    <Star className="mb-3 h-5 w-5 fill-[#FBBF24] text-[#FBBF24]" />
                    <h3 className="font-bold text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="border-y border-[#1E293B] bg-[#0B1220] py-18 md:py-24">
        <div className="section-container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#60A5FA]">Como funciona</p>
            <h2 className="mt-3 font-impact text-4xl tracking-wide text-white md:text-5xl">
              CRIE SEU CARD EM 3 PASSOS
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["1", "Escolha o modelo", "Futebol 2026 para card premium ou Panini para figurinha clássica."],
              ["2", "Envie a foto", "Preencha os dados do jogador e confirme a autorização de uso da imagem."],
              ["3", "Baixe o resultado", "Veja a prévia, finalize o pagamento e acesse sua imagem final."],
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

      <section className="py-18 md:py-24">
        <div className="section-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#FBBF24]">Dúvidas rápidas</p>
            <h2 className="mt-3 font-impact text-4xl tracking-wide text-white md:text-5xl">
              TUDO CLARO ANTES DE COMEÇAR
            </h2>
            <p className="mt-4 text-[#94A3B8]">
              A ideia é reduzir atrito: o visitante entende o produto, escolhe o estilo e vai direto
              para a criação.
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
            PRONTO PARA VER SUA VERSÃO DE CRAQUE?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#CBD5E1]">
            Comece pelo modelo mais popular ou escolha o estilo de figurinha. Em poucos minutos,
            sua foto ganha cara de coleção.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/criar/futebol-2026" className="btn-primary px-8 text-base animate-glow-pulse">
              Criar meu card agora
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/criar/futebol-panini" className="btn-secondary px-8 text-base">
              Quero estilo Panini
            </Link>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-[#94A3B8]">
            <Clock className="h-4 w-4" />
            Criação rápida, preview antes da compra e entrega digital.
          </div>
        </div>
      </section>
    </div>
  );
}

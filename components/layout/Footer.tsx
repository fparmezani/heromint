import Link from "next/link";
import { Sparkles, Globe, MessageCircle, Play } from "lucide-react";
import { CookiePreferencesButton } from "@/components/privacy/CookiePreferencesButton";

const legalLinks = [
  { label: "Termos de Uso", href: "/termos-de-uso" },
  { label: "Política de Privacidade", href: "/politica-de-privacidade" },
  { label: "Política de Cookies", href: "/politica-de-cookies" },
  { label: "Política de Reembolso", href: "/politica-de-reembolso" },
  { label: "Exclusão de Dados", href: "/exclusao-de-dados" },
  { label: "Contato", href: "/contato" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#1E293B] bg-[#020617] py-12">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/futebol" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-impact text-xl tracking-wider text-white">HEROMINT</span>
              </div>
            </Link>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Transforme sua foto em colecionáveis digitais épicos gerados por IA.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-8 h-8 rounded-lg border border-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:text-white hover:border-[#2563EB] transition-all">
                <Globe className="w-4 h-4" />
              </a>
              <a href="mailto:suporte@heromint.net" aria-label="Enviar e-mail para o suporte" className="w-8 h-8 rounded-lg border border-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:text-white hover:border-[#2563EB] transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg border border-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:text-white hover:border-[#2563EB] transition-all">
                <Play className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Produto</h4>
            <ul className="space-y-2">
              {["Como Funciona", "Coleções", "Preços", "Exemplos"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-[#94A3B8] hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Themes */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Temas</h4>
            <ul className="space-y-2">
              {["Futebol 2026", "Futebol Panini", "Futebol Familia em breve", "Outros temas em breve"].map((item) => (
                <li key={item}>
                  <Link href="/temas" className="text-sm text-[#94A3B8] hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-[#94A3B8] hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookiePreferencesButton />
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1E293B] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#94A3B8]">
            © 2026 HeroMint. Todos os direitos reservados.
          </p>
          <p className="text-xs text-[#94A3B8]">
            Feito com ❤️ e IA para transformar pessoas em lendas.
          </p>
        </div>
      </div>
    </footer>
  );
}

import { MessageCircle } from "lucide-react";

const whatsappNumber = "5511963767799";
const whatsappMessage = "Olá, vim pelo site 0HeroMint e gostaria de ajuda.";
const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

export function FloatingWhatsAppButton() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar com a HeroMint pelo WhatsApp"
      className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-black/40 ring-1 ring-white/20 transition-all hover:-translate-y-0.5 hover:bg-[#20BD5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#86EFAC] md:bottom-6 md:right-6 md:h-16 md:w-16"
    >
      <MessageCircle className="h-7 w-7 md:h-8 md:w-8" aria-hidden="true" />
    </a>
  );
}

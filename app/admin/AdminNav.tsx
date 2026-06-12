"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Palette,
  FlaskConical,
  Settings,
  Mail,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin",                  label: "Dashboard",           icon: LayoutDashboard, exact: true },
  { href: "/admin/template-editor",  label: "Editor de Templates", icon: Palette },
  { href: "/admin/template-test",    label: "Teste de Cards",      icon: FlaskConical },
  { href: "/admin/recuperacao",      label: "Recuperação",         icon: Mail },
  { href: "/admin/configuracoes",    label: "Configurações",       icon: Settings },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-[#0A0F1E] border-r border-[#1E293B] flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1E293B]">
        <span className="text-[#FBBF24] font-black text-lg tracking-widest uppercase">
          Hero<span className="text-white">Mint</span>
        </span>
        <p className="text-[#475569] text-xs mt-0.5">Painel Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20"
                  : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3 h-3 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Voltar ao site */}
      <div className="px-5 py-4 border-t border-[#1E293B]">
        <Link href="/" className="text-xs text-[#475569] hover:text-[#94A3B8] transition-colors">
          ← Voltar ao site
        </Link>
      </div>
    </aside>
  );
}

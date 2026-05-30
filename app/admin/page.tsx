import type { Metadata } from "next";
import { BarChart3, CreditCard, Users, TrendingUp, Settings } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin — HeroMint",
};

// Mock data for demo
const stats = [
  { label: "Cards Criados", value: "1.284", icon: Users, change: "+12%", color: "text-[#2563EB]", bg: "bg-[#2563EB]/10" },
  { label: "Receita Total", value: "R$ 18.420", icon: TrendingUp, change: "+24%", color: "text-[#22C55E]", bg: "bg-[#22C55E]/10" },
  { label: "Pedidos Pagos", value: "847", icon: CreditCard, change: "+8%", color: "text-[#7C3AED]", bg: "bg-[#7C3AED]/10" },
  { label: "Taxa de Conversão", value: "65.9%", icon: BarChart3, change: "+3%", color: "text-[#FBBF24]", bg: "bg-[#FBBF24]/10" },
];

const mockOrders = [
  { id: "clx1", theme: "⚽ Futebol 2026", package: "Pack Premium", value: "R$ 19,90", status: "paid", date: "29/05/2026" },
  { id: "clx2", theme: "⚔️ Hero Card", package: "Card Individual", value: "R$ 9,90", status: "paid", date: "29/05/2026" },
  { id: "clx3", theme: "🪄 Escola de Magia", package: "Pack Completo", value: "R$ 29,90", status: "pending", date: "29/05/2026" },
  { id: "clx4", theme: "🏰 Reino Medieval", package: "Pack Premium", value: "R$ 19,90", status: "paid", date: "28/05/2026" },
  { id: "clx5", theme: "🎬 Avatar / Pôster", package: "Card Individual", value: "R$ 9,90", status: "paid", date: "28/05/2026" },
];

const STATUS_STYLES = {
  paid: "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30",
  pending: "bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/30",
  failed: "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30",
};

const STATUS_LABELS = {
  paid: "Pago",
  pending: "Pendente",
  failed: "Falhou",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#020617] pt-8 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-impact text-4xl text-white tracking-wide">ADMIN DASHBOARD</h1>
            <p className="text-[#94A3B8] text-sm mt-1">HeroMint — Visão geral da plataforma</p>
          </div>
          
          <Link 
            href="/admin/configuracoes"
            className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            Configurações
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[#94A3B8] text-xs font-medium">{stat.label}</p>
                  <p className="text-white font-bold text-xl">{stat.value}</p>
                  <p className="text-[#22C55E] text-xs">{stat.change} este mês</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Orders table */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-3xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between">
            <h2 className="font-bold text-white">Últimos Pedidos</h2>
            <span className="text-[#94A3B8] text-sm">{mockOrders.length} pedidos recentes</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E293B]">
                  {["ID", "Tema", "Pacote", "Valor", "Status", "Data"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {mockOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#1E293B]/50 transition-colors">
                    <td className="px-5 py-4 text-[#94A3B8] text-xs font-mono">{order.id}...</td>
                    <td className="px-5 py-4 text-white text-sm">{order.theme}</td>
                    <td className="px-5 py-4 text-[#94A3B8] text-sm">{order.package}</td>
                    <td className="px-5 py-4 text-white font-bold text-sm">{order.value}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[order.status as keyof typeof STATUS_STYLES]}`}>
                        {STATUS_LABELS[order.status as keyof typeof STATUS_LABELS]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#94A3B8] text-sm">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { BarChart3, CreditCard, Users, TrendingUp, Settings, Mail } from "lucide-react";
import Link from "next/link";
import { requireAdminPage } from "@/lib/admin-auth";
import { getAdminDashboardData } from "@/lib/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin - HeroMint",
};

export const dynamic = "force-dynamic";

const STATUS_STYLES = {
  paid: "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30",
  pending: "bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/30",
  failed: "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30",
  refunded: "bg-[#94A3B8]/10 text-[#94A3B8] border border-[#94A3B8]/30",
};

const STATUS_LABELS = {
  paid: "Pago",
  pending: "Pendente",
  failed: "Falhou",
  refunded: "Estornado",
};

const PACKAGE_LABELS = {
  individual: "Card Individual",
  premium: "Pack Premium",
  completo: "Pack Completo",
  "futebol-familia": "Futebol Familia",
};

const numberFormatter = new Intl.NumberFormat("pt-BR");
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const dateFormatter = new Intl.DateTimeFormat("pt-BR");

function getOrderEmail(order: {
  id: string;
  users?: { email?: string | null } | { email?: string | null }[] | null;
}) {
  const user = Array.isArray(order.users) ? order.users[0] : order.users;
  return user?.email || `${order.id.slice(0, 8)}...`;
}

export default async function AdminPage() {
  await requireAdminPage();
  const dashboard = await getAdminDashboardData();
  const stats = [
    {
      label: "Cards Criados",
      value: numberFormatter.format(dashboard.cardsCreated),
      icon: Users,
      change: dashboard.cardsCreatedChange,
      color: "text-[#2563EB]",
      bg: "bg-[#2563EB]/10",
    },
    {
      label: "Receita Total",
      value: currencyFormatter.format(dashboard.revenue / 100),
      icon: TrendingUp,
      change: dashboard.revenueChange,
      color: "text-[#22C55E]",
      bg: "bg-[#22C55E]/10",
    },
    {
      label: "Pedidos Pagos",
      value: numberFormatter.format(dashboard.paidOrders),
      icon: CreditCard,
      change: dashboard.paidOrdersChange,
      color: "text-[#7C3AED]",
      bg: "bg-[#7C3AED]/10",
    },
    {
      label: "Taxa de Conversao",
      value: `${dashboard.conversionRate.toFixed(1)}%`,
      icon: BarChart3,
      change: dashboard.conversionChange,
      color: "text-[#FBBF24]",
      bg: "bg-[#FBBF24]/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] pt-8 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-impact text-4xl text-white tracking-wide">ADMIN DASHBOARD</h1>
            <p className="text-[#94A3B8] text-sm mt-1">HeroMint - Visao geral da plataforma</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/recuperacao"
              className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              Recuperacao
            </Link>
            <Link
              href="/admin/configuracoes"
              className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Configuracoes
            </Link>
          </div>
        </div>

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
                  <p className="text-[#22C55E] text-xs">{stat.change} este mes</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[#0F172A] border border-[#1E293B] rounded-3xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between">
            <h2 className="font-bold text-white">Ultimos Pedidos</h2>
            <span className="text-[#94A3B8] text-sm">{dashboard.recentOrders.length} pedidos recentes</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E293B]">
                  {["Email", "Tema", "Pacote", "Valor", "Status", "Data"].map((heading) => (
                    <th key={heading} className="px-5 py-3 text-left text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {dashboard.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#1E293B]/50 transition-colors">
                    <td className="px-5 py-4 text-[#CBD5E1] text-sm">{getOrderEmail(order)}</td>
                    <td className="px-5 py-4 text-white text-sm">{order.theme_name}</td>
                    <td className="px-5 py-4 text-[#94A3B8] text-sm">{PACKAGE_LABELS[order.package_type]}</td>
                    <td className="px-5 py-4 text-white font-bold text-sm">{currencyFormatter.format(order.total_amount / 100)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[order.payment_status]}`}>
                        {STATUS_LABELS[order.payment_status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#94A3B8] text-sm">{dateFormatter.format(new Date(order.created_at))}</td>
                  </tr>
                ))}
                {dashboard.recentOrders.length === 0 && (
                  <tr>
                    <td className="px-5 py-8 text-center text-[#94A3B8] text-sm" colSpan={6}>
                      Nenhum pedido registrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

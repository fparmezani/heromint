import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock3, Mail, MailCheck, Users } from "lucide-react";
import { requireAdminPage } from "@/lib/admin-auth";
import { getRecoveryDashboardData } from "@/lib/recovery-emails";
import { RecoveryEmailRunner } from "@/components/admin/RecoveryEmailRunner";

export const metadata: Metadata = {
  title: "Recuperacao - HeroMint",
};

export const dynamic = "force-dynamic";

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  sent: "Enviado",
  skipped_paid: "Pago depois",
  skipped_recent: "Email recente",
  failed: "Falhou",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "border-[#FBBF24]/30 bg-[#FBBF24]/10 text-[#FBBF24]",
  sent: "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]",
  skipped_paid: "border-[#2563EB]/30 bg-[#2563EB]/10 text-[#93C5FD]",
  skipped_recent: "border-[#94A3B8]/30 bg-[#94A3B8]/10 text-[#CBD5E1]",
  failed: "border-[#EF4444]/30 bg-[#EF4444]/10 text-[#FCA5A5]",
};

export default async function RecoveryPage() {
  await requireAdminPage();
  const dashboard = await getRecoveryDashboardData();
  const uniqueEligibleEmails = new Set(dashboard.eligibleCandidates.map((event) => event.user_email)).size;

  const stats = [
    {
      label: "Enviados hoje",
      value: dashboard.sentToday,
      icon: MailCheck,
      color: "text-[#22C55E]",
      bg: "bg-[#22C55E]/10",
    },
    {
      label: "Enviados 7 dias",
      value: dashboard.sentLast7Days,
      icon: Mail,
      color: "text-[#2563EB]",
      bg: "bg-[#2563EB]/10",
    },
    {
      label: "Elegiveis agora",
      value: dashboard.pendingEligible,
      icon: Clock3,
      color: "text-[#FBBF24]",
      bg: "bg-[#FBBF24]/10",
    },
    {
      label: "Pendentes totais",
      value: dashboard.pendingTotal,
      icon: Users,
      color: "text-[#7C3AED]",
      bg: "bg-[#7C3AED]/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-4 inline-flex items-center gap-2 text-sm text-[#94A3B8] transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao admin
            </Link>
            <h1 className="font-impact text-4xl tracking-wide text-white">RECUPERACAO</h1>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Envio manual de emails para pessoas que geraram preview e nao finalizaram a compra.
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-4 rounded-2xl border border-[#1E293B] bg-[#0F172A] p-5">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#94A3B8]">{stat.label}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {dashboard.setupRequired && (
          <div className="mb-6 rounded-2xl border border-[#FBBF24]/30 bg-[#FBBF24]/10 p-5 text-sm text-[#FEF3C7]">
            <p className="font-bold text-[#FBBF24]">Tabela de recuperacao ainda nao configurada</p>
            <p className="mt-1">
              Aplique o SQL em <span className="font-mono">database/add-recovery-email-events.sql</span> no banco antes de enviar emails.
            </p>
          </div>
        )}

        <div className="mb-6">
          <RecoveryEmailRunner
            eligibleCount={dashboard.eligibleCandidates.length}
            uniqueEmailCount={uniqueEligibleEmails}
          />
        </div>

        <div className="mb-6 overflow-hidden rounded-3xl border border-[#1E293B] bg-[#0F172A]">
          <div className="flex items-center justify-between border-b border-[#1E293B] px-6 py-4">
            <div>
              <h2 className="font-bold text-white">Candidatos para envio</h2>
              <p className="mt-1 text-xs text-[#94A3B8]">
                Estes registros estao elegiveis por tempo. Antes de enviar, o sistema ainda checa pagamento e envio recente.
              </p>
            </div>
            <span className="text-sm text-[#94A3B8]">
              {uniqueEligibleEmails} emails / {dashboard.eligibleCandidates.length} registros
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E293B]">
                  {["Email", "Nome", "Tema", "Pacote", "Origem", "Gerado em"].map((heading) => (
                    <th key={heading} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {dashboard.eligibleCandidates.map((event) => (
                  <tr key={event.id} className="transition-colors hover:bg-[#1E293B]/50">
                    <td className="px-5 py-4 text-sm text-white">{event.user_email}</td>
                    <td className="px-5 py-4 text-sm text-[#CBD5E1]">{event.user_name || "-"}</td>
                    <td className="px-5 py-4 text-sm text-[#CBD5E1]">{event.theme_name}</td>
                    <td className="px-5 py-4 text-sm text-[#94A3B8]">{event.package_type}</td>
                    <td className="px-5 py-4 text-sm text-[#94A3B8]">
                      {event.source === "order" ? "Pedido pendente" : "Preview gerado"}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#94A3B8]">
                      {dateTimeFormatter.format(new Date(event.created_at))}
                    </td>
                  </tr>
                ))}
                {dashboard.eligibleCandidates.length === 0 && (
                  <tr>
                    <td className="px-5 py-8 text-center text-sm text-[#94A3B8]" colSpan={6}>
                      Nenhum candidato elegivel para envio agora.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#1E293B] bg-[#0F172A]">
          <div className="flex items-center justify-between border-b border-[#1E293B] px-6 py-4">
            <h2 className="font-bold text-white">Ultimos eventos</h2>
            <span className="text-sm text-[#94A3B8]">{dashboard.recentEvents.length} registros</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E293B]">
                  {["Email", "Tema", "Pacote", "Status", "Criado em", "Observacao"].map((heading) => (
                    <th key={heading} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {dashboard.recentEvents.map((event) => (
                  <tr key={event.id} className="transition-colors hover:bg-[#1E293B]/50">
                    <td className="px-5 py-4 text-sm text-white">{event.user_email}</td>
                    <td className="px-5 py-4 text-sm text-[#CBD5E1]">{event.theme_name}</td>
                    <td className="px-5 py-4 text-sm text-[#94A3B8]">{event.package_type}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[event.status] || STATUS_STYLES.pending}`}>
                        {STATUS_LABELS[event.status] || event.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#94A3B8]">
                      {dateTimeFormatter.format(new Date(event.created_at))}
                    </td>
                    <td className="max-w-sm px-5 py-4 text-sm text-[#94A3B8]">
                      {event.last_error || (event.email_sent_at ? `Enviado em ${dateTimeFormatter.format(new Date(event.email_sent_at))}` : "-")}
                    </td>
                  </tr>
                ))}
                {dashboard.recentEvents.length === 0 && (
                  <tr>
                    <td className="px-5 py-8 text-center text-sm text-[#94A3B8]" colSpan={6}>
                      Nenhum evento registrado ainda.
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

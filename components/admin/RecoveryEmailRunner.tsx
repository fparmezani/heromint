"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MailCheck } from "lucide-react";

interface RunResult {
  success: boolean;
  scanned: number;
  sent: number;
  skippedPaid: number;
  skippedRecent: number;
  failed: number;
  errors?: string[];
  error?: string;
}

interface RecoveryEmailRunnerProps {
  eligibleCount: number;
  uniqueEmailCount: number;
}

export function RecoveryEmailRunner({ eligibleCount, uniqueEmailCount }: RecoveryEmailRunnerProps) {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);

  const runTask = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/recovery-emails/run", {
        method: "POST",
      });
      const data = await response.json();
      setResult(data);
      router.refresh();
    } catch (error) {
      setResult({
        success: false,
        scanned: 0,
        sent: 0,
        skippedPaid: 0,
        skippedRecent: 0,
        failed: 1,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">Envio manual</h2>
          <p className="text-[#94A3B8] text-sm mt-1">
            Revise os candidatos abaixo antes de enviar. O sistema ainda ignora quem ja pagou ou recebeu email recentemente.
          </p>
        </div>

        <button
          type="button"
          onClick={runTask}
          disabled={isRunning || eligibleCount === 0}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <MailCheck className="h-4 w-4" />}
          {isRunning
            ? "Enviando..."
            : eligibleCount > 0
              ? `Enviar para ${uniqueEmailCount} email${uniqueEmailCount === 1 ? "" : "s"}`
              : "Nenhum email elegivel"}
        </button>
      </div>

      {result && (
        <div className={`mt-4 rounded-xl border p-4 text-sm ${
          result.success
            ? "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#BBF7D0]"
            : "border-[#EF4444]/30 bg-[#EF4444]/10 text-[#FECACA]"
        }`}>
          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <p>
              Verificados: {result.scanned} | Enviados: {result.sent} | Ja pagaram: {result.skippedPaid} | Recentes: {result.skippedRecent} | Falhas: {result.failed}
            </p>
          )}
          {result.errors && result.errors.length > 0 && (
            <ul className="mt-2 list-disc pl-5">
              {result.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

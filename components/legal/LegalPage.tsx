import type { ReactNode } from "react";
import Link from "next/link";

export function LegalPage({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: ReactNode;
}) {
  return (
    <section className="section-container py-16 md:py-20">
      <div className="mx-auto max-w-4xl rounded-3xl border border-[#1E293B] bg-[#0F172A] p-6 md:p-10">
        <Link href="/futebol" className="text-sm text-[#60A5FA] hover:underline">
          Voltar para a página inicial
        </Link>
        <h1 className="mt-5 text-3xl font-bold text-white md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-[#94A3B8]">Última atualização: {updatedAt}</p>
        <div className="mt-8 space-y-7 text-sm leading-7 text-[#CBD5E1] [&_a]:text-[#60A5FA] [&_a]:hover:underline [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
          {children}
        </div>
      </div>
    </section>
  );
}

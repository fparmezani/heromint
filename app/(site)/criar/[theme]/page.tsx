import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getThemeById, isThemeAvailable } from "@/lib/themes";
import { MultiStepForm } from "@/components/create/MultiStepForm";

interface Props {
  params: Promise<{ theme: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { theme: themeId } = await params;
  const theme = getThemeById(themeId);
  if (!theme) return { title: "Tema não encontrado — HeroMint" };
  return {
    title: `Criar ${theme.name} — HeroMint`,
    description: theme.description,
  };
}

export default async function CriarPage({ params }: Props) {
  const { theme: themeId } = await params;
  const theme = getThemeById(themeId);

  if (!theme) {
    notFound();
  }
  if (!isThemeAvailable(themeId)) {
    redirect("/temas");
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br ${theme.gradient} opacity-5 rounded-full blur-[100px]`} />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-3xl mb-4 shadow-lg">
              {theme.icon}
            </div>
            <h1 className="font-impact text-4xl md:text-5xl text-white tracking-wide mb-2">
              {theme.name.toUpperCase()}
            </h1>
            <p className="text-[#94A3B8]">{theme.description}</p>
          </div>

          {/* Multi-step form */}
          <MultiStepForm theme={theme} />
        </div>
      </div>
    </div>
  );
}

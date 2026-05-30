import { isThemeAvailable, themes } from "@/lib/themes";
import { ThemeCard } from "./ThemeCard";

export function ThemeGrid() {
  const availableThemes = themes.filter((theme) => isThemeAvailable(theme.id));
  const upcomingThemes = themes.filter((theme) => !isThemeAvailable(theme.id));

  return (
    <div className="space-y-14">
      <section>
        <div className="mb-6">
          <p className="text-[#22C55E] text-xs font-bold uppercase tracking-[0.2em] mb-2">Disponível agora</p>
          <h2 className="font-impact text-3xl text-white tracking-wide">COLEÇÃO FUTEBOL</h2>
          <p className="text-[#94A3B8] mt-2">Escolha seu formato e transforme suas fotos em imagens esportivas premium.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableThemes.map((theme, index) => (
            <ThemeCard key={theme.id} theme={theme} index={index} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6">
          <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-[0.2em] mb-2">Próximos lançamentos</p>
          <h2 className="font-impact text-3xl text-white tracking-wide">NOVOS UNIVERSOS EM BREVE</h2>
          <p className="text-[#64748B] mt-2">Estamos preparando novas experiências com formulários e resultados aprimorados.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {upcomingThemes.map((theme, index) => (
            <ThemeCard key={theme.id} theme={theme} index={index} available={false} />
          ))}
        </div>
      </section>
    </div>
  );
}

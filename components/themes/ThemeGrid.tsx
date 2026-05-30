import { themes } from "@/lib/themes";
import { ThemeCard } from "./ThemeCard";

export function ThemeGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {themes.map((theme, index) => (
        <ThemeCard key={theme.id} theme={theme} index={index} />
      ))}
    </div>
  );
}

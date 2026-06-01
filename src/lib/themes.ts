// Shared theme visuals (emoji + gradient) used by the home grid and the invitation card.

const THEME_EMOJI: Record<string, string> = {
  astronautas: "🚀",
  dinosaurios: "🦕",
  superhéroes: "🦸",
  superheroes: "🦸",
  princesas: "👑",
  unicornios: "🦄",
  sirenitas: "🧜",
  piratas: "🏴‍☠️",
  animales: "🦁",
};

const THEME_GRADIENT: Record<string, [string, string]> = {
  astronautas: ["#0b1d51", "#5b8def"],
  dinosaurios: ["#14532d", "#22c55e"],
  superhéroes: ["#7f1d1d", "#ef4444"],
  superheroes: ["#7f1d1d", "#ef4444"],
  princesas: ["#831843", "#ec4899"],
  unicornios: ["#581c87", "#a855f7"],
  sirenitas: ["#155e75", "#06b6d4"],
  piratas: ["#1c1917", "#57534e"],
  animales: ["#78350f", "#f59e0b"],
};

export function themeEmoji(theme: string): string {
  return THEME_EMOJI[theme.trim().toLowerCase()] ?? "🎨";
}

export function themeGradient(theme: string): [string, string] {
  return THEME_GRADIENT[theme.trim().toLowerCase()] ?? ["#3a1a6e", "#ff00c8"];
}

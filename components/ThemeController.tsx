"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useAccountStore } from "@/store/accountStore";

export function ThemeApplier() {
  const theme = useThemeStore((state) => state.theme);
  const proSkin = useThemeStore((state) => state.proSkin);
  const isPro = useAccountStore((state) => state.isPro);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.skin = isPro ? proSkin : "parchment";
  }, [isPro, proSkin, theme]);

  return null;
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title="Toggle theme"
      aria-label="Toggle theme"
      className="focus-ring inline-grid h-10 w-10 place-items-center rounded-full border border-ink-900/15 bg-parchment-50/70 text-ink-900 transition hover:bg-sakura-200/35"
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}

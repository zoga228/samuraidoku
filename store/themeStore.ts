"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";
export type ProSkin = "parchment" | "black-ink" | "sakura-garden" | "katana-steel";

interface ThemeState {
  theme: ThemeMode;
  proSkin: ProSkin;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setProSkin: (skin: ProSkin) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      proSkin: "parchment",
      toggleTheme: () => set({ theme: get().theme === "light" ? "dark" : "light" }),
      setTheme: (theme) => set({ theme }),
      setProSkin: (proSkin) => set({ proSkin })
    }),
    {
      name: "samuraidoku-theme"
    }
  )
);

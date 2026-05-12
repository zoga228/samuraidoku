"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthProvider = "supabase" | "demo";

interface AccountState {
  email: string | null;
  provider: AuthProvider | null;
  isPro: boolean;
  setAccount: (email: string, provider: AuthProvider) => void;
  signOutLocal: () => void;
  activatePro: () => void;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      email: null,
      provider: null,
      isPro: false,
      setAccount: (email, provider) => set({ email, provider }),
      signOutLocal: () => set({ email: null, provider: null, isPro: false }),
      activatePro: () => set({ isPro: true })
    }),
    {
      name: "samuraidoku-account"
    }
  )
);

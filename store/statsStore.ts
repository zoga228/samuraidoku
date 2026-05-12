"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Difficulty, GameMode } from "@/lib/sudoku/variants";

export interface CompletionRecord {
  id: string;
  date: string;
  gameType: "play" | "daily" | "practice";
  mode: GameMode;
  difficulty: Difficulty;
  time: number;
  mistakes: number;
  hintsUsed: number;
  moves: number;
  accuracy: number;
}

interface StatsState {
  records: CompletionRecord[];
  addCompletion: (record: CompletionRecord) => void;
  clearStats: () => void;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      records: [],
      addCompletion: (record) => {
        if (get().records.some((item) => item.id === record.id)) {
          return;
        }

        set({ records: [record, ...get().records].slice(0, 50) });
      },
      clearStats: () => set({ records: [] })
    }),
    {
      name: "samuraidoku-stats"
    }
  )
);

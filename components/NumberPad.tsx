"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { getVariantConfig } from "@/lib/sudoku/variants";
import { cn } from "@/lib/utils";

export default function NumberPad({ rail = false, large = false }: { rail?: boolean; large?: boolean }) {
  const mode = useGameStore((state) => state.mode);
  const inputNumber = useGameStore((state) => state.inputNumber);
  const userGrid = useGameStore((state) => state.userGrid);
  const numbers = getVariantConfig(mode).numbers;
  const size = numbers.length;

  return (
    <section className={cn("paper-panel rounded-md p-4", rail && "lg:sticky lg:top-24")}>
      <h2 className="mb-3 font-serif text-xl font-semibold text-ink-900">Numbers</h2>
      <div className={cn("grid gap-2", numbers.length === 4 ? "grid-cols-4 lg:grid-cols-2" : "grid-cols-3")}>
        {numbers.map((number) => {
          const placed = userGrid.flat().filter((value) => value === number).length;
          const remaining = Math.max(0, size - placed);

          return (
            <motion.button
              key={number}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => inputNumber(number)}
              className={cn(
                "focus-ring flex aspect-square flex-col items-center justify-center rounded-md border border-ink-900/10 bg-parchment-50/80 font-serif font-semibold text-ink-900 shadow-sm transition hover:bg-sakura-200/45",
                rail ? "text-3xl xl:text-4xl" : "text-4xl",
                large && "min-h-[92px] text-5xl"
              )}
            >
              <span>{number}</span>
              <span className="mt-1 font-sans text-[11px] font-semibold uppercase text-ink-700">{remaining} left</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

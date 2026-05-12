"use client";

import { motion } from "framer-motion";
import { GameMode, gameModes } from "@/lib/sudoku/variants";
import { cn } from "@/lib/utils";

export default function GameModeSelector({
  value,
  onChange
}: {
  value: GameMode;
  onChange: (mode: GameMode) => void;
}) {
  return (
    <section className="paper-panel rounded-md p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-ink-900">Mode</h2>
        <span className="text-xs uppercase text-ink-700">Variant</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {gameModes.map((mode) => (
          <motion.button
            key={mode.id}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(mode.id)}
            className={cn(
              "focus-ring rounded-md border px-3 py-3 text-left transition",
              value === mode.id
                ? "border-ink-900 bg-ink-900 text-parchment-100"
                : "border-ink-900/15 bg-parchment-50/65 text-ink-800 hover:bg-sakura-200/30"
            )}
          >
            <span className="block text-sm font-semibold">{mode.title}</span>
            <span className={cn("mt-1 block text-xs", value === mode.id ? "text-parchment-200" : "text-ink-700")}>
              {mode.description}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

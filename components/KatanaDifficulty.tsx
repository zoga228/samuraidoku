"use client";

import { motion } from "framer-motion";
import { Difficulty, difficultyLevels } from "@/lib/sudoku/variants";
import { cn } from "@/lib/utils";
import KatanaIcon from "./KatanaIcon";

export default function KatanaDifficulty({
  value,
  onChange,
  compact = false
}: {
  value: Difficulty;
  onChange?: (difficulty: Difficulty) => void;
  compact?: boolean;
}) {
  return (
    <div className={cn("grid gap-2", compact ? "grid-cols-3" : "grid-cols-1")}>
      {difficultyLevels.map((level) => {
        const active = value === level.id;

        return (
          <motion.button
            key={level.id}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange?.(level.id)}
            className={cn(
              "focus-ring grid min-h-[74px] grid-rows-[auto_1fr] gap-1 overflow-hidden rounded-md border px-3 py-2 text-left transition",
              active
                ? "border-ink-900 bg-ink-900 text-parchment-100"
                : "border-ink-900/15 bg-parchment-50/60 text-ink-800 hover:border-sakura-300 hover:bg-sakura-200/30"
            )}
          >
            <span className="text-sm font-semibold leading-none">{level.shortLabel}</span>
            <span className="flex min-w-0 items-end justify-end gap-0.5 pr-1" aria-label={`${level.katana} katana`}>
              {Array.from({ length: level.katana }, (_, index) => (
                <KatanaIcon key={index} active={active} />
              ))}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

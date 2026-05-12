"use client";

import { Difficulty } from "@/lib/sudoku/variants";
import KatanaDifficulty from "./KatanaDifficulty";

export default function DifficultySelector({
  value,
  onChange
}: {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}) {
  return (
    <section className="paper-panel rounded-md p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-ink-900">Katana Level</h2>
        <span className="text-xs uppercase text-ink-700">Difficulty</span>
      </div>
      <KatanaDifficulty value={value} onChange={onChange} compact />
    </section>
  );
}

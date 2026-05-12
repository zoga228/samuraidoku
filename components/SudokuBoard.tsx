"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { cn } from "@/lib/utils";
import { getVariantConfig, sameBox } from "@/lib/sudoku/variants";

export default function SudokuBoard() {
  const {
    mode,
    puzzle,
    userGrid,
    solution,
    notes,
    selectedCell,
    isPaused,
    killerCages,
    selectCell
  } = useGameStore();
  const config = getVariantConfig(mode);
  const size = userGrid.length || config.size;
  const cageMap = useMemo(() => {
    const map = new Map<string, { sum: number; first: boolean }>();

    for (const cage of killerCages) {
      cage.cells.forEach((cell, index) => {
        map.set(`${cell.row}-${cell.col}`, { sum: cage.sum, first: index === 0 });
      });
    }

    return map;
  }, [killerCages]);

  return (
    <div className="relative mx-auto w-full max-w-[680px]">
      <div
        className="sudoku-grid-shadow grid aspect-square overflow-hidden rounded-[3px] bg-parchment-50"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {userGrid.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const fixed = puzzle[rowIndex][colIndex] !== 0;
            const selected = selectedCell?.row === rowIndex && selectedCell.col === colIndex;
            const highlighted =
              selectedCell &&
              (selectedCell.row === rowIndex ||
                selectedCell.col === colIndex ||
                sameBox(selectedCell.row, selectedCell.col, rowIndex, colIndex, config));
            const correct = value !== 0 && !fixed && value === solution[rowIndex][colIndex];
            const error = value !== 0 && value !== solution[rowIndex][colIndex];
            const cage = cageMap.get(`${rowIndex}-${colIndex}`);
            const cellNotes = notes[rowIndex]?.[colIndex] ?? [];

            return (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => selectCell(rowIndex, colIndex)}
                className={cn(
                  "focus-ring relative flex aspect-square items-center justify-center border border-ink-900/18 text-center font-serif transition",
                  rowIndex % config.boxRows === 0 && "border-t-2 border-t-ink-900/85",
                  colIndex % config.boxCols === 0 && "border-l-2 border-l-ink-900/85",
                  rowIndex === size - 1 && "border-b-2 border-b-ink-900/85",
                  colIndex === size - 1 && "border-r-2 border-r-ink-900/85",
                  highlighted && "bg-steel-100/50",
                  selected && "z-10 bg-sakura-200/55 shadow-glow",
                  fixed && "font-bold text-ink-900",
                  !fixed && value !== 0 && "text-indigo-950",
                  correct && "bg-success/15 text-success",
                  error && "animate-shake bg-error/12 text-error",
                  mode === "killer" && "after:absolute after:inset-[5px] after:rounded-sm after:border after:border-dashed after:border-ink-900/20"
                )}
              >
                {mode === "killer" && cage?.first && (
                  <span className="absolute left-1 top-0.5 z-10 font-sans text-[10px] font-bold text-ink-700">
                    {cage.sum}
                  </span>
                )}
                {value !== 0 ? (
                  <span className={cn(size === 4 ? "text-3xl sm:text-5xl" : "text-2xl sm:text-4xl")}>{value}</span>
                ) : (
                  cellNotes.length > 0 && (
                    <span
                      className="grid h-full w-full content-center gap-0.5 p-1 font-sans text-[10px] text-ink-700/70 sm:text-xs"
                      style={{
                        gridTemplateColumns: `repeat(${size === 4 ? 2 : 3}, minmax(0, 1fr))`
                      }}
                    >
                      {config.numbers.map((candidate) => (
                        <span key={candidate} className="leading-none">
                          {cellNotes.includes(candidate) ? candidate : ""}
                        </span>
                      ))}
                    </span>
                  )
                )}
              </motion.button>
            );
          })
        )}
      </div>

      {isPaused && (
        <div className="absolute inset-0 grid place-items-center rounded-[3px] bg-ink-900/82 text-center text-parchment-100 backdrop-blur-sm">
          <div>
            <p className="font-serif text-4xl font-semibold">Paused</p>
            <p className="mt-2 text-sm text-parchment-200">Return when the mind is clear.</p>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { Eraser, Lightbulb, Pause, Pencil, Play, RefreshCw, RotateCcw } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { cn } from "@/lib/utils";

const buttonBase =
  "focus-ring flex min-h-[62px] flex-col items-center justify-center gap-1 rounded-md border border-ink-900/12 bg-parchment-50/70 px-2 py-2 text-xs font-semibold text-ink-800 transition hover:bg-sakura-200/35";

export default function GameControls() {
  const {
    mode,
    difficulty,
    gameType,
    notesMode,
    isPaused,
    undoMove,
    eraseCell,
    toggleNotesMode,
    useHint,
    pauseGame,
    resumeGame,
    startNewGame
  } = useGameStore();

  return (
    <section className="paper-panel rounded-md p-4">
      <h2 className="mb-3 font-serif text-xl font-semibold text-ink-900">Tools</h2>
      <div className="grid grid-cols-3 gap-2">
        <button type="button" onClick={undoMove} title="Undo" className={buttonBase}>
          <RotateCcw size={21} />
          Undo
        </button>
        <button type="button" onClick={eraseCell} title="Eraser" className={buttonBase}>
          <Eraser size={21} />
          Eraser
        </button>
        <button
          type="button"
          onClick={toggleNotesMode}
          title="Notes"
          className={cn(buttonBase, notesMode && "border-ink-900 bg-ink-900 text-parchment-100 hover:bg-ink-800")}
        >
          <Pencil size={21} />
          Notes
        </button>
        <button type="button" onClick={useHint} title="Hint" className={buttonBase}>
          <Lightbulb size={21} />
          Hint
        </button>
        <button type="button" onClick={isPaused ? resumeGame : pauseGame} title="Pause" className={buttonBase}>
          {isPaused ? <Play size={21} /> : <Pause size={21} />}
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          onClick={() => startNewGame(mode, difficulty, undefined, gameType)}
          title="New game"
          className="focus-ring flex min-h-[62px] flex-col items-center justify-center gap-1 rounded-md border border-ink-900 bg-ink-900 px-2 py-2 text-xs font-semibold text-parchment-100 transition hover:bg-ink-800"
        >
          <RefreshCw size={21} />
          New
        </button>
      </div>
    </section>
  );
}

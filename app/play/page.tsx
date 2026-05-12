"use client";

import { useEffect } from "react";
import AICoachPanel from "@/components/AICoachPanel";
import GameControls from "@/components/GameControls";
import NumberPad from "@/components/NumberPad";
import SakuraBackground from "@/components/SakuraBackground";
import SudokuBoard from "@/components/SudokuBoard";
import VictoryOverlay from "@/components/VictoryOverlay";
import { formatTime } from "@/lib/utils";
import { Difficulty, difficultyLevels } from "@/lib/sudoku/variants";
import { useGameStore } from "@/store/gameStore";
import { useStatsStore } from "@/store/statsStore";
import { getAccuracy } from "@/lib/sudoku/solver";

export default function PlayPage() {
  const {
    mode,
    difficulty,
    timer,
    mistakes,
    maxMistakes,
    hintsUsed,
    moves,
    completed,
    gameKey,
    gameType,
    startNewGame,
    tick,
    inputNumber,
    eraseCell
  } =
    useGameStore();
  const addCompletion = useStatsStore((state) => state.addCompletion);
  const validDifficulty = difficultyLevels.some((level) => level.id === difficulty);

  useEffect(() => {
    const interval = window.setInterval(() => tick(), 1000);
    return () => window.clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    if (gameType !== "play" || !validDifficulty) {
      startNewGame(mode, validDifficulty ? difficulty : "medium", undefined, "play");
    }
  }, [difficulty, gameType, mode, startNewGame, validDifficulty]);

  const changeDifficulty = (nextDifficulty: Difficulty) => startNewGame(mode, nextDifficulty, undefined, "play");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (/^[1-9]$/.test(event.key)) {
        inputNumber(Number(event.key));
      }

      if (event.key === "Backspace" || event.key === "Delete") {
        eraseCell();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [eraseCell, inputNumber]);

  useEffect(() => {
    if (!completed || !gameKey) {
      return;
    }

    addCompletion({
      id: gameKey,
      date: new Date().toISOString(),
      gameType: "play",
      mode,
      difficulty,
      time: timer,
      mistakes,
      hintsUsed,
      moves,
      accuracy: getAccuracy(moves, mistakes)
    });
  }, [addCompletion, completed, difficulty, gameKey, hintsUsed, mistakes, mode, moves, timer]);

  return (
    <main className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <SakuraBackground quiet />
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase text-ink-700">Training ground</p>
            <h1 className="font-serif text-4xl font-semibold text-ink-900 sm:text-5xl">Play Samuraidoku</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {difficultyLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => changeDifficulty(level.id)}
                  className={`focus-ring rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    difficulty === level.id
                      ? "border-ink-900 bg-ink-900 text-parchment-100"
                      : "border-ink-900/15 bg-parchment-50/55 text-ink-700 hover:bg-sakura-200/25"
                  }`}
                >
                  {level.shortLabel}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center sm:min-w-[390px]">
            <div className="paper-panel rounded-md px-3 py-2">
              <p className="text-xs uppercase text-ink-700">Time</p>
              <p className="font-serif text-2xl font-semibold">{formatTime(timer)}</p>
            </div>
            <div className="paper-panel rounded-md px-3 py-2">
              <p className="text-xs uppercase text-ink-700">Errors</p>
              <p className="font-serif text-2xl font-semibold">
                {mistakes}/{maxMistakes}
              </p>
            </div>
            <div className="paper-panel rounded-md px-3 py-2">
              <p className="text-xs uppercase text-ink-700">Hints</p>
              <p className="font-serif text-2xl font-semibold">{hintsUsed}</p>
            </div>
            <div className="paper-panel rounded-md px-3 py-2">
              <p className="text-xs uppercase text-ink-700">State</p>
              <p className="font-serif text-lg font-semibold">{completed ? "Won" : "Focus"}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,720px)_minmax(360px,420px)]">
          <SudokuBoard />
          <aside className="grid gap-4">
            <NumberPad large />
            <AICoachPanel />
            <GameControls />
          </aside>
        </div>
      </div>
      <VictoryOverlay
        open={completed}
        time={timer}
        mistakes={mistakes}
        onRestart={() => startNewGame(mode, difficulty, undefined, "play")}
      />
    </main>
  );
}

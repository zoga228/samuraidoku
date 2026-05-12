"use client";

import { useEffect, useState } from "react";
import AICoachPanel from "@/components/AICoachPanel";
import GameControls from "@/components/GameControls";
import NumberPad from "@/components/NumberPad";
import SakuraBackground from "@/components/SakuraBackground";
import SudokuBoard from "@/components/SudokuBoard";
import VictoryOverlay from "@/components/VictoryOverlay";
import { calculateDailyScore, DailyResult } from "@/lib/dailyChallenge";
import { formatTime, todayKey } from "@/lib/utils";
import { getAccuracy } from "@/lib/sudoku/solver";
import { useGameStore } from "@/store/gameStore";
import { useStatsStore } from "@/store/statsStore";

export default function DailyPage() {
  const [key, setKey] = useState("");
  const [savedResult, setSavedResult] = useState<DailyResult | null>(null);
  const { timer, mistakes, hintsUsed, moves, completed, gameKey, startNewGame, tick } = useGameStore();
  const addCompletion = useStatsStore((state) => state.addCompletion);
  const score = calculateDailyScore({ mistakes, seconds: timer, hintsUsed });
  const accuracy = getAccuracy(moves, mistakes);

  useEffect(() => {
    setKey(todayKey());
  }, []);

  useEffect(() => {
    if (!key) {
      return;
    }

    const seed = `daily-${key}`;
    const storedResult = window.localStorage.getItem(`samuraidoku-daily-result-${key}`);

    if (storedResult) {
      setSavedResult(JSON.parse(storedResult) as DailyResult);
    }

    if (gameKey !== seed) {
      startNewGame("classic", "hard", seed, "daily");
    }
  }, [gameKey, key, startNewGame]);

  useEffect(() => {
    const interval = window.setInterval(() => tick(), 1000);
    return () => window.clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    if (!completed || !key) {
      return;
    }

    const result: DailyResult = {
      date: key,
      time: timer,
      mistakes,
      hintsUsed,
      accuracy,
      score
    };

    window.localStorage.setItem(`samuraidoku-daily-result-${key}`, JSON.stringify(result));
    setSavedResult(result);
    addCompletion({
      id: `daily-${key}`,
      date: new Date().toISOString(),
      gameType: "daily",
      mode: "classic",
      difficulty: "hard",
      time: timer,
      mistakes,
      hintsUsed,
      moves,
      accuracy
    });
  }, [accuracy, addCompletion, completed, hintsUsed, key, mistakes, moves, score, timer]);

  if (!key) {
    return (
      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase text-ink-700">Daily Challenge</p>
          <h1 className="font-serif text-4xl font-semibold text-ink-900">Preparing today&apos;s puzzle</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <SakuraBackground quiet />
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="text-xs uppercase text-ink-700">{key}</p>
            <h1 className="font-serif text-4xl font-semibold text-ink-900 sm:text-5xl">Daily Challenge</h1>
            <p className="mt-3 max-w-2xl text-ink-700">
              Everyone receives the same seeded puzzle today. Keep the hints unused for the clean-blade bonus.
            </p>
          </div>
          <section className="paper-panel rounded-md p-4">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <p className="text-xs uppercase text-ink-700">Time</p>
                <p className="font-serif text-xl font-semibold">{formatTime(timer)}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-ink-700">Errors</p>
                <p className="font-serif text-xl font-semibold">{mistakes}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-ink-700">Accuracy</p>
                <p className="font-serif text-xl font-semibold">{accuracy}%</p>
              </div>
              <div>
                <p className="text-xs uppercase text-ink-700">Score</p>
                <p className="font-serif text-xl font-semibold">{score}</p>
              </div>
            </div>
            {savedResult && (
              <p className="mt-3 rounded-md bg-success/12 px-3 py-2 text-sm text-success">
                Saved result: {savedResult.score} points in {formatTime(savedResult.time)}.
              </p>
            )}
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,720px)_minmax(360px,420px)]">
          <SudokuBoard />
          <aside className="grid gap-4">
            <NumberPad large />
            <GameControls />
            <AICoachPanel />
          </aside>
        </div>
      </div>
      <VictoryOverlay
        open={completed}
        time={timer}
        mistakes={mistakes}
        score={score}
        onRestart={() => startNewGame("classic", "hard", `daily-${key}`, "daily")}
      />
    </main>
  );
}

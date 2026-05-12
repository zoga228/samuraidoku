import { generateSudoku } from "./sudoku/generator";
import { Difficulty } from "./sudoku/variants";
import { todayKey } from "./utils";

export interface DailyResult {
  date: string;
  time: number;
  mistakes: number;
  hintsUsed: number;
  accuracy: number;
  score: number;
}

export function getDailyChallenge(date = todayKey(), difficulty: Difficulty = "hard") {
  return generateSudoku("classic", difficulty, `daily-${date}`);
}

export function calculateDailyScore({
  mistakes,
  seconds,
  hintsUsed
}: {
  mistakes: number;
  seconds: number;
  hintsUsed: number;
}) {
  const minutes = Math.floor(seconds / 60);
  const noHintsBonus = hintsUsed === 0 ? 150 : 0;

  return Math.max(0, 1000 - mistakes * 100 - minutes * 10 - hintsUsed * 35 + noHintsBonus);
}

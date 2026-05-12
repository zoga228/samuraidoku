import { Technique } from "@/data/techniques";
import { generateSudoku } from "./generator";
import { getCandidates } from "./solver";
import { Difficulty } from "./variants";

export interface TechniquePractice {
  puzzle: number[][];
  solution: number[][];
  targetCells: Array<{ row: number; col: number }>;
  candidate: number;
  prompt: string;
  explanation: string;
}

const patternCounts: Record<Technique["pattern"], number> = {
  single: 1,
  pair: 2,
  triple: 3,
  line: 3,
  fish: 4,
  wing: 3
};

type CandidateCell = {
  row: number;
  col: number;
  candidates: number[];
};

function candidateCells(puzzle: number[][]) {
  return puzzle.flatMap((row, rowIndex) =>
    row
      .map((value, colIndex) => ({
        row: rowIndex,
        col: colIndex,
        candidates: value === 0 ? getCandidates(puzzle, rowIndex, colIndex, "classic") : []
      }))
      .filter((cell) => cell.candidates.length > 0)
  );
}

function firstCommonCandidate(cells: CandidateCell[]) {
  for (let candidate = 1; candidate <= 9; candidate += 1) {
    if (cells.every((cell) => cell.candidates.includes(candidate))) {
      return candidate;
    }
  }

  return null;
}

function chooseCells(puzzle: number[][], technique: Technique) {
  const empties = candidateCells(puzzle);
  const count = patternCounts[technique.pattern];

  if (technique.pattern === "pair" || technique.pattern === "line") {
    for (let row = 0; row < 9; row += 1) {
      const rowCells = empties.filter((cell) => cell.row === row);
      for (let candidate = 1; candidate <= 9; candidate += 1) {
        const cells = rowCells.filter((cell) => cell.candidates.includes(candidate)).slice(0, count);
        if (cells.length === count) {
          return { cells, candidate };
        }
      }
    }
  }

  if (technique.pattern === "triple") {
    for (let col = 0; col < 9; col += 1) {
      const colCells = empties.filter((cell) => cell.col === col);
      for (let candidate = 1; candidate <= 9; candidate += 1) {
        const cells = colCells.filter((cell) => cell.candidates.includes(candidate)).slice(0, count);
        if (cells.length === count) {
          return { cells, candidate };
        }
      }
    }
  }

  if (technique.pattern === "fish") {
    for (let candidate = 1; candidate <= 9; candidate += 1) {
      for (let rowA = 0; rowA < 8; rowA += 1) {
        for (let rowB = rowA + 1; rowB < 9; rowB += 1) {
          const colsA = empties.filter((cell) => cell.row === rowA && cell.candidates.includes(candidate)).map((cell) => cell.col);
          const colsB = empties.filter((cell) => cell.row === rowB && cell.candidates.includes(candidate)).map((cell) => cell.col);
          const commonCols = colsA.filter((col) => colsB.includes(col)).slice(0, 2);

          if (commonCols.length === 2) {
            const cells = [
              { row: rowA, col: commonCols[0], candidates: [candidate] },
              { row: rowA, col: commonCols[1], candidates: [candidate] },
              { row: rowB, col: commonCols[0], candidates: [candidate] },
              { row: rowB, col: commonCols[1], candidates: [candidate] }
            ];
            return { cells, candidate };
          }
        }
      }
    }
  }

  if (technique.pattern === "wing") {
    const cells = empties
      .sort((a, b) => Math.abs(a.row - 4) + Math.abs(a.col - 4) - (Math.abs(b.row - 4) + Math.abs(b.col - 4)))
      .slice(0, count);
    const candidate = firstCommonCandidate(cells);

    if (cells.length === count && candidate) {
      return { cells, candidate };
    }
  }

  for (let candidate = 1; candidate <= 9; candidate += 1) {
    const cells = empties.filter((cell) => cell.candidates.includes(candidate)).slice(0, count);
    if (cells.length === count) {
      return { cells, candidate };
    }
  }

  const fallback = empties.slice(0, count);
  return {
    cells: fallback,
    candidate: firstCommonCandidate(fallback) ?? fallback[0]?.candidates[0] ?? 1
  };
}

export function createTechniquePractice(technique: Technique, seed = `${technique.title}-${Date.now()}`): TechniquePractice {
  const difficulty: Difficulty = technique.difficulty === "easy" ? "easy" : technique.difficulty === "medium" ? "medium" : "hard";
  const { puzzle, solution } = generateSudoku("classic", difficulty, seed);
  const selected = chooseCells(puzzle, technique);
  const targetCells = selected.cells.map(({ row, col }) => ({ row, col }));
  const candidate = selected.candidate;

  return {
    puzzle,
    solution,
    targetCells,
    candidate,
    prompt: `Mark all highlighted cells where candidate ${candidate} belongs to the ${technique.title} pattern.`,
    explanation: `The highlighted cells all keep ${candidate} as a legal candidate. That shared candidate is what makes the ${technique.title} pattern useful.`
  };
}

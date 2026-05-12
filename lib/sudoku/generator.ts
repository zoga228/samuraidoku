import { cloneGrid, createEmptyGrid, isPlacementValid } from "./validator";
import {
  Difficulty,
  GameMode,
  KillerCage,
  createKillerCages,
  getCluesForDifficulty,
  getVariantConfig
} from "./variants";

export interface GeneratedPuzzle {
  puzzle: number[][];
  solution: number[][];
  killerCages: KillerCage[];
}

function hashSeed(seed: string) {
  let hash = 1779033703 ^ seed.length;

  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return (hash ^= hash >>> 16) >>> 0;
  };
}

function createRng(seed = `${Date.now()}-${Math.random()}`) {
  const nextSeed = hashSeed(seed);
  let value = nextSeed();

  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rng: () => number) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function createPatternGrid(size: number, boxRows: number, boxCols: number, rng: () => number) {
  const numbers = shuffle(
    Array.from({ length: size }, (_, index) => index + 1),
    rng
  );
  const rowGroups = shuffle(Array.from({ length: Math.ceil(size / boxRows) }, (_, index) => index), rng);
  const colGroups = shuffle(Array.from({ length: Math.ceil(size / boxCols) }, (_, index) => index), rng);
  const rows = rowGroups.flatMap((group) =>
    shuffle(
      Array.from({ length: boxRows }, (_, index) => group * boxRows + index),
      rng
    )
  );
  const cols = colGroups.flatMap((group) =>
    shuffle(
      Array.from({ length: boxCols }, (_, index) => group * boxCols + index),
      rng
    )
  );

  return rows.map((row) =>
    cols.map((col) => {
      const pattern = (boxCols * (row % boxRows) + Math.floor(row / boxRows) + col) % size;
      return numbers[pattern];
    })
  );
}

function createBacktrackedGrid(mode: GameMode, rng: () => number) {
  const config = getVariantConfig(mode);
  const grid = createEmptyGrid(config.size);
  const cells = Array.from({ length: config.size * config.size }, (_, index) => ({
    row: Math.floor(index / config.size),
    col: index % config.size
  })).sort((a, b) => {
    const aDiag = Number(a.row === a.col || a.row + a.col === config.size - 1);
    const bDiag = Number(b.row === b.col || b.row + b.col === config.size - 1);
    return bDiag - aDiag;
  });

  function fill(index: number): boolean {
    if (index >= cells.length) {
      return true;
    }

    const cell = cells[index];
    const values = shuffle(config.numbers, rng);

    for (const value of values) {
      if (isPlacementValid(grid, cell.row, cell.col, value, mode)) {
        grid[cell.row][cell.col] = value;

        if (fill(index + 1)) {
          return true;
        }

        grid[cell.row][cell.col] = 0;
      }
    }

    return false;
  }

  fill(0);
  return grid;
}

function removeCells(solution: number[][], difficulty: Difficulty, rng: () => number) {
  const size = solution.length;
  const clues = getCluesForDifficulty(difficulty, size);
  const puzzle = cloneGrid(solution);
  const cells = shuffle(
    Array.from({ length: size * size }, (_, index) => ({
      row: Math.floor(index / size),
      col: index % size
    })),
    rng
  );
  const cellsToRemove = Math.max(0, size * size - clues);

  for (let index = 0; index < cellsToRemove; index += 1) {
    const cell = cells[index];
    puzzle[cell.row][cell.col] = 0;
  }

  return puzzle;
}

export function generateSudoku(
  mode: GameMode = "classic",
  difficulty: Difficulty = "easy",
  seed = `${mode}-${difficulty}-${Date.now()}`
): GeneratedPuzzle {
  const rng = createRng(seed);
  const config = getVariantConfig(mode);
  const solution =
    config.diagonal || config.size !== 9
      ? createBacktrackedGrid(mode, rng)
      : createPatternGrid(config.size, config.boxRows, config.boxCols, rng);
  const puzzle = removeCells(solution, difficulty, rng);
  const killerCages = config.killer ? createKillerCages(solution) : [];

  return {
    puzzle,
    solution,
    killerCages
  };
}

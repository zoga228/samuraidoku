import { GameMode, getVariantConfig, sameBox } from "./variants";

export function cloneGrid(grid: number[][]) {
  return grid.map((row) => [...row]);
}

export function createEmptyGrid(size: number) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
}

export function getRowValues(grid: number[][], row: number) {
  return grid[row].filter(Boolean);
}

export function getColumnValues(grid: number[][], col: number) {
  return grid.map((row) => row[col]).filter(Boolean);
}

export function getBlockValues(grid: number[][], row: number, col: number, mode: GameMode) {
  const config = getVariantConfig(mode);
  const startRow = Math.floor(row / config.boxRows) * config.boxRows;
  const startCol = Math.floor(col / config.boxCols) * config.boxCols;
  const values: number[] = [];

  for (let r = startRow; r < startRow + config.boxRows; r += 1) {
    for (let c = startCol; c < startCol + config.boxCols; c += 1) {
      if (grid[r][c]) {
        values.push(grid[r][c]);
      }
    }
  }

  return values;
}

export function hasNoRepeats(values: number[]) {
  const seen = new Set<number>();

  for (const value of values) {
    if (value === 0) {
      continue;
    }

    if (seen.has(value)) {
      return false;
    }

    seen.add(value);
  }

  return true;
}

export function isPlacementValid(grid: number[][], row: number, col: number, num: number, mode: GameMode) {
  const config = getVariantConfig(mode);

  if (!config.numbers.includes(num)) {
    return false;
  }

  for (let c = 0; c < config.size; c += 1) {
    if (c !== col && grid[row][c] === num) {
      return false;
    }
  }

  for (let r = 0; r < config.size; r += 1) {
    if (r !== row && grid[r][col] === num) {
      return false;
    }
  }

  for (let r = 0; r < config.size; r += 1) {
    for (let c = 0; c < config.size; c += 1) {
      if ((r !== row || c !== col) && sameBox(r, c, row, col, config) && grid[r][c] === num) {
        return false;
      }
    }
  }

  if (config.diagonal && row === col) {
    for (let i = 0; i < config.size; i += 1) {
      if (i !== row && grid[i][i] === num) {
        return false;
      }
    }
  }

  if (config.diagonal && row + col === config.size - 1) {
    for (let i = 0; i < config.size; i += 1) {
      const antiCol = config.size - 1 - i;
      if (i !== row && grid[i][antiCol] === num) {
        return false;
      }
    }
  }

  return true;
}

export function findConflicts(grid: number[][], row: number, col: number, num: number, mode: GameMode) {
  const config = getVariantConfig(mode);
  const conflicts: Array<"row" | "column" | "box" | "diagonal"> = [];

  if (grid[row].some((value, index) => index !== col && value === num)) {
    conflicts.push("row");
  }

  if (grid.some((line, index) => index !== row && line[col] === num)) {
    conflicts.push("column");
  }

  if (
    grid.some((line, r) =>
      line.some((value, c) => (r !== row || c !== col) && sameBox(r, c, row, col, config) && value === num)
    )
  ) {
    conflicts.push("box");
  }

  if (config.diagonal) {
    const mainConflict = row === col && grid.some((line, index) => index !== row && line[index] === num);
    const antiConflict =
      row + col === config.size - 1 &&
      grid.some((line, index) => index !== row && line[config.size - 1 - index] === num);

    if (mainConflict || antiConflict) {
      conflicts.push("diagonal");
    }
  }

  return conflicts;
}

export function isGridComplete(grid: number[][]) {
  return grid.every((row) => row.every((value) => value !== 0));
}

export function isGridSolved(grid: number[][], solution: number[][]) {
  return grid.every((row, r) => row.every((value, c) => value === solution[r][c]));
}

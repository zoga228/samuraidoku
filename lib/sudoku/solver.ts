import { GameMode, getVariantConfig } from "./variants";
import { isGridSolved, isPlacementValid } from "./validator";

export function getCandidates(grid: number[][], row: number, col: number, mode: GameMode) {
  const config = getVariantConfig(mode);

  if (grid[row]?.[col]) {
    return [];
  }

  return config.numbers.filter((number) => isPlacementValid(grid, row, col, number, mode));
}

export function findFirstEmptyCell(grid: number[][]) {
  for (let row = 0; row < grid.length; row += 1) {
    for (let col = 0; col < grid[row].length; col += 1) {
      if (grid[row][col] === 0) {
        return { row, col };
      }
    }
  }

  return null;
}

export function checkSolution(grid: number[][], solution: number[][]) {
  return isGridSolved(grid, solution);
}

export function getAccuracy(totalMoves: number, mistakes: number) {
  if (totalMoves === 0) {
    return 100;
  }

  return Math.max(0, Math.round(((totalMoves - mistakes) / totalMoves) * 100));
}

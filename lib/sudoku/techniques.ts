import { getCandidates } from "./solver";
import { findConflicts, getBlockValues, getColumnValues, getRowValues } from "./validator";
import { GameMode } from "./variants";

export function explainSelectedCell(
  grid: number[][],
  solution: number[][],
  row: number,
  col: number,
  mode: GameMode
) {
  if (grid[row][col]) {
    return `This cell already holds ${grid[row][col]}. Breathe, observe the board, and protect confirmed ground.`;
  }

  const rowValues = getRowValues(grid, row);
  const columnValues = getColumnValues(grid, col);
  const blockValues = getBlockValues(grid, row, col, mode);
  const candidates = getCandidates(grid, row, col, mode);

  if (candidates.length === 1) {
    return `Naked single: only ${candidates[0]} survives the row, column and box. The blade path is clear.`;
  }

  return `Possible numbers for this cell: ${candidates.join(", ") || "none yet"}. Row holds ${
    rowValues.join(", ") || "no digits"
  }; column holds ${columnValues.join(", ") || "no digits"}; box holds ${
    blockValues.join(", ") || "no digits"
  }. Prove the move before placing it.`;
}

export function explainMove(
  previousGrid: number[][],
  solution: number[][],
  row: number,
  col: number,
  num: number,
  mode: GameMode,
  success: boolean
) {
  if (success) {
    return `Good move. ${num} fits here because it does not conflict with the row, column or ${
      mode === "diagonal" ? "diagonal rules" : "3x3 block"
    }. Focus turns knowledge into discipline.`;
  }

  const conflicts = findConflicts(previousGrid, row, col, num, mode);

  if (conflicts.length > 0) {
    const reason = conflicts[0] === "box" ? "3x3 block" : conflicts[0];
    return `This cell cannot be ${num} because ${num} already exists in this ${reason}. Step back and scan the nearby houses.`;
  }

  return `This cell cannot be ${num}. It creates no visible duplicate, but deeper constraints reject it. Recheck candidates before placing.`;
}

export function techniqueInsight(title: string) {
  const insights: Record<string, string> = {
    "Naked Singles": "A cell has one possible candidate after row, column and box exclusions.",
    "Hidden Singles": "A digit may have several-looking options, but only one legal place in a house.",
    "Naked Pairs": "Two cells in a house share the same two candidates, removing them elsewhere.",
    "Hidden Pairs": "Two digits appear only in the same two cells, even if extra notes distract you.",
    "X-Wing": "Two rows and two columns lock a digit into a rectangle.",
    "Y-Wing": "Three bivalue cells form a pivot and two pincers that remove a candidate.",
    Swordfish: "A larger fish pattern uses three rows and columns to trap a digit."
  };

  return insights[title] ?? "Study the candidates, then remove what cannot survive the rules.";
}

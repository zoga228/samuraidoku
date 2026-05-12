export type GameMode = "classic" | "killer" | "diagonal" | "kids";
export type Difficulty = "easy" | "medium" | "hard";

export interface VariantConfig {
  mode: GameMode;
  title: string;
  size: number;
  boxRows: number;
  boxCols: number;
  numbers: number[];
  diagonal?: boolean;
  killer?: boolean;
}

export interface KillerCage {
  id: string;
  cells: Array<{ row: number; col: number }>;
  sum: number;
}

export const difficultyLevels: Array<{
  id: Difficulty;
  label: string;
  shortLabel: string;
  katana: number;
  clues9x9: number;
  clues4x4: number;
}> = [
  { id: "easy", label: "Easy / Legkii", shortLabel: "Easy", katana: 1, clues9x9: 43, clues4x4: 10 },
  { id: "medium", label: "Medium / Srednii", shortLabel: "Medium", katana: 2, clues9x9: 36, clues4x4: 8 },
  { id: "hard", label: "Hard / Slozhnyi", shortLabel: "Hard", katana: 3, clues9x9: 29, clues4x4: 6 }
];

export const gameModes: Array<{
  id: GameMode;
  title: string;
  description: string;
  accent: string;
}> = [
  {
    id: "classic",
    title: "Classic Sudoku",
    description: "The timeless 9x9 discipline of rows, columns and 3x3 boxes.",
    accent: "Ink"
  },
  {
    id: "killer",
    title: "Killer Sudoku",
    description: "Cages show sums. Digits cannot repeat inside a cage.",
    accent: "Steel"
  },
  {
    id: "diagonal",
    title: "Diagonal Sudoku",
    description: "Two main diagonals must also hold every digit from 1 to 9.",
    accent: "Sakura"
  },
  {
    id: "kids",
    title: "Kids Sudoku",
    description: "A 4x4 training board with larger cells and gentle pacing.",
    accent: "Garden"
  }
];

export function getVariantConfig(mode: GameMode): VariantConfig {
  if (mode === "kids") {
    return {
      mode,
      title: "Kids Sudoku",
      size: 4,
      boxRows: 2,
      boxCols: 2,
      numbers: [1, 2, 3, 4]
    };
  }

  return {
    mode,
    title:
      mode === "killer"
        ? "Killer Sudoku"
        : mode === "diagonal"
          ? "Diagonal Sudoku"
          : "Classic Sudoku",
    size: 9,
    boxRows: 3,
    boxCols: 3,
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    diagonal: mode === "diagonal",
    killer: mode === "killer"
  };
}

export function getDifficultyMeta(difficulty: Difficulty) {
  return difficultyLevels.find((level) => level.id === difficulty) ?? difficultyLevels[0];
}

export function getCluesForDifficulty(difficulty: Difficulty, size: number) {
  const level = getDifficultyMeta(difficulty);
  return size === 4 ? level.clues4x4 : level.clues9x9;
}

export function getBoxIndex(row: number, col: number, config: VariantConfig) {
  return (
    Math.floor(row / config.boxRows) * Math.ceil(config.size / config.boxCols) +
    Math.floor(col / config.boxCols)
  );
}

export function sameBox(aRow: number, aCol: number, bRow: number, bCol: number, config: VariantConfig) {
  return (
    Math.floor(aRow / config.boxRows) === Math.floor(bRow / config.boxRows) &&
    Math.floor(aCol / config.boxCols) === Math.floor(bCol / config.boxCols)
  );
}

const cageShapes9x9 = [
  [
    [0, 0],
    [0, 1]
  ],
  [
    [0, 2],
    [1, 2],
    [1, 3]
  ],
  [
    [0, 3],
    [0, 4]
  ],
  [
    [0, 5],
    [0, 6],
    [1, 6]
  ],
  [
    [0, 7],
    [0, 8]
  ],
  [
    [1, 0],
    [2, 0],
    [2, 1]
  ],
  [
    [1, 1],
    [2, 2]
  ],
  [
    [1, 4],
    [1, 5],
    [2, 5]
  ],
  [
    [1, 7],
    [1, 8],
    [2, 8]
  ],
  [
    [2, 3],
    [2, 4],
    [3, 4]
  ],
  [
    [2, 6],
    [2, 7]
  ],
  [
    [3, 0],
    [3, 1],
    [4, 1]
  ],
  [
    [3, 2],
    [4, 2]
  ],
  [
    [3, 3],
    [4, 3]
  ],
  [
    [3, 5],
    [3, 6],
    [4, 6]
  ],
  [
    [3, 7],
    [3, 8]
  ],
  [
    [4, 0],
    [5, 0]
  ],
  [
    [4, 4],
    [4, 5],
    [5, 5]
  ],
  [
    [4, 7],
    [4, 8],
    [5, 8]
  ],
  [
    [5, 1],
    [5, 2],
    [6, 2]
  ],
  [
    [5, 3],
    [5, 4]
  ],
  [
    [5, 6],
    [5, 7]
  ],
  [
    [6, 0],
    [6, 1],
    [7, 1]
  ],
  [
    [6, 3],
    [7, 3]
  ],
  [
    [6, 4],
    [6, 5],
    [7, 5]
  ],
  [
    [6, 6],
    [6, 7]
  ],
  [
    [6, 8],
    [7, 8],
    [8, 8]
  ],
  [
    [7, 0],
    [8, 0]
  ],
  [
    [7, 2],
    [8, 1],
    [8, 2]
  ],
  [
    [7, 4],
    [8, 3],
    [8, 4]
  ],
  [
    [7, 6],
    [7, 7],
    [8, 7]
  ],
  [
    [8, 5],
    [8, 6]
  ]
] as const;

const cageShapes4x4 = [
  [
    [0, 0],
    [0, 1]
  ],
  [
    [0, 2],
    [1, 2]
  ],
  [
    [0, 3],
    [1, 3]
  ],
  [
    [1, 0],
    [2, 0]
  ],
  [
    [1, 1],
    [2, 1],
    [2, 2]
  ],
  [
    [2, 3],
    [3, 3]
  ],
  [
    [3, 0],
    [3, 1]
  ],
  [
    [3, 2]
  ]
] as const;

export function createKillerCages(solution: number[][]): KillerCage[] {
  const shapes = solution.length === 4 ? cageShapes4x4 : cageShapes9x9;

  return shapes.map((shape, index) => {
    const cells = shape.map(([row, col]) => ({ row, col }));
    return {
      id: `cage-${index + 1}`,
      cells,
      sum: cells.reduce((total, cell) => total + solution[cell.row][cell.col], 0)
    };
  });
}

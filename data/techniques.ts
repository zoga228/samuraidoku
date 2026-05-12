import { Difficulty } from "@/lib/sudoku/variants";

export interface Technique {
  title: string;
  ruTitle: string;
  description: string;
  difficulty: Difficulty;
  pattern: "single" | "pair" | "triple" | "line" | "fish" | "wing";
}

export const techniques: Technique[] = [
  {
    title: "Last Free Cell",
    ruTitle: "Последняя свободная ячейка",
    description: "When a house has one empty cell, the missing digit must live there.",
    difficulty: "easy",
    pattern: "single"
  },
  {
    title: "Last Remaining Cell",
    ruTitle: "Последняя оставшаяся ячейка",
    description: "A digit has only one possible position inside a row, column or box.",
    difficulty: "easy",
    pattern: "single"
  },
  {
    title: "Last Digit",
    ruTitle: "Последняя цифра",
    description: "All other numbers are present, revealing the only missing digit.",
    difficulty: "easy",
    pattern: "single"
  },
  {
    title: "Naked Singles",
    ruTitle: "Очевидные одиночки",
    description: "A cell has just one legal candidate after basic exclusions.",
    difficulty: "easy",
    pattern: "single"
  },
  {
    title: "Hidden Singles",
    ruTitle: "Скрытые одиночки",
    description: "A number can appear in only one cell inside a specific house.",
    difficulty: "medium",
    pattern: "single"
  },
  {
    title: "Naked Pairs",
    ruTitle: "Очевидные пары",
    description: "Two cells share the same two candidates and remove them elsewhere.",
    difficulty: "medium",
    pattern: "pair"
  },
  {
    title: "Hidden Pairs",
    ruTitle: "Скрытые пары",
    description: "Two digits are locked into two cells even when extra notes appear.",
    difficulty: "hard",
    pattern: "pair"
  },
  {
    title: "Naked Triples",
    ruTitle: "Очевидные тройки",
    description: "Three cells hold three candidates as a set, clearing the house.",
    difficulty: "hard",
    pattern: "triple"
  },
  {
    title: "Hidden Triples",
    ruTitle: "Скрытые тройки",
    description: "Three digits appear only in three cells and can be isolated.",
    difficulty: "hard",
    pattern: "triple"
  },
  {
    title: "Pointing Pairs",
    ruTitle: "Указывающие пары",
    description: "A candidate in a box points along one row or column.",
    difficulty: "hard",
    pattern: "line"
  },
  {
    title: "Pointing Triples",
    ruTitle: "Указывающие тройки",
    description: "Three candidates in a box align and remove that digit outside.",
    difficulty: "hard",
    pattern: "line"
  },
  {
    title: "X-Wing",
    ruTitle: "X-Wing",
    description: "Two rows and columns form a rectangle that traps one candidate.",
    difficulty: "hard",
    pattern: "fish"
  },
  {
    title: "Y-Wing",
    ruTitle: "Y-Wing",
    description: "A pivot and two pincers remove a digit from their shared view.",
    difficulty: "hard",
    pattern: "wing"
  },
  {
    title: "Swordfish",
    ruTitle: "Swordfish",
    description: "Three rows and columns create a larger fish elimination pattern.",
    difficulty: "hard",
    pattern: "fish"
  }
];

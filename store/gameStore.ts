"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateSudoku } from "@/lib/sudoku/generator";
import { explainMove, explainSelectedCell } from "@/lib/sudoku/techniques";
import { cloneGrid, createEmptyGrid, isGridSolved } from "@/lib/sudoku/validator";
import { Difficulty, GameMode, KillerCage, difficultyLevels, gameModes, getVariantConfig } from "@/lib/sudoku/variants";

type Move = {
  row: number;
  col: number;
  prevValue: number;
  nextValue: number;
  prevNotes: number[];
  nextNotes: number[];
  mistakesBefore: number;
  hintsBefore: number;
};

export type ErrorLogEntry = {
  row: number;
  col: number;
  attempted: number;
  expected: number;
  time: number;
};

export type GameType = "play" | "daily" | "practice";

export interface GameState {
  mode: GameMode;
  difficulty: Difficulty;
  puzzle: number[][];
  solution: number[][];
  userGrid: number[][];
  notes: number[][][];
  killerCages: KillerCage[];
  selectedCell: { row: number; col: number } | null;
  mistakes: number;
  maxMistakes: number;
  timer: number;
  isPaused: boolean;
  notesMode: boolean;
  hintsUsed: number;
  moves: number;
  completed: boolean;
  gameKey: string | null;
  gameType: GameType;
  coachMessage: string;
  history: Move[];
  errorLog: ErrorLogEntry[];
  startNewGame: (mode?: GameMode, difficulty?: Difficulty, seed?: string, gameType?: GameType) => void;
  selectCell: (row: number, col: number) => void;
  inputNumber: (num: number) => void;
  eraseCell: () => void;
  toggleNotesMode: () => void;
  undoMove: () => void;
  useHint: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  tick: () => void;
}

function createNotes(size: number) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => [] as number[]));
}

function initialGame() {
  const generated = generateSudoku("classic", "easy", "initial-samuraidoku");
  return {
    mode: "classic" as GameMode,
    difficulty: "easy" as Difficulty,
    puzzle: generated.puzzle,
    solution: generated.solution,
    userGrid: cloneGrid(generated.puzzle),
    notes: createNotes(generated.puzzle.length),
    killerCages: generated.killerCages,
    selectedCell: null,
    mistakes: 0,
    maxMistakes: 3,
    timer: 0,
    isPaused: false,
    notesMode: false,
    hintsUsed: 0,
    moves: 0,
    completed: false,
    gameKey: "initial-samuraidoku",
    gameType: "play" as GameType,
    coachMessage: "Choose a cell. The Sensei will read the row, column and box with you.",
    history: [] as Move[],
    errorLog: [] as ErrorLogEntry[]
  };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialGame(),
      startNewGame: (mode = get().mode, difficulty = get().difficulty, seed, gameType = get().gameType) => {
        const safeMode = gameModes.some((item) => item.id === mode) ? mode : "classic";
        const safeDifficulty = difficultyLevels.some((item) => item.id === difficulty) ? difficulty : "medium";
        const generated = generateSudoku(safeMode, safeDifficulty, seed);
        const size = generated.puzzle.length;
        const nextKey = seed ?? `${gameType}-${safeMode}-${safeDifficulty}-${Date.now()}-${Math.random()}`;

        set({
          mode: safeMode,
          difficulty: safeDifficulty,
          puzzle: generated.puzzle,
          solution: generated.solution,
          userGrid: cloneGrid(generated.puzzle),
          notes: createNotes(size),
          killerCages: generated.killerCages,
          selectedCell: null,
          mistakes: 0,
          maxMistakes: safeMode === "kids" ? 5 : 3,
          timer: 0,
          isPaused: false,
          notesMode: false,
          hintsUsed: 0,
          moves: 0,
          completed: false,
          gameKey: nextKey,
          gameType,
          coachMessage: "A new board is prepared. Select a cell and begin with patient observation.",
          history: [],
          errorLog: []
        });
      },
      selectCell: (row, col) => {
        const state = get();

        set({
          selectedCell: { row, col },
          coachMessage: explainSelectedCell(state.userGrid, state.solution, row, col, state.mode)
        });
      },
      inputNumber: (num) => {
        const state = get();
        const selected = state.selectedCell;

        if (!selected || state.isPaused || state.completed) {
          return;
        }

        const { row, col } = selected;
        const config = getVariantConfig(state.mode);

        if (!config.numbers.includes(num) || state.puzzle[row][col] !== 0) {
          return;
        }

        const nextGrid = cloneGrid(state.userGrid);
        const nextNotes = state.notes.map((line) => line.map((cell) => [...cell]));
        const prevNotes = [...nextNotes[row][col]];
        const prevValue = nextGrid[row][col];

        if (state.notesMode) {
          nextNotes[row][col] = nextNotes[row][col].includes(num)
            ? nextNotes[row][col].filter((value) => value !== num)
            : [...nextNotes[row][col], num].sort((a, b) => a - b);

          set({
            notes: nextNotes,
            history: [
              ...state.history,
              {
                row,
                col,
                prevValue,
                nextValue: prevValue,
                prevNotes,
                nextNotes: [...nextNotes[row][col]],
                mistakesBefore: state.mistakes,
                hintsBefore: state.hintsUsed
              }
            ],
            coachMessage: `Note ${num} ${prevNotes.includes(num) ? "removed" : "added"}. Notes are sketches in ink, not commitments.`
          });
          return;
        }

        nextGrid[row][col] = num;
        nextNotes[row][col] = [];

        const success = state.solution[row][col] === num;
        const mistakes = success ? state.mistakes : state.mistakes + 1;
        const completed = isGridSolved(nextGrid, state.solution);

        set({
          userGrid: nextGrid,
          notes: nextNotes,
          mistakes,
          moves: state.moves + 1,
          completed,
          history: [
            ...state.history,
            {
              row,
              col,
              prevValue,
              nextValue: num,
              prevNotes,
              nextNotes: [],
              mistakesBefore: state.mistakes,
              hintsBefore: state.hintsUsed
            }
          ],
          errorLog: success
            ? state.errorLog
            : [
                {
                  row,
                  col,
                  attempted: num,
                  expected: state.solution[row][col],
                  time: state.timer
                },
                ...state.errorLog
              ].slice(0, 12),
          coachMessage: completed
            ? "Board complete. The training bell is quiet, and your focus remains."
            : explainMove(state.userGrid, state.solution, row, col, num, state.mode, success)
        });
      },
      eraseCell: () => {
        const state = get();
        const selected = state.selectedCell;

        if (!selected || state.isPaused || state.completed) {
          return;
        }

        const { row, col } = selected;

        if (state.puzzle[row][col] !== 0) {
          return;
        }

        const nextGrid = cloneGrid(state.userGrid);
        const nextNotes = state.notes.map((line) => line.map((cell) => [...cell]));
        const prevValue = nextGrid[row][col];
        const prevNotes = [...nextNotes[row][col]];

        nextGrid[row][col] = 0;
        nextNotes[row][col] = [];

        set({
          userGrid: nextGrid,
          notes: nextNotes,
          completed: false,
          history: [
            ...state.history,
            {
              row,
              col,
              prevValue,
              nextValue: 0,
              prevNotes,
              nextNotes: [],
              mistakesBefore: state.mistakes,
              hintsBefore: state.hintsUsed
            }
          ],
          coachMessage: "The cell is cleared. Empty space is useful when it helps you see again."
        });
      },
      toggleNotesMode: () => {
        const notesMode = !get().notesMode;
        set({
          notesMode,
          coachMessage: notesMode
            ? "Notes mode is on. Mark possibilities before the strike."
            : "Notes mode is off. Your next number will be a committed move."
        });
      },
      undoMove: () => {
        const state = get();
        const lastMove = state.history[state.history.length - 1];

        if (!lastMove) {
          return;
        }

        const nextGrid = cloneGrid(state.userGrid);
        const nextNotes = state.notes.map((line) => line.map((cell) => [...cell]));

        nextGrid[lastMove.row][lastMove.col] = lastMove.prevValue;
        nextNotes[lastMove.row][lastMove.col] = lastMove.prevNotes;

        set({
          userGrid: nextGrid,
          notes: nextNotes,
          mistakes: lastMove.mistakesBefore,
          hintsUsed: lastMove.hintsBefore,
          completed: false,
          history: state.history.slice(0, -1),
          coachMessage: "Undo complete. A disciplined mind can revise without shame."
        });
      },
      useHint: () => {
        const state = get();
        const selected = state.selectedCell;
        const target =
          selected && state.puzzle[selected.row][selected.col] === 0 && state.userGrid[selected.row][selected.col] === 0
            ? selected
            : state.userGrid.flatMap((row, r) => row.map((value, c) => ({ value, row: r, col: c }))).find((cell) => {
                return cell.value === 0 && state.puzzle[cell.row][cell.col] === 0;
              });

        if (!target || state.isPaused || state.completed) {
          return;
        }

        const nextGrid = cloneGrid(state.userGrid);
        const nextNotes = state.notes.map((line) => line.map((cell) => [...cell]));
        const prevValue = nextGrid[target.row][target.col];
        const prevNotes = [...nextNotes[target.row][target.col]];

        nextGrid[target.row][target.col] = state.solution[target.row][target.col];
        nextNotes[target.row][target.col] = [];

        set({
          userGrid: nextGrid,
          notes: nextNotes,
          hintsUsed: state.hintsUsed + 1,
          selectedCell: { row: target.row, col: target.col },
          completed: isGridSolved(nextGrid, state.solution),
          history: [
            ...state.history,
            {
              row: target.row,
              col: target.col,
              prevValue,
              nextValue: state.solution[target.row][target.col],
              prevNotes,
              nextNotes: [],
              mistakesBefore: state.mistakes,
              hintsBefore: state.hintsUsed
            }
          ],
          coachMessage: `Hint placed ${state.solution[target.row][target.col]}. Study why it works before moving on.`
        });
      },
      pauseGame: () => set({ isPaused: true, coachMessage: "Paused. Rest is part of training." }),
      resumeGame: () => set({ isPaused: false, coachMessage: "Training resumes. Return to the smallest certainty." }),
      tick: () => {
        const state = get();

        if (!state.isPaused && !state.completed) {
          set({ timer: state.timer + 1 });
        }
      }
    }),
    {
      name: "samuraidoku-game",
      partialize: (state) => ({
        mode: state.mode,
        difficulty: state.difficulty,
        puzzle: state.puzzle,
        solution: state.solution,
        userGrid: state.userGrid,
        notes: state.notes,
        killerCages: state.killerCages,
        selectedCell: state.selectedCell,
        mistakes: state.mistakes,
        maxMistakes: state.maxMistakes,
        timer: state.timer,
        isPaused: state.isPaused,
        notesMode: state.notesMode,
        hintsUsed: state.hintsUsed,
        moves: state.moves,
        completed: state.completed,
        coachMessage: state.coachMessage,
        gameKey: state.gameKey,
        gameType: state.gameType,
        history: state.history,
        errorLog: state.errorLog
      })
    }
  )
);

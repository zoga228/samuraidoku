"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, RefreshCw, X } from "lucide-react";
import TechniqueCard from "@/components/TechniqueCard";
import SakuraBackground from "@/components/SakuraBackground";
import TechniqueSudokuImage from "@/components/TechniqueSudokuImage";
import { Technique, techniques } from "@/data/techniques";
import { techniqueInsight } from "@/lib/sudoku/techniques";
import { createTechniquePractice, TechniquePractice } from "@/lib/sudoku/techniquePractice";

export default function LearnPage() {
  const [activeTechnique, setActiveTechnique] = useState<Technique>(techniques[3]);
  const [practice, setPractice] = useState<TechniquePractice>(() => createTechniquePractice(techniques[3], "learn-initial"));
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("Select highlighted cells and mark the shared candidate.");

  const candidateOptions = useMemo(() => {
    const options = new Set<number>([practice.candidate]);
    let next = practice.candidate;

    while (options.size < 4) {
      next = (next % 9) + 1;
      options.add(next);
    }

    return [...options].sort((a, b) => a - b);
  }, [practice.candidate]);

  const resetInteraction = (nextPractice = practice) => {
    setSelectedCell(null);
    setMarks({});
    setSolutionVisible(false);
    setFeedback(`Mark all highlighted cells with candidate ${nextPractice.candidate}.`);
  };

  const openPractice = (technique: Technique) => {
    const nextPractice = createTechniquePractice(technique);
    setActiveTechnique(technique);
    setPractice(nextPractice);
    resetInteraction(nextPractice);
    setPracticeOpen(true);
  };

  const regeneratePractice = () => {
    const nextPractice = createTechniquePractice(activeTechnique);
    setPractice(nextPractice);
    resetInteraction(nextPractice);
  };

  const chooseCandidate = (candidate: number) => {
    if (!selectedCell) {
      setFeedback("Choose a cell on the board first.");
      return;
    }

    const key = `${selectedCell.row}-${selectedCell.col}`;
    const isTarget = practice.targetCells.some((cell) => cell.row === selectedCell.row && cell.col === selectedCell.col);

    if (candidate === practice.candidate && isTarget) {
      const nextMarks = { ...marks, [key]: candidate };
      const completed = practice.targetCells.every((cell) => nextMarks[`${cell.row}-${cell.col}`] === practice.candidate);

      setMarks(nextMarks);
      setSolutionVisible(completed);
      setFeedback(
        completed
          ? "Correct. All pattern cells are marked."
          : `Good. Mark ${practice.targetCells.length - Object.keys(nextMarks).length} more highlighted cell(s).`
      );
      return;
    }

    setFeedback("Not yet. Recheck the highlighted pattern and candidate list.");
    setSolutionVisible(false);
  };

  return (
    <main className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <SakuraBackground quiet />
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="text-xs uppercase text-ink-700">Practice techniques</p>
            <h1 className="font-serif text-4xl font-semibold text-ink-900 sm:text-5xl">Learn like a strategist</h1>
            <p className="mt-3 max-w-2xl text-ink-700">
              Study Sudoku patterns with compact visual cards, then open a small practice prompt with Sensei guidance.
            </p>
          </div>
          <section className="paper-panel rounded-md p-5">
            <p className="text-xs uppercase text-ink-700">Practice prompt</p>
            <h2 className="mt-1 font-serif text-3xl font-semibold">{activeTechnique.title}</h2>
            <TechniqueSudokuImage practice={practice} pattern={activeTechnique.pattern} className="mt-4" />
            <p className="mt-4 text-sm leading-6 text-ink-700">{techniqueInsight(activeTechnique.title)}</p>
            <p className="mt-3 rounded-md bg-ink-900 px-3 py-2 text-sm text-parchment-100">
              Sensei: identify the candidate that appears in the highlighted cells, then remove it from the rest of the
              house.
            </p>
            <button
              type="button"
              onClick={() => openPractice(activeTechnique)}
              className="focus-ring mt-4 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-parchment-100"
            >
              Start Practice
            </button>
          </section>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {techniques.map((technique) => (
            <TechniqueCard key={technique.title} technique={technique} onPractice={openPractice} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {practiceOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-ink-900/55 p-4 backdrop-blur-sm"
          >
            <motion.section
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              className="paper-panel max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-md p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase text-ink-700">{activeTechnique.ruTitle}</p>
                  <h2 className="font-serif text-4xl font-semibold text-ink-900">{activeTechnique.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setPracticeOpen(false)}
                  aria-label="Close practice"
                  title="Close practice"
                  className="focus-ring rounded-full border border-ink-900/15 p-2"
                >
                  <X size={18} />
                </button>
              </div>

              <TechniqueSudokuImage
                practice={practice}
                pattern={activeTechnique.pattern}
                large
                interactive
                selectedCell={selectedCell}
                marks={marks}
                onCellSelect={(cell) => {
                  setSelectedCell(cell);
                  setFeedback(`Cell R${cell.row + 1} C${cell.col + 1} selected. Choose candidate ${practice.candidate}.`);
                }}
                className="mt-5"
              />
              <p className="mt-5 text-sm leading-6 text-ink-700">{activeTechnique.description}</p>
              <p className="mt-3 rounded-md bg-parchment-50/70 p-3 text-sm leading-6 text-ink-700">
                {practice.prompt}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {candidateOptions.map((candidate) => (
                  <button
                    key={candidate}
                    type="button"
                    onClick={() => chooseCandidate(candidate)}
                    className="focus-ring rounded-md border border-ink-900/12 bg-parchment-50/70 px-4 py-3 text-center font-serif text-2xl font-semibold transition hover:bg-sakura-200/35"
                  >
                    {candidate}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={regeneratePractice}
                className="focus-ring mt-3 inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-4 py-2 text-sm font-semibold"
              >
                <RefreshCw size={16} /> New practice
              </button>

              {solutionVisible ? (
                <p className="mt-4 flex items-start gap-2 rounded-md bg-success/12 p-4 text-sm leading-6 text-success">
                  <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
                  Sensei: correct. {practice.explanation}
                </p>
              ) : (
                <p className="mt-4 rounded-md bg-ink-900 px-4 py-3 text-sm leading-6 text-parchment-100">
                  Sensei: {feedback}
                </p>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

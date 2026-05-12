"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Technique } from "@/data/techniques";
import { getDifficultyMeta } from "@/lib/sudoku/variants";
import KatanaIcon from "./KatanaIcon";
import TechniqueSudokuImage from "./TechniqueSudokuImage";
import { createTechniquePractice } from "@/lib/sudoku/techniquePractice";

export default function TechniqueCard({
  technique,
  onPractice
}: {
  technique: Technique;
  onPractice?: (technique: Technique) => void;
}) {
  const difficulty = getDifficultyMeta(technique.difficulty);
  const practice = createTechniquePractice(technique, `card-${technique.title}`);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      className="paper-panel rounded-md p-4"
    >
      <TechniqueSudokuImage practice={practice} pattern={technique.pattern} />
      <div className="mt-4">
        <p className="text-xs uppercase text-ink-700">{technique.ruTitle}</p>
        <h3 className="font-serif text-2xl font-semibold text-ink-900">{technique.title}</h3>
        <p className="mt-2 min-h-[72px] text-sm leading-6 text-ink-700">{technique.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-md border border-ink-900/10 bg-parchment-50/55 px-3 py-2">
        <span className="text-xs font-semibold uppercase text-ink-700">{difficulty.shortLabel}</span>
        <span className="flex justify-end gap-0.5" aria-label={`${difficulty.katana} katana difficulty`}>
          {Array.from({ length: difficulty.katana }, (_, index) => (
            <KatanaIcon key={index} />
          ))}
        </span>
      </div>
      {onPractice ? (
        <button
          type="button"
          onClick={() => onPractice(technique)}
          className="focus-ring mt-4 inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-parchment-100 transition hover:bg-ink-800"
        >
          Practice <ArrowRight size={16} />
        </button>
      ) : (
        <Link
          href="/learn"
          className="focus-ring mt-4 inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-parchment-100 transition hover:bg-ink-800"
        >
          Practice <ArrowRight size={16} />
        </Link>
      )}
    </motion.article>
  );
}

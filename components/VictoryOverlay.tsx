"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw, Trophy } from "lucide-react";
import { formatTime } from "@/lib/utils";

export default function VictoryOverlay({
  open,
  time,
  mistakes,
  score,
  onRestart
}: {
  open: boolean;
  time: number;
  mistakes: number;
  score?: number;
  onRestart: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] grid place-items-center bg-ink-900/55 p-4 backdrop-blur-sm"
        >
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className="paper-panel relative w-full max-w-md overflow-hidden rounded-md p-6 text-center"
          >
            {Array.from({ length: 18 }, (_, index) => (
              <motion.span
                key={index}
                initial={{ y: -40, opacity: 0, rotate: 0 }}
                animate={{ y: 260, opacity: [0, 0.85, 0], rotate: 280 }}
                transition={{ duration: 2.8, repeat: Infinity, delay: index * 0.12 }}
                className="absolute top-0 h-3 w-3 rounded-[70%_20%_70%_35%] bg-sakura-300"
                style={{ left: `${8 + ((index * 17) % 84)}%` }}
              />
            ))}
            <div className="relative">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ink-900 text-parchment-100">
                <Trophy size={30} />
              </div>
              <p className="mt-5 text-xs uppercase text-ink-700">Victory</p>
              <h2 className="font-serif text-4xl font-semibold text-ink-900">Puzzle completed</h2>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-md bg-parchment-50/70 p-3">
                  <p className="text-xs uppercase text-ink-700">Time</p>
                  <p className="font-serif text-xl font-semibold">{formatTime(time)}</p>
                </div>
                <div className="rounded-md bg-parchment-50/70 p-3">
                  <p className="text-xs uppercase text-ink-700">Errors</p>
                  <p className="font-serif text-xl font-semibold">{mistakes}</p>
                </div>
                <div className="rounded-md bg-parchment-50/70 p-3">
                  <p className="text-xs uppercase text-ink-700">Score</p>
                  <p className="font-serif text-xl font-semibold">{score ?? "Win"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onRestart}
                className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-5 py-3 font-semibold text-parchment-100"
              >
                <RefreshCw size={18} /> Start again
              </button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

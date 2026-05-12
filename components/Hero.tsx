"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import SakuraBackground from "./SakuraBackground";
import Logo from "./Logo";

export default function Hero() {
  return (
    <section className="relative isolate min-h-[calc(100vh-72px)] overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
      <SakuraBackground />
      <Image
        src="/katana.svg"
        alt=""
        width={820}
        height={128}
        className="absolute right-[-10rem] top-[16%] hidden w-[46rem] rotate-[-8deg] opacity-20 lg:block"
      />
      <Image
        src="/sakura.svg"
        alt=""
        width={240}
        height={240}
        className="absolute bottom-10 right-8 hidden w-44 opacity-35 md:block"
      />
      <div className="absolute left-5 top-14 hidden h-[72%] w-px bg-ink-900/25 md:block" aria-hidden="true" />
      <div className="absolute left-8 top-16 hidden font-serif text-7xl font-semibold text-ink-900/10 vertical-title md:block">
        SUDOKU
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-190px)] max-w-7xl items-center">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-8 inline-flex items-center gap-3 border-y border-ink-900/20 py-3 pr-5"
          >
            <Logo compact />
            <span className="text-xs uppercase text-ink-700">Japanese Samurai Sudoku Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-6xl font-semibold leading-[0.92] text-ink-900 sm:text-7xl lg:text-8xl"
          >
            Samuraidoku
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-7 max-w-2xl text-lg leading-8 text-ink-700 sm:text-xl"
          >
            Train your mind like a samurai. Solve Sudoku with focus, discipline and strategy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/play"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 font-semibold text-parchment-100 transition hover:bg-ink-800"
            >
              Start Training <ArrowRight size={18} />
            </Link>
            <Link
              href="/daily"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-ink-900/25 bg-parchment-50/50 px-6 py-3 font-semibold text-ink-900 transition hover:bg-sakura-200/40"
            >
              <CalendarDays size={18} /> Daily Challenge
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import Hero from "@/components/Hero";
import TechniqueCard from "@/components/TechniqueCard";
import { gameModes } from "@/lib/sudoku/variants";
import { techniques } from "@/data/techniques";
import { Brain, Building2, CalendarDays, GraduationCap, Medal, Sparkles } from "lucide-react";
import Link from "next/link";

const benefits = [
  { title: "AI Coach", icon: Brain, text: "Local Sensei logic explains candidates, conflicts and next steps." },
  { title: "Daily Challenge", icon: CalendarDays, text: "One seeded puzzle per day with score, time and accuracy." },
  { title: "City Leaderboards", icon: Building2, text: "Supabase-ready rankings for real cross-device results." },
  { title: "Samurai Progression", icon: Medal, text: "Difficulty is measured by three clean katana levels." },
  { title: "Practice Techniques", icon: GraduationCap, text: "Learn singles, pairs, wings and fish patterns in context." },
  { title: "Premium Identity", icon: Sparkles, text: "Parchment, ink, steel and sakura build a memorable product." }
];

export default function HomePage() {
  return (
    <main>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase text-ink-700">Game modes</p>
            <h2 className="font-serif text-4xl font-semibold text-ink-900">Choose a discipline</h2>
          </div>
          <Link href="/play" className="font-semibold text-ink-900 underline decoration-sakura-300 underline-offset-4">
            Start Training
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {gameModes.map((mode) => (
            <article key={mode.id} className="paper-panel rounded-md p-5">
              <p className="text-xs uppercase text-ink-700">{mode.accent}</p>
              <h3 className="mt-2 font-serif text-2xl font-semibold">{mode.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink-700">{mode.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-ink-900/10 bg-ink-900 py-16 text-parchment-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs uppercase text-sakura-200">Why Samuraidoku</p>
            <h2 className="font-serif text-4xl font-semibold">A puzzle habit with product depth</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <article key={benefit.title} className="rounded-md border border-parchment-100/14 p-5">
                <benefit.icon className="text-sakura-200" size={24} />
                <h3 className="mt-4 font-serif text-2xl font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-parchment-200">{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase text-ink-700">Learning preview</p>
            <h2 className="font-serif text-4xl font-semibold text-ink-900">Techniques for the path</h2>
          </div>
          <Link href="/learn" className="font-semibold text-ink-900 underline decoration-sakura-300 underline-offset-4">
            Open Learn
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {techniques.slice(3, 9).map((technique) => (
            <TechniqueCard key={technique.title} technique={technique} />
          ))}
        </div>
      </section>

    </main>
  );
}

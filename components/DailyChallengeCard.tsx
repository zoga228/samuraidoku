"use client";

import Link from "next/link";
import { CalendarDays, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { todayKey } from "@/lib/utils";

export default function DailyChallengeCard() {
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(todayKey());
  }, []);

  return (
    <article className="paper-panel rounded-md p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-ink-700">Today</p>
          <h3 className="font-serif text-2xl font-semibold text-ink-900">Daily Challenge</h3>
        </div>
        <CalendarDays className="text-sakura-500" size={28} />
      </div>
      <p className="text-sm leading-6 text-ink-700">
        One shared puzzle for {date || "today"}. Finish cleanly to earn the no-hints bonus and climb the city board.
      </p>
      <div className="mt-5 flex items-center justify-between rounded-md bg-ink-900 px-4 py-3 text-parchment-100">
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <Trophy size={17} /> 1000 base points
        </span>
        <Link href="/daily" className="rounded-full bg-parchment-100 px-3 py-1 text-sm font-semibold text-ink-900">
          Enter
        </Link>
      </div>
    </article>
  );
}

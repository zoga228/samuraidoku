"use client";

import { useEffect, useMemo, useState } from "react";
import { cities } from "@/data/cities";
import { cn } from "@/lib/utils";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";

type LeaderboardRow = {
  rank: number;
  player_name: string;
  city: string;
  time_seconds: number;
  accuracy: number;
  score: number;
};

function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const rest = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

export default function Leaderboard() {
  const [city, setCity] = useState<"All" | (typeof cities)[number]>("All");
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [status, setStatus] = useState("Leaderboard is ready for Supabase data.");
  const supabase = useMemo(() => createClient(), []);
  const configured = isSupabaseConfigured();
  const entries = useMemo(() => (city === "All" ? rows : rows.filter((entry) => entry.city === city)), [city, rows]);

  useEffect(() => {
    if (!configured || !supabase) {
      setRows([]);
      setStatus("Connect Supabase leaderboard table to show real cross-device results.");
      return;
    }

    supabase
      .from("leaderboard")
      .select("rank, player_name, city, time_seconds, accuracy, score")
      .order("score", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (error) {
          setRows([]);
          setStatus("Leaderboard table is empty or not created yet.");
        } else {
          setRows((data ?? []) as LeaderboardRow[]);
          setStatus(data?.length ? "Live leaderboard data." : "No public results yet.");
        }
      });
  }, [configured, supabase]);

  return (
    <section className="paper-panel rounded-md p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase text-ink-700">Live ranks</p>
          <h2 className="font-serif text-3xl font-semibold text-ink-900">Leaderboard</h2>
          <p className="mt-2 text-sm text-ink-700">{status}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["All", ...cities] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCity(item)}
              className={cn(
                "focus-ring rounded-full border px-3 py-1.5 text-sm font-semibold transition",
                city === item
                  ? "border-ink-900 bg-ink-900 text-parchment-100"
                  : "border-ink-900/15 bg-parchment-50/60 text-ink-800 hover:bg-sakura-200/35"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink-900/20 text-xs uppercase text-ink-700">
              <th className="py-3 pr-4">Rank</th>
              <th className="py-3 pr-4">Player</th>
              <th className="py-3 pr-4">City</th>
              <th className="py-3 pr-4">Time</th>
              <th className="py-3 pr-4">Accuracy</th>
              <th className="py-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={`${entry.player_name}-${index}`} className="border-b border-ink-900/8">
                <td className="py-4 pr-4 font-serif text-xl font-semibold">{entry.rank}</td>
                <td className="py-4 pr-4 font-semibold text-ink-900">{entry.player_name}</td>
                <td className="py-4 pr-4 text-ink-700">{entry.city}</td>
                <td className="py-4 pr-4 text-ink-700">{formatSeconds(entry.time_seconds)}</td>
                <td className="py-4 pr-4 text-success">{entry.accuracy}%</td>
                <td className="py-4 font-bold">{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {entries.length === 0 && (
          <div className="rounded-md border border-dashed border-ink-900/18 bg-parchment-50/55 p-8 text-center text-ink-700">
            No leaderboard rows yet. Real results will appear after Supabase table sync.
          </div>
        )}
      </div>
    </section>
  );
}

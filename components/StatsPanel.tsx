"use client";

import { BarChart3, Clock, Target, Trophy } from "lucide-react";
import { useStatsStore } from "@/store/statsStore";
import { formatTime } from "@/lib/utils";

export default function StatsPanel() {
  const records = useStatsStore((state) => state.records);
  const wins = records.length;
  const best = records.reduce((bestTime, record) => Math.min(bestTime, record.time), Number.POSITIVE_INFINITY);
  const averageAccuracy =
    wins === 0 ? 0 : Math.round(records.reduce((total, record) => total + record.accuracy, 0) / wins);
  const latest = records.slice(0, 4);

  return (
    <section className="paper-panel rounded-md p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-ink-700">Progress</p>
          <h2 className="font-serif text-xl font-semibold text-ink-900">Statistics</h2>
        </div>
        <BarChart3 size={20} />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-md bg-parchment-50/65 p-2">
          <Trophy className="mx-auto mb-1" size={16} />
          <p className="font-serif text-xl font-semibold">{wins}</p>
          <p className="text-[10px] uppercase text-ink-700">Wins</p>
        </div>
        <div className="rounded-md bg-parchment-50/65 p-2">
          <Clock className="mx-auto mb-1" size={16} />
          <p className="font-serif text-xl font-semibold">{Number.isFinite(best) ? formatTime(best) : "--"}</p>
          <p className="text-[10px] uppercase text-ink-700">Best</p>
        </div>
        <div className="rounded-md bg-parchment-50/65 p-2">
          <Target className="mx-auto mb-1" size={16} />
          <p className="font-serif text-xl font-semibold">{averageAccuracy}%</p>
          <p className="text-[10px] uppercase text-ink-700">Accuracy</p>
        </div>
      </div>
      <div className="mt-3 grid gap-2">
        {latest.length === 0 ? (
          <p className="rounded-md bg-parchment-50/55 p-3 text-sm text-ink-700">Finish a puzzle to save your first result.</p>
        ) : (
          latest.map((record) => (
            <div key={record.id} className="flex items-center justify-between rounded-md bg-parchment-50/55 px-3 py-2 text-sm">
              <span className="font-semibold capitalize">{record.mode}</span>
              <span className="text-ink-700">
                {formatTime(record.time)} · {record.accuracy}% · {record.mistakes} errors
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

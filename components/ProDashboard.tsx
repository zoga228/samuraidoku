"use client";

import { BarChart3, CalendarDays, Flame, Lock, Palette, Route, Sparkles, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { DailyResult } from "@/lib/dailyChallenge";
import { clamp, formatTime } from "@/lib/utils";
import { ProSkin, useThemeStore } from "@/store/themeStore";
import { useAccountStore } from "@/store/accountStore";
import { useStatsStore } from "@/store/statsStore";

const skinOptions: Array<{
  id: ProSkin;
  name: string;
  description: string;
  locked: boolean;
  swatch: string;
}> = [
  {
    id: "parchment",
    name: "Classic Parchment",
    description: "The default rice-paper training table.",
    locked: false,
    swatch: "linear-gradient(135deg, #F3EBDD, #D8CCBA)"
  },
  {
    id: "black-ink",
    name: "Black Ink Samurai",
    description: "A deep ink dojo with high-contrast cells.",
    locked: true,
    swatch: "linear-gradient(135deg, #171714, #33312C 58%, #9E2A2B)"
  },
  {
    id: "sakura-garden",
    name: "Sakura Garden",
    description: "Soft blossom panels for calm daily play.",
    locked: true,
    swatch: "linear-gradient(135deg, #F3EBDD, #E8B7B7 52%, #6B8F71)"
  },
  {
    id: "katana-steel",
    name: "Katana Steel",
    description: "Cool steel contrast with sharpened board lines.",
    locked: true,
    swatch: "linear-gradient(135deg, #D6D2C8, #777B7C 56%, #24231F)"
  }
];

type DailyHistoryRow = DailyResult & { storageKey: string };

function rankForWins(wins: number) {
  if (wins >= 50) {
    return { title: "Shogun", next: 50 };
  }

  if (wins >= 25) {
    return { title: "Master", next: 50 };
  }

  if (wins >= 10) {
    return { title: "Samurai", next: 25 };
  }

  if (wins >= 3) {
    return { title: "Ronin", next: 10 };
  }

  return { title: "Student", next: 3 };
}

export default function ProDashboard() {
  const { isPro } = useAccountStore();
  const records = useStatsStore((state) => state.records);
  const { proSkin, setProSkin } = useThemeStore();
  const [dailyHistory, setDailyHistory] = useState<DailyHistoryRow[]>([]);
  const wins = records.length;
  const dailyWins = records.filter((record) => record.gameType === "daily").length;
  const practiceWins = records.filter((record) => record.gameType === "practice").length;
  const noHintWins = records.filter((record) => record.hintsUsed === 0).length;
  const averageTime = wins ? Math.round(records.reduce((total, record) => total + record.time, 0) / wins) : 0;
  const averageAccuracy = wins ? Math.round(records.reduce((total, record) => total + record.accuracy, 0) / wins) : 0;
  const bestDailyScore = dailyHistory.reduce((best, result) => Math.max(best, result.score), 0);
  const rank = rankForWins(wins);
  const previousRankFloor = rank.title === "Student" ? 0 : rank.title === "Ronin" ? 3 : rank.title === "Samurai" ? 10 : 25;
  const rankProgress =
    rank.next === previousRankFloor
      ? 100
      : clamp(Math.round(((wins - previousRankFloor) / (rank.next - previousRankFloor)) * 100), 0, 100);
  const recentRecords = records.slice(0, 5);
  const featureStatus = useMemo(
    () => [
      { label: "Unlimited Sensei explanations", active: isPro },
      { label: "Premium board skins", active: isPro },
      { label: "Advanced statistics", active: isPro },
      { label: "Daily Challenge history", active: isPro },
      { label: "Personal progress path", active: isPro }
    ],
    [isPro]
  );

  useEffect(() => {
    const rows: DailyHistoryRow[] = [];

    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);

      if (!key?.startsWith("samuraidoku-daily-result-")) {
        continue;
      }

      try {
        const parsed = JSON.parse(window.localStorage.getItem(key) ?? "") as DailyResult;
        rows.push({ ...parsed, storageKey: key });
      } catch {
        // Ignore older or malformed local entries.
      }
    }

    rows.sort((left, right) => right.date.localeCompare(left.date));
    setDailyHistory(rows);
  }, [records]);

  const chooseSkin = (skin: ProSkin, locked: boolean) => {
    if (locked && !isPro) {
      return;
    }

    setProSkin(skin);
  };

  return (
    <section className="grid gap-4">
      <div className="paper-panel rounded-md p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase text-ink-700">Pro Control Room</p>
            <h2 className="font-serif text-3xl font-semibold text-ink-900">Premium Features</h2>
          </div>
          <Sparkles size={24} />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {featureStatus.map((feature) => (
            <div key={feature.label} className="flex items-center gap-2 rounded-md bg-parchment-50/60 px-3 py-2 text-sm font-semibold">
              {feature.active ? <Trophy size={16} className="text-success" /> : <Lock size={16} className="text-ink-700" />}
              {feature.label}
            </div>
          ))}
        </div>
      </div>

      <div className="paper-panel rounded-md p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-ink-700">Skins</p>
            <h2 className="font-serif text-3xl font-semibold text-ink-900">Board Themes</h2>
          </div>
          <Palette size={24} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {skinOptions.map((skin) => {
            const locked = skin.locked && !isPro;
            const active = proSkin === skin.id && (!skin.locked || isPro);

            return (
              <button
                key={skin.id}
                type="button"
                onClick={() => chooseSkin(skin.id, skin.locked)}
                className={`focus-ring rounded-md border p-3 text-left transition ${
                  active
                    ? "border-ink-900 bg-ink-900 text-parchment-100"
                    : "border-ink-900/12 bg-parchment-50/55 hover:bg-sakura-200/25"
                } ${locked ? "opacity-70" : ""}`}
              >
                <span className="block h-16 rounded-sm border border-ink-900/10" style={{ background: skin.swatch }} />
                <span className="mt-3 flex items-center justify-between gap-2 font-serif text-xl font-semibold">
                  {skin.name}
                  {locked && <Lock size={16} />}
                </span>
                <span className={`mt-1 block text-sm ${active ? "text-parchment-200" : "text-ink-700"}`}>
                  {skin.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="paper-panel rounded-md p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-ink-700">Advanced</p>
              <h2 className="font-serif text-3xl font-semibold text-ink-900">Statistics</h2>
            </div>
            <BarChart3 size={24} />
          </div>
          {isPro ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <StatTile label="Total wins" value={wins.toString()} />
              <StatTile label="Average time" value={wins ? formatTime(averageTime) : "--"} />
              <StatTile label="Accuracy" value={`${averageAccuracy}%`} />
              <StatTile label="No-hint wins" value={noHintWins.toString()} />
              <StatTile label="Daily wins" value={dailyWins.toString()} />
              <StatTile label="Practice wins" value={practiceWins.toString()} />
            </div>
          ) : (
            <LockedText text="Upgrade to unlock advanced performance breakdowns." />
          )}
        </div>

        <div className="paper-panel rounded-md p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-ink-700">Path</p>
              <h2 className="font-serif text-3xl font-semibold text-ink-900">Progress</h2>
            </div>
            <Route size={24} />
          </div>
          {isPro ? (
            <>
              <p className="font-serif text-4xl font-semibold text-ink-900">{rank.title}</p>
              <p className="mt-2 text-sm text-ink-700">
                {rank.title === "Shogun" ? "Highest rank reached." : `${rank.next - wins} more wins to the next rank.`}
              </p>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-parchment-50/70">
                <div className="h-full rounded-full bg-success" style={{ width: `${rankProgress}%` }} />
              </div>
              <div className="mt-4 grid gap-2">
                {recentRecords.length ? (
                  recentRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between rounded-md bg-parchment-50/55 px-3 py-2 text-sm">
                      <span className="font-semibold capitalize">{record.gameType}</span>
                      <span className="text-ink-700">{formatTime(record.time)} - {record.accuracy}%</span>
                    </div>
                  ))
                ) : (
                  <p className="rounded-md bg-parchment-50/55 p-3 text-sm text-ink-700">Finish a puzzle to start the path.</p>
                )}
              </div>
            </>
          ) : (
            <LockedText text="Upgrade to unlock the samurai progress path." />
          )}
        </div>
      </div>

      <div className="paper-panel rounded-md p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-ink-700">Archive</p>
            <h2 className="font-serif text-3xl font-semibold text-ink-900">Daily History</h2>
          </div>
          <CalendarDays size={24} />
        </div>
        {isPro ? (
          <div className="grid gap-2">
            <StatTile label="Best daily score" value={bestDailyScore ? bestDailyScore.toString() : "--"} icon={<Flame size={16} />} />
            {dailyHistory.length ? (
              dailyHistory.slice(0, 8).map((result) => (
                <div key={result.storageKey} className="grid gap-2 rounded-md bg-parchment-50/55 px-3 py-2 text-sm sm:grid-cols-5">
                  <span className="font-semibold">{result.date}</span>
                  <span>{formatTime(result.time)}</span>
                  <span>{result.accuracy}%</span>
                  <span>{result.mistakes} errors</span>
                  <span className="font-semibold">{result.score} pts</span>
                </div>
              ))
            ) : (
              <p className="rounded-md bg-parchment-50/55 p-3 text-sm text-ink-700">
                Complete a Daily Challenge to save the first archive entry.
              </p>
            )}
          </div>
        ) : (
          <LockedText text="Upgrade to keep a visible Daily Challenge archive." />
        )}
      </div>
    </section>
  );
}

function StatTile({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="rounded-md bg-parchment-50/60 p-3">
      <div className="flex items-center gap-2 text-xs uppercase text-ink-700">
        {icon}
        {label}
      </div>
      <p className="mt-1 font-serif text-2xl font-semibold text-ink-900">{value}</p>
    </div>
  );
}

function LockedText({ text }: { text: string }) {
  return (
    <p className="flex items-start gap-2 rounded-md bg-parchment-50/60 p-4 text-sm leading-6 text-ink-700">
      <Lock className="mt-0.5 shrink-0" size={18} />
      {text}
    </p>
  );
}

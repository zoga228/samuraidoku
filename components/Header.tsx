"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, ChevronDown, Flame, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { cn, todayKey } from "@/lib/utils";
import { gameModes } from "@/lib/sudoku/variants";
import { useGameStore } from "@/store/gameStore";
import { useAccountStore } from "@/store/accountStore";
import { ThemeToggle } from "./ThemeController";

const navItems = [
  { href: "/play", label: "Play" },
  { href: "/duel", label: "1v1" },
  { href: "/daily", label: "Daily" },
  { href: "/learn", label: "Learn" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/pro", label: "Pro" },
  { href: "/admin", label: "Admin" },
  { href: "/login", label: "Login" }
];

function dateKey(date: Date) {
  return todayKey(date);
}

function DailyStreakLink({ onClick }: { onClick?: () => void }) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const refresh = () => {
      let count = 0;
      const cursor = new Date();

      while (window.localStorage.getItem(`samuraidoku-daily-result-${dateKey(cursor)}`)) {
        count += 1;
        cursor.setDate(cursor.getDate() - 1);
      }

      setStreak(count);
    };

    refresh();
    const interval = window.setInterval(refresh, 3000);
    window.addEventListener("storage", refresh);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <Link
      href="/daily"
      onClick={onClick}
      className="focus-ring hidden items-center gap-2 rounded-full border border-ink-900/15 bg-parchment-50/70 px-3 py-2 text-xs font-semibold text-ink-800 transition hover:bg-sakura-200/35 sm:inline-flex"
    >
      <CalendarDays size={16} />
      Daily Challenge
      <span className="inline-flex items-center gap-0.5 rounded-full bg-ink-900 px-2 py-1 text-parchment-100">
        {Array.from({ length: Math.min(3, Math.max(1, streak || 1)) }, (_, index) => (
          <Flame key={index} size={12} className={streak ? "text-sakura-200" : "text-steel-200"} />
        ))}
        <span className="ml-1">{streak}</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);
  const { mode, difficulty, startNewGame } = useGameStore();
  const { email, isPro } = useAccountStore();
  const activeMode = gameModes.find((item) => item.id === mode) ?? gameModes[0];

  const chooseMode = (nextMode: typeof mode) => {
    startNewGame(nextMode, difficulty, undefined, "play");
    setModeOpen(false);
    setOpen(false);

    if (pathname !== "/play") {
      router.push("/play");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink-900/10 bg-parchment-100/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="focus-ring rounded-md" onClick={() => setOpen(false)}>
            <Logo />
          </Link>
          <DailyStreakLink onClick={() => setOpen(false)} />
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => setModeOpen((value) => !value)}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-parchment-50/60 px-4 py-2 text-sm font-semibold text-ink-800 transition hover:bg-sakura-200/35"
            >
              {activeMode.title.replace(" Sudoku", "")}
              <ChevronDown size={16} className={cn("transition", modeOpen && "rotate-180")} />
            </button>
            {modeOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-md border border-ink-900/15 bg-parchment-100 p-2 shadow-ink">
                {gameModes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => chooseMode(item.id)}
                    className={cn(
                      "focus-ring w-full rounded-md px-3 py-2 text-left transition hover:bg-sakura-200/35",
                      mode === item.id && "bg-ink-900 text-parchment-100 hover:bg-ink-900"
                    )}
                  >
                    <span className="block text-sm font-semibold">{item.title}</span>
                    <span className={cn("mt-0.5 block text-xs", mode === item.id ? "text-parchment-200" : "text-ink-700")}>
                      {item.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {navItems.map((item) => {
            if (item.href === "/login" && email) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="focus-ring rounded-full border border-ink-900/15 bg-parchment-50/60 px-4 py-2 text-sm font-semibold text-ink-800 transition hover:bg-sakura-200/35"
                >
                  {isPro ? "Pro" : "Account"}
                </Link>
              );
            }

            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-ink-700 transition hover:bg-sakura-200/35 hover:text-ink-900 focus-ring",
                  active && "bg-ink-900 text-parchment-100 hover:bg-ink-900 hover:text-parchment-100"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:block">
          <ThemeToggle />
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          title="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
          className="focus-ring rounded-full border border-ink-900/15 p-2 text-ink-900 md:hidden"
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-ink-900/10 px-4 pb-4 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-2 pt-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-ink-800",
                  pathname === item.href && "bg-ink-900 text-parchment-100"
                )}
              >
                {item.label}
              </Link>
            ))}
            <DailyStreakLink onClick={() => setOpen(false)} />
            <ThemeToggle />
            <div className="mt-2 rounded-md border border-ink-900/12 p-2">
              <p className="px-2 pb-2 text-xs uppercase text-ink-700">Mode</p>
              {gameModes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseMode(item.id)}
                  className={cn(
                    "focus-ring mb-1 w-full rounded-md px-3 py-2 text-left text-sm font-medium text-ink-800",
                    mode === item.id && "bg-ink-900 text-parchment-100"
                  )}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

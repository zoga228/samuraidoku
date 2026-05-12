"use client";

import { Brain, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { getCandidates } from "@/lib/sudoku/solver";
import { getBlockValues, getColumnValues, getRowValues } from "@/lib/sudoku/validator";
import { useAccountStore } from "@/store/accountStore";

export default function AICoachPanel() {
  const { mode, selectedCell, userGrid, coachMessage } = useGameStore();
  const { isPro } = useAccountStore();
  const [aiMessage, setAiMessage] = useState("Select a cell, then ask Sensei for a guided explanation.");
  const [source, setSource] = useState<"openai" | "local">("local");
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [asked, setAsked] = useState(false);
  const { candidates, rowValues, columnValues, blockValues } = useMemo(() => {
    if (!selectedCell) {
      return {
        candidates: [] as number[],
        rowValues: [] as number[],
        columnValues: [] as number[],
        blockValues: [] as number[]
      };
    }

    return {
      candidates: getCandidates(userGrid, selectedCell.row, selectedCell.col, mode),
      rowValues: getRowValues(userGrid, selectedCell.row),
      columnValues: getColumnValues(userGrid, selectedCell.col),
      blockValues: getBlockValues(userGrid, selectedCell.row, selectedCell.col, mode)
    };
  }, [mode, selectedCell, userGrid]);
  const requestKey = useMemo(() => {
    if (!selectedCell) {
      return "";
    }

    return JSON.stringify({
      mode,
      selectedCell,
      value: userGrid[selectedCell.row][selectedCell.col],
      candidates,
      rowValues,
      columnValues,
      blockValues,
      localMessage: coachMessage
    });
  }, [blockValues, candidates, coachMessage, columnValues, mode, rowValues, selectedCell, userGrid]);

  useEffect(() => {
    setAsked(false);
    setAiMessage(selectedCell ? "Cell selected. Ask Sensei when you want a hint." : "Select a cell, then ask Sensei.");
    setSource("local");
    setLoading(false);
  }, [selectedCell]);

  const askSensei = () => {
    if (!selectedCell || !requestKey || !isPro) {
      return;
    }

    setLoading(true);
    setAsked(true);

    fetch("/api/coach", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: requestKey
    })
      .then((response) => response.json())
      .then((data: { message?: string; source?: "openai" | "local"; configured?: boolean }) => {
        if (data.message) {
          setAiMessage(data.message);
        }

        setSource(data.source ?? "local");
        setConfigured(Boolean(data.configured));
      })
      .catch(() => {
        setAiMessage(coachMessage);
        setSource("local");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const status = loading
    ? "Calling Sensei"
    : source === "openai"
      ? "OpenAI Sensei"
      : configured
        ? "Local fallback"
        : "Local Sensei";

  return (
    <section className="paper-panel rounded-md p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-semibold text-ink-900">Sensei AI Coach</h2>
          <p className="text-xs uppercase text-ink-700">{status}</p>
        </div>
        <div className="rounded-full bg-ink-900 p-2 text-parchment-100">
          <Brain size={20} />
        </div>
      </div>

      {!isPro ? (
        <div className="rounded-md border border-ink-900/10 bg-parchment-50/70 p-4">
          <p className="flex items-start gap-2 text-sm leading-6 text-ink-800">
            <Lock className="mt-0.5 shrink-0" size={18} />
            Sensei AI Coach is a Pro feature. Upgrade to ask for logic explanations during training.
          </p>
          <Link
            href="/pro"
            className="focus-ring mt-4 inline-flex rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-parchment-100"
          >
            Unlock Pro
          </Link>
        </div>
      ) : (
        <>
          <p className="rounded-md border border-ink-900/10 bg-parchment-50/70 p-3 text-sm leading-6 text-ink-800">
            {aiMessage}
          </p>
          <button
            type="button"
            disabled={!selectedCell || loading}
            onClick={askSensei}
            className="focus-ring mt-3 w-full rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-parchment-100 transition disabled:cursor-not-allowed disabled:opacity-55"
          >
            {loading ? "Sensei is thinking..." : "Ask Sensei"}
          </button>
        </>
      )}

      {isPro && selectedCell && asked && (
        <div className="mt-4 grid gap-3 text-sm">
          <div className="flex items-center gap-2 text-ink-800">
            <Sparkles size={16} className="text-sakura-500" />
            Cell R{selectedCell.row + 1} C{selectedCell.col + 1}
            <span className="text-ink-700">Read the houses first</span>
          </div>
          <div>
            <p className="mb-2 text-xs uppercase text-ink-700">Possible numbers</p>
            <div className="flex flex-wrap gap-1.5">
              {(candidates.length ? candidates : ["-"]).map((candidate) => (
                <span
                  key={candidate}
                  className="rounded-full border border-ink-900/10 bg-sakura-200/25 px-2 py-1 text-xs font-semibold"
                >
                  {candidate}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-ink-700">
            <span className="rounded-md bg-parchment-50/60 p-2">Row: {rowValues.join(", ") || "empty"}</span>
            <span className="rounded-md bg-parchment-50/60 p-2">Col: {columnValues.join(", ") || "empty"}</span>
            <span className="rounded-md bg-parchment-50/60 p-2">Box: {blockValues.join(", ") || "empty"}</span>
          </div>
        </div>
      )}
    </section>
  );
}

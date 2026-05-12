"use client";

import Link from "next/link";
import { CreditCard, Database, Shield, Users } from "lucide-react";
import SakuraBackground from "@/components/SakuraBackground";
import { isSupabaseConfigured } from "@/utils/supabase/client";
import { useStatsStore } from "@/store/statsStore";

const launchChecks = [
  "Supabase Auth and SSR middleware configured",
  "Profiles table prepared for cross-device people search",
  "Duel room table prepared for code-based 1v1 races",
  "Leaderboard reads live Supabase data only",
  "Stripe Checkout route prepared for Pro subscriptions",
  "Local stats and progress persisted in browser",
  "Deployment scripts ready for Vercel or hosted Node"
];

export default function AdminPage() {
  const records = useStatsStore((state) => state.records);
  const supabaseReady = isSupabaseConfigured();

  return (
    <main className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <SakuraBackground quiet />
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase text-ink-700">Operations</p>
            <h1 className="font-serif text-5xl font-semibold text-ink-900">Admin Panel</h1>
            <p className="mt-3 max-w-2xl text-ink-700">
              Launch checklist, database readiness, payments and local activity overview for Samuraidoku.
            </p>
          </div>
          <Link
            href="/login"
            className="focus-ring rounded-full bg-ink-900 px-5 py-3 text-center font-semibold text-parchment-100"
          >
            Open Profile
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <section className="paper-panel rounded-md p-5">
            <Shield size={24} />
            <p className="mt-4 text-xs uppercase text-ink-700">Auth</p>
            <h2 className="font-serif text-3xl font-semibold">{supabaseReady ? "Ready" : "Env missing"}</h2>
          </section>
          <section className="paper-panel rounded-md p-5">
            <Users size={24} />
            <p className="mt-4 text-xs uppercase text-ink-700">Local completions</p>
            <h2 className="font-serif text-3xl font-semibold">{records.length}</h2>
          </section>
          <section className="paper-panel rounded-md p-5">
            <Database size={24} />
            <p className="mt-4 text-xs uppercase text-ink-700">Database</p>
            <h2 className="font-serif text-3xl font-semibold">Schema ready</h2>
          </section>
          <section className="paper-panel rounded-md p-5">
            <CreditCard size={24} />
            <p className="mt-4 text-xs uppercase text-ink-700">Payments</p>
            <h2 className="font-serif text-3xl font-semibold">Stripe route</h2>
          </section>
        </div>

        <section className="paper-panel mt-6 rounded-md p-5">
          <p className="text-xs uppercase text-ink-700">Launch checklist</p>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {launchChecks.map((check) => (
              <div key={check} className="rounded-md bg-parchment-50/60 px-3 py-2 text-sm font-semibold text-ink-800">
                {check}
              </div>
            ))}
          </div>
        </section>

        <section className="paper-panel mt-6 rounded-md p-5">
          <p className="text-xs uppercase text-ink-700">Required before public launch</p>
          <ol className="mt-4 grid gap-2 text-sm text-ink-700">
            <li>1. Apply `supabase/schema.sql` in Supabase SQL editor.</li>
            <li>2. Add Stripe keys and a real recurring price id.</li>
            <li>3. Deploy on Vercel and set production env variables.</li>
            <li>4. Replace local Pro activation with webhook-confirmed subscription status.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}

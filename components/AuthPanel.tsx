"use client";

import { useEffect, useMemo, useState } from "react";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";
import { useAccountStore } from "@/store/accountStore";

async function upsertProfile(supabase: NonNullable<ReturnType<typeof createClient>>, email: string, userId?: string) {
  const username = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 24);

  if (!userId) {
    return;
  }

  await supabase.from("profiles").upsert({
    id: userId,
    username,
    display_name: username,
    city: null,
    rating: 1000,
    updated_at: new Date().toISOString()
  });
}

export default function AuthPanel() {
  const supabase = useMemo(() => createClient(), []);
  const configured = isSupabaseConfigured();
  const { email: accountEmail, provider, isPro, setAccount, signOutLocal } = useAccountStore();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const sessionEmail = data.session?.user.email;
      if (sessionEmail) {
        setAccount(sessionEmail, "supabase");
        upsertProfile(supabase, sessionEmail, data.session?.user.id);
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionEmail = session?.user.email;
      if (sessionEmail) {
        setAccount(sessionEmail, "supabase");
        upsertProfile(supabase, sessionEmail, session?.user.id);
      } else {
        signOutLocal();
      }
    });

    return () => subscription.unsubscribe();
  }, [setAccount, signOutLocal, supabase]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (!configured || !supabase) {
      setAccount(email || "demo@samuraidoku.local", "demo");
      setMessage("Demo session started. Add Supabase env variables for real auth.");
      setLoading(false);
      return;
    }

    const response =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (response.error) {
      setMessage(response.error.message);
    } else {
      const sessionEmail = response.data.user?.email ?? email;
      setAccount(sessionEmail, "supabase");
      await upsertProfile(supabase, sessionEmail, response.data.user?.id);
      setMessage(mode === "login" ? "Signed in." : "Account created. Check email confirmation if enabled.");
    }

    setLoading(false);
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut({ scope: "local" });
    }
    signOutLocal();
  };

  if (accountEmail) {
    return (
      <section className="paper-panel rounded-md p-5">
        <p className="text-xs uppercase text-ink-700">Account</p>
        <h2 className="mt-1 font-serif text-3xl font-semibold text-ink-900">{accountEmail}</h2>
        <div className="mt-4 grid gap-2 text-sm text-ink-700">
          <p>Provider: {provider === "supabase" ? "Supabase Auth" : "Demo session"}</p>
          <p>Subscription: {isPro ? "Samuraidoku Pro active" : "Free plan"}</p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="focus-ring mt-5 inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-3 font-semibold text-parchment-100"
        >
          <LogOut size={18} /> Sign out
        </button>
      </section>
    );
  }

  return (
    <section className="paper-panel rounded-md p-5">
      <p className="text-xs uppercase text-ink-700">{configured ? "Supabase Auth" : "Demo auth"}</p>
      <h2 className="mt-1 font-serif text-3xl font-semibold text-ink-900">
        {mode === "login" ? "Log in" : "Create account"}
      </h2>
      <form onSubmit={submit} className="mt-5 grid gap-3">
        <label className="grid gap-1 text-sm font-semibold text-ink-800">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="focus-ring rounded-md border border-ink-900/15 bg-parchment-50/70 px-3 py-3 font-normal"
            placeholder="you@example.com"
          />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-ink-800">
          Password
          <input
            type="password"
            required={configured}
            minLength={configured ? 6 : undefined}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="focus-ring rounded-md border border-ink-900/15 bg-parchment-50/70 px-3 py-3 font-normal"
            placeholder={configured ? "At least 6 characters" : "optional in demo mode"}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="focus-ring mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-5 py-3 font-semibold text-parchment-100 disabled:opacity-60"
        >
          {mode === "login" ? <LogIn size={18} /> : <UserPlus size={18} />}
          {loading ? "Working..." : mode === "login" ? "Log in" : "Sign up"}
        </button>
      </form>
      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="focus-ring mt-4 rounded-full border border-ink-900/15 px-4 py-2 text-sm font-semibold"
      >
        {mode === "login" ? "Create account" : "I already have an account"}
      </button>
      {message && <p className="mt-4 rounded-md bg-sakura-200/25 p-3 text-sm text-ink-800">{message}</p>}
      {!configured && (
        <p className="mt-4 text-xs leading-5 text-ink-700">
          Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to enable real Supabase login.
        </p>
      )}
    </section>
  );
}

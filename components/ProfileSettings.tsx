"use client";

import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cities } from "@/data/cities";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";

type ProfileRow = {
  username: string | null;
  display_name: string | null;
  city: string | null;
};

export default function ProfileSettings() {
  const supabase = useMemo(() => createClient(), []);
  const configured = isSupabaseConfigured();
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("Set a public name and city so other players can find you.");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!configured || !supabase) {
      setMessage("Connect Supabase to edit a public profile.");
      return;
    }

    supabase.auth.getUser().then(async ({ data }) => {
      const id = data.user?.id;
      if (!id) {
        setUserId(null);
        setMessage("Log in to edit your public player profile.");
        return;
      }

      setUserId(id);
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, display_name, city")
        .eq("id", id)
        .maybeSingle();

      const row = profile as ProfileRow | null;
      setUsername(row?.username ?? "");
      setDisplayName(row?.display_name ?? "");
      setCity(row?.city ?? "");
    });
  }, [configured, supabase]);

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!configured || !supabase || !userId) {
      setMessage("Log in with Supabase before saving a public profile.");
      return;
    }

    setLoading(true);
    const cleanUsername = username.trim().replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 24);
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      username: cleanUsername,
      display_name: displayName.trim().slice(0, 40) || cleanUsername,
      city: city || null,
      updated_at: new Date().toISOString()
    });

    setMessage(error ? error.message : "Profile saved. Other devices can now find this player.");
    setLoading(false);
  };

  return (
    <section className="paper-panel rounded-md p-5">
      <p className="text-xs uppercase text-ink-700">Public Profile</p>
      <h2 className="mt-1 font-serif text-3xl font-semibold text-ink-900">Search Identity</h2>
      <form onSubmit={save} className="mt-5 grid gap-3">
        <label className="grid gap-1 text-sm font-semibold text-ink-800">
          Username
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="focus-ring rounded-md border border-ink-900/15 bg-parchment-50/70 px-3 py-3 font-normal"
            placeholder="NomadSamurai"
          />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-ink-800">
          Display name
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="focus-ring rounded-md border border-ink-900/15 bg-parchment-50/70 px-3 py-3 font-normal"
            placeholder="Ayan"
          />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-ink-800">
          City
          <select
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="focus-ring rounded-md border border-ink-900/15 bg-parchment-50/70 px-3 py-3 font-normal"
          >
            <option value="">No city</option>
            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-5 py-3 font-semibold text-parchment-100 disabled:opacity-60"
        >
          <Save size={18} /> {loading ? "Saving..." : "Save profile"}
        </button>
      </form>
      <p className="mt-4 text-sm text-ink-700">{message}</p>
    </section>
  );
}

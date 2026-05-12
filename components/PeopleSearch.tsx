"use client";

import { Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";

type ProfileRow = {
  id: string;
  username: string | null;
  display_name: string | null;
  city: string | null;
  rating: number | null;
};

export default function PeopleSearch() {
  const supabase = useMemo(() => createClient(), []);
  const configured = isSupabaseConfigured();
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [message, setMessage] = useState("Search players by username, name or city.");
  const [loading, setLoading] = useState(false);

  const search = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!configured || !supabase) {
      setProfiles([]);
      setMessage("Connect Supabase `profiles` table to search players across devices.");
      return;
    }

    setLoading(true);
    const term = `%${query.trim()}%`;
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, display_name, city, rating")
      .or(`username.ilike.${term},display_name.ilike.${term},city.ilike.${term}`)
      .limit(12);

    if (error) {
      setProfiles([]);
      setMessage("Profiles table is not ready yet. Apply the SQL schema from README.");
    } else {
      setProfiles((data ?? []) as ProfileRow[]);
      setMessage(data?.length ? "Players found." : "No players found yet.");
    }

    setLoading(false);
  };

  return (
    <section className="paper-panel rounded-md p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-ink-700">Community</p>
          <h2 className="font-serif text-3xl font-semibold text-ink-900">Find Players</h2>
        </div>
        <Users size={24} />
      </div>
      <form onSubmit={search} className="flex gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="focus-ring min-w-0 flex-1 rounded-md border border-ink-900/15 bg-parchment-50/70 px-3 py-3"
          placeholder="Search username, name, city"
        />
        <button
          type="submit"
          disabled={loading}
          className="focus-ring inline-grid w-12 place-items-center rounded-md bg-ink-900 text-parchment-100 disabled:opacity-60"
          aria-label="Search players"
        >
          <Search size={18} />
        </button>
      </form>
      <p className="mt-3 text-sm text-ink-700">{loading ? "Searching..." : message}</p>
      <div className="mt-4 grid gap-2">
        {profiles.map((profile) => (
          <div key={profile.id} className="rounded-md border border-ink-900/10 bg-parchment-50/60 px-3 py-2">
            <p className="font-semibold text-ink-900">{profile.display_name || profile.username || "Unnamed player"}</p>
            <p className="text-sm text-ink-700">
              @{profile.username || "player"} - {profile.city || "No city"} - {profile.rating ?? 1000} rating
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

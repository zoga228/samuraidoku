import Leaderboard from "@/components/Leaderboard";
import SakuraBackground from "@/components/SakuraBackground";

export default function LeaderboardPage() {
  return (
    <main className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <SakuraBackground quiet />
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-xs uppercase text-ink-700">Rankings</p>
          <h1 className="font-serif text-4xl font-semibold text-ink-900 sm:text-5xl">City Leaderboards</h1>
          <p className="mt-3 max-w-2xl text-ink-700">
            Live public results from Supabase. New rows appear here after real players submit finished games.
          </p>
        </div>
        <Leaderboard />
      </div>
    </main>
  );
}

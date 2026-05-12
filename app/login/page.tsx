import AuthPanel from "@/components/AuthPanel";
import PeopleSearch from "@/components/PeopleSearch";
import ProfileSettings from "@/components/ProfileSettings";
import SakuraBackground from "@/components/SakuraBackground";
import StatsPanel from "@/components/StatsPanel";

export default function LoginPage() {
  return (
    <main className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <SakuraBackground quiet />
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-xs uppercase text-ink-700">Account</p>
          <h1 className="font-serif text-5xl font-semibold leading-none text-ink-900 sm:text-6xl">Player Profile</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-ink-700">
            Login connects progress, Pro access, statistics and player search across devices.
          </p>
        </div>
        <div className="grid gap-4">
          <AuthPanel />
          <ProfileSettings />
          <StatsPanel />
          <PeopleSearch />
        </div>
      </div>
    </main>
  );
}

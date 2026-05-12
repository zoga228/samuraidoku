import ProDashboard from "@/components/ProDashboard";
import ProUpgradeCard from "@/components/ProUpgradeCard";
import SakuraBackground from "@/components/SakuraBackground";

export default function ProPage() {
  return (
    <main className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <SakuraBackground quiet />
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="grid gap-6">
          <p className="text-xs uppercase text-ink-700">Samuraidoku Pro</p>
          <div>
            <h1 className="font-serif text-5xl font-semibold leading-none text-ink-900 sm:text-6xl">Premium training</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink-700">
              Pro turns Samuraidoku into a personal training room: premium skins, deeper progress, Daily archive and
              unlimited Sensei explanations.
            </p>
          </div>
        </div>
        <div className="grid gap-4">
          <ProUpgradeCard large />
          <ProDashboard />
        </div>
      </div>
    </main>
  );
}

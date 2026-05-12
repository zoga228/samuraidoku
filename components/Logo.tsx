import { cn } from "@/lib/utils";

export default function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)} aria-label="Samuraidoku logo">
      <svg
        width="44"
        height="44"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        role="img"
        aria-hidden="true"
      >
        <rect x="5" y="5" width="54" height="54" rx="4" fill="#F3EBDD" stroke="#24231F" strokeWidth="2" />
        <path
          d="M20 8C19 20 21 35 19 57"
          stroke="#24231F"
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        <path
          d="M42 7C40 22 44 34 42 58"
          stroke="#24231F"
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        <path
          d="M8 20C24 18 38 22 57 20"
          stroke="#24231F"
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        <path
          d="M7 43C23 41 39 45 58 42"
          stroke="#24231F"
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        <path d="M17 9L22 17M40 6L45 15M7 41L16 45M49 18L58 21" stroke="#DFA6A6" strokeWidth="1.4" />
      </svg>
      {!compact && (
        <div className="leading-none">
          <span className="block font-serif text-2xl font-semibold text-ink-900">Samuraidoku</span>
          <span className="mt-1 block text-[10px] uppercase text-ink-700">Mind of the blade</span>
        </div>
      )}
    </div>
  );
}

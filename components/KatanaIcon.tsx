import { cn } from "@/lib/utils";

export default function KatanaIcon({ active = false, className }: { active?: boolean; className?: string }) {
  return (
    <span className={cn("inline-grid h-8 w-5 place-items-center overflow-visible", className)} aria-hidden="true">
      <svg
        viewBox="0 0 72 24"
        className="-rotate-[60deg] overflow-visible drop-shadow-sm"
        width="30"
        height="18"
        role="img"
      >
        <path
          d="M6 11.5C21 9.2 39 8.7 59 10.2L69 12L59 13.8C39 15.3 21 14.8 6 12.5V11.5Z"
          fill={active ? "#F3EBDD" : "#D6D2C8"}
          stroke={active ? "#F3EBDD" : "#24231F"}
          strokeWidth="1.4"
        />
        <path d="M5 12L13 6L11 12L13 18L5 12Z" fill={active ? "#E8B7B7" : "#24231F"} />
        <rect x="18" y="6" width="3" height="12" rx="1" fill={active ? "#E8B7B7" : "#24231F"} />
        <path
          d="M2 12H18"
          stroke={active ? "#F3EBDD" : "#24231F"}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M6 8L10 16M11 8L15 16" stroke={active ? "#24231F" : "#F3EBDD"} strokeWidth="1.6" />
      </svg>
    </span>
  );
}

"use client";

import { cn } from "@/lib/utils";

const petals = [
  { left: "7%", delay: "-2s", duration: "18s", drift: "16vw", size: "13px" },
  { left: "17%", delay: "-8s", duration: "22s", drift: "-12vw", size: "9px" },
  { left: "31%", delay: "-4s", duration: "20s", drift: "10vw", size: "12px" },
  { left: "48%", delay: "-12s", duration: "24s", drift: "-18vw", size: "10px" },
  { left: "61%", delay: "-5s", duration: "19s", drift: "12vw", size: "14px" },
  { left: "73%", delay: "-11s", duration: "23s", drift: "-10vw", size: "8px" },
  { left: "88%", delay: "-7s", duration: "21s", drift: "9vw", size: "11px" },
  { left: "94%", delay: "-14s", duration: "25s", drift: "-14vw", size: "13px" }
];

export default function SakuraBackground({ quiet = false }: { quiet?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {petals.slice(0, quiet ? 4 : petals.length).map((petal, index) => (
        <span
          key={`${petal.left}-${index}`}
          className={cn(
            "absolute top-0 block animate-floatDown rounded-full bg-sakura-300",
            quiet ? "opacity-20" : "opacity-40"
          )}
          style={
            {
              left: petal.left,
              width: petal.size,
              height: petal.size,
              borderRadius: "70% 20% 70% 35%",
              animationDelay: petal.delay,
              "--petal-duration": petal.duration,
              "--petal-drift": petal.drift
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

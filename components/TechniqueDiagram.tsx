import { Technique } from "@/data/techniques";
import { cn } from "@/lib/utils";

const configs: Record<
  Technique["pattern"],
  {
    highlights: Array<[number, number]>;
    pinkDots: Array<[number, number]>;
    blueDots: Array<[number, number]>;
    lines: Array<{ from: [number, number]; to: [number, number]; color: string }>;
  }
> = {
  single: {
    highlights: [[2, 2]],
    pinkDots: [[2, 2]],
    blueDots: [
      [0, 2],
      [2, 0],
      [4, 2],
      [2, 4]
    ],
    lines: [{ from: [0, 2], to: [4, 2], color: "#9E2A2B" }]
  },
  pair: {
    highlights: [
      [1, 1],
      [1, 4]
    ],
    pinkDots: [
      [1, 1],
      [1, 4]
    ],
    blueDots: [
      [1, 2],
      [1, 3],
      [4, 1]
    ],
    lines: [{ from: [1, 1], to: [1, 4], color: "#DFA6A6" }]
  },
  triple: {
    highlights: [
      [1, 0],
      [2, 0],
      [3, 0]
    ],
    pinkDots: [
      [1, 0],
      [2, 0],
      [3, 0]
    ],
    blueDots: [
      [0, 3],
      [4, 4],
      [2, 5]
    ],
    lines: [{ from: [1, 0], to: [3, 0], color: "#DFA6A6" }]
  },
  line: {
    highlights: [
      [2, 1],
      [2, 2],
      [2, 3]
    ],
    pinkDots: [
      [2, 1],
      [2, 2],
      [2, 3]
    ],
    blueDots: [
      [0, 2],
      [4, 2],
      [5, 2]
    ],
    lines: [{ from: [2, 0], to: [2, 5], color: "#6B8F71" }]
  },
  fish: {
    highlights: [
      [1, 1],
      [1, 4],
      [4, 1],
      [4, 4]
    ],
    pinkDots: [
      [1, 1],
      [1, 4],
      [4, 1],
      [4, 4]
    ],
    blueDots: [
      [1, 2],
      [4, 2],
      [0, 4]
    ],
    lines: [
      { from: [1, 1], to: [1, 4], color: "#315C8B" },
      { from: [4, 1], to: [4, 4], color: "#315C8B" },
      { from: [1, 1], to: [4, 4], color: "#9E2A2B" },
      { from: [1, 4], to: [4, 1], color: "#DFA6A6" }
    ]
  },
  wing: {
    highlights: [
      [1, 2],
      [3, 1],
      [3, 4]
    ],
    pinkDots: [
      [1, 2],
      [3, 1],
      [3, 4]
    ],
    blueDots: [
      [2, 2],
      [4, 2],
      [2, 4]
    ],
    lines: [
      { from: [1, 2], to: [3, 1], color: "#315C8B" },
      { from: [1, 2], to: [3, 4], color: "#315C8B" },
      { from: [3, 1], to: [3, 4], color: "#9E2A2B" }
    ]
  }
};

function center(row: number, col: number) {
  return {
    x: 42 + col * 44 + 22,
    y: 24 + row * 24 + 12
  };
}

export default function TechniqueDiagram({
  pattern,
  large = false,
  className
}: {
  pattern: Technique["pattern"];
  large?: boolean;
  className?: string;
}) {
  const config = configs[pattern];
  const cells = Array.from({ length: 36 }, (_, index) => ({
    row: Math.floor(index / 6),
    col: index % 6
  }));

  return (
    <svg
      viewBox="0 0 360 190"
      className={cn(
        "aspect-[1.9] w-full rounded-md border border-ink-900/10 bg-steel-100/45",
        large && "aspect-[1.65]",
        className
      )}
      role="img"
      aria-label={`${pattern} Sudoku technique diagram`}
    >
      <rect width="360" height="190" fill="#D6D2C8" opacity="0.42" />
      <rect x="40" y="22" width="264" height="144" rx="6" fill="#F3EBDD" stroke="#24231F" strokeOpacity="0.28" />
      {cells.map(({ row, col }) => {
        const highlighted = config.highlights.some(([r, c]) => r === row && c === col);
        return (
          <rect
            key={`${row}-${col}`}
            x={42 + col * 44}
            y={24 + row * 24}
            width="44"
            height="24"
            fill={highlighted ? "#E8B7B7" : "#F7F0E6"}
            stroke="#24231F"
            strokeOpacity={highlighted ? 0.42 : 0.12}
          />
        );
      })}
      {[0, 2, 4, 6].map((index) => (
        <line
          key={`v-${index}`}
          x1={42 + index * 44}
          y1="24"
          x2={42 + index * 44}
          y2="168"
          stroke="#24231F"
          strokeOpacity={index % 2 === 0 ? 0.4 : 0.16}
          strokeWidth={index % 2 === 0 ? 2 : 1}
        />
      ))}
      {[0, 3, 6].map((index) => (
        <line
          key={`h-${index}`}
          x1="42"
          y1={24 + index * 24}
          x2="306"
          y2={24 + index * 24}
          stroke="#24231F"
          strokeOpacity="0.4"
          strokeWidth="2"
        />
      ))}
      {config.lines.map((line, index) => {
        const from = center(line.from[0], line.from[1]);
        const to = center(line.to[0], line.to[1]);
        return (
          <line
            key={`line-${index}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={line.color}
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
      {config.blueDots.map(([row, col], index) => {
        const point = center(row, col);
        return <circle key={`blue-${index}`} cx={point.x} cy={point.y} r="3" fill="#315C8B" opacity="0.8" />;
      })}
      {config.pinkDots.map(([row, col], index) => {
        const point = center(row, col);
        return (
          <g key={`pink-${index}`}>
            <rect x={point.x - 10} y={point.y - 10} width="20" height="20" rx="4" fill="#F3EBDD" stroke="#9E2A2B" />
            <circle cx={point.x - 4} cy={point.y - 3} r="2.4" fill="#DFA6A6" />
            <circle cx={point.x + 4} cy={point.y + 3} r="2.4" fill="#DFA6A6" />
          </g>
        );
      })}
      <path d="M316 18C331 42 330 67 317 92C344 79 350 52 338 24" stroke="#24231F" strokeOpacity="0.34" strokeWidth="3" fill="none" />
      <circle cx="330" cy="32" r="8" fill="#DFA6A6" opacity="0.55" />
    </svg>
  );
}

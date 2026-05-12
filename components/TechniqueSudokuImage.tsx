import { Technique } from "@/data/techniques";
import { TechniquePractice } from "@/lib/sudoku/techniquePractice";
import { cn } from "@/lib/utils";

export default function TechniqueSudokuImage({
  practice,
  pattern,
  large = false,
  className,
  interactive = false,
  selectedCell,
  marks,
  onCellSelect
}: {
  practice: TechniquePractice;
  pattern: Technique["pattern"];
  large?: boolean;
  className?: string;
  interactive?: boolean;
  selectedCell?: { row: number; col: number } | null;
  marks?: Record<string, number>;
  onCellSelect?: (cell: { row: number; col: number }) => void;
}) {
  const cell = 24;
  const startX = 28;
  const startY = 14;
  const size = cell * 9;
  const targetSet = new Set(practice.targetCells.map((item) => `${item.row}-${item.col}`));

  return (
    <svg
      viewBox="0 0 300 238"
      className={cn(
        "aspect-[1.26] w-full rounded-md border border-ink-900/10 bg-steel-100/35",
        large && "aspect-[1.35]",
        className
      )}
      role="img"
      aria-label={`${pattern} practice from a generated Sudoku board`}
    >
      <rect width="300" height="238" fill="#D6D2C8" opacity="0.28" />
      <rect x={startX} y={startY} width={size} height={size} rx="5" fill="#F3EBDD" stroke="#24231F" strokeOpacity="0.35" />
      {practice.puzzle.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          const x = startX + colIndex * cell;
          const y = startY + rowIndex * cell;
          const highlighted = targetSet.has(`${rowIndex}-${colIndex}`);
          const selected = selectedCell?.row === rowIndex && selectedCell.col === colIndex;
          const mark = marks?.[`${rowIndex}-${colIndex}`];
          return (
            <g
              key={`${rowIndex}-${colIndex}`}
              onClick={() => {
                if (interactive && value === 0) {
                  onCellSelect?.({ row: rowIndex, col: colIndex });
                }
              }}
              className={interactive && value === 0 ? "cursor-pointer" : undefined}
            >
              <rect
                x={x}
                y={y}
                width={cell}
                height={cell}
                fill={selected ? "#E8B7B7" : "transparent"}
                stroke="#24231F"
                strokeOpacity={0.1}
              />
              {value !== 0 ? (
                <text
                  x={x + cell / 2}
                  y={y + 16}
                  textAnchor="middle"
                  fontFamily="Georgia, serif"
                  fontSize="15"
                  fontWeight="700"
                  fill="#24231F"
                >
                  {value}
                </text>
              ) : mark ? (
                <text
                  x={x + cell / 2}
                  y={y + 16}
                  textAnchor="middle"
                  fontFamily="Georgia, serif"
                  fontSize="15"
                  fontWeight="700"
                  fill="#6B8F71"
                >
                  {mark}
                </text>
              ) : highlighted ? (
                <g>
                  <rect
                    x={x + 3}
                    y={y + 3}
                    width={cell - 6}
                    height={cell - 6}
                    rx="4"
                    fill="transparent"
                    stroke="#9E2A2B"
                    strokeWidth={selected ? 2.6 : 1.8}
                  />
                </g>
              ) : null}
            </g>
          );
        })
      )}
      {Array.from({ length: 10 }, (_, index) => (
        <g key={index}>
          <line
            x1={startX + index * cell}
            y1={startY}
            x2={startX + index * cell}
            y2={startY + size}
            stroke="#24231F"
            strokeOpacity={index % 3 === 0 ? 0.75 : 0.16}
            strokeWidth={index % 3 === 0 ? 2 : 1}
          />
          <line
            x1={startX}
            y1={startY + index * cell}
            x2={startX + size}
            y2={startY + index * cell}
            stroke="#24231F"
            strokeOpacity={index % 3 === 0 ? 0.75 : 0.16}
            strokeWidth={index % 3 === 0 ? 2 : 1}
          />
        </g>
      ))}
    </svg>
  );
}

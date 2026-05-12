"use client";

import { motion } from "framer-motion";
import { Copy, Eraser, RefreshCw, Search, Swords, Trophy, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SakuraBackground from "@/components/SakuraBackground";
import { generateSudoku } from "@/lib/sudoku/generator";
import { cloneGrid, isGridSolved } from "@/lib/sudoku/validator";
import { cn, formatTime } from "@/lib/utils";
import { useAccountStore } from "@/store/accountStore";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";

type Seat = "host" | "guest";

type DuelRoom = {
  id: string;
  code: string;
  seed: string;
  status: "waiting" | "active" | "finished";
  host_id: string;
  host_name: string;
  guest_id: string | null;
  guest_name: string | null;
  host_progress: number;
  guest_progress: number;
  host_mistakes: number;
  guest_mistakes: number;
  host_time: number | null;
  guest_time: number | null;
  winner: "host" | "guest" | null;
  started_at: string | null;
  created_at: string;
};

function createRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function getDeviceId() {
  const key = "samuraidoku-duel-device-id";
  const existing = window.localStorage.getItem(key);

  if (existing) {
    return existing;
  }

  const next = crypto.randomUUID();
  window.localStorage.setItem(key, next);
  return next;
}

function getPlayerName(email: string | null) {
  if (email) {
    return email.split("@")[0].slice(0, 22);
  }

  return `Player-${getDeviceId().slice(0, 4).toUpperCase()}`;
}

function getProgress(grid: number[][], puzzle: number[][]) {
  const emptyCells = puzzle.flat().filter((value) => value === 0).length;
  const filledCells = grid
    .flatMap((row, rowIndex) => row.map((value, colIndex) => ({ value, row: rowIndex, col: colIndex })))
    .filter((cell) => puzzle[cell.row][cell.col] === 0 && cell.value !== 0).length;

  return emptyCells === 0 ? 100 : Math.round((filledCells / emptyCells) * 100);
}

function gridStorageKey(code: string, seat: Seat) {
  return `samuraidoku-duel-grid-${code}-${seat}`;
}

function loadGrid(code: string, seat: Seat, puzzle: number[][]) {
  try {
    const stored = window.localStorage.getItem(gridStorageKey(code, seat));
    return stored ? (JSON.parse(stored) as number[][]) : cloneGrid(puzzle);
  } catch {
    return cloneGrid(puzzle);
  }
}

function saveGrid(code: string, seat: Seat, grid: number[][]) {
  window.localStorage.setItem(gridStorageKey(code, seat), JSON.stringify(grid));
}

export default function DuelPage() {
  const supabase = useMemo(() => createClient(), []);
  const configured = isSupabaseConfigured();
  const email = useAccountStore((state) => state.email);
  const [room, setRoom] = useState<DuelRoom | null>(null);
  const [seat, setSeat] = useState<Seat | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [message, setMessage] = useState("Create a duel room or enter your opponent's code.");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [grid, setGrid] = useState<number[][]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [now, setNow] = useState(Date.now());
  const roomCode = room?.code ?? "";
  const roomSeed = room?.seed ?? "";
  const hostMistakes = room?.host_mistakes ?? 0;
  const guestMistakes = room?.guest_mistakes ?? 0;
  const generated = useMemo(() => (roomSeed ? generateSudoku("classic", "medium", roomSeed) : null), [roomSeed]);
  const puzzle = generated?.puzzle ?? [];
  const solution = generated?.solution ?? [];
  const elapsed =
    room?.started_at && room.status !== "waiting" ? Math.max(0, Math.floor((now - Date.parse(room.started_at)) / 1000)) : 0;
  const ownProgress = room && seat ? (seat === "host" ? room.host_progress : room.guest_progress) : 0;
  const opponentProgress = room && seat ? (seat === "host" ? room.guest_progress : room.host_progress) : 0;
  const opponentName = room && seat ? (seat === "host" ? room.guest_name : room.host_name) : null;
  const ownName = room && seat ? (seat === "host" ? room.host_name : room.guest_name) : null;
  const ownFinished = Boolean(room?.winner && seat === room.winner);
  const opponentFinished = Boolean(room?.winner && seat && room.winner !== seat);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!roomCode || !seat || !generated) {
      setGrid([]);
      return;
    }

    const nextGrid = loadGrid(roomCode, seat, generated.puzzle);
    setGrid(nextGrid);
    setMistakes(seat === "host" ? hostMistakes : guestMistakes);
    setSelected(null);
  }, [generated, guestMistakes, hostMistakes, roomCode, seat]);

  useEffect(() => {
    if (!configured || !supabase || !roomCode) {
      return;
    }

    const refresh = async () => {
      const { data, error } = await supabase.from("duel_rooms").select("*").eq("code", roomCode).maybeSingle();

      if (error) {
        setMessage("Duel table is not ready. Apply the updated Supabase schema first.");
        return;
      }

      if (data) {
        setRoom(data as DuelRoom);
      }
    };

    const interval = window.setInterval(refresh, 1800);
    return () => window.clearInterval(interval);
  }, [configured, roomCode, supabase]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (/^[1-9]$/.test(event.key)) {
        inputNumber(Number(event.key));
      }

      if (event.key === "Backspace" || event.key === "Delete") {
        eraseCell();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const createRoom = async () => {
    if (!configured || !supabase) {
      setMessage("Supabase is required for real cross-device duels.");
      return;
    }

    setLoading(true);
    const code = createRoomCode();
    const deviceId = getDeviceId();
    const hostName = getPlayerName(email);
    const seed = `duel-${code}-${Date.now()}`;
    const { data, error } = await supabase
      .from("duel_rooms")
      .insert({
        code,
        seed,
        status: "waiting",
        host_id: deviceId,
        host_name: hostName
      })
      .select("*")
      .single();

    if (error) {
      setMessage("Could not create room. Check that `duel_rooms` exists in Supabase.");
    } else {
      setRoom(data as DuelRoom);
      setSeat("host");
      setMessage(`Room ${code} created. Send this code to your opponent.`);
    }

    setLoading(false);
  };

  const joinRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!configured || !supabase) {
      setMessage("Supabase is required for real cross-device duels.");
      return;
    }

    const code = joinCode.trim().toUpperCase();

    if (!code) {
      setMessage("Enter a duel code.");
      return;
    }

    setLoading(true);
    const { data: existing, error: findError } = await supabase.from("duel_rooms").select("*").eq("code", code).maybeSingle();

    if (findError || !existing) {
      setMessage("No duel room found for this code.");
      setLoading(false);
      return;
    }

    const foundRoom = existing as DuelRoom;
    const deviceId = getDeviceId();

    if (foundRoom.host_id === deviceId) {
      setRoom(foundRoom);
      setSeat("host");
      setMessage("Reconnected as host.");
      setLoading(false);
      return;
    }

    if (foundRoom.guest_id && foundRoom.guest_id !== deviceId) {
      setMessage("This duel room already has two players.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("duel_rooms")
      .update({
        guest_id: deviceId,
        guest_name: getPlayerName(email),
        status: "active",
        started_at: foundRoom.started_at ?? new Date().toISOString()
      })
      .eq("code", code)
      .select("*")
      .single();

    if (error) {
      setMessage("Could not join room. Try again.");
    } else {
      setRoom(data as DuelRoom);
      setSeat("guest");
      setMessage("Joined duel. Solve from your own screen.");
    }

    setLoading(false);
  };

  const updateProgress = async (nextGrid: number[][], nextMistakes: number, solved: boolean) => {
    if (!configured || !supabase || !room || !seat || !generated) {
      return;
    }

    const progress = getProgress(nextGrid, generated.puzzle);
    const patch =
      seat === "host"
        ? {
            host_progress: progress,
            host_mistakes: nextMistakes,
            host_time: solved ? elapsed : room.host_time,
            winner: solved && !room.winner ? "host" : room.winner,
            status: solved && !room.winner ? "finished" : room.status
          }
        : {
            guest_progress: progress,
            guest_mistakes: nextMistakes,
            guest_time: solved ? elapsed : room.guest_time,
            winner: solved && !room.winner ? "guest" : room.winner,
            status: solved && !room.winner ? "finished" : room.status
          };

    const { data } = await supabase.from("duel_rooms").update(patch).eq("code", room.code).select("*").single();

    if (data) {
      setRoom(data as DuelRoom);
    }
  };

  const selectCell = (row: number, col: number) => {
    if (!room || room.status !== "active" || !puzzle.length || puzzle[row][col] !== 0 || room.winner) {
      return;
    }

    setSelected({ row, col });
  };

  const inputNumber = (num: number) => {
    if (!room || !seat || room.status !== "active" || !selected || !grid.length || !solution.length || room.winner) {
      return;
    }

    if (puzzle[selected.row][selected.col] !== 0) {
      return;
    }

    const nextGrid = cloneGrid(grid);
    nextGrid[selected.row][selected.col] = num;
    const nextMistakes = mistakes + (num !== solution[selected.row][selected.col] ? 1 : 0);
    const solved = isGridSolved(nextGrid, solution);

    setGrid(nextGrid);
    setMistakes(nextMistakes);
    saveGrid(room.code, seat, nextGrid);
    updateProgress(nextGrid, nextMistakes, solved);
  };

  const eraseCell = () => {
    if (!room || !seat || room.status !== "active" || !selected || !grid.length || room.winner) {
      return;
    }

    if (puzzle[selected.row][selected.col] !== 0) {
      return;
    }

    const nextGrid = cloneGrid(grid);
    nextGrid[selected.row][selected.col] = 0;
    setGrid(nextGrid);
    saveGrid(room.code, seat, nextGrid);
    updateProgress(nextGrid, mistakes, false);
  };

  const copyCode = async () => {
    if (!room) {
      return;
    }

    await navigator.clipboard.writeText(room.code);
    setMessage(`Code ${room.code} copied.`);
  };

  const resetLocalRoom = () => {
    setRoom(null);
    setSeat(null);
    setGrid([]);
    setSelected(null);
    setMistakes(0);
    setMessage("Create a duel room or enter your opponent's code.");
  };

  return (
    <main className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <SakuraBackground quiet />
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase text-ink-700">Online race</p>
            <h1 className="font-serif text-5xl font-semibold text-ink-900">1v1 Sudoku Duel</h1>
            <p className="mt-3 max-w-2xl text-ink-700">
              Create a code, share it with another player and solve the same Sudoku from separate devices.
            </p>
          </div>
          <section className="paper-panel rounded-md p-4">
            <div className="flex items-center gap-4">
              <Swords size={26} />
              <div>
                <p className="text-xs uppercase text-ink-700">Race timer</p>
                <p className="font-serif text-3xl font-semibold">{formatTime(elapsed)}</p>
              </div>
            </div>
          </section>
        </div>

        {!room && (
          <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="paper-panel rounded-md p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-ink-700">Host</p>
                  <h2 className="font-serif text-3xl font-semibold text-ink-900">Create Duel Room</h2>
                </div>
                <Users size={24} />
              </div>
              <p className="text-sm leading-6 text-ink-700">
                A room code creates one shared Sudoku seed. Your opponent joins from their own device.
              </p>
              <button
                type="button"
                onClick={createRoom}
                disabled={loading}
                className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-5 py-3 font-semibold text-parchment-100 disabled:opacity-60"
              >
                <Swords size={18} /> {loading ? "Creating..." : "Create room code"}
              </button>
            </div>

            <form onSubmit={joinRoom} className="paper-panel rounded-md p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-ink-700">Guest</p>
                  <h2 className="font-serif text-3xl font-semibold text-ink-900">Join by Code</h2>
                </div>
                <Search size={24} />
              </div>
              <label className="grid gap-2 text-sm font-semibold text-ink-800">
                Duel code
                <input
                  value={joinCode}
                  onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
                  className="focus-ring rounded-md border border-ink-900/15 bg-parchment-50/70 px-4 py-4 font-serif text-3xl uppercase tracking-[0.18em]"
                  placeholder="ABC123"
                  maxLength={8}
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-5 py-3 font-semibold text-parchment-100 disabled:opacity-60"
              >
                <Search size={18} /> {loading ? "Searching..." : "Find player room"}
              </button>
            </form>
          </section>
        )}

        {room && seat && generated && (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,720px)_minmax(360px,420px)]">
            <section className="paper-panel rounded-md p-4">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase text-ink-700">{seat === "host" ? "Host screen" : "Guest screen"}</p>
                  <h2 className="font-serif text-3xl font-semibold text-ink-900">{ownName}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={copyCode}
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-4 py-2 text-sm font-semibold"
                  >
                    <Copy size={16} /> {room.code}
                  </button>
                  <button
                    type="button"
                    onClick={resetLocalRoom}
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-parchment-100"
                  >
                    <RefreshCw size={16} /> Leave
                  </button>
                </div>
              </div>

              <DuelBoard
                grid={grid}
                puzzle={puzzle}
                solution={solution}
                selected={selected}
                disabled={room.status !== "active" || Boolean(room.winner)}
                onSelect={selectCell}
              />
            </section>

            <aside className="grid gap-4">
              <section className="paper-panel rounded-md p-4">
                <p className="text-xs uppercase text-ink-700">Numbers</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {Array.from({ length: 9 }, (_, index) => index + 1).map((number) => (
                    <motion.button
                      key={number}
                      type="button"
                      whileTap={{ scale: 0.94 }}
                      onClick={() => inputNumber(number)}
                      className="focus-ring flex aspect-square min-h-[88px] items-center justify-center rounded-md border border-ink-900/10 bg-parchment-50/80 font-serif text-5xl font-semibold text-ink-900 shadow-sm transition hover:bg-sakura-200/45"
                    >
                      {number}
                    </motion.button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={eraseCell}
                  className="focus-ring mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-ink-900/12 bg-parchment-50/70 px-4 py-3 font-semibold"
                >
                  <Eraser size={18} /> Erase
                </button>
              </section>

              <section className="paper-panel rounded-md p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase text-ink-700">Room</p>
                    <h2 className="font-serif text-3xl font-semibold text-ink-900">Race Status</h2>
                  </div>
                  {room.winner && <Trophy size={24} className="text-success" />}
                </div>
                <p className="rounded-md bg-parchment-50/60 p-3 text-sm text-ink-700">{message}</p>
                {room.status === "waiting" && (
                  <p className="mt-3 rounded-md bg-sakura-200/25 p-3 text-sm font-semibold text-ink-800">
                    Waiting for opponent. Send code {room.code}.
                  </p>
                )}
                {room.winner && (
                  <p className="mt-3 rounded-md bg-success/15 p-3 font-serif text-2xl font-semibold text-success">
                    {ownFinished ? "You won" : opponentFinished ? "Opponent won" : "Duel finished"}
                  </p>
                )}
                <div className="mt-4 grid gap-3">
                  <PlayerRaceLine
                    label="You"
                    name={ownName ?? "You"}
                    progress={ownProgress}
                    mistakes={seat === "host" ? room.host_mistakes : room.guest_mistakes}
                    time={seat === "host" ? room.host_time : room.guest_time}
                    active={!room.winner && room.status === "active"}
                  />
                  <PlayerRaceLine
                    label="Opponent"
                    name={opponentName ?? "Waiting..."}
                    progress={opponentProgress}
                    mistakes={seat === "host" ? room.guest_mistakes : room.host_mistakes}
                    time={seat === "host" ? room.guest_time : room.host_time}
                    active={!room.winner && room.status === "active" && Boolean(opponentName)}
                  />
                </div>
              </section>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function DuelBoard({
  grid,
  puzzle,
  solution,
  selected,
  disabled,
  onSelect
}: {
  grid: number[][];
  puzzle: number[][];
  solution: number[][];
  selected: { row: number; col: number } | null;
  disabled: boolean;
  onSelect: (row: number, col: number) => void;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[680px]">
      <div
        className="sudoku-grid-shadow grid aspect-square overflow-hidden rounded-[3px] bg-parchment-50"
        style={{ gridTemplateColumns: "repeat(9, minmax(0, 1fr))" }}
      >
        {grid.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const fixed = puzzle[rowIndex][colIndex] !== 0;
            const active = selected?.row === rowIndex && selected.col === colIndex;
            const wrong = value !== 0 && value !== solution[rowIndex][colIndex];
            const correct = value !== 0 && !fixed && value === solution[rowIndex][colIndex];

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                disabled={disabled && !active}
                onClick={() => onSelect(rowIndex, colIndex)}
                className={cn(
                  "focus-ring flex aspect-square items-center justify-center border border-ink-900/18 font-serif text-2xl font-semibold transition sm:text-4xl",
                  rowIndex % 3 === 0 && "border-t-2 border-t-ink-900/85",
                  colIndex % 3 === 0 && "border-l-2 border-l-ink-900/85",
                  rowIndex === 8 && "border-b-2 border-b-ink-900/85",
                  colIndex === 8 && "border-r-2 border-r-ink-900/85",
                  active && "z-10 bg-sakura-200/55 shadow-glow",
                  fixed && "text-ink-900",
                  !fixed && value !== 0 && "text-indigo-950",
                  correct && "bg-success/15 text-success",
                  wrong && "animate-shake bg-error/12 text-error"
                )}
              >
                {value || ""}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function PlayerRaceLine({
  label,
  name,
  progress,
  mistakes,
  time,
  active
}: {
  label: string;
  name: string;
  progress: number;
  mistakes: number;
  time: number | null;
  active: boolean;
}) {
  return (
    <div className="rounded-md border border-ink-900/10 bg-parchment-50/60 p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-ink-700">{label}</p>
          <p className="font-serif text-2xl font-semibold text-ink-900">{name}</p>
        </div>
        <p className="font-serif text-xl font-semibold">{time === null ? (active ? "Racing" : "--") : formatTime(time)}</p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-parchment-100">
        <div className="h-full rounded-full bg-success transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-xs uppercase text-ink-700">
        <span>{progress}% complete</span>
        <span>{mistakes} errors</span>
      </div>
    </div>
  );
}

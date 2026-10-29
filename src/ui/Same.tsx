import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { playCheer, playSuccess, playTryAgain, speak } from "../audio";
import { shuffle } from "../data/helpers";
import { labelWord, ui } from "../i18n";
import { awardStars } from "../progress";
import { Mascot, TopBar } from "./Chrome";

const faces = [
  { pair: "Apple", emoji: "🍎" },
  { pair: "Ball", emoji: "⚽" },
  { pair: "Fish", emoji: "🐟" },
  { pair: "Moon", emoji: "🌙" },
];

type Side = "left" | "right";
type Tile = { id: string; pair: string; emoji: string };
type Line = { pair: string; x1: number; y1: number; x2: number; y2: number };

function column(side: Side): Tile[] {
  return shuffle(faces.map((face) => ({ id: `${side}-${face.pair}-${Math.random().toString(36).slice(2, 6)}`, ...face })));
}

export function SameScreen({
  muted,
  onToggleMute,
  onBack,
}: {
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(() => column("left"));
  const [right, setRight] = useState(() => column("right"));
  const [matched, setMatched] = useState<string[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [draft, setDraft] = useState<Line | null>(null);
  const [fromId, setFromId] = useState<string | null>(null);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const matchedRef = useRef<string[]>([]);
  const fromRef = useRef<{ id: string; pair: string; side: Side } | null>(null);
  const cheered = useRef(false);
  const won = matched.length === faces.length;

  useEffect(() => {
    if (!won || cheered.current) return;
    cheered.current = true;
    awardStars("Same pictures", 1);
    void (async () => {
      await playSuccess();
      await speak(ui("sameDone"));
    })();
  }, [won]);

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const measure = () => {
      const box = board.getBoundingClientRect();
      setSize({ w: box.width, h: box.height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(board);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const box = board.getBoundingClientRect();
    const next = matchedRef.current.flatMap((pair) => {
      const nodes = [...board.querySelectorAll<HTMLElement>(`[data-pair="${pair}"]`)];
      if (nodes.length < 2) return [];
      const a = center(nodes[0], box);
      const b = center(nodes[1], box);
      return [{ pair, x1: a.x, y1: a.y, x2: b.x, y2: b.y }];
    });
    setLines(next);
  }, [matched, size]);

  function reset() {
    matchedRef.current = [];
    fromRef.current = null;
    cheered.current = false;
    setMatched([]);
    setLines([]);
    setDraft(null);
    setFromId(null);
    setWrongId(null);
    setLeft(column("left"));
    setRight(column("right"));
  }

  function startLine(event: ReactPointerEvent<HTMLDivElement>) {
    if (won) return;
    const tile = (event.target as HTMLElement).closest<HTMLElement>("[data-pair]");
    if (!tile || matchedRef.current.includes(tile.dataset.pair ?? "")) return;
    const board = boardRef.current;
    if (!board) return;
    const box = board.getBoundingClientRect();
    const origin = center(tile, box);
    fromRef.current = { id: tile.dataset.id ?? "", pair: tile.dataset.pair ?? "", side: tile.dataset.side as Side };
    setFromId(tile.dataset.id ?? null);
    setDraft({ pair: "draft", x1: origin.x, y1: origin.y, x2: origin.x, y2: origin.y });
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* A cancelled pointer should still draw the line. */
    }
    void speak(labelWord(tile.dataset.pair ?? ""));
  }

  function moveLine(event: ReactPointerEvent<HTMLDivElement>) {
    if (!fromRef.current || !boardRef.current) return;
    const box = boardRef.current.getBoundingClientRect();
    const x2 = event.clientX - box.left;
    const y2 = event.clientY - box.top;
    setDraft((current) => (current ? { ...current, x2, y2 } : current));
  }

  function endLine(event: ReactPointerEvent<HTMLDivElement>) {
    const from = fromRef.current;
    fromRef.current = null;
    setFromId(null);
    setDraft(null);
    if (!from || !boardRef.current) return;
    const other: Side = from.side === "left" ? "right" : "left";
    const hit = tileNear(event.clientX, event.clientY, other);
    if (!hit || matchedRef.current.includes(hit.dataset.pair ?? "")) {
      if (hit) void playTryAgain();
      return;
    }
    if (hit.dataset.pair !== from.pair) {
      setWrongId(hit.dataset.id ?? null);
      void playTryAgain();
      window.setTimeout(() => setWrongId(null), 450);
      return;
    }
    matchedRef.current = [...matchedRef.current, from.pair];
    setMatched(matchedRef.current);
    playCheer();
    void speak(`${ui("yes")} ${labelWord(from.pair)}`);
  }

  function tileNear(clientX: number, clientY: number, side: Side) {
    const board = boardRef.current;
    if (!board) return null;
    const tiles = [...board.querySelectorAll<HTMLElement>(`[data-side="${side}"]`)];
    const inside = tiles.find((tile) => {
      const box = tile.getBoundingClientRect();
      return clientX >= box.left - 16 && clientX <= box.right + 16 && clientY >= box.top - 16 && clientY <= box.bottom + 16;
    });
    if (inside) return inside;
    let best: HTMLElement | null = null;
    let bestDist = 64;
    for (const tile of tiles) {
      const box = tile.getBoundingClientRect();
      const dist = Math.hypot(clientX - (box.left + box.width / 2), clientY - (box.top + box.height / 2));
      if (dist < bestDist) {
        best = tile;
        bestDist = dist;
      }
    }
    return best;
  }

  return (
    <main className="screen">
      <TopBar tint="#e85d8c" ink="#fff" emoji="🍎" title={ui("same")} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
      <p className="intro">{won ? ui("sameDone") : ui("sameHint")}</p>
      <p className="counter">
        {matched.length} / {faces.length}
      </p>
      {won && <Mascot mood="jump" />}
      <div
        className="same-board"
        ref={boardRef}
        onPointerDown={startLine}
        onPointerMove={moveLine}
        onPointerUp={endLine}
        onPointerCancel={endLine}
      >
        <svg className="same-lines" width={size.w} height={size.h} aria-hidden>
          {lines.map((line) => (
            <line key={line.pair} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
          ))}
          {draft && <line className="draft" x1={draft.x1} y1={draft.y1} x2={draft.x2} y2={draft.y2} />}
        </svg>
        <div className="same-col">
          {left.map((tile) => (
            <PictureTile key={tile.id} tile={tile} side="left" matched={matched.includes(tile.pair)} active={fromId === tile.id} wrong={wrongId === tile.id} />
          ))}
        </div>
        <div className="same-col">
          {right.map((tile) => (
            <PictureTile key={tile.id} tile={tile} side="right" matched={matched.includes(tile.pair)} active={fromId === tile.id} wrong={wrongId === tile.id} />
          ))}
        </div>
      </div>
      {won && (
        <button type="button" className="primary" onClick={reset}>
          {ui("playAgain")}
        </button>
      )}
    </main>
  );
}

function PictureTile({
  tile,
  side,
  matched,
  active,
  wrong,
}: {
  tile: Tile;
  side: Side;
  matched: boolean;
  active: boolean;
  wrong: boolean;
}) {
  return (
    <div
      className={`same-tile ${matched ? "matched" : ""} ${active ? "picked" : ""} ${wrong ? "shake" : ""}`}
      data-id={tile.id}
      data-pair={tile.pair}
      data-side={side}
      role="button"
      aria-label={labelWord(tile.pair)}
    >
      <span className="same-emoji">{tile.emoji}</span>
      <span>{labelWord(tile.pair)}</span>
    </div>
  );
}

function center(tile: HTMLElement, board: DOMRect) {
  const box = tile.getBoundingClientRect();
  return { x: box.left - board.left + box.width / 2, y: box.top - board.top + box.height / 2 };
}

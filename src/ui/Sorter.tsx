import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { playCheer, playSuccess, playTryAgain, speak } from "../audio";
import { shuffle } from "../data/helpers";
import { ui } from "../i18n";
import { awardStars } from "../progress";
import { Mascot, TopBar } from "./Chrome";

type ShapeId = "circle" | "square" | "triangle" | "star";

const shapes: { id: ShapeId; emoji: string }[] = [
  { id: "circle", emoji: "⭕" },
  { id: "square", emoji: "🟦" },
  { id: "triangle", emoji: "🔺" },
  { id: "star", emoji: "⭐" },
];

type Piece = { id: ShapeId; emoji: string; x: number; y: number; placed: boolean };

function fresh(): Piece[] {
  return shuffle(shapes).map((shape, index) => ({
    ...shape,
    x: 16 + (index % 2) * 150,
    y: 16 + Math.floor(index / 2) * 110,
    placed: false,
  }));
}

export function SorterScreen({
  muted,
  onToggleMute,
  onBack,
}: {
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: ShapeId; dx: number; dy: number } | null>(null);
  const [pieces, setPieces] = useState(fresh);
  const [wrong, setWrong] = useState<ShapeId | null>(null);
  const won = pieces.every((piece) => piece.placed);
  const celebrated = useRef(false);

  useEffect(() => {
    if (!won || celebrated.current) return;
    celebrated.current = true;
    awardStars("Shape sorter", 1);
    void playSuccess();
  }, [won]);

  function holeCenter(id: ShapeId) {
    const board = boardRef.current;
    const hole = board?.querySelector<HTMLElement>(`[data-hole="${id}"]`);
    if (!board || !hole) return null;
    const box = board.getBoundingClientRect();
    const target = hole.getBoundingClientRect();
    return { x: target.left - box.left + 8, y: target.top - box.top + 8, cx: target.left + target.width / 2, cy: target.top + target.height / 2 };
  }

  function move(event: ReactPointerEvent<HTMLElement>) {
    const active = drag.current;
    const board = boardRef.current;
    if (!active || !board) return;
    const box = board.getBoundingClientRect();
    setPieces((current) =>
      current.map((piece) => (piece.id === active.id ? { ...piece, x: event.clientX - box.left - active.dx, y: event.clientY - box.top - active.dy } : piece)),
    );
  }

  function drop(event: ReactPointerEvent<HTMLElement>) {
    const active = drag.current;
    drag.current = null;
    if (!active) return;
    const hole = holeCenter(active.id);
    const near = hole && Math.hypot(event.clientX - hole.cx, event.clientY - hole.cy) < 70;
    if (near && hole) {
      setPieces((current) => current.map((piece) => (piece.id === active.id ? { ...piece, x: hole.x, y: hole.y, placed: true } : piece)));
      playCheer();
      void speak(ui("yes"));
      return;
    }
    setWrong(active.id);
    void playTryAgain();
    window.setTimeout(() => setWrong(null), 400);
    setPieces((current) => {
      const index = shapes.findIndex((shape) => shape.id === active.id);
      return current.map((piece) =>
        piece.id === active.id ? { ...piece, x: 16 + (index % 2) * 150, y: 16 + Math.floor(index / 2) * 110, placed: false } : piece,
      );
    });
  }

  return (
    <main className="screen">
      <TopBar tint="#f97316" ink="#fff" emoji="🔷" title={ui("sorter")} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
      <p className="intro">{won ? ui("sorterDone") : ui("sorterHint")}</p>
      {won && <Mascot mood="jump" />}
      <div className="sorter-board" ref={boardRef}>
        <div className="sorter-holes">
          {shapes.map((shape) => (
            <div key={shape.id} className="shape-hole" data-hole={shape.id} aria-label={shape.id}>
              <span>{shape.emoji}</span>
            </div>
          ))}
        </div>
        {pieces.map((piece) => (
          <button
            key={piece.id}
            type="button"
            className={`shape-piece ${piece.placed ? "placed" : ""} ${wrong === piece.id ? "shake" : ""}`}
            style={{ left: piece.x, top: piece.y }}
            onPointerDown={(event) => {
              if (piece.placed || won) return;
              const box = event.currentTarget.getBoundingClientRect();
              drag.current = { id: piece.id, dx: event.clientX - box.left, dy: event.clientY - box.top };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={move}
            onPointerUp={drop}
            onPointerCancel={drop}
          >
            {piece.emoji}
          </button>
        ))}
      </div>
      {won && (
        <button
          type="button"
          className="primary"
          onClick={() => {
            celebrated.current = false;
            setPieces(fresh());
          }}
        >
          {ui("playAgain")}
        </button>
      )}
    </main>
  );
}

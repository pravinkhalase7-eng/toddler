import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { playCheer, playSuccess, playTryAgain, speak } from "../audio";
import { shuffle } from "../data/helpers";
import { ui } from "../i18n";
import { awardStars } from "../progress";
import type { ShapeName } from "../types";
import { Mascot, TopBar } from "./Chrome";
import { ShapeIcon } from "./Picture";

const shapes: ShapeName[] = ["circle", "square", "triangle", "rectangle", "star", "heart", "oval", "diamond", "pentagon", "hexagon"];

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
  const [holes, setHoles] = useState(() => shuffle(shapes));
  const [tray, setTray] = useState(() => shuffle(shapes));
  const [placed, setPlaced] = useState<ShapeName[]>([]);
  const [drag, setDrag] = useState<{ id: ShapeName; x: number; y: number } | null>(null);
  const [wrong, setWrong] = useState<ShapeName | null>(null);
  const won = placed.length === shapes.length;
  const celebrated = useRef(false);

  useEffect(() => {
    if (!won || celebrated.current) return;
    celebrated.current = true;
    awardStars("Shape sorter", 1);
    void playSuccess();
  }, [won]);

  function holeUnder(clientX: number, clientY: number) {
    const board = boardRef.current;
    if (!board) return null;
    const nodes = [...board.querySelectorAll<HTMLElement>("[data-hole]")];
    return (
      nodes.find((node) => {
        const box = node.getBoundingClientRect();
        return clientX >= box.left && clientX <= box.right && clientY >= box.top && clientY <= box.bottom;
      }) ?? null
    );
  }

  function drop(clientX: number, clientY: number) {
    if (!drag) return;
    const id = drag.id;
    setDrag(null);
    const hole = holeUnder(clientX, clientY);
    if (hole?.dataset.hole === id) {
      setPlaced((current) => [...current, id]);
      playCheer();
      void speak(ui("yes"));
      return;
    }
    setWrong(id);
    void playTryAgain();
    window.setTimeout(() => setWrong(null), 450);
  }

  function startDrag(event: ReactPointerEvent<HTMLButtonElement>, id: ShapeName) {
    if (placed.includes(id) || won) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ id, x: event.clientX, y: event.clientY });
  }

  return (
    <main className="screen">
      <TopBar tint="#f97316" ink="#fff" emoji="🔷" title={ui("sorter")} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
      <p className="intro">{won ? ui("sorterDone") : ui("sorterHint")}</p>
      {won && <Mascot mood="jump" />}
      <div className="sorter-board" ref={boardRef}>
        <div className="sorter-tray">
          {tray.map((id) => (
            <button
              key={id}
              type="button"
              className={`shape-piece ${placed.includes(id) ? "gone" : ""} ${wrong === id ? "shake" : ""}`}
              aria-label={id}
              onPointerDown={(event) => startDrag(event, id)}
              onPointerMove={(event) => {
                if (!drag || drag.id !== id) return;
                setDrag({ id, x: event.clientX, y: event.clientY });
              }}
              onPointerUp={(event) => drop(event.clientX, event.clientY)}
              onPointerCancel={() => setDrag(null)}
            >
              {!placed.includes(id) && <ShapeIcon shape={id} className="shape-svg small" />}
            </button>
          ))}
        </div>
        <div className="sorter-holes">
          {holes.map((id) => (
            <div key={id} className={`shape-hole ${placed.includes(id) ? "filled" : ""}`} data-hole={id} aria-label={id}>
              <ShapeIcon shape={id} className={`shape-svg small ${placed.includes(id) ? "" : "as-hole"}`} />
            </div>
          ))}
        </div>
      </div>
      {drag && (
        <div className="drag-ghost" style={{ left: drag.x, top: drag.y }}>
          <ShapeIcon shape={drag.id} className="shape-svg small" />
        </div>
      )}
      {won && (
        <button
          type="button"
          className="primary"
          onClick={() => {
            celebrated.current = false;
            setHoles(shuffle(shapes));
            setTray(shuffle(shapes));
            setPlaced([]);
          }}
        >
          {ui("playAgain")}
        </button>
      )}
    </main>
  );
}

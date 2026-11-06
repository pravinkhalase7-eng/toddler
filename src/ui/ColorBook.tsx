import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ui } from "../i18n";
import { TopBar } from "./Chrome";

const crayons = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#a855f7", "#f472b6", "#92400e", "#111827"];

const pages = ["Apple", "House", "Sun", "Fish", "Flower", "Cat", "Car", "Star"] as const;

export function ColorBookScreen({
  muted,
  onToggleMute,
  onBack,
}: {
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
}) {
  const paintRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [page, setPage] = useState<(typeof pages)[number]>("Apple");
  const [color, setColor] = useState(crayons[0]);
  const [eraser, setEraser] = useState(false);

  useEffect(() => {
    const canvas = paintRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [page]);

  function point(event: ReactPointerEvent<HTMLDivElement>) {
    const canvas = paintRef.current;
    if (!canvas) return [0, 0] as [number, number];
    const box = canvas.getBoundingClientRect();
    return [((event.clientX - box.left) / box.width) * canvas.width, ((event.clientY - box.top) / box.height) * canvas.height] as [number, number];
  }

  function drawTo(event: ReactPointerEvent<HTMLDivElement>) {
    const canvas = paintRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !drawing.current) return;
    const [x, y] = point(event);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = eraser ? 28 : 18;
    if (eraser) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  return (
    <main className="screen">
      <TopBar tint="#c77dff" ink="#fff" emoji="🖍️" title={ui("colorBook")} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
      <p className="intro">{ui("colorBookHint")}</p>
      <div className="shortcut-row trace-picks">
        {pages.map((name) => (
          <button key={name} type="button" className={`shortcut ${page === name ? "on" : ""}`} onClick={() => setPage(name)}>
            {name}
          </button>
        ))}
      </div>
      <div className="paint-row">
        {crayons.map((swatch) => (
          <button
            key={swatch}
            type="button"
            className={`paint ${!eraser && color === swatch ? "on" : ""}`}
            style={{ background: swatch }}
            aria-label={swatch}
            onClick={() => {
              setColor(swatch);
              setEraser(false);
            }}
          />
        ))}
        <button type="button" className={`shortcut ${eraser ? "on" : ""}`} onClick={() => setEraser(true)}>
          {ui("eraser")}
        </button>
      </div>
      <div
        className="color-book"
        onPointerDown={(event) => {
          const canvas = paintRef.current;
          const ctx = canvas?.getContext("2d");
          if (!canvas || !ctx) return;
          drawing.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          const [x, y] = point(event);
          ctx.beginPath();
          ctx.moveTo(x, y);
          drawTo(event);
        }}
        onPointerMove={drawTo}
        onPointerUp={() => {
          drawing.current = false;
        }}
        onPointerCancel={() => {
          drawing.current = false;
        }}
      >
        <canvas ref={paintRef} width={320} height={320} />
        <PageArt page={page} />
      </div>
    </main>
  );
}

function PageArt({ page }: { page: (typeof pages)[number] }) {
  return (
    <svg className="color-lines" viewBox="0 0 320 320" aria-hidden>
      {page === "Apple" && (
        <>
          <circle cx="160" cy="180" r="78" />
          <path d="M160 102 C150 70 190 58 176 96" />
          <path d="M168 100 C190 78 214 96 188 112" />
        </>
      )}
      {page === "House" && (
        <>
          <polygon points="160,48 270,140 50,140" />
          <rect x="78" y="140" width="164" height="120" />
          <rect x="138" y="190" width="44" height="70" />
          <rect x="96" y="164" width="36" height="32" />
          <rect x="188" y="164" width="36" height="32" />
        </>
      )}
      {page === "Sun" && (
        <>
          <circle cx="160" cy="160" r="58" />
          {Array.from({ length: 12 }, (_, index) => {
            const angle = (index / 12) * Math.PI * 2;
            const x1 = 160 + Math.cos(angle) * 74;
            const y1 = 160 + Math.sin(angle) * 74;
            const x2 = 160 + Math.cos(angle) * 108;
            const y2 = 160 + Math.sin(angle) * 108;
            return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </>
      )}
      {page === "Fish" && (
        <>
          <ellipse cx="150" cy="160" rx="90" ry="52" />
          <polygon points="230,160 280,116 280,204" />
          <circle cx="112" cy="150" r="8" />
          <path d="M150 108 C170 80 200 90 190 120" />
        </>
      )}
      {page === "Flower" && (
        <>
          <circle cx="160" cy="150" r="28" />
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const angle = (deg * Math.PI) / 180;
            return <ellipse key={deg} cx={160 + Math.cos(angle) * 52} cy={150 + Math.sin(angle) * 52} rx="26" ry="18" transform={`rotate(${deg} ${160 + Math.cos(angle) * 52} ${150 + Math.sin(angle) * 52})`} />;
          })}
          <path d="M160 178 C150 220 170 250 160 286" />
          <path d="M160 230 C130 214 118 230 128 248" />
        </>
      )}
      {page === "Cat" && (
        <>
          <circle cx="160" cy="176" r="70" />
          <polygon points="104,120 86,58 138,104" />
          <polygon points="216,120 234,58 182,104" />
          <circle cx="136" cy="170" r="8" />
          <circle cx="184" cy="170" r="8" />
          <path d="M150 188 Q160 198 170 188" />
          <path d="M70 176 Q40 160 58 210" />
          <path d="M250 176 Q280 160 262 210" />
        </>
      )}
      {page === "Car" && (
        <>
          <path d="M70 190 H250 L230 140 H120 L90 190" />
          <rect x="58" y="188" width="210" height="48" rx="12" />
          <circle cx="110" cy="246" r="22" />
          <circle cx="214" cy="246" r="22" />
          <path d="M128 142 H200 L188 188 H118 Z" />
        </>
      )}
      {page === "Star" && <polygon points="160,36 188,118 274,118 204,168 230,252 160,202 90,252 116,168 46,118 132,118" />}
    </svg>
  );
}

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { playCheer, playCue, speak } from "../audio";
import { categories, findLesson } from "../data/catalog";
import { ui, topicName } from "../i18n";
import {
  addChild,
  allChildren,
  awardStars,
  buySticker,
  getChild,
  ownsSticker,
  placedStickers,
  renameChild,
  restEnabled,
  setLanguage,
  setRestEnabled,
  starsFor,
  switchChild,
  togglePlaced,
  walletStars,
  type Lang,
} from "../progress";
import { bedtimeTitles, scenes } from "../stickers";
import type { Cue } from "../types";
import { Mascot, TopBar } from "./Chrome";

export function BedtimeScreen({
  muted,
  onToggleMute,
  onBack,
  onOpen,
}: {
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
  onOpen: (title: string) => void;
}) {
  return (
    <main className="screen">
      <TopBar tint="#1e3a5f" ink="#fff" emoji="🌙" title={ui("bedtime")} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
      <div className="topic-list">
        {bedtimeTitles.map((title) => {
          const { lesson } = findLesson(title);
          return (
            <button key={title} type="button" className="topic-row bedtime-row" onClick={() => onOpen(title)}>
              <span className="topic-badge">{lesson.emoji}</span>
              <span className="topic-copy">
                <strong>{topicName(title)}</strong>
              </span>
            </button>
          );
        })}
      </div>
    </main>
  );
}

export function StickerScreen({
  muted,
  onToggleMute,
  onBack,
}: {
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
}) {
  const [sceneId, setSceneId] = useState(scenes[0].id);
  const scene = scenes.find((item) => item.id === sceneId) ?? scenes[0];
  const placed = placedStickers(scene.id);
  const wallet = walletStars();
  const names: Record<string, string> = { farm: "Farm", bed: "Bedroom", sky: "Sky" };

  return (
    <main className="screen">
      <TopBar tint="#f4b400" ink="#4a3708" emoji="⭐" title={ui("stickers")} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
      <p className="star-pill">
        ★ {wallet} {ui("wallet")}
      </p>
      <div className="shortcut-row">
        {scenes.map((item) => (
          <button key={item.id} type="button" className={`shortcut ${item.id === sceneId ? "on" : ""}`} onClick={() => setSceneId(item.id)}>
            {topicName(names[item.id] ?? item.id)}
          </button>
        ))}
      </div>
      <div className="sticker-stage" style={{ background: scene.tint }}>
        {placed.map((id) => {
          const sticker = scene.stickers.find((item) => item.id === id);
          return (
            <span key={id} className="placed-sticker">
              {sticker?.emoji}
            </span>
          );
        })}
        {placed.length === 0 && <p>{ui("place")}</p>}
      </div>
      {wallet === 0 && scene.stickers.every((item) => !ownsSticker(item.id)) && <p className="intro">{ui("needStars")}</p>}
      <div className="sticker-shop">
        {scene.stickers.map((sticker) => {
          const owned = ownsSticker(sticker.id);
          const onScene = placed.includes(sticker.id);
          return (
            <button
              key={sticker.id}
              type="button"
              className={`shop-card ${onScene ? "on" : ""}`}
              onClick={() => {
                if (!owned) {
                  buySticker(sticker.id, sticker.cost);
                  return;
                }
                togglePlaced(scene.id, sticker.id);
              }}
            >
              <span className="opt-emoji">{sticker.emoji}</span>
              <span>{owned ? (onScene ? "✓" : ui("place")) : `${ui("buy")} ★${sticker.cost}`}</span>
            </button>
          );
        })}
      </div>
    </main>
  );
}

type Stroke = [number, number][];

function circleStroke(): Stroke {
  const points: Stroke = [];
  for (let i = 0; i <= 28; i += 1) {
    const angle = (i / 28) * Math.PI * 2;
    points.push([150 + Math.cos(angle) * 90, 150 + Math.sin(angle) * 90]);
  }
  return points;
}

const traces: { id: string; label: string; strokes: Stroke[] }[] = [
  { id: "A", label: "A", strokes: [[[150, 40], [70, 250]], [[150, 40], [230, 250]], [[105, 155], [195, 155]]] },
  { id: "B", label: "B", strokes: [[[80, 40], [80, 250]], [[80, 40], [170, 40], [190, 90], [80, 140]], [[80, 140], [180, 140], [200, 190], [80, 250]]] },
  { id: "1", label: "1", strokes: [[[120, 80], [150, 40], [150, 250]], [[110, 250], [190, 250]]] },
  { id: "2", label: "2", strokes: [[[90, 90], [140, 40], [200, 80], [90, 250], [210, 250]]] },
  { id: "circle", label: "Circle", strokes: [circleStroke()] },
  { id: "square", label: "Square", strokes: [[[70, 70], [230, 70], [230, 230], [70, 230], [70, 70]]] },
  { id: "triangle", label: "Triangle", strokes: [[[150, 50], [250, 240], [50, 240], [150, 50]]] },
];

function densify(stroke: Stroke) {
  const out: Stroke = [];
  for (let i = 0; i < stroke.length - 1; i += 1) {
    const [x1, y1] = stroke[i];
    const [x2, y2] = stroke[i + 1];
    const steps = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 18));
    for (let step = 0; step <= steps; step += 1) out.push([x1 + ((x2 - x1) * step) / steps, y1 + ((y2 - y1) * step) / steps]);
  }
  return out;
}

export function TraceScreen({
  muted,
  onToggleMute,
  onBack,
}: {
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
}) {
  const [shape, setShape] = useState(traces[0]);
  const [user, setUser] = useState<Stroke>([]);
  const [done, setDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const userRef = useRef<Stroke>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, 300, 300);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#e4d3bf";
    ctx.lineWidth = 16;
    ctx.setLineDash([1, 18]);
    for (const stroke of shape.strokes) {
      ctx.beginPath();
      stroke.forEach(([x, y], index) => (index ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.strokeStyle = done ? "#16a34a" : "#6d4aff";
    ctx.lineWidth = 12;
    if (user.length) {
      ctx.beginPath();
      user.forEach(([x, y], index) => (index ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
    }
  }, [shape, user, done]);

  function point(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return [0, 0] as [number, number];
    const box = canvas.getBoundingClientRect();
    return [((event.clientX - box.left) / box.width) * 300, ((event.clientY - box.top) / box.height) * 300] as [number, number];
  }

  function finishStroke(next: Stroke) {
    const guide = shape.strokes.flatMap(densify);
    const hit = guide.filter(([x, y]) => next.some(([ux, uy]) => Math.hypot(ux - x, uy - y) < 28)).length;
    if (next.length > 12 && hit / guide.length > 0.62) {
      setDone(true);
      awardStars("Finger tracing", 1);
      playCheer();
      void speak(ui("traceDone"));
    }
  }

  return (
    <main className="screen">
      <TopBar tint="#ff8a5b" ink="#fff" emoji="✏️" title={ui("trace")} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
      <p className="intro">{done ? ui("traceDone") : ui("traceHint")}</p>
      <div className="shortcut-row">
        {traces.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`shortcut ${item.id === shape.id ? "on" : ""}`}
            onClick={() => {
              setShape(item);
              setUser([]);
              userRef.current = [];
              setDone(false);
            }}
          >
            {topicName(item.label)}
          </button>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="trace-pad"
        onPointerDown={(event) => {
          if (done) return;
          drawing.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          const start = [point(event)];
          userRef.current = start;
          setUser(start);
        }}
        onPointerMove={(event) => {
          if (!drawing.current || done) return;
          userRef.current = [...userRef.current, point(event)];
          setUser(userRef.current);
        }}
        onPointerUp={() => {
          if (!drawing.current || done) return;
          drawing.current = false;
          finishStroke(userRef.current);
        }}
      />
    </main>
  );
}

const toys: { id: string; emoji: string; cue?: Cue; say?: string; effect: string }[] = [
  { id: "cloud", emoji: "☁️", cue: "rain", effect: "rain" },
  { id: "cow", emoji: "🐄", cue: "moo", effect: "bounce" },
  { id: "lamp", emoji: "💡", say: "Light", effect: "glow" },
  { id: "flower", emoji: "🌱", say: "Grow", effect: "grow" },
  { id: "drum", emoji: "🥁", cue: "drum", effect: "bounce" },
  { id: "duck", emoji: "🦆", cue: "quack", effect: "splash" },
];

export function PlayroomScreen({
  muted,
  onToggleMute,
  onBack,
}: {
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const toy = toys.find((item) => item.id === active);

  return (
    <main className="screen">
      <TopBar tint="#2f9e44" ink="#fff" emoji="🧸" title={ui("toys")} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
      <div className={`playroom ${toy?.effect ?? ""}`}>
        {toy?.effect === "rain" && (
          <div className="rain" aria-hidden>
            {Array.from({ length: 12 }, (_, index) => (
              <i key={index} style={{ left: `${index * 8}%`, animationDelay: `${index * 0.08}s` }} />
            ))}
          </div>
        )}
        <div className="toy-grid">
          {toys.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`toy ${active === item.id ? item.effect : ""}`}
              onClick={() => {
                setActive(item.id);
                if (item.cue) void playCue(item.cue);
                else if (item.say) void speak(item.say);
              }}
            >
              {item.emoji}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

const buildPieces = [
  { id: "hat", emoji: "🎩", x: 8, y: 78, zoneX: 42, zoneY: 8 },
  { id: "nose", emoji: "🥕", x: 28, y: 78, zoneX: 46, zoneY: 36 },
  { id: "scarf", emoji: "🧣", x: 50, y: 78, zoneX: 34, zoneY: 48 },
  { id: "button", emoji: "⚫", x: 72, y: 78, zoneX: 46, zoneY: 60 },
];

export function BuildScreen({
  muted,
  onToggleMute,
  onBack,
}: {
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
}) {
  const [spots, setSpots] = useState(buildPieces.map((piece) => ({ ...piece, placed: false })));
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const board = useRef<HTMLDivElement>(null);
  const done = spots.every((piece) => piece.placed);
  const cheered = useRef(false);

  useEffect(() => {
    if (!done || cheered.current) return;
    cheered.current = true;
    awardStars("Build a picture", 1);
    playCheer();
    void speak(ui("buildDone"));
  }, [done]);

  function move(id: string, clientX: number, clientY: number) {
    const box = board.current?.getBoundingClientRect();
    if (!box || !drag.current) return;
    const x = ((clientX - box.left - drag.current.dx) / box.width) * 100;
    const y = ((clientY - box.top - drag.current.dy) / box.height) * 100;
    setSpots((current) => current.map((piece) => (piece.id === id ? { ...piece, x, y } : piece)));
  }

  return (
    <main className="screen">
      <TopBar tint="#3b82f6" ink="#fff" emoji="⛄" title={ui("build")} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
      <p className="intro">{done ? ui("buildDone") : ui("buildHint")}</p>
      <div
        className="build-board"
        ref={board}
        onPointerMove={(event) => {
          if (!drag.current) return;
          move(drag.current.id, event.clientX, event.clientY);
        }}
        onPointerUp={() => {
          const id = drag.current?.id;
          drag.current = null;
          if (!id) return;
          setSpots((current) =>
            current.map((piece) => {
              if (piece.id !== id || piece.placed) return piece;
              const near = Math.hypot(piece.x - piece.zoneX, piece.y - piece.zoneY) < 14;
              return near ? { ...piece, x: piece.zoneX, y: piece.zoneY, placed: true } : piece;
            }),
          );
        }}
      >
        <div className="snowman" aria-hidden>
          ⛄
        </div>
        {spots.map((piece) => (
          <button
            key={piece.id}
            type="button"
            className={`build-piece ${piece.placed ? "placed" : ""}`}
            style={{ left: `${piece.x}%`, top: `${piece.y}%` }}
            onPointerDown={(event) => {
              if (piece.placed) return;
              const box = board.current?.getBoundingClientRect();
              if (!box) return;
              const px = box.left + (piece.x / 100) * box.width;
              const py = box.top + (piece.y / 100) * box.height;
              drag.current = { id: piece.id, dx: event.clientX - px, dy: event.clientY - py };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
          >
            {piece.emoji}
          </button>
        ))}
      </div>
    </main>
  );
}

const colorSets: Record<string, { name: string; parts: { id: string; kind: "sky" | "ground" | "sun" | "house" | "extra" }[] }> = {
  garden: { name: "Garden", parts: [{ id: "sky", kind: "sky" }, { id: "sun", kind: "sun" }, { id: "ground", kind: "ground" }, { id: "house", kind: "house" }, { id: "extra", kind: "extra" }] },
  night: { name: "Night", parts: [{ id: "sky", kind: "sky" }, { id: "sun", kind: "sun" }, { id: "ground", kind: "ground" }, { id: "house", kind: "house" }, { id: "extra", kind: "extra" }] },
  farm: { name: "Farm", parts: [{ id: "sky", kind: "sky" }, { id: "sun", kind: "sun" }, { id: "ground", kind: "ground" }, { id: "house", kind: "house" }, { id: "extra", kind: "extra" }] },
};

const paints = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#a855f7"];

export function ColorScreen({
  scene,
  muted,
  onToggleMute,
  onBack,
}: {
  scene: string;
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
}) {
  const picture = colorSets[scene] ?? colorSets.garden;
  const [fills, setFills] = useState<Record<string, string>>({});
  const [paint, setPaint] = useState(paints[4]);
  const extras: Record<string, string> = { garden: "🌸", night: "⭐", farm: "🐄" };

  return (
    <main className="screen">
      <TopBar tint="#c77dff" ink="#fff" emoji="🎨" title={ui("colorPicture")} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
      <p className="intro">{ui("colorHint")}</p>
      <div className="paint-row">
        {paints.map((color) => (
          <button key={color} type="button" className={`paint ${paint === color ? "on" : ""}`} style={{ background: color }} onClick={() => setPaint(color)} aria-label={color} />
        ))}
      </div>
      <div className="color-page">
        {picture.parts.map((part) => (
          <button
            key={part.id}
            type="button"
            className={`color-part ${part.kind}`}
            style={{ background: fills[part.id] ?? undefined }}
            onClick={() => setFills((current) => ({ ...current, [part.id]: paint }))}
          >
            {part.kind === "extra" ? extras[scene] ?? "🌸" : ""}
          </button>
        ))}
      </div>
      <p className="counter">{topicName(picture.name)}</p>
    </main>
  );
}

export function GrownupsScreen({
  muted,
  onToggleMute,
  onBack,
}: {
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
}) {
  const child = getChild();
  const [name, setName] = useState(child.name);
  const [adding, setAdding] = useState("");

  useEffect(() => {
    setName(getChild().name);
  }, [child.id, child.name]);

  return (
    <main className="screen">
      <TopBar tint="#3b2a4a" ink="#fff" emoji="🧑" title={ui("grownups")} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
      <section className="block grown">
        <h2>{ui("child")}</h2>
        <div className="shortcut-row">
          {allChildren().map((item) => (
            <button key={item.id} type="button" className={`shortcut ${item.id === child.id ? "on" : ""}`} onClick={() => switchChild(item.id)}>
              {item.name}
            </button>
          ))}
        </div>
        <label className="field">
          {ui("name")}
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <button type="button" className="ghost" onClick={() => renameChild(name)}>
          {ui("name")}
        </button>
        <label className="field">
          {ui("addChild")}
          <input value={adding} onChange={(event) => setAdding(event.target.value)} />
        </label>
        <button
          type="button"
          className="primary"
          onClick={() => {
            addChild(adding);
            setAdding("");
          }}
        >
          {ui("addChild")}
        </button>
        <h2>{ui("language")}</h2>
        <div className="shortcut-row">
          {(["en", "hi", "mr"] as Lang[]).map((item) => (
            <button key={item} type="button" className={`shortcut ${child.lang === item ? "on" : ""}`} onClick={() => setLanguage(item)}>
              {ui(item === "en" ? "english" : item === "hi" ? "hindi" : "marathi")}
            </button>
          ))}
        </div>
        <label className="field check">
          <input type="checkbox" checked={restEnabled()} onChange={(event) => setRestEnabled(event.target.checked)} />
          {ui("reminder")}
        </label>
        <h2>{ui("progress")}</h2>
        {categories.map((category) => {
          const opened = category.topics.filter((topic) => starsFor(topic.title) > 0).length;
          return (
            <div key={category.id} className="progress-row">
              <span>{topicName(category.name)}</span>
              <div className="show-bar">
                <span style={{ width: `${(opened / category.topics.length) * 100}%` }} />
              </div>
              <small>
                {opened}/{category.topics.length}
              </small>
            </div>
          );
        })}
        <h2>{ui("notOpened")}</h2>
        <ul className="plain-list">
          {categories
            .flatMap((category) => category.topics)
            .filter((topic) => !child.opened.includes(topic.title) && starsFor(topic.title) === 0)
            .slice(0, 8)
            .map((topic) => (
              <li key={topic.title}>{topicName(topic.title)}</li>
            ))}
        </ul>
        <p className="intro">
          {ui("yourStars")}: ★ {walletStars()}
        </p>
      </section>
    </main>
  );
}

export function RestOverlay({ onStory, onDone }: { onStory: () => void; onDone: () => void }) {
  return (
    <div className="rest-overlay">
      <div className="done-card">
        <Mascot mood="think" />
        <h2>{ui("restTitle")}</h2>
        <p>{ui("restBody")}</p>
        <button type="button" className="primary" onClick={onStory}>
          {ui("readStory")}
        </button>
        <button type="button" className="ghost" onClick={onDone}>
          {ui("allDone")}
        </button>
      </div>
    </div>
  );
}

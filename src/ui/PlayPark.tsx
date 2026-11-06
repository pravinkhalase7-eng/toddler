import { useEffect, useMemo, useRef, useState } from "react";
import { playCheer, playTryAgain, speak, stopAudio } from "../audio";
import { shuffle } from "../data/helpers";
import { ui } from "../i18n";
import { awardStars } from "../progress";
import type { ShapeName } from "../types";
import { TopBar } from "./Chrome";
import { ShapeIcon } from "./Picture";

type GameId = "letters" | "numbers" | "colors" | "catch" | "feed" | "sounds" | "count" | "rain" | "shapes";

const games: { id: GameId; emoji: string; label: string }[] = [
  { id: "letters", emoji: "🎈", label: "letterBalloons" },
  { id: "numbers", emoji: "🔢", label: "numberBalloons" },
  { id: "colors", emoji: "🎨", label: "colorBalloons" },
  { id: "shapes", emoji: "⭐", label: "shapeBalloons" },
  { id: "catch", emoji: "🧺", label: "catchWord" },
  { id: "feed", emoji: "🐵", label: "feedAnimal" },
  { id: "sounds", emoji: "🫧", label: "popSound" },
  { id: "count", emoji: "🌟", label: "countPop" },
  { id: "rain", emoji: "🌧️", label: "letterRain" },
];

const abc: [string, string, string][] = [
  ["A", "🍎", "apple"],
  ["B", "⚽", "ball"],
  ["C", "🐱", "cat"],
  ["D", "🐶", "dog"],
  ["E", "🐘", "elephant"],
  ["F", "🐟", "fish"],
  ["G", "🐐", "goat"],
  ["H", "🎩", "hat"],
  ["I", "🧊", "ice"],
  ["J", "🧃", "juice"],
  ["K", "🪁", "kite"],
  ["L", "🦁", "lion"],
  ["M", "🌙", "moon"],
  ["N", "🪺", "nest"],
  ["O", "🍊", "orange"],
  ["P", "🐷", "pig"],
  ["Q", "👑", "queen"],
  ["R", "🌈", "rainbow"],
  ["S", "☀️", "sun"],
  ["T", "🐯", "tiger"],
  ["U", "☂️", "umbrella"],
  ["V", "🎻", "violin"],
  ["W", "🐋", "whale"],
  ["X", "🎵", "xylophone"],
  ["Y", "🪀", "yo-yo"],
  ["Z", "🦓", "zebra"],
];

const colors: [string, string][] = [
  ["red", "#ef4444"],
  ["orange", "#f97316"],
  ["yellow", "#facc15"],
  ["green", "#22c55e"],
  ["blue", "#3b82f6"],
  ["purple", "#a855f7"],
  ["pink", "#f472b6"],
  ["brown", "#92400e"],
];

const shapeSet: ShapeName[] = ["circle", "square", "triangle", "star", "heart", "oval", "diamond", "rectangle"];

const foods: { animal: string; say: string; emoji: string; choices: [string, string][] }[] = [
  { animal: "🐵", say: "banana", emoji: "🍌", choices: [["banana", "🍌"], ["apple", "🍎"], ["milk", "🥛"], ["cookie", "🍪"]] },
  { animal: "🐰", say: "carrot", emoji: "🥕", choices: [["carrot", "🥕"], ["cookie", "🍪"], ["fish", "🐟"], ["bread", "🍞"]] },
  { animal: "🐶", say: "bone", emoji: "🦴", choices: [["bone", "🦴"], ["banana", "🍌"], ["apple", "🍎"], ["cake", "🍰"]] },
  { animal: "🐱", say: "fish", emoji: "🐟", choices: [["fish", "🐟"], ["bone", "🦴"], ["carrot", "🥕"], ["milk", "🥛"]] },
];

const sounds = ["mmm", "aaa", "ooo", "ba", "ma", "da", "pa"];

const words = [
  ["apple", "🍎"],
  ["ball", "⚽"],
  ["cat", "🐱"],
  ["dog", "🐶"],
  ["fish", "🐟"],
  ["star", "⭐"],
  ["car", "🚗"],
  ["moon", "🌙"],
];

type Item = {
  id: string;
  label: string;
  emoji: string;
  color?: string;
  shape?: ShapeName;
  correct: boolean;
  x: number;
  y: number;
  vy: number;
  gone: boolean;
};

function rising(label: string, emoji: string, correct: boolean, extra: Partial<Item> = {}): Item {
  return { id: `${label}-${Math.random().toString(36).slice(2, 7)}`, label, emoji, correct, x: 0, y: 70 + Math.random() * 30, vy: -0.012 - Math.random() * 0.006, gone: false, ...extra };
}

function falling(label: string, emoji: string, correct: boolean): Item {
  return { id: `${label}-${Math.random().toString(36).slice(2, 7)}`, label, emoji, correct, x: 0, y: -10 - Math.random() * 30, vy: 0.018 + Math.random() * 0.01, gone: false };
}

function place(items: Item[]) {
  const xs = shuffle(items.map((_, index) => 12 + index * (76 / Math.max(1, items.length - 1))));
  return items.map((item, index) => ({ ...item, x: xs[index] ?? 50 }));
}

function build(mode: GameId): { say: string; banner: string; items: Item[] } {
  if (mode === "letters") {
    const target = abc[Math.floor(Math.random() * abc.length)];
    const others = shuffle(abc.filter((item) => item[0] !== target[0])).slice(0, 3);
    return { say: target[0], banner: target[0], items: place(shuffle([target, ...others]).map((item) => rising(item[0], "🎈", item[0] === target[0]))) };
  }
  if (mode === "numbers") {
    const target = String(1 + Math.floor(Math.random() * 9));
    const others = shuffle(["1", "2", "3", "4", "5", "6", "7", "8", "9"].filter((item) => item !== target)).slice(0, 3);
    return { say: target, banner: target, items: place(shuffle([target, ...others]).map((item) => rising(item, "🎈", item === target))) };
  }
  if (mode === "colors") {
    const target = colors[Math.floor(Math.random() * colors.length)];
    const others = shuffle(colors.filter((item) => item[0] !== target[0])).slice(0, 3);
    return {
      say: target[0],
      banner: target[0],
      items: place(shuffle([target, ...others]).map((item) => rising(item[0], "", item[0] === target[0], { color: item[1] }))),
    };
  }
  if (mode === "shapes") {
    const target = shapeSet[Math.floor(Math.random() * shapeSet.length)];
    const others = shuffle(shapeSet.filter((item) => item !== target)).slice(0, 3);
    return { say: target, banner: target, items: place(shuffle([target, ...others]).map((item) => rising(item, "", item === target, { shape: item }))) };
  }
  if (mode === "catch" || mode === "feed") {
    const target = words[Math.floor(Math.random() * words.length)];
    const others = shuffle(words.filter((item) => item[0] !== target[0])).slice(0, 2);
    return {
      say: target[0],
      banner: `${target[1]} ${target[0]}`,
      items: place(shuffle([target, ...others]).map((item) => falling(item[0], item[1], item[0] === target[0]))),
    };
  }
  const target = abc[Math.floor(Math.random() * abc.length)];
  const decoys = shuffle(abc.filter((item) => item[0] !== target[0])).slice(0, 3);
  const copies = [target, target, ...decoys, decoys[0]];
  return {
    say: `${target[0]} for ${target[2]}`,
    banner: `${target[0]} ${target[1]}`,
    items: place(shuffle(copies).map((item) => falling(item[0], item[0], item[0] === target[0]))),
  };
}

export function PlayParkScreen({
  muted,
  onToggleMute,
  onBack,
}: {
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
}) {
  const [game, setGame] = useState<GameId | null>(null);
  if (!game) {
    return (
      <main className="screen">
        <TopBar tint="#0ea5e9" ink="#fff" emoji="🎈" title={ui("playPark")} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
        <p className="intro">{ui("playParkHint")}</p>
        <div className="topic-list">
          {games.map((item) => (
            <button key={item.id} type="button" className="topic-row" onClick={() => setGame(item.id)}>
              <span className="topic-badge">{item.emoji}</span>
              <span className="topic-copy">
                <strong>{ui(item.label)}</strong>
              </span>
            </button>
          ))}
        </div>
      </main>
    );
  }
  return <GameScreen mode={game} muted={muted} onToggleMute={onToggleMute} onBack={() => setGame(null)} />;
}

function GameScreen({
  mode,
  muted,
  onToggleMute,
  onBack,
}: {
  mode: GameId;
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
}) {
  const meta = games.find((item) => item.id === mode) ?? games[0];
  return (
    <main className="screen">
      <TopBar tint="#0ea5e9" ink="#fff" emoji={meta.emoji} title={ui(meta.label)} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
      {mode === "feed" && <FeedGame />}
      {mode === "sounds" && <SoundGame />}
      {mode === "count" && <CountGame />}
      {(mode === "letters" || mode === "numbers" || mode === "colors" || mode === "shapes" || mode === "catch" || mode === "rain") && <SkyGame mode={mode} />}
    </main>
  );
}

function SkyGame({ mode }: { mode: GameId }) {
  const [round, setRound] = useState(0);
  const [banner, setBanner] = useState("");
  const [floaters, setFloaters] = useState<Item[]>([]);
  const [basket, setBasket] = useState(50);
  const [wrong, setWrong] = useState<string | null>(null);
  const floatersRef = useRef<Item[]>([]);
  const basketRef = useRef(50);
  const wonRef = useRef(false);
  const roundRef = useRef(0);

  useEffect(() => {
    const token = round;
    roundRef.current = round;
    wonRef.current = false;
    const made = build(mode);
    floatersRef.current = made.items;
    setFloaters(made.items);
    setBanner(made.banner);
    void speak(made.say);
    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      if (roundRef.current !== token) return;
      const dt = Math.min(40, now - last);
      last = now;
      let rainMiss = false;
      let catchMiss = false;
      floatersRef.current = floatersRef.current.map((item) => {
        if (item.gone) return item;
        let y = item.y + item.vy * dt;
        if (item.vy < 0 && y < -18) y = 108;
        if (mode === "catch" && y > 78 && y < 98 && Math.abs(item.x - basketRef.current) < 12) {
          if (item.correct && !wonRef.current) {
            wonRef.current = true;
            playCheer();
            awardStars(mode, 1);
            window.setTimeout(() => setRound((value) => value + 1), 650);
          }
          if (!item.correct) void playTryAgain();
          return { ...item, gone: true, y };
        }
        if (mode === "rain" && item.correct && y > 104) {
          y = -12;
          rainMiss = true;
        }
        if (mode === "rain" && !item.correct && y > 108) return { ...item, gone: true };
        if (mode === "catch" && item.correct && y > 108) catchMiss = true;
        return { ...item, y };
      });
      if (rainMiss) void playTryAgain();
      if (catchMiss && !wonRef.current) {
        wonRef.current = true;
        void playTryAgain();
        window.setTimeout(() => setRound((value) => value + 1), 500);
      }
      if (mode === "rain" && !wonRef.current && floatersRef.current.some((item) => item.correct) && floatersRef.current.filter((item) => item.correct).every((item) => item.gone)) {
        wonRef.current = true;
        playCheer();
        awardStars(mode, 1);
        window.setTimeout(() => setRound((value) => value + 1), 650);
      }
      setFloaters(floatersRef.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      stopAudio();
    };
  }, [mode, round]);

  function moveBasket(board: HTMLDivElement, clientX: number) {
    if (mode !== "catch") return;
    const box = board.getBoundingClientRect();
    const x = ((clientX - box.left) / box.width) * 100;
    basketRef.current = x;
    setBasket(x);
  }

  function tap(item: Item) {
    if (item.gone || wonRef.current || mode === "catch") return;
    if (!item.correct) {
      setWrong(item.id);
      void playTryAgain();
      window.setTimeout(() => setWrong(null), 400);
      return;
    }
    floatersRef.current = floatersRef.current.map((entry) => (entry.id === item.id ? { ...entry, gone: true } : entry));
    setFloaters(floatersRef.current);
    const pending = floatersRef.current.some((entry) => entry.correct && !entry.gone);
    if (!pending) {
      wonRef.current = true;
      playCheer();
      void speak(ui("yes"));
      awardStars(mode, 1);
      window.setTimeout(() => setRound((value) => value + 1), 650);
    }
  }

  return (
    <>
      <p className="prompt-banner">{banner}</p>
      <div
        className="sky-play"
        onPointerDown={(event) => moveBasket(event.currentTarget, event.clientX)}
        onPointerMove={(event) => moveBasket(event.currentTarget, event.clientX)}
      >
        {floaters.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`floater ${item.gone ? "gone" : ""} ${wrong === item.id ? "shake" : ""}`}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            onPointerDown={() => tap(item)}
          >
            <span className="balloon-face" style={{ background: item.color ?? "#38bdf8" }}>
              {item.shape ? <ShapeIcon shape={item.shape} className="shape-svg tiny" /> : item.vy < 0 ? item.label : item.emoji}
            </span>
          </button>
        ))}
        {mode === "catch" && (
          <div className="basket" style={{ left: `${basket}%` }}>
            🧺
          </div>
        )}
      </div>
    </>
  );
}

function FeedGame() {
  const [round, setRound] = useState(0);
  const [wrong, setWrong] = useState("");
  const meal = foods[round % foods.length];
  const choices = useMemo(() => shuffle(meal.choices), [round, meal.choices]);

  useEffect(() => {
    void speak(meal.say);
    return () => stopAudio();
  }, [meal.say, round]);

  return (
    <>
      <p className="prompt-banner">{meal.emoji}</p>
      <div className="animal-face">{meal.animal}</div>
      <div className="feed-grid">
        {choices.map(([name, emoji]) => (
          <button
            key={name}
            type="button"
            className={`shop-card ${wrong === name ? "shake" : ""}`}
            onClick={() => {
              if (name !== meal.say) {
                setWrong(name);
                void playTryAgain();
                window.setTimeout(() => setWrong(""), 400);
                return;
              }
              playCheer();
              void speak(ui("yes"));
              awardStars("feed", 1);
              window.setTimeout(() => setRound((value) => value + 1), 600);
            }}
          >
            <span className="opt-emoji">{emoji}</span>
            <span>{name}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function SoundGame() {
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState(sounds[0]);
  const [options, setOptions] = useState(sounds.slice(0, 4));
  const [wrong, setWrong] = useState("");

  useEffect(() => {
    const next = sounds[Math.floor(Math.random() * sounds.length)];
    const rest = shuffle(sounds.filter((item) => item !== next)).slice(0, 3);
    setTarget(next);
    setOptions(shuffle([next, ...rest]));
    void speak(next);
    return () => stopAudio();
  }, [round]);

  return (
    <>
      <p className="prompt-banner">{target}</p>
      <div className="feed-grid">
        {options.map((sound) => (
          <button
            key={sound}
            type="button"
            className={`shop-card ${wrong === sound ? "shake" : ""}`}
            onClick={() => {
              if (sound !== target) {
                setWrong(sound);
                void playTryAgain();
                window.setTimeout(() => setWrong(""), 400);
                return;
              }
              playCheer();
              awardStars("sounds-pop", 1);
              window.setTimeout(() => setRound((value) => value + 1), 550);
            }}
          >
            <span className="opt-emoji">🫧</span>
            <span>{sound}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function CountGame() {
  const [round, setRound] = useState(0);
  const [need, setNeed] = useState(2);
  const [tapped, setTapped] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const [cells, setCells] = useState<number[]>([0, 1, 2, 3, 4, 5]);

  useEffect(() => {
    const count = 1 + Math.floor(Math.random() * 3);
    setNeed(count);
    setTapped([]);
    setCells(shuffle([0, 1, 2, 3, 4, 5]));
    void speak(String(count));
    return () => stopAudio();
  }, [round]);

  return (
    <>
      <p className="prompt-banner">
        {need} ⭐
      </p>
      <p className="counter">
        {tapped.length} / {need}
      </p>
      <div className="feed-grid">
        {cells.map((id) => {
          const star = id < 4;
          const used = tapped.includes(id);
          return (
            <button
              key={`${round}-${id}`}
              type="button"
              className={`shop-card ${wrong === id ? "shake" : ""} ${used ? "on" : ""}`}
              onClick={() => {
                if (used) return;
                if (!star) {
                  setWrong(id);
                  void playTryAgain();
                  window.setTimeout(() => setWrong(null), 400);
                  return;
                }
                const next = [...tapped, id];
                setTapped(next);
                if (next.length > need) {
                  void playTryAgain();
                  return;
                }
                if (next.length === need) {
                  playCheer();
                  void speak(ui("yes"));
                  awardStars("count-pop", 1);
                  window.setTimeout(() => setRound((value) => value + 1), 600);
                }
              }}
            >
              <span className="opt-emoji">{used ? "💥" : star ? "⭐" : "❤️"}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

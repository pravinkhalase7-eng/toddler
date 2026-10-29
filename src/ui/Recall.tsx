import { useEffect, useRef, useState, type ReactNode } from "react";
import { playCheer, playCue, playSuccess, playTryAgain, speak, stopAudio } from "../audio";
import { shuffle } from "../data/helpers";
import { labelWord, ui } from "../i18n";
import { awardStars, getLang } from "../progress";
import type { Cue } from "../types";
import { Mascot, TopBar } from "./Chrome";

const TOTAL = 3;

const places = [
  { word: "Apple", emoji: "🍎" },
  { word: "Ball", emoji: "⚽" },
  { word: "Fish", emoji: "🐟" },
  { word: "Moon", emoji: "🌙" },
  { word: "Star", emoji: "⭐" },
  { word: "Cat", emoji: "🐱" },
  { word: "Dog", emoji: "🐶" },
  { word: "Car", emoji: "🚗" },
  { word: "Duck", emoji: "🦆" },
];

const animals: { word: string; emoji: string; cue: Cue }[] = [
  { word: "Cow", emoji: "🐄", cue: "moo" },
  { word: "Duck", emoji: "🦆", cue: "quack" },
  { word: "Dog", emoji: "🐶", cue: "bark" },
  { word: "Cat", emoji: "🐱", cue: "meow" },
];

const paints = [
  { word: "Red", hex: "#ef4444" },
  { word: "Yellow", hex: "#facc15" },
  { word: "Blue", hex: "#3b82f6" },
  { word: "Green", hex: "#22c55e" },
  { word: "Purple", hex: "#a855f7" },
  { word: "Pink", hex: "#ec4899" },
];

type Pic = { word: string; emoji: string };

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function whereWas(word: string) {
  const name = labelWord(word);
  const lang = getLang();
  if (lang === "hi") return `${name} कहाँ था?`;
  if (lang === "mr") return `${name} कुठे होते?`;
  return `Where was the ${name}?`;
}

function Frame({
  tint,
  emoji,
  title,
  hint,
  round,
  won,
  muted,
  onToggleMute,
  onBack,
  onAgain,
  children,
}: {
  tint: string;
  emoji: string;
  title: string;
  hint: string;
  round: number;
  won: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
  onAgain: () => void;
  children: ReactNode;
}) {
  return (
    <main className="screen">
      <TopBar tint={tint} ink="#fff" emoji={emoji} title={title} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
      <p className="intro">{won ? ui("youDidIt") : hint}</p>
      <p className="counter">
        {won ? TOTAL : round} / {TOTAL}
      </p>
      {won ? (
        <>
          <Mascot mood="jump" />
          <button type="button" className="primary" onClick={onAgain}>
            {ui("playAgain")}
          </button>
        </>
      ) : (
        children
      )}
    </main>
  );
}

function useWin(title: string, won: boolean) {
  const cheered = useRef(false);
  useEffect(() => {
    if (!won) {
      cheered.current = false;
      return;
    }
    if (cheered.current) return;
    cheered.current = true;
    awardStars(title, 1);
    void (async () => {
      await playSuccess();
      await speak(ui("youDidIt"));
    })();
  }, [title, won]);
}

function Picture({
  item,
  className,
  onClick,
  hidden,
}: {
  item: Pic;
  className?: string;
  onClick?: () => void;
  hidden?: boolean;
}) {
  return (
    <button type="button" className={`same-tile ${hidden ? "down" : ""} ${className ?? ""}`} data-word={item.word} onClick={onClick} aria-label={hidden ? ui("whereGame") : labelWord(item.word)}>
      {hidden ? (
        <span className="same-emoji">✦</span>
      ) : (
        <>
          <span className="same-emoji">{item.emoji}</span>
          <span>{labelWord(item.word)}</span>
        </>
      )}
    </button>
  );
}

const oddSets: { word: string; emoji: string; odd?: boolean }[][] = [
  [
    { word: "Dog", emoji: "🐶" },
    { word: "Dog", emoji: "🐶" },
    { word: "Dog", emoji: "🐶" },
    { word: "Cat", emoji: "🐱", odd: true },
  ],
  [
    { word: "Apple", emoji: "🍎" },
    { word: "Apple", emoji: "🍎" },
    { word: "Apple", emoji: "🍎" },
    { word: "Banana", emoji: "🍌", odd: true },
  ],
  [
    { word: "Star", emoji: "⭐" },
    { word: "Star", emoji: "⭐" },
    { word: "Star", emoji: "⭐" },
    { word: "Heart", emoji: "❤️", odd: true },
  ],
];

function makeOdd(index: number) {
  const items = shuffle(oddSets[index % oddSets.length]).map((item, place) => ({
    ...item,
    id: `${item.word}-${place}-${Math.random().toString(36).slice(2, 6)}`,
  }));
  return { items, answer: items.find((item) => item.odd)! };
}

export function OddScreen(props: ScreenProps) {
  const [index, setIndex] = useState(0);
  const [round, setRound] = useState(() => makeOdd(0));
  const [won, setWon] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const misses = useRef(0);
  const lock = useRef(false);
  useWin("Odd one out", won);

  useEffect(() => {
    if (won) return;
    setPicked(null);
    setHelp(false);
    misses.current = 0;
    lock.current = false;
    void speak(ui("oddHint"));
    return () => stopAudio();
  }, [round, won]);

  function again() {
    setWon(false);
    setIndex(0);
    setRound(makeOdd(0));
  }

  function next() {
    if (index + 1 >= TOTAL) {
      setWon(true);
      return;
    }
    const following = index + 1;
    setIndex(following);
    setRound(makeOdd(following));
  }

  function choose(id: string) {
    if (lock.current) return;
    const item = round.items.find((entry) => entry.id === id);
    if (!item) return;
    if (item.odd) {
      lock.current = true;
      setPicked(id);
      playCheer();
      void speak(`${ui("yes")} ${labelWord(item.word)}`);
      window.setTimeout(next, 900);
      return;
    }
    misses.current += 1;
    setPicked(id);
    void playTryAgain();
    if (misses.current >= 2) {
      lock.current = true;
      setHelp(true);
      void speak(`${ui("thisOne")} ${labelWord(round.answer.word)}`);
      window.setTimeout(next, 1100);
      return;
    }
    window.setTimeout(() => setPicked(null), 400);
  }

  return (
    <Frame {...props} tint="#0d9488" emoji="👀" title={ui("odd")} hint={ui("oddHint")} round={index + 1} won={won} onAgain={again}>
      <div className="recall odd-grid" data-answer={round.answer.word}>
        {round.items.map((item) => (
          <Picture
            key={item.id}
            item={item}
            className={`${picked === item.id && item.odd ? "matched" : ""} ${help && item.odd ? "matched" : ""} ${picked === item.id && !item.odd ? "shake" : ""}`}
            onClick={() => choose(item.id)}
          />
        ))}
      </div>
    </Frame>
  );
}

function makeWhere() {
  return { cards: shuffle(places), target: places[Math.floor(Math.random() * places.length)] };
}

export function WhereScreen(props: ScreenProps) {
  const [round, setRound] = useState(makeWhere);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"look" | "ask">("look");
  const [won, setWon] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const misses = useRef(0);
  const lock = useRef(false);
  useWin("Where was it", won);

  useEffect(() => {
    if (won) return;
    let cancel = false;
    setPhase("look");
    setOpen(null);
    setHelp(false);
    misses.current = 0;
    lock.current = false;
    void speak(whereWas(round.target.word));
    const timer = window.setTimeout(() => {
      if (cancel) return;
      setPhase("ask");
      void speak(whereWas(round.target.word));
    }, 1800);
    return () => {
      cancel = true;
      window.clearTimeout(timer);
      stopAudio();
    };
  }, [round, won]);

  function again() {
    setWon(false);
    setIndex(0);
    setRound(makeWhere());
  }

  function next() {
    if (index + 1 >= TOTAL) {
      setWon(true);
      return;
    }
    setIndex(index + 1);
    setRound(makeWhere());
  }

  function choose(word: string) {
    if (lock.current || phase !== "ask") return;
    if (word === round.target.word) {
      lock.current = true;
      setOpen(word);
      playCheer();
      void speak(`${ui("yes")} ${labelWord(word)}`);
      window.setTimeout(next, 900);
      return;
    }
    misses.current += 1;
    void playTryAgain();
    if (misses.current >= 2) {
      lock.current = true;
      setHelp(true);
      setOpen(round.target.word);
      void speak(`${ui("thisOne")} ${labelWord(round.target.word)}`);
      window.setTimeout(next, 1100);
    }
  }

  return (
      <Frame {...props} tint="#7c3aed" emoji="🙈" title={ui("whereGame")} hint={whereWas(round.target.word)} round={index + 1} won={won} onAgain={again}>
      <div className="recall" data-phase={phase} data-answer={round.target.word}>
        <div className="recall-row where-grid">
          {round.cards.map((item) => (
            <Picture
              key={item.word}
              item={item}
              hidden={phase === "ask" && open !== item.word && !(help && item.word === round.target.word)}
              className={`${phase === "look" && item.word === round.target.word ? "picked" : ""} ${open === item.word || (help && item.word === round.target.word) ? "matched" : ""}`}
              onClick={() => choose(item.word)}
            />
          ))}
        </div>
      </div>
    </Frame>
  );
}

function makeSounds() {
  const order = shuffle(animals).slice(0, 2);
  const extra = shuffle(animals.filter((item) => !order.some((picked) => picked.word === item.word)))[0];
  return { order, choices: shuffle([...order, extra]) };
}

export function SoundsScreen(props: ScreenProps) {
  const [round, setRound] = useState(makeSounds);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"listen" | "tap">("listen");
  const [won, setWon] = useState(false);
  const [glow, setGlow] = useState<string | null>(null);
  const stepRef = useRef(0);
  const misses = useRef(0);
  const lock = useRef(false);
  useWin("Copy the sounds", won);

  useEffect(() => {
    if (won) return;
    let cancel = false;
    setPhase("listen");
    stepRef.current = 0;
    setGlow(null);
    misses.current = 0;
    lock.current = true;
    void (async () => {
      for (const animal of round.order) {
        if (cancel) return;
        setGlow(animal.word);
        await playCue(animal.cue);
        await wait(250);
      }
      if (cancel) return;
      setGlow(null);
      lock.current = false;
      setPhase("tap");
      void speak(ui("soundsHint"));
    })();
    return () => {
      cancel = true;
      stopAudio();
    };
  }, [round, won]);

  function again() {
    setWon(false);
    setIndex(0);
    setRound(makeSounds());
  }

  function next() {
    if (index + 1 >= TOTAL) {
      setWon(true);
      return;
    }
    setIndex(index + 1);
    setRound(makeSounds());
  }

  function choose(word: string) {
    if (lock.current || phase !== "tap") return;
    if (word !== round.order[stepRef.current].word) {
      misses.current += 1;
      stepRef.current = 0;
      setGlow(null);
      void playTryAgain();
      if (misses.current >= 2) {
        lock.current = true;
        void (async () => {
          for (const animal of round.order) {
            setGlow(animal.word);
            await playCue(animal.cue);
            await wait(200);
          }
          next();
        })();
      }
      return;
    }
    const nextStep = stepRef.current + 1;
    stepRef.current = nextStep;
    setGlow(word);
    if (nextStep >= round.order.length) {
      lock.current = true;
      playCheer();
      void speak(ui("yes"));
      window.setTimeout(next, 900);
      return;
    }
    void playCue(round.order[nextStep - 1].cue);
  }

  return (
    <Frame {...props} tint="#2f9e44" emoji="🐄" title={ui("sounds")} hint={ui("soundsHint")} round={index + 1} won={won} onAgain={again}>
      <div className="recall" data-phase={phase} data-order={round.order.map((item) => item.word).join(",")}>
        <div className="recall-row">
          {round.choices.map((item) => (
            <Picture key={item.word} item={item} className={glow === item.word ? "picked" : ""} onClick={() => choose(item.word)} />
          ))}
        </div>
      </div>
    </Frame>
  );
}

function makeFlash() {
  const choices = shuffle(paints).slice(0, 3);
  return { choices, target: choices[Math.floor(Math.random() * choices.length)] };
}

export function FlashScreen(props: ScreenProps) {
  const [round, setRound] = useState(makeFlash);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"flash" | "pick">("flash");
  const [won, setWon] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const misses = useRef(0);
  const lock = useRef(false);
  useWin("Color flash", won);

  useEffect(() => {
    if (won) return;
    let cancel = false;
    setPhase("flash");
    setPicked(null);
    setHelp(false);
    misses.current = 0;
    lock.current = false;
    void speak(labelWord(round.target.word));
    const timer = window.setTimeout(() => {
      if (cancel) return;
      setPhase("pick");
      void speak(ui("flashHint"));
    }, 1400);
    return () => {
      cancel = true;
      window.clearTimeout(timer);
      stopAudio();
    };
  }, [round, won]);

  function again() {
    setWon(false);
    setIndex(0);
    setRound(makeFlash());
  }

  function next() {
    if (index + 1 >= TOTAL) {
      setWon(true);
      return;
    }
    setIndex(index + 1);
    setRound(makeFlash());
  }

  function choose(word: string) {
    if (lock.current || phase !== "pick") return;
    if (word === round.target.word) {
      lock.current = true;
      setPicked(word);
      playCheer();
      void speak(`${ui("yes")} ${labelWord(word)}`);
      window.setTimeout(next, 900);
      return;
    }
    misses.current += 1;
    setPicked(word);
    void playTryAgain();
    if (misses.current >= 2) {
      lock.current = true;
      setHelp(true);
      void speak(`${ui("thisOne")} ${labelWord(round.target.word)}`);
      window.setTimeout(next, 1100);
      return;
    }
    window.setTimeout(() => setPicked(null), 400);
  }

  return (
    <Frame {...props} tint="#f97316" emoji="🔴" title={ui("flash")} hint={ui("flashHint")} round={index + 1} won={won} onAgain={again}>
      <div className="recall" data-phase={phase} data-answer={round.target.word}>
        <div className="recall-row">
          {round.choices.map((color) => (
            <button
              key={color.word}
              type="button"
              className={`color-dot ${phase === "flash" && color.word === round.target.word ? "flash" : ""} ${picked === color.word && color.word === round.target.word ? "matched" : ""} ${help && color.word === round.target.word ? "matched" : ""}`}
              style={{ background: color.hex }}
              data-word={color.word}
              aria-label={labelWord(color.word)}
              onClick={() => choose(color.word)}
            />
          ))}
        </div>
      </div>
    </Frame>
  );
}

type ScreenProps = {
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
};

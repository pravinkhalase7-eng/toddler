import { useEffect, useRef, useState } from "react";
import { playCheer, playCue, playSuccess, playTryAgain, speak } from "../audio";
import { shuffle } from "../data/helpers";
import { labelWord, ui } from "../i18n";
import { awardStars } from "../progress";
import { Mascot, TopBar } from "./Chrome";

const faces = [
  { pair: "Cow", emoji: "🐄" },
  { pair: "Duck", emoji: "🦆" },
  { pair: "Dog", emoji: "🐶" },
  { pair: "Cat", emoji: "🐱" },
  { pair: "Sun", emoji: "☀️" },
  { pair: "Star", emoji: "⭐" },
];

type Card = { id: string; pair: string; emoji: string };

function deal(): Card[] {
  return shuffle(
    faces.flatMap((face) => [
      { id: `${face.pair}-a-${Math.random().toString(36).slice(2, 6)}`, ...face },
      { id: `${face.pair}-b-${Math.random().toString(36).slice(2, 6)}`, ...face },
    ]),
  );
}

export function MemoryScreen({
  muted,
  onToggleMute,
  onBack,
}: {
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
}) {
  const [cards, setCards] = useState(deal);
  const [up, setUp] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const upRef = useRef<string[]>([]);
  const matchedRef = useRef<string[]>([]);
  const lockRef = useRef(false);
  const cheered = useRef(false);
  const won = matched.length === faces.length;

  useEffect(() => {
    if (!won || cheered.current) return;
    cheered.current = true;
    awardStars("Memory", 1);
    void (async () => {
      await playSuccess();
      await speak(ui("memoryDone"));
    })();
  }, [won]);

  function reset() {
    lockRef.current = false;
    upRef.current = [];
    matchedRef.current = [];
    cheered.current = false;
    setUp([]);
    setMatched([]);
    setCards(deal());
  }

  function flip(card: Card) {
    if (lockRef.current || matchedRef.current.includes(card.pair) || upRef.current.includes(card.id)) return;
    const next = [...upRef.current, card.id];
    if (next.length > 2) return;
    upRef.current = next;
    setUp(next);
    void playCue("pop");
    if (next.length < 2) return;

    lockRef.current = true;
    const [first, second] = next.map((id) => cards.find((item) => item.id === id)!);
    if (first.pair === second.pair) {
      window.setTimeout(() => {
        matchedRef.current = [...matchedRef.current, first.pair];
        setMatched(matchedRef.current);
        upRef.current = [];
        setUp([]);
        lockRef.current = false;
        playCheer();
        void speak(labelWord(first.pair));
      }, 420);
      return;
    }
    void playTryAgain();
    window.setTimeout(() => {
      upRef.current = [];
      setUp([]);
      lockRef.current = false;
    }, 900);
  }

  return (
    <main className="screen">
      <TopBar tint="#8b5cf6" ink="#fff" emoji="🃏" title={ui("memory")} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
      <p className="intro">{won ? ui("memoryDone") : ui("memoryHint")}</p>
      <p className="counter">
        {matched.length} / {faces.length}
      </p>
      {won && <Mascot mood="jump" />}
      <div className="memory-grid">
        {cards.map((card) => {
          const open = up.includes(card.id) || matched.includes(card.pair);
          return (
            <button
              key={card.id}
              type="button"
              className={`mem-card ${open ? "up" : ""} ${matched.includes(card.pair) ? "matched" : ""}`}
              data-pair={card.pair}
              onClick={() => flip(card)}
              aria-label={open ? labelWord(card.pair) : ui("memory")}
            >
              <span className="mem-inner">
                <span className="mem-face mem-back" aria-hidden>
                  ✦
                </span>
                <span className="mem-face mem-front">
                  <span className="mem-emoji">{card.emoji}</span>
                  <span className="mem-word">{labelWord(card.pair)}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {won && (
        <button type="button" className="primary" onClick={reset}>
          {ui("playAgain")}
        </button>
      )}
    </main>
  );
}

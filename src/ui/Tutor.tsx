import { useEffect, useRef, useState } from "react";
import { hearWord, playCheer, playSuccess, playTryAgain, saidWord, speak, stopAudio } from "../audio";
import { shuffle } from "../data/helpers";
import { ui } from "../i18n";
import { awardStars } from "../progress";
import { Mascot, TopBar } from "./Chrome";

const objects = [
  { word: "apple", emoji: "🍎" },
  { word: "ball", emoji: "⚽" },
  { word: "cat", emoji: "🐱" },
  { word: "dog", emoji: "🐶" },
  { word: "fish", emoji: "🐟" },
  { word: "sun", emoji: "☀️" },
  { word: "moon", emoji: "🌙" },
  { word: "star", emoji: "⭐" },
  { word: "car", emoji: "🚗" },
  { word: "book", emoji: "📚" },
  { word: "milk", emoji: "🥛" },
  { word: "shoe", emoji: "👟" },
];

export function TutorScreen({
  muted,
  onToggleMute,
  onBack,
}: {
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
}) {
  const [round, setRound] = useState(() => shuffle(objects));
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"ask" | "listen" | "yes" | "no">("ask");
  const [misses, setMisses] = useState(0);
  const [heard, setHeard] = useState("");
  const item = round[index];
  const done = index >= round.length;
  const celebrated = useRef(false);

  useEffect(() => {
    if (done || !item) return;
    setPhase("ask");
    setHeard("");
    void speak(`${ui("whatIs")} ${ui("yourTurn")}`);
    return () => stopAudio();
  }, [item, done]);

  async function listen() {
    if (!item || phase === "listen") return;
    setPhase("listen");
    setHeard("");
    const said = await hearWord();
    setHeard(said);
    if (saidWord(said, item.word)) {
      setPhase("yes");
      playCheer();
      await speak(`${ui("yes")} ${item.word}.`);
      window.setTimeout(() => setIndex((value) => value + 1), 900);
      return;
    }
    const nextMiss = misses + 1;
    setMisses(nextMiss);
    setPhase("no");
    void playTryAgain();
    if (nextMiss >= 2) {
      await speak(`${ui("thisIs")} ${item.word}. ${ui("say")} ${item.word}.`);
      return;
    }
    await speak(`${ui("tryAgain")}. ${ui("whatIs")}`);
  }

  function nextAfterReveal() {
    setMisses(0);
    setIndex((value) => value + 1);
  }

  useEffect(() => {
    if (!done || celebrated.current) return;
    celebrated.current = true;
    awardStars("Talking tutor", 1);
    void playSuccess();
  }, [done]);

  if (done) {
    return (
      <main className="screen">
        <TopBar tint="#0d9488" ink="#fff" emoji="🗣️" title={ui("tutor")} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
        <Mascot mood="jump" />
        <h2>{ui("tutorDone")}</h2>
        <button
          type="button"
          className="primary"
          onClick={() => {
            celebrated.current = false;
            setRound(shuffle(objects));
            setIndex(0);
            setMisses(0);
          }}
        >
          {ui("playAgain")}
        </button>
      </main>
    );
  }

  return (
    <main className="screen">
      <TopBar tint="#0d9488" ink="#fff" emoji="🗣️" title={ui("tutor")} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
      <p className="intro">{ui("tutorHint")}</p>
      <p className="counter">
        {index + 1} / {round.length}
      </p>
      <div className="tutor-card">
        <span>{item.emoji}</span>
        <p>{phase === "yes" || misses >= 2 ? item.word : ui("whatIs")}</p>
        {heard && <small>{heard}</small>}
      </div>
      <button type="button" className="primary" onClick={() => void listen()} disabled={phase === "listen" || phase === "yes"}>
        {phase === "listen" ? ui("listening") : ui("yourTurn")}
      </button>
      {misses >= 2 && phase === "no" && (
        <button type="button" className="ghost" onClick={nextAfterReveal}>
          {ui("next")}
        </button>
      )}
    </main>
  );
}

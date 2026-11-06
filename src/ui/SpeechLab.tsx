import { useState } from "react";
import { hearWord, playCheer, playCue, playTryAgain, saidWord, speak } from "../audio";
import { ui } from "../i18n";
import { awardStars } from "../progress";
import type { Cue } from "../types";
import { TopBar } from "./Chrome";

type Drill = { id: string; title: string; hint: string; items: { say: string; show: string; cue?: Cue }[] };

const drills: Drill[] = [
  {
    id: "sounds",
    title: "Easy sounds",
    hint: "Hear the sound, then you make it.",
    items: [
      { say: "mmm", show: "👄" },
      { say: "ahh", show: "😮" },
      { say: "ooo", show: "😗" },
      { say: "eee", show: "😁" },
      { say: "ppp", show: "😗" },
      { say: "bbb", show: "👄" },
    ],
  },
  {
    id: "syllables",
    title: "Little syllables",
    hint: "Copy the beat of the sound.",
    items: [
      { say: "ma", show: "👶" },
      { say: "ba", show: "⚽" },
      { say: "da", show: "👋" },
      { say: "pa", show: "👏" },
      { say: "na", show: "👃" },
      { say: "ga", show: "🚗" },
    ],
  },
  {
    id: "words",
    title: "First words",
    hint: "Say one small word.",
    items: [
      { say: "hi", show: "👋" },
      { say: "bye", show: "👋" },
      { say: "more", show: "➕" },
      { say: "mama", show: "👩" },
      { say: "dada", show: "👨" },
      { say: "ball", show: "⚽" },
      { say: "up", show: "⬆️" },
      { say: "milk", show: "🥛" },
      { say: "no", show: "🙅" },
      { say: "yes", show: "🙆" },
    ],
  },
  {
    id: "animals",
    title: "Animal talk",
    hint: "The animal talks. Then you talk.",
    items: [
      { say: "moo", show: "🐄", cue: "moo" },
      { say: "woof", show: "🐶", cue: "bark" },
      { say: "quack", show: "🦆", cue: "quack" },
      { say: "meow", show: "🐱", cue: "meow" },
      { say: "baa", show: "🐑" },
    ],
  },
  {
    id: "phrases",
    title: "Two words",
    hint: "Try two words together.",
    items: [
      { say: "more milk", show: "🥛" },
      { say: "bye bye", show: "👋" },
      { say: "my ball", show: "⚽" },
      { say: "big dog", show: "🐶" },
      { say: "all done", show: "✅" },
    ],
  },
];

export function SpeechLabScreen({
  muted,
  onToggleMute,
  onBack,
}: {
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
}) {
  const [drill, setDrill] = useState<Drill | null>(null);
  return (
    <main className="screen">
      <TopBar tint="#e85d8c" ink="#fff" emoji="💬" title={ui("speech")} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
      {!drill && (
        <>
          <p className="intro">{ui("speechHint")}</p>
          <div className="topic-list">
            {drills.map((item) => (
              <button key={item.id} type="button" className="topic-row" onClick={() => setDrill(item)}>
                <span className="topic-badge">💬</span>
                <span className="topic-copy">
                  <strong>{item.title}</strong>
                  <small>{item.hint}</small>
                </span>
              </button>
            ))}
          </div>
        </>
      )}
      {drill && <DrillPlay drill={drill} onBack={() => setDrill(null)} />}
    </main>
  );
}

function DrillPlay({ drill, onBack }: { drill: Drill; onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"ready" | "listen" | "yes" | "no">("ready");
  const [heard, setHeard] = useState("");
  const item = drill.items[index];
  const done = index >= drill.items.length;

  async function turn() {
    if (!item) return;
    setPhase("listen");
    setHeard("");
    if (item.cue) await playCue(item.cue);
    else await speak(item.say);
    await speak(ui("yourTurn"));
    const said = await hearWord(4000);
    setHeard(said);
    const first = item.say.split(" ")[0];
    if (saidWord(said, item.say) || saidWord(said, first)) {
      setPhase("yes");
      playCheer();
      awardStars("Speech practice", 1);
      window.setTimeout(() => {
        setIndex((value) => value + 1);
        setPhase("ready");
      }, 700);
      return;
    }
    setPhase("no");
    void playTryAgain();
    await speak(`${ui("say")} ${item.say}`);
  }

  if (done) {
    return (
      <>
        <h2>{ui("speechDone")}</h2>
        <button type="button" className="primary" onClick={onBack}>
          {ui("back")}
        </button>
      </>
    );
  }

  return (
    <>
      <button type="button" className="ghost" onClick={onBack}>
        {ui("back")}
      </button>
      <p className="intro">{drill.hint}</p>
      <div className="tutor-card">
        <span>{item.show}</span>
        <p>{item.say}</p>
        {heard && <small>{heard}</small>}
      </div>
      <button type="button" className="primary" onClick={() => void turn()} disabled={phase === "listen"}>
        {phase === "listen" ? ui("listening") : ui("sayWithMe")}
      </button>
      {phase === "no" && (
        <button
          type="button"
          className="ghost"
          onClick={() => {
            setIndex((value) => value + 1);
            setPhase("ready");
          }}
        >
          {ui("next")}
        </button>
      )}
    </>
  );
}

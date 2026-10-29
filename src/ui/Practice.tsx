import { useEffect, useMemo, useRef, useState } from "react";
import { playCheer, playPrompt, playSuccess, playTryAgain, speak, stopAudio } from "../audio";
import { makeQuiz, shuffle } from "../data/helpers";
import { labelWord, topicName, ui } from "../i18n";
import { awardStars, getLang } from "../progress";
import type { Category, Game, Lesson, QuizQ } from "../types";
import { Confetti, Mascot, TopBar } from "./Chrome";
import { ChoiceArt } from "./Picture";

function promptLine(say: string, answer?: string) {
  if (getLang() === "en" || !answer) return say;
  return `${ui("tap")} ${labelWord(answer)}`;
}

function yesLine(answer: string) {
  return `${ui("yes")} ${labelWord(answer)}`;
}

function CheerPop() {
  const bits = ["⭐", "✨", "🌟", "🎉", "💛", "✨"];
  return (
    <div className="cheer" aria-hidden>
      {bits.map((emoji, index) => (
        <span key={`${emoji}-${index}`} className="cheer-bit" style={{ ["--i" as string]: index }}>
          {emoji}
        </span>
      ))}
      <strong>{ui("yes")}</strong>
    </div>
  );
}

function starsFromScore(correct: number, total: number) {
  if (total <= 0) return 1;
  const ratio = correct / total;
  if (ratio >= 0.8) return 3;
  if (ratio >= 0.45) return 2;
  return 1;
}

function Celebrate({
  stars,
  title,
  onHome,
  onAgain,
}: {
  stars: number;
  title: string;
  onHome: () => void;
  onAgain: () => void;
}) {
  useEffect(() => {
    void (async () => {
      await playSuccess();
      await speak(ui("youDidIt"));
    })();
    return () => stopAudio();
  }, [stars]);

  return (
    <div className="done-card">
      <Confetti />
      <Mascot mood="jump" />
      <h2>{ui("youDidIt")}</h2>
      <p className="earned" aria-label={`${stars} stars`}>
        {"★".repeat(stars)}
        {"☆".repeat(3 - stars)}
      </p>
      <p>{topicName(title)}</p>
      <button type="button" className="primary" onClick={onAgain}>
        {ui("playAgain")}
      </button>
      <button type="button" className="ghost" onClick={onHome}>
        {ui("backHome")}
      </button>
    </div>
  );
}

export function PracticeView({
  category,
  lesson,
  muted,
  onToggleMute,
  onBack,
  onHome,
  onAward,
}: {
  category: Category;
  lesson: Lesson;
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
  onHome: () => void;
  onAward: () => void;
}) {
  const [roundKey, setRoundKey] = useState(0);
  const [earned, setEarned] = useState<number | null>(null);

  function finish(stars: number) {
    awardStars(lesson.title, stars);
    onAward();
    setEarned(stars);
  }

  return (
    <section className="screen" key={roundKey}>
      <TopBar
        tint={category.tint}
        ink={category.ink}
        title={lesson.game ? ui("playTheGame") : ui("letsPractise")}
        eyebrow={topicName(lesson.title)}
        onBack={onBack}
        muted={muted}
        onToggleMute={onToggleMute}
      />
      {earned != null ? (
        <Celebrate
          stars={earned}
          title={lesson.title}
          onHome={onHome}
          onAgain={() => {
            setEarned(null);
            setRoundKey((value) => value + 1);
          }}
        />
      ) : lesson.game && lesson.game.type !== "pick" ? (
        <SpecialGame game={lesson.game} onDone={finish} />
      ) : (
        <PickGame lesson={lesson} onDone={(correct, total) => finish(starsFromScore(correct, total))} />
      )}
    </section>
  );
}

function PickGame({ lesson, onDone }: { lesson: Lesson; onDone: (correct: number, total: number) => void }) {
  const rounds = useMemo(() => {
    const source = lesson.game?.type === "pick" ? lesson.game.rounds : lesson.quiz?.length ? lesson.quiz : makeQuiz(lesson);
    return source.map((round) => ({ ...round, options: shuffle(round.options) }));
  }, [lesson]);
  return <RoundList rounds={rounds} onDone={onDone} />;
}

function RoundList({ rounds, onDone }: { rounds: QuizQ[]; onDone: (correct: number, total: number) => void }) {
  const [index, setIndex] = useState(0);
  const [misses, setMisses] = useState(0);
  const [helps, setHelps] = useState(false);
  const [shake, setShake] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const correctRef = useRef(0);
  const round = rounds[index];

  useEffect(() => {
    if (!round) return;
    void playPrompt(promptLine(round.say, round.answer), round.cue);
    return () => stopAudio();
  }, [round]);

  if (!round) {
    return (
      <div className="done-card">
        <p>This one is for listening. Go back and tap the pictures.</p>
      </div>
    );
  }

  function succeed() {
    if (locked) return;
    setLocked(true);
    setPicked(round.answer);
    if (misses === 0) correctRef.current += 1;
    playCheer();
    void speak(yesLine(round.answer));
    window.setTimeout(() => {
      if (index + 1 >= rounds.length) onDone(correctRef.current, rounds.length);
      else {
        setIndex(index + 1);
        setMisses(0);
        setHelps(false);
        setShake(null);
        setPicked(null);
        setLocked(false);
      }
    }, 1200);
  }

  function fail(word: string) {
    if (locked) return;
    setShake(word);
    void playTryAgain();
    const next = misses + 1;
    setMisses(next);
    if (next >= 2) {
      setHelps(true);
      void speak(`${ui("thisOne")} ${labelWord(round.answer)}`);
    } else void speak(ui("tryAgain"));
  }

  return (
    <div className={`play ${picked ? "cheering" : ""}`}>
      {picked && <CheerPop />}
      <p className="counter">
        {index + 1} / {rounds.length}
      </p>
      {round.picture && <div className="prompt-picture">{round.picture}</div>}
      <p className="bubble">{promptLine(round.say, round.answer)}</p>
      <button type="button" className="hear inline" onClick={() => void playPrompt(promptLine(round.say, round.answer), round.cue)} aria-label={ui("hearAgain")}>
        🔊
      </button>
      <div className="options">
        {round.options.map((opt) => {
          const reveal = helps && opt.word === round.answer;
          return (
            <button
              key={opt.word}
              type="button"
              className={`option ${shake === opt.word ? "shake" : ""} ${reveal ? "reveal" : ""} ${picked === opt.word ? "correct" : ""}`}
              onClick={() => (opt.word === round.answer ? succeed() : fail(opt.word))}
            >
              <ChoiceArt opt={opt} />
              <span>{labelWord(opt.word)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SpecialGame({ game, onDone }: { game: Exclude<Game, { type: "pick" }>; onDone: (stars: number) => void }) {
  if (game.type === "odd") return <OddGame game={game} onDone={onDone} />;
  if (game.type === "next") return <NextGame game={game} onDone={onDone} />;
  if (game.type === "count") return <CountGame game={game} onDone={onDone} />;
  if (game.type === "shadow") return <ShadowGame game={game} onDone={onDone} />;
  return <SortGame game={game} onDone={onDone} />;
}

function OddGame({
  game,
  onDone,
}: {
  game: Extract<Game, { type: "odd" }>;
  onDone: (stars: number) => void;
}) {
  const rounds: QuizQ[] = game.rounds.map((round) => ({
    say: round.say,
    answer: round.items.find((item) => item.odd)?.word ?? "",
    options: round.items.map((item) => ({ word: item.word, emoji: item.emoji })),
  }));
  return <RoundList rounds={rounds} onDone={(correct, total) => onDone(starsFromScore(correct, total))} />;
}

function NextGame({
  game,
  onDone,
}: {
  game: Extract<Game, { type: "next" }>;
  onDone: (stars: number) => void;
}) {
  const rounds: QuizQ[] = game.rounds.map((round) => ({
    say: round.say,
    answer: round.answer,
    picture: round.pattern.join(" "),
    options: round.options.map((emoji) => ({ word: emoji, emoji })),
  }));
  return <RoundList rounds={rounds} onDone={(correct, total) => onDone(starsFromScore(correct, total))} />;
}

function CountGame({
  game,
  onDone,
}: {
  game: Extract<Game, { type: "count" }>;
  onDone: (stars: number) => void;
}) {
  const rounds: QuizQ[] = game.rounds.map((round) => ({
    say: round.say,
    answer: String(round.n),
    picture: round.emoji.repeat(round.n),
    options: round.choices.map((choice) => ({ word: String(choice), emoji: String(choice) })),
  }));
  return <RoundList rounds={rounds} onDone={(correct, total) => onDone(starsFromScore(correct, total))} />;
}

function ShadowGame({
  game,
  onDone,
}: {
  game: Extract<Game, { type: "shadow" }>;
  onDone: (stars: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const [helps, setHelps] = useState(false);
  const [shake, setShake] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const correctRef = useRef(0);
  const rounds = useMemo(() => game.rounds.map((round) => ({ ...round, options: shuffle(round.options) })), [game.rounds]);
  const round = rounds[index];
  const picture = round.options.find((opt) => opt.word === round.answer)?.emoji ?? "⭐";

  useEffect(() => {
    void playPrompt(promptLine(round.say, round.answer));
    return () => stopAudio();
  }, [round]);

  function succeed() {
    if (locked) return;
    setLocked(true);
    setPicked(round.answer);
    if (misses === 0) correctRef.current += 1;
    playCheer();
    void speak(yesLine(round.answer));
    window.setTimeout(() => {
      if (index + 1 >= rounds.length) onDone(starsFromScore(correctRef.current, rounds.length));
      else {
        setIndex(index + 1);
        setLocked(false);
        setHelps(false);
        setShake(null);
        setPicked(null);
        setMisses(0);
      }
    }, 1200);
  }

  return (
    <div className={`play ${picked ? "cheering" : ""}`}>
      {picked && <CheerPop />}
      <p className="counter">
        {index + 1} / {rounds.length}
      </p>
      <div className="prompt-picture">{picture}</div>
      <p className="bubble">{promptLine(round.say, round.answer)}</p>
      <div className="options">
        {round.options.map((opt) => (
          <button
            key={opt.word}
            type="button"
            aria-label={opt.word}
            className={`option ${shake === opt.word ? "shake" : ""} ${helps && opt.word === round.answer ? "reveal" : ""} ${picked === opt.word ? "correct" : ""}`}
            onClick={() => {
              if (opt.word === round.answer) succeed();
              else if (!locked) {
                setShake(opt.word);
                void playTryAgain();
                const next = misses + 1;
                setMisses(next);
                if (next >= 2) {
                  setHelps(true);
                  void speak(`${ui("thisOne")} ${labelWord(round.answer)}`);
                } else void speak(ui("tryAgain"));
              }
            }}
          >
            <ChoiceArt opt={opt} shadow />
          </button>
        ))}
      </div>
    </div>
  );
}

function SortGame({
  game,
  onDone,
}: {
  game: Extract<Game, { type: "sort" }>;
  onDone: (stars: number) => void;
}) {
  const [cursor, setCursor] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const [helps, setHelps] = useState(false);
  const [misses, setMisses] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const totalMisses = useRef(0);
  const item = game.items[cursor];

  useEffect(() => {
    if (!item) return;
    void playPrompt(getLang() === "en" ? `${game.prompt} ${item.word}` : `${ui("where")} ${labelWord(item.word)}`);
    return () => stopAudio();
  }, [game.prompt, item]);

  if (!item) return null;

  return (
    <div className={`play ${picked ? "cheering" : ""}`}>
      {picked && <CheerPop />}
      <p className="counter">
        {cursor + 1} / {game.items.length}
      </p>
      <div className={`prompt-picture ${wrong ? "shake" : ""} ${picked ? "correct-picture" : ""}`}>{item.emoji}</div>
      <p className="bubble">
        {getLang() === "en" ? `${game.prompt} ${item.word}` : `${ui("where")} ${labelWord(item.word)}`}
      </p>
      <div className="bins">
        {game.bins.map((bin) => (
          <button
            key={bin.id}
            type="button"
            className={`option bin ${helps && bin.id === item.bin ? "reveal" : ""} ${picked === bin.id ? "correct" : ""}`}
            onClick={() => {
              if (picked) return;
              if (bin.id === item.bin) {
                setPicked(bin.id);
                playCheer();
                void speak(item.say);
                window.setTimeout(() => {
                  if (cursor + 1 >= game.items.length) {
                    const total = totalMisses.current;
                    onDone(total === 0 ? 3 : total < 3 ? 2 : 1);
                  } else {
                    setCursor(cursor + 1);
                    setMisses(0);
                    setHelps(false);
                    setWrong(null);
                    setPicked(null);
                  }
                }, 1200);
              } else {
                const next = misses + 1;
                totalMisses.current += 1;
                setMisses(next);
                setWrong(bin.id);
                void playTryAgain();
                if (next >= 2) {
                  setHelps(true);
                  void speak(ui("thisOne"));
                } else void speak(ui("tryAgain"));
                window.setTimeout(() => setWrong(null), 400);
              }
            }}
          >
            <span className="opt-emoji">{bin.emoji}</span>
            <span>{labelWord(bin.label)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

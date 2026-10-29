import { useEffect, useRef, useState } from "react";
import { listenForSound, playBit, playCheer, playSuccess, speak, stopAudio } from "../audio";
import { labelWord, speechFor, topicName, ui } from "../i18n";
import { awardStars, isFavorite, markOpened, toggleFavorite } from "../progress";
import type { Category, Lesson } from "../types";
import { Mascot, TopBar } from "./Chrome";
import { Picture, SideFace } from "./Picture";

function labelOf(bit: Lesson["bits"][number]) {
  return bit.letter ?? labelWord(bit.word);
}

function subOf(bit: Lesson["bits"][number]) {
  if (bit.letter) return labelWord(bit.word);
  return bit.sub ? labelWord(bit.sub) : bit.sub;
}

export function LessonView({
  category,
  lesson,
  muted,
  onToggleMute,
  onBack,
  onPractice,
  onAward,
  bedtime = false,
  onColor,
}: {
  category: Category;
  lesson: Lesson;
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
  onPractice: () => void;
  onAward: () => void;
  bedtime?: boolean;
  onColor?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [paused, setPaused] = useState(false);
  const [listen, setListen] = useState<"off" | "wait" | "yes" | "miss">("off");
  const [sideLine, setSideLine] = useState<{ index: number; text: string; hint: string } | null>(null);
  const controlled = useRef(false);
  const run = useRef(0);
  const indexRef = useRef(0);
  const celebrated = useRef(false);
  const startX = useRef<number | null>(null);
  const bit = lesson.bits[index];
  const raw = sideLine?.index === index ? sideLine.text : (bit?.say ?? "");
  const hint = sideLine?.index === index ? sideLine.hint : bit?.word;
  const line = speechFor(raw, hint).text;
  indexRef.current = index;

  useEffect(() => {
    markOpened(lesson.title);
  }, [lesson.title]);

  useEffect(() => {
    if (done || lesson.layout === "video" || controlled.current || !bit) return;
    void playBit(bit);
    return () => {
      if (!controlled.current) stopAudio();
    };
  }, [bit, done, lesson.layout]);

  useEffect(() => {
    if (lesson.layout !== "video" || paused || done || !bit) return;
    let cancel = false;
    const started = index;
    const startedAt = Date.now();
    void (async () => {
      await playBit(lesson.bits[started]);
      if (cancel || indexRef.current !== started) return;
      const remain = 2600 - (Date.now() - startedAt);
      if (remain > 0) await new Promise((resolve) => window.setTimeout(resolve, remain));
      if (cancel || indexRef.current !== started) return;
      if (started + 1 >= lesson.bits.length) setDone(true);
      else setIndex(started + 1);
    })();
    return () => {
      cancel = true;
      stopAudio();
    };
  }, [bit, done, index, lesson.bits, lesson.layout, paused]);

  useEffect(() => {
    if (!done || celebrated.current) return;
    celebrated.current = true;
    awardStars(lesson.title, 1);
    onAward();
    void (async () => {
      await playSuccess();
      await speak(ui("youDidIt"));
    })();
  }, [done, lesson.title, onAward]);

  function go(nextIndex: number) {
    run.current += 1;
    controlled.current = false;
    stopAudio();
    if (nextIndex >= lesson.bits.length) setDone(true);
    else if (nextIndex >= 0) setIndex(nextIndex);
  }

  function replay() {
    if (!bit) return;
    run.current += 1;
    controlled.current = false;
    stopAudio();
    setSideLine(null);
    setListen("off");
    void playBit(bit);
  }

  async function sayWithMe() {
    if (!bit) return;
    const my = ++run.current;
    controlled.current = true;
    setListen("wait");
    setSideLine(null);
    stopAudio();
    await playBit(bit);
    if (run.current !== my) return;
    const heard = await listenForSound(2200);
    if (run.current !== my) return;
    controlled.current = false;
    if (heard) {
      setListen("yes");
      playCheer();
      void speak(ui("iHeardYou"));
    } else setListen("miss");
  }

  async function singAll() {
    const my = ++run.current;
    controlled.current = true;
    stopAudio();
    for (let i = 0; i < lesson.bits.length; i += 1) {
      if (run.current !== my) return;
      setIndex(i);
      setSideLine(null);
      await playBit(lesson.bits[i]);
    }
    if (run.current === my) controlled.current = false;
  }

  const nextLabel =
    lesson.layout === "story" ? ui("nextPage") : lesson.layout === "steps" ? ui("iDidIt") : lesson.layout === "song" ? ui("nextLine") : ui("next");

  return (
    <section className="screen">
      <TopBar
        tint={category.tint}
        ink={category.ink}
        title={topicName(lesson.title)}
        eyebrow={topicName(category.name)}
        onBack={onBack}
        muted={muted}
        onToggleMute={onToggleMute}
        extra={
          <button type="button" className={`icon-btn heart ${isFavorite(lesson.title) ? "on" : ""}`} onClick={() => toggleFavorite(lesson.title)} aria-label={ui("favorites")}>
            {isFavorite(lesson.title) ? "❤️" : "🤍"}
          </button>
        }
      />
      <p className="intro">{speechFor(lesson.intro).text}</p>
      {done ? (
        <div className="done-card">
          <Mascot mood="jump" />
          <h2>{ui("youDidIt")}</h2>
          {!bedtime && <p>{ui("wantPractise")}</p>}
          {!bedtime && (
            <button type="button" className="primary" onClick={onPractice}>
              {lesson.game ? ui("playTheGame") : ui("letsPractise")}
            </button>
          )}
          {lesson.layout === "story" && onColor && (
            <button type="button" className="primary" onClick={onColor}>
              {ui("colorPicture")}
            </button>
          )}
          <button
            type="button"
            className="ghost"
            onClick={() => {
              celebrated.current = false;
              setDone(false);
              setIndex(0);
              setPaused(false);
            }}
          >
            {ui("playAgain")}
          </button>
        </div>
      ) : (
        bit && (
          <>
            {lesson.layout === "video" && (
              <div className="show-bar" aria-hidden>
                <span style={{ width: `${((index + 1) / lesson.bits.length) * 100}%` }} />
              </div>
            )}
            <div
              className={`stage ${lesson.layout === "video" ? "dance" : ""}`}
              onPointerDown={(event) => {
                startX.current = event.clientX;
              }}
              onPointerUp={(event) => {
                const dx = event.clientX - (startX.current ?? event.clientX);
                startX.current = null;
                if (dx < -70) go(index + 1);
                else if (dx > 70) go(index - 1);
                else if (!(event.target as HTMLElement).closest(".side")) replay();
              }}
            >
              {lesson.layout === "pairs" && bit.left && bit.right ? (
                <div className="pair-row">
                  <SideFace
                    side={bit.left}
                    onPress={() => {
                      setSideLine({ index, text: bit.left!.say, hint: bit.left!.word });
                      stopAudio();
                      void speak(speechFor(bit.left!.say, bit.left!.word).text);
                    }}
                  />
                  <SideFace
                    side={bit.right}
                    onPress={() => {
                      setSideLine({ index, text: bit.right!.say, hint: bit.right!.word });
                      stopAudio();
                      void speak(speechFor(bit.right!.say, bit.right!.word).text);
                    }}
                  />
                </div>
              ) : (
                <Picture bit={bit} />
              )}
              {lesson.layout === "video" && <span className="play-badge">{paused ? ui("paused") : ui("showBadge")}</span>}
            </div>
            <h2 className="word">{labelOf(bit)}</h2>
            {subOf(bit) && <p className="subhead">{subOf(bit)}</p>}
            <p className="bubble">{line}</p>
            {lesson.bits.length > 12 ? (
              <p className="counter">
                {index + 1} / {lesson.bits.length}
              </p>
            ) : (
              <div className="dots" aria-hidden>
                {lesson.bits.map((item, dot) => (
                  <i key={item.word + dot} className={dot === index ? "on" : dot < index ? "done" : ""} />
                ))}
              </div>
            )}
            {lesson.layout === "song" && (
              <ol className="lyrics">
                {lesson.bits.map((item, lineIndex) => (
                  <li key={item.word} className={lineIndex === index ? "on" : ""}>
                    <button
                      type="button"
                      onClick={() => {
                        run.current += 1;
                        controlled.current = false;
                        stopAudio();
                        setIndex(lineIndex);
                        if (lineIndex === index) void playBit(item);
                      }}
                    >
                      <span>{item.emoji}</span>
                      <span>{speechFor(item.say, item.word).text}</span>
                    </button>
                  </li>
                ))}
              </ol>
            )}
            <div className="controls">
              <button type="button" className="nav-btn" onClick={() => go(index - 1)} disabled={index === 0}>
                {ui("back")}
              </button>
              <button type="button" className="hear" onClick={replay} aria-label={ui("hearAgain")}>
                🔊
              </button>
              <button type="button" className="nav-btn next" onClick={() => go(index + 1)}>
                {index + 1 === lesson.bits.length ? ui("finish") : nextLabel}
              </button>
            </div>
            <button type="button" className="ghost" onClick={() => void sayWithMe()}>
              {listen === "wait" ? ui("listening") : ui("sayWithMe")}
            </button>
            {listen === "yes" && <p className="intro">{ui("iHeardYou")}</p>}
            {listen === "miss" && (
              <button
                type="button"
                className="primary"
                onClick={() => {
                  setListen("yes");
                  playCheer();
                }}
              >
                {ui("iSaidIt")}
              </button>
            )}
            {lesson.layout === "song" && (
              <button type="button" className="primary" onClick={() => void singAll()}>
                {ui("sing")}
              </button>
            )}
            {lesson.layout === "video" && (
              <button type="button" className="primary" onClick={() => setPaused((value) => !value)}>
                {paused ? ui("playShow") : ui("pauseShow")}
              </button>
            )}
            {!bedtime && (
              <button type="button" className="ghost" onClick={onPractice}>
                {lesson.game ? ui("playTheGame") : ui("letsPractise")}
              </button>
            )}
          </>
        )
      )}
    </section>
  );
}

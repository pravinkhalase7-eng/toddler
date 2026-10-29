import { useCallback, useEffect, useState } from "react";
import { mutedNow, setMuted, unlockAudio } from "./audio";
import { findLesson, getCategory } from "./data/catalog";
import { topicName, ui } from "./i18n";
import { dismissRest, isFavorite, shouldRest, starsFor, subscribe, toggleFavorite, touchSession } from "./progress";
import { colorSceneFor } from "./stickers";
import { StarRow, TopBar } from "./ui/Chrome";
import { HomeScreen, layoutText } from "./ui/HomeScreen";
import { LessonView } from "./ui/Lesson";
import { MemoryScreen } from "./ui/Memory";
import { FlashScreen, OddScreen, SoundsScreen, WhereScreen } from "./ui/Recall";
import { SameScreen } from "./ui/Same";
import { BedtimeScreen, BuildScreen, ColorScreen, GrownupsScreen, PlayroomScreen, RestOverlay, StickerScreen, TraceScreen } from "./ui/More";
import { PracticeView } from "./ui/Practice";

type Screen =
  | { name: "home" }
  | { name: "category"; id: number }
  | { name: "learn"; title: string; bedtime?: boolean }
  | { name: "practice"; title: string }
  | { name: "stickers" }
  | { name: "bedtime" }
  | { name: "trace" }
  | { name: "playroom" }
  | { name: "build" }
  | { name: "memory" }
  | { name: "same" }
  | { name: "odd" }
  | { name: "where" }
  | { name: "sounds" }
  | { name: "flash" }
  | { name: "grownups" }
  | { name: "color"; scene: string; from: string; bedtime?: boolean };

export function App() {
  const [screen, setScreen] = useState<Screen>({ name: "home" });
  const [muted, setMutedState] = useState(mutedNow());
  const [stamp, setStamp] = useState(0);
  const [resting, setResting] = useState(false);
  const bump = useCallback(() => setStamp((value) => value + 1), []);

  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock);
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  useEffect(() => {
    const stop = subscribe(() => setStamp((value) => value + 1));
    return () => {
      stop();
    };
  }, []);

  useEffect(() => {
    touchSession();
    const timer = window.setInterval(() => {
      if (shouldRest()) setResting(true);
    }, 15000);
    return () => window.clearInterval(timer);
  }, []);

  function toggleMute() {
    const next = !mutedNow();
    setMuted(next);
    setMutedState(next);
  }

  const bedtime = screen.name === "bedtime" || (screen.name === "learn" && screen.bedtime) || (screen.name === "color" && screen.bedtime);
  void stamp;

  return (
    <div className={`sky ${bedtime ? "bedtime" : ""}`} style={{ ["--yes" as string]: `"${ui("yes")}"` }}>
      <div className="float-cloud a">☁️</div>
      <div className="float-cloud b">☁️</div>
      <div className="shell">
        {screen.name === "home" && (
          <HomeScreen
            muted={muted}
            onToggleMute={toggleMute}
            onOpen={(title) => setScreen({ name: "learn", title })}
            onCategory={(id) => setScreen({ name: "category", id })}
            onStickers={() => setScreen({ name: "stickers" })}
            onBedtime={() => setScreen({ name: "bedtime" })}
            onTrace={() => setScreen({ name: "trace" })}
            onPlayroom={() => setScreen({ name: "playroom" })}
            onBuild={() => setScreen({ name: "build" })}
            onMemory={() => setScreen({ name: "memory" })}
            onSame={() => setScreen({ name: "same" })}
            onOdd={() => setScreen({ name: "odd" })}
            onWhere={() => setScreen({ name: "where" })}
            onSounds={() => setScreen({ name: "sounds" })}
            onFlash={() => setScreen({ name: "flash" })}
            onGrownups={() => setScreen({ name: "grownups" })}
          />
        )}

        {screen.name === "category" && (
          <CategoryScreen
            id={screen.id}
            muted={muted}
            onToggleMute={toggleMute}
            onBack={() => setScreen({ name: "home" })}
            onOpen={(title) => setScreen({ name: "learn", title })}
          />
        )}

        {screen.name === "learn" && (
          <LearnScreen
            title={screen.title}
            bedtime={screen.bedtime}
            muted={muted}
            onToggleMute={toggleMute}
            onBack={() =>
              screen.bedtime ? setScreen({ name: "bedtime" }) : setScreen({ name: "category", id: findLesson(screen.title).category.id })
            }
            onPractice={() => setScreen({ name: "practice", title: screen.title })}
            onColor={() => setScreen({ name: "color", scene: colorSceneFor(screen.title), from: screen.title, bedtime: screen.bedtime })}
            onAward={bump}
          />
        )}

        {screen.name === "practice" && (
          <PracticeScreen
            title={screen.title}
            muted={muted}
            onToggleMute={toggleMute}
            onBack={() => setScreen({ name: "learn", title: screen.title })}
            onHome={() => setScreen({ name: "home" })}
            onAward={bump}
          />
        )}

        {screen.name === "stickers" && <StickerScreen muted={muted} onToggleMute={toggleMute} onBack={() => setScreen({ name: "home" })} />}
        {screen.name === "bedtime" && (
          <BedtimeScreen
            muted={muted}
            onToggleMute={toggleMute}
            onBack={() => setScreen({ name: "home" })}
            onOpen={(title) => setScreen({ name: "learn", title, bedtime: true })}
          />
        )}
        {screen.name === "trace" && <TraceScreen muted={muted} onToggleMute={toggleMute} onBack={() => setScreen({ name: "home" })} />}
        {screen.name === "playroom" && <PlayroomScreen muted={muted} onToggleMute={toggleMute} onBack={() => setScreen({ name: "home" })} />}
        {screen.name === "build" && <BuildScreen muted={muted} onToggleMute={toggleMute} onBack={() => setScreen({ name: "home" })} />}
        {screen.name === "memory" && <MemoryScreen muted={muted} onToggleMute={toggleMute} onBack={() => setScreen({ name: "home" })} />}
        {screen.name === "same" && <SameScreen muted={muted} onToggleMute={toggleMute} onBack={() => setScreen({ name: "home" })} />}
        {screen.name === "odd" && <OddScreen muted={muted} onToggleMute={toggleMute} onBack={() => setScreen({ name: "home" })} />}
        {screen.name === "where" && <WhereScreen muted={muted} onToggleMute={toggleMute} onBack={() => setScreen({ name: "home" })} />}
        {screen.name === "sounds" && <SoundsScreen muted={muted} onToggleMute={toggleMute} onBack={() => setScreen({ name: "home" })} />}
        {screen.name === "flash" && <FlashScreen muted={muted} onToggleMute={toggleMute} onBack={() => setScreen({ name: "home" })} />}
        {screen.name === "grownups" && <GrownupsScreen muted={muted} onToggleMute={toggleMute} onBack={() => setScreen({ name: "home" })} />}
        {screen.name === "color" && (
          <ColorScreen
            scene={screen.scene}
            muted={muted}
            onToggleMute={toggleMute}
            onBack={() => setScreen({ name: "learn", title: screen.from, bedtime: screen.bedtime })}
          />
        )}
      </div>
      {resting && (
        <RestOverlay
          onStory={() => {
            dismissRest();
            setResting(false);
            setScreen({ name: "learn", title: "Bedtime Story: The Little Sleepy Bear", bedtime: true });
          }}
          onDone={() => {
            dismissRest();
            setResting(false);
            setScreen({ name: "home" });
          }}
        />
      )}
    </div>
  );
}

function CategoryScreen({
  id,
  muted,
  onToggleMute,
  onBack,
  onOpen,
}: {
  id: number;
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
  onOpen: (title: string) => void;
}) {
  const category = getCategory(id);
  return (
    <main className="screen">
      <TopBar
        tint={category.tint}
        ink={category.ink}
        emoji={category.emoji}
        title={topicName(category.name)}
        eyebrow={category.blurb}
        onBack={onBack}
        muted={muted}
        onToggleMute={onToggleMute}
      />
      <div className="topic-list">
        {category.topics.map((topic) => (
          <div key={topic.title} className="topic-row">
            <button type="button" className="topic-open" onClick={() => onOpen(topic.title)}>
              <span className="topic-badge" style={{ background: category.tint }}>
                {topic.emoji}
              </span>
              <span className="topic-copy">
                <strong>{topicName(topic.title)}</strong>
                <small>{layoutText(topic)}</small>
              </span>
              <StarRow n={starsFor(topic.title)} />
            </button>
            <button type="button" className={`heart ${isFavorite(topic.title) ? "on" : ""}`} onClick={() => toggleFavorite(topic.title)} aria-label={ui("favorites")}>
              {isFavorite(topic.title) ? "❤️" : "🤍"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

function LearnScreen({
  title,
  bedtime,
  muted,
  onToggleMute,
  onBack,
  onPractice,
  onColor,
  onAward,
}: {
  title: string;
  bedtime?: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
  onPractice: () => void;
  onColor: () => void;
  onAward: () => void;
}) {
  const { category, lesson } = findLesson(title);
  return (
    <LessonView
      category={category}
      lesson={lesson}
      muted={muted}
      onToggleMute={onToggleMute}
      onBack={onBack}
      onPractice={onPractice}
      onAward={onAward}
      bedtime={bedtime}
      onColor={lesson.layout === "story" ? onColor : undefined}
    />
  );
}

function PracticeScreen({
  title,
  muted,
  onToggleMute,
  onBack,
  onHome,
  onAward,
}: {
  title: string;
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
  onHome: () => void;
  onAward: () => void;
}) {
  const { category, lesson } = findLesson(title);
  return (
    <PracticeView
      category={category}
      lesson={lesson}
      muted={muted}
      onToggleMute={onToggleMute}
      onBack={onBack}
      onHome={onHome}
      onAward={onAward}
    />
  );
}

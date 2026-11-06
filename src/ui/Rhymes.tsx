import { useState } from "react";
import { ui } from "../i18n";
import { TopBar } from "./Chrome";

const rhymes: { title: string; emoji: string; id: string; start?: number }[] = [
  { title: "Twinkle Twinkle Little Star", emoji: "⭐", id: "wk4KHNJjpjQ" },
  { title: "Wheels on the Bus", emoji: "🚌", id: "HP-MbfHFUqs" },
  { title: "Baa Baa Black Sheep", emoji: "🐑", id: "Gmrj5-70xV4", start: 9 },
  { title: "London Bridge", emoji: "🌉", id: "Gmrj5-70xV4", start: 157 },
  { title: "Mary Had a Little Lamb", emoji: "🐑", id: "Gmrj5-70xV4", start: 295 },
  { title: "Humpty Dumpty", emoji: "🥚", id: "H7Hq8qQiY-0" },
  { title: "Old MacDonald", emoji: "🐄", id: "TloXEcbCF8Q", start: 1029 },
  { title: "Itsy Bitsy Spider", emoji: "🕷️", id: "Gmrj5-70xV4", start: 914 },
];

export function RhymesScreen({
  muted,
  onToggleMute,
  onBack,
}: {
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
}) {
  const [playing, setPlaying] = useState(rhymes[0]);

  return (
    <main className="screen">
      <TopBar tint="#8b5cf6" ink="#fff" emoji="🎵" title={ui("rhymes")} onBack={onBack} muted={muted} onToggleMute={onToggleMute} />
      <p className="intro">{ui("rhymesHint")}</p>
      <div className="rhyme-player">
        <iframe
          title={playing.title}
          src={`https://www.youtube-nocookie.com/embed/${playing.id}?start=${playing.start ?? 0}&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="topic-list">
        {rhymes.map((rhyme) => (
          <button key={rhyme.title} type="button" className={`topic-row ${playing.title === rhyme.title ? "bedtime-row" : ""}`} onClick={() => setPlaying(rhyme)}>
            <span className="topic-badge">{rhyme.emoji}</span>
            <span className="topic-copy">
              <strong>{rhyme.title}</strong>
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}

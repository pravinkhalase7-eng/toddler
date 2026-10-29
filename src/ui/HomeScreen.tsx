import { useRef } from "react";
import { categories, findLesson } from "../data/catalog";
import { layoutLabel } from "../data/helpers";
import { ui, topicName } from "../i18n";
import { getChild, starsFor, toggleFavorite, totalStars } from "../progress";
import type { Lesson } from "../types";
import { todayTitles } from "../stickers";
import { Mascot, StarRow } from "./Chrome";

const layoutKeys: Record<string, string> = {
  "Listen and look": "listen",
  Compare: "compare",
  Song: "song",
  Story: "story",
  Steps: "steps",
  Show: "show",
  Game: "game",
};

export function HomeScreen({
  muted,
  onToggleMute,
  onOpen,
  onCategory,
  onStickers,
  onBedtime,
  onTrace,
  onPlayroom,
  onBuild,
  onMemory,
  onSame,
  onOdd,
  onWhere,
  onSounds,
  onFlash,
  onGrownups,
}: {
  muted: boolean;
  onToggleMute: () => void;
  onOpen: (title: string) => void;
  onCategory: (id: number) => void;
  onStickers: () => void;
  onBedtime: () => void;
  onTrace: () => void;
  onPlayroom: () => void;
  onBuild: () => void;
  onMemory: () => void;
  onSame: () => void;
  onOdd: () => void;
  onWhere: () => void;
  onSounds: () => void;
  onFlash: () => void;
  onGrownups: () => void;
}) {
  const hold = useRef(0);
  const child = getChild();
  const titles = categories.flatMap((category) => category.topics.map((topic) => topic.title));
  const today = todayTitles(titles, child.stars);
  const favorites = child.favorites.filter((title) => titles.includes(title));
  const shortcuts = [
    { label: ui("bedtime"), emoji: "🌙", onClick: onBedtime, tint: "#1e3a5f", ink: "#fff" },
    { label: ui("stickers"), emoji: "⭐", onClick: onStickers, tint: "#f4b400", ink: "#4a3708" },
    { label: ui("trace"), emoji: "✏️", onClick: onTrace, tint: "#ff8a5b", ink: "#fff" },
    { label: ui("toys"), emoji: "🧸", onClick: onPlayroom, tint: "#2f9e44", ink: "#fff" },
    { label: ui("build"), emoji: "⛄", onClick: onBuild, tint: "#3b82f6", ink: "#fff" },
    { label: ui("memory"), emoji: "🃏", onClick: onMemory, tint: "#8b5cf6", ink: "#fff" },
    { label: ui("same"), emoji: "🍎", onClick: onSame, tint: "#e85d8c", ink: "#fff" },
  ];

  return (
    <main className="screen">
      <header className="home-head">
        <Mascot />
        <div>
          <p className="eyebrow">{child.name} · Ages 1–4</p>
          <h1>Toddler Learn</h1>
          <p>{ui("tagline")}</p>
        </div>
        <button type="button" className="icon-btn" onClick={onToggleMute} aria-label={muted ? ui("soundOn") : ui("soundOff")}>
          {muted ? "🔇" : "🔊"}
        </button>
      </header>
      <p className="star-pill">
        ★ {totalStars()} {ui("stars")}
      </p>

      <section className="block">
        <h2>{ui("playToday")}</h2>
        <div className="today-row">
          {today.map((title) => {
            const { lesson, category } = findLesson(title);
            return (
              <button key={title} type="button" className="today-card" style={{ background: category.tint, color: category.ink }} onClick={() => onOpen(title)}>
                <span>{lesson.emoji}</span>
                <strong>{topicName(title)}</strong>
              </button>
            );
          })}
        </div>
      </section>

      {favorites.length > 0 && (
        <section className="block">
          <h2>{ui("favorites")}</h2>
          <div className="topic-list">
            {favorites.map((title) => {
              const { lesson, category } = findLesson(title);
              return (
                <div key={title} className="topic-row">
                  <button type="button" className="topic-open" onClick={() => onOpen(title)}>
                    <span className="topic-badge" style={{ background: category.tint }}>
                      {lesson.emoji}
                    </span>
                    <span className="topic-copy">
                      <strong>{topicName(title)}</strong>
                    </span>
                    <StarRow n={starsFor(title)} />
                  </button>
                  <button type="button" className="heart" onClick={() => toggleFavorite(title)} aria-label={ui("favorites")}>
                    ❤️
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="block">
        <h2>{ui("memoryPlay")}</h2>
        <div className="shortcut-row">
          <button type="button" className="shortcut" style={{ background: "#0d9488", color: "#fff" }} onClick={onOdd}>
            <span>👀</span>
            {ui("odd")}
          </button>
          <button type="button" className="shortcut" style={{ background: "#7c3aed", color: "#fff" }} onClick={onWhere}>
            <span>🙈</span>
            {ui("whereGame")}
          </button>
          <button type="button" className="shortcut" style={{ background: "#2f9e44", color: "#fff" }} onClick={onSounds}>
            <span>🐄</span>
            {ui("sounds")}
          </button>
          <button type="button" className="shortcut" style={{ background: "#f97316", color: "#fff" }} onClick={onFlash}>
            <span>🔴</span>
            {ui("flash")}
          </button>
        </div>
      </section>

      <div className="shortcut-row">
        {shortcuts.map((item) => (
          <button key={item.label} type="button" className="shortcut" style={{ background: item.tint, color: item.ink }} onClick={item.onClick}>
            <span>{item.emoji}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="cat-grid">
        {categories.map((category) => {
          const earned = category.topics.reduce((sum, topic) => sum + starsFor(topic.title), 0);
          return (
            <button
              key={category.id}
              type="button"
              className="cat-card"
              style={{ background: category.tint, color: category.ink }}
              onClick={() => onCategory(category.id)}
            >
              <span className="cat-emoji" aria-hidden>
                {category.emoji}
              </span>
              <span className="cat-name">{topicName(category.name)}</span>
              <span className="cat-meta">
                {category.topics.length} {ui("activities")} · ★ {earned}
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="grownup-hold"
        onPointerDown={() => {
          hold.current = window.setTimeout(onGrownups, 700);
        }}
        onPointerUp={() => window.clearTimeout(hold.current)}
        onPointerLeave={() => window.clearTimeout(hold.current)}
      >
        {ui("grownups")} · {ui("hold")}
      </button>
    </main>
  );
}

export function layoutText(topic: Lesson) {
  return ui(layoutKeys[layoutLabel(topic)] ?? "listen");
}

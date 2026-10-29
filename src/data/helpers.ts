import type { Bit, Cue, Layout, Lesson, Opt, QuizQ } from "../types";

const TINTS = ["#fff1e6", "#e7f8ee", "#e7f1ff", "#fff6d8", "#fdecef", "#f3e8ff", "#e6fbf6", "#fff0f6"];

export function bit(word: string, emoji: string, say?: string, extra: Partial<Bit> = {}): Bit {
  let hash = 0;
  for (let i = 0; i < word.length; i += 1) hash = (hash * 33 + word.charCodeAt(i)) >>> 0;
  return {
    word,
    emoji,
    say: say ?? `${word}.`,
    tint: TINTS[hash % TINTS.length],
    ...extra,
  };
}

export function lesson(
  title: string,
  emoji: string,
  layout: Layout,
  intro: string,
  bits: Bit[],
  extra: Partial<Pick<Lesson, "game" | "quiz">> = {},
): Lesson {
  return { title, emoji, layout, intro, bits, ...extra };
}

export function q(say: string, answer: string, options: [string, string][], cue?: Cue, picture?: string): QuizQ {
  return {
    say,
    answer,
    cue,
    picture,
    options: options.map(([word, emoji]) => ({ word, emoji })),
  };
}

export function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function makeQuiz(item: Lesson): QuizQ[] {
  const pool = item.bits.filter((entry) => entry.word);
  if (pool.length < 2) return [];
  return shuffle(pool)
    .slice(0, Math.min(5, pool.length))
    .map((entry) => {
      const others = shuffle(pool.filter((candidate) => candidate.word !== entry.word)).slice(0, 3);
      const options: Opt[] = shuffle([entry, ...others]).map((choice) => ({
        word: choice.word,
        emoji: choice.emoji || "⭐",
        swatch: choice.swatch,
        shape: choice.shape,
      }));
      const say = entry.ask ?? (/^\d+$/.test(entry.word) ? `Tap the number ${entry.word}` : `Tap the ${entry.word}`);
      return { say, answer: entry.word, options };
    });
}

export function layoutLabel(item: Lesson) {
  if (item.game) return "Game";
  switch (item.layout) {
    case "song":
      return "Song";
    case "story":
      return "Story";
    case "steps":
      return "Steps";
    case "video":
      return "Show";
    case "pairs":
      return "Compare";
    default:
      return "Listen and look";
  }
}

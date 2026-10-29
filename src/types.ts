export type ShapeName =
  | "circle"
  | "square"
  | "triangle"
  | "rectangle"
  | "star"
  | "heart"
  | "oval"
  | "diamond";

export type Cue =
  | "moo"
  | "oink"
  | "quack"
  | "baa"
  | "neigh"
  | "cluck"
  | "roar"
  | "tweet"
  | "bark"
  | "meow"
  | "hoot"
  | "trumpet"
  | "ribbit"
  | "buzz"
  | "splash"
  | "beep"
  | "drum"
  | "piano"
  | "bell"
  | "horn"
  | "pop"
  | "goat"
  | "monkey"
  | "chirp"
  | "whale"
  | "click"
  | "wind"
  | "rain";

export type Layout = "cards" | "pairs" | "song" | "story" | "steps" | "video";

export interface Side {
  word: string;
  emoji: string;
  say: string;
  count?: number;
  motion?: "up" | "down" | "long" | "short" | "big" | "small";
}

export interface Bit {
  word: string;
  emoji: string;
  say: string;
  tint: string;
  sub?: string;
  ask?: string;
  letter?: string;
  count?: number;
  shape?: ShapeName;
  swatch?: string;
  cue?: Cue;
  notes?: number[];
  left?: Side;
  right?: Side;
}

export interface Opt {
  word: string;
  emoji: string;
  swatch?: string;
  shape?: ShapeName;
}

export interface QuizQ {
  say: string;
  answer: string;
  cue?: Cue;
  picture?: string;
  options: Opt[];
}

export type Game =
  | { type: "pick"; rounds: QuizQ[] }
  | {
      type: "odd";
      rounds: { say: string; items: { word: string; emoji: string; odd?: boolean }[] }[];
    }
  | {
      type: "next";
      rounds: { say: string; pattern: string[]; answer: string; options: string[] }[];
    }
  | {
      type: "count";
      rounds: { say: string; emoji: string; n: number; choices: number[] }[];
    }
  | { type: "shadow"; rounds: { say: string; answer: string; options: Opt[] }[] }
  | {
      type: "sort";
      prompt: string;
      bins: { id: string; label: string; emoji: string }[];
      items: { word: string; emoji: string; bin: string; say: string }[];
    };

export interface Lesson {
  title: string;
  emoji: string;
  layout: Layout;
  intro: string;
  bits: Bit[];
  game?: Game;
  quiz?: QuizQ[];
}

export interface Category {
  id: number;
  name: string;
  emoji: string;
  tint: string;
  ink: string;
  blurb: string;
  topics: Lesson[];
}

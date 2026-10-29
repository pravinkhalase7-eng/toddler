export type StickerScene = {
  id: string;
  tint: string;
  stickers: { id: string; emoji: string; cost: number }[];
};

export const scenes: StickerScene[] = [
  {
    id: "farm",
    tint: "#e7f8ee",
    stickers: [
      { id: "farm-cow", emoji: "🐄", cost: 1 },
      { id: "farm-pig", emoji: "🐷", cost: 1 },
      { id: "farm-hen", emoji: "🐔", cost: 1 },
      { id: "farm-tree", emoji: "🌳", cost: 1 },
      { id: "farm-sun", emoji: "☀️", cost: 1 },
      { id: "farm-tractor", emoji: "🚜", cost: 2 },
    ],
  },
  {
    id: "bed",
    tint: "#efe7ff",
    stickers: [
      { id: "bed-moon", emoji: "🌙", cost: 1 },
      { id: "bed-star", emoji: "⭐", cost: 1 },
      { id: "bed-teddy", emoji: "🧸", cost: 1 },
      { id: "bed-book", emoji: "📖", cost: 1 },
      { id: "bed-lamp", emoji: "💡", cost: 1 },
      { id: "bed-bear", emoji: "🐻", cost: 2 },
    ],
  },
  {
    id: "sky",
    tint: "#e7f1ff",
    stickers: [
      { id: "sky-sun", emoji: "☀️", cost: 1 },
      { id: "sky-cloud", emoji: "☁️", cost: 1 },
      { id: "sky-rainbow", emoji: "🌈", cost: 1 },
      { id: "sky-bird", emoji: "🐦", cost: 1 },
      { id: "sky-balloon", emoji: "🎈", cost: 1 },
      { id: "sky-plane", emoji: "✈️", cost: 2 },
    ],
  },
];

export const bedtimeTitles = [
  "Sleep Routine",
  "Twinkle Twinkle Little Star",
  "Five Little Ducks",
  "The Little Star Who Was Afraid",
  "The Little Seed",
  "The Lion and the Mouse",
  "The Thirsty Crow",
  "The Tortoise and the Hare",
  "The Hungry Caterpillar",
  "The Little Lost Puppy",
  "The Sharing Teddy Bear",
  "The Rainbow Adventure",
  "The Magic Fruit Basket",
  "Bedtime Story: The Little Sleepy Bear",
];

export function colorSceneFor(title: string) {
  const scenes = ["garden", "night", "farm"] as const;
  const total = [...title].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return scenes[total % scenes.length];
}

export function todayTitles(titles: string[], stars: Record<string, number>) {
  const day = new Date().toDateString();
  const hash = (value: string) => {
    let h = 0;
    for (let i = 0; i < value.length; i += 1) h = (h * 33 + value.charCodeAt(i)) >>> 0;
    return h;
  };
  return [...titles]
    .sort((a, b) => (stars[a] ?? 0) - (stars[b] ?? 0) || hash(day + a) - hash(day + b))
    .slice(0, 3);
}

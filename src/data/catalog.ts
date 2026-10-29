import type { Category, Lesson } from "../types";
import { basic } from "./basic";
import { everyday } from "./everyday";
import { feelings } from "./feelings";
import { habits } from "./habits";
import { nature } from "./nature";
import { songs } from "./songs";
import { stories } from "./stories";
import { thinking } from "./thinking";
import { videos } from "./videos";

export const appMeta = {
  title: "Toddler Learn",
  age: "1–4 years",
};

export const categories: Category[] = [
  basic,
  nature,
  everyday,
  habits,
  feelings,
  songs,
  thinking,
  stories,
  videos,
];

export function getCategory(id: number) {
  const category = categories.find((item) => item.id === id);
  if (!category) throw new Error(`Missing category ${id}`);
  return category;
}

export function findLesson(title: string): { category: Category; lesson: Lesson } {
  for (const category of categories) {
    const lesson = category.topics.find((topic) => topic.title === title);
    if (lesson) return { category, lesson };
  }
  throw new Error(`Missing lesson ${title}`);
}

const titles = categories.flatMap((category) => category.topics.map((topic) => topic.title));
const unique = new Set(titles);
if (unique.size !== titles.length) {
  const duplicates = titles.filter((title, index) => titles.indexOf(title) !== index);
  console.warn("Duplicate lesson titles", duplicates);
}

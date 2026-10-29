import type { Category } from "../types";
import { bit, lesson, q } from "./helpers";

const letters: [string, string, string][] = [
  ["A", "🍎", "Apple"],
  ["B", "⚽", "Ball"],
  ["C", "🐱", "Cat"],
  ["D", "🐶", "Dog"],
  ["E", "🐘", "Elephant"],
  ["F", "🐟", "Fish"],
  ["G", "🐐", "Goat"],
  ["H", "🎩", "Hat"],
  ["I", "🧊", "Igloo"],
  ["J", "🧃", "Juice"],
  ["K", "🪁", "Kite"],
  ["L", "🦁", "Lion"],
  ["M", "🌙", "Moon"],
  ["N", "🪺", "Nest"],
  ["O", "🍊", "Orange"],
  ["P", "🐷", "Pig"],
  ["Q", "👑", "Queen"],
  ["R", "🌈", "Rainbow"],
  ["S", "☀️", "Sun"],
  ["T", "🐯", "Tiger"],
  ["U", "☂️", "Umbrella"],
  ["V", "🎻", "Violin"],
  ["W", "🐋", "Whale"],
  ["X", "🎵", "Xylophone"],
  ["Y", "🪀", "Yo-yo"],
  ["Z", "🦓", "Zebra"],
];

const numberWords = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

export const basic: Category = {
  id: 1,
  name: "Basic Learning",
  emoji: "🔤",
  tint: "#ff8a5b",
  ink: "#fff",
  blurb: "Letters, numbers, colors, shapes, and opposites",
  topics: [
    lesson(
      "ABC Alphabet",
      "🔤",
      "cards",
      "Every letter has a sound and a picture.",
      letters.map(([letter, emoji, word]) =>
        bit(word, emoji, `${letter} is for ${word.toLowerCase()}.`, { letter, ask: `Tap the ${word.toLowerCase()}` }),
      ),
    ),
    lesson(
      "Numbers 1 to 10",
      "🔢",
      "cards",
      "Count the stars. Then find the number.",
      numberWords.map((name, index) =>
        bit(String(index + 1), "⭐", `${name}. ${name} star${index === 0 ? "" : "s"}.`, {
          count: index + 1,
          sub: name,
          ask: `Tap the number ${index + 1}`,
        }),
      ),
    ),
    lesson(
      "Colors",
      "🎨",
      "cards",
      "Colors are everywhere. Tap one and say its name.",
      [
        bit("Red", "🍓", "Red. A strawberry is red.", { swatch: "#ef4444", ask: "Tap red" }),
        bit("Orange", "🍊", "Orange. An orange is orange.", { swatch: "#f97316", ask: "Tap orange" }),
        bit("Yellow", "🌟", "Yellow. The sun looks yellow.", { swatch: "#facc15", ask: "Tap yellow" }),
        bit("Green", "🐸", "Green. A frog is green.", { swatch: "#22c55e", ask: "Tap green" }),
        bit("Blue", "🐳", "Blue. The ocean is blue.", { swatch: "#3b82f6", ask: "Tap blue" }),
        bit("Purple", "🍇", "Purple. Grapes can be purple.", { swatch: "#a855f7", ask: "Tap purple" }),
        bit("Pink", "🐷", "Pink. This pig is pink.", { swatch: "#f472b6", ask: "Tap pink" }),
        bit("Brown", "🧸", "Brown. A teddy bear is brown.", { swatch: "#92400e", ask: "Tap brown" }),
        bit("Black", "🐱", "Black. This kitten is black.", { swatch: "#111827", ask: "Tap black" }),
        bit("White", "☁️", "White. A cloud can be white.", { swatch: "#f8fafc", ask: "Tap white" }),
      ],
    ),
    lesson(
      "Shapes",
      "🔺",
      "cards",
      "Shapes have names. Trace them with your eyes.",
      [
        bit("Circle", "⭕", "A circle is round, like a ball.", { shape: "circle", ask: "Tap the circle" }),
        bit("Square", "🟦", "A square has four equal sides.", { shape: "square", ask: "Tap the square" }),
        bit("Triangle", "🔺", "A triangle has three sides.", { shape: "triangle", ask: "Tap the triangle" }),
        bit("Rectangle", "📗", "A rectangle is like a long square.", { shape: "rectangle", ask: "Tap the rectangle" }),
        bit("Star", "⭐", "A star has pointy arms.", { shape: "star", ask: "Tap the star" }),
        bit("Heart", "❤️", "A heart shape means love.", { shape: "heart", ask: "Tap the heart" }),
        bit("Oval", "🥚", "An oval is a stretched circle, like an egg.", { shape: "oval", ask: "Tap the oval" }),
        bit("Diamond", "💎", "A diamond looks like a kite.", { shape: "diamond", ask: "Tap the diamond" }),
      ],
    ),
    lesson(
      "Big and Small",
      "🐘",
      "pairs",
      "Some things are big. Some things are small.",
      [
        bit("Big elephant", "🐘", "The elephant is big. The mouse is small.", {
          ask: "Tap the big elephant",
          left: { word: "Big", emoji: "🐘", say: "Big elephant.", motion: "big" },
          right: { word: "Small", emoji: "🐭", say: "Small mouse.", motion: "small" },
        }),
        bit("Big ball", "🏀", "This ball is big. This ball is small.", {
          ask: "Tap the big ball",
          left: { word: "Big", emoji: "🏀", say: "Big ball.", motion: "big" },
          right: { word: "Small", emoji: "⚾", say: "Small ball.", motion: "small" },
        }),
        bit("Big bus", "🚌", "A bus is big. A bicycle is smaller.", {
          ask: "Tap the big bus",
          left: { word: "Big", emoji: "🚌", say: "Big bus.", motion: "big" },
          right: { word: "Small", emoji: "🚲", say: "Smaller bicycle.", motion: "small" },
        }),
        bit("Big whale", "🐋", "A whale is big. A fish is small.", {
          ask: "Tap the big whale",
          left: { word: "Big", emoji: "🐋", say: "Big whale.", motion: "big" },
          right: { word: "Small", emoji: "🐟", say: "Small fish.", motion: "small" },
        }),
      ],
    ),
    lesson(
      "Up and Down",
      "🎈",
      "pairs",
      "Up goes high. Down comes low.",
      [
        bit("Balloon up", "🎈", "The balloon goes up. The ball comes down.", {
          ask: "Tap the balloon going up",
          left: { word: "Up", emoji: "🎈", say: "Up. The balloon floats up.", motion: "up" },
          right: { word: "Down", emoji: "⚽", say: "Down. The ball comes down.", motion: "down" },
        }),
        bit("Bird up", "🐦", "The bird flies up. The bug walks down low.", {
          ask: "Tap the bird up high",
          left: { word: "Up", emoji: "🐦", say: "Up in the sky.", motion: "up" },
          right: { word: "Down", emoji: "🐞", say: "Down on the grass.", motion: "down" },
        }),
        bit("Rocket up", "🚀", "A rocket goes up. Rain falls down.", {
          ask: "Tap the rocket",
          left: { word: "Up", emoji: "🚀", say: "Up goes the rocket.", motion: "up" },
          right: { word: "Down", emoji: "🌧️", say: "Down comes the rain.", motion: "down" },
        }),
        bit("Hands up", "🙌", "Hands can go up. Toes point down.", {
          ask: "Tap hands up",
          left: { word: "Up", emoji: "🙌", say: "Hands up!", motion: "up" },
          right: { word: "Down", emoji: "🦶", say: "Toes down.", motion: "down" },
        }),
      ],
    ),
    lesson(
      "Long and Short",
      "🐍",
      "pairs",
      "Long stretches out. Short is little.",
      [
        bit("Long snake", "🐍", "The snake is long. The worm is short.", {
          ask: "Tap the long snake",
          left: { word: "Long", emoji: "🐍〰️", say: "A long snake.", motion: "long" },
          right: { word: "Short", emoji: "🐛", say: "A short worm.", motion: "short" },
        }),
        bit("Long train", "🚂", "A train is long. A car is shorter.", {
          ask: "Tap the long train",
          left: { word: "Long", emoji: "🚂🚃🚃", say: "A long train.", motion: "long" },
          right: { word: "Short", emoji: "🚗", say: "A shorter car.", motion: "short" },
        }),
        bit("Long scarf", "🧣", "A scarf can be long. A bow is short.", {
          ask: "Tap the long scarf",
          left: { word: "Long", emoji: "🧣", say: "A long scarf.", motion: "long" },
          right: { word: "Short", emoji: "🎀", say: "A short bow.", motion: "short" },
        }),
        bit("Long path", "🛣️", "This path is long. This stick is short.", {
          ask: "Tap the long path",
          left: { word: "Long", emoji: "🛣️", say: "A long path.", motion: "long" },
          right: { word: "Short", emoji: "🪵", say: "A short stick.", motion: "short" },
        }),
      ],
    ),
    lesson(
      "More and Less",
      "🍎",
      "pairs",
      "More means a bigger group. Less means fewer.",
      [
        bit("More apples", "🍎", "Five apples are more. Two apples are less.", {
          ask: "Tap more apples",
          left: { word: "More", emoji: "🍎", say: "More apples. Five.", count: 5 },
          right: { word: "Less", emoji: "🍎", say: "Less apples. Two.", count: 2 },
        }),
        bit("More stars", "⭐", "Four stars are more than one star.", {
          ask: "Tap more stars",
          left: { word: "More", emoji: "⭐", say: "More stars.", count: 4 },
          right: { word: "Less", emoji: "⭐", say: "Less. Just one star.", count: 1 },
        }),
        bit("Less frogs", "🐸", "Three frogs are less. Six frogs are more.", {
          ask: "Tap the side with less",
          left: { word: "Less", emoji: "🐸", say: "Less frogs. Three.", count: 3 },
          right: { word: "More", emoji: "🐸", say: "More frogs. Six.", count: 6 },
        }),
        bit("More cookies", "🍪", "Five cookies are more than two cookies.", {
          ask: "Tap more cookies",
          left: { word: "Less", emoji: "🍪", say: "Less cookies.", count: 2 },
          right: { word: "More", emoji: "🍪", say: "More cookies.", count: 5 },
        }),
      ],
      {
        quiz: [
          q("Which group has more apples?", "Five apples", [
            ["Five apples", "🍎"],
            ["Two apples", "🍏"],
            ["One apple", "🍑"],
          ]),
          q("Less means…", "A smaller group", [
            ["A smaller group", "🤏"],
            ["A bigger group", "👐"],
            ["A loud sound", "📢"],
          ]),
        ],
      },
    ),
    lesson(
      "Same and Different",
      "⭐",
      "pairs",
      "Same means they match. Different means they do not.",
      [
        bit("Same stars", "⭐", "Two stars are the same. A star and a heart are different.", {
          ask: "Tap the same stars",
          left: { word: "Same", emoji: "⭐⭐", say: "Same. Two stars." },
          right: { word: "Different", emoji: "⭐❤️", say: "Different. A star and a heart." },
        }),
        bit("Same cats", "🐱", "Two cats match. A cat and a dog are different.", {
          ask: "Tap the same cats",
          left: { word: "Same", emoji: "🐱🐱", say: "Same cats." },
          right: { word: "Different", emoji: "🐱🐶", say: "Different animals." },
        }),
        bit("Same dots", "🔴", "Two red dots are the same. Red and blue are different.", {
          ask: "Tap the same dots",
          left: { word: "Same", emoji: "🔴🔴", say: "Same color." },
          right: { word: "Different", emoji: "🔴🔵", say: "Different colors." },
        }),
        bit("Same balls", "⚽", "Two balls are the same kind. A ball and a car are different.", {
          ask: "Tap the same balls",
          left: { word: "Same", emoji: "⚽⚽", say: "Same. Two balls." },
          right: { word: "Different", emoji: "⚽🚗", say: "Different. Ball and car." },
        }),
      ],
    ),
    lesson(
      "Opposites",
      "↔️",
      "pairs",
      "Opposites are words that are far apart, like hot and cold.",
      [
        bit("Hot sun", "☀️", "Hot and cold are opposites.", {
          ask: "Tap hot",
          left: { word: "Hot", emoji: "☀️", say: "Hot sun." },
          right: { word: "Cold", emoji: "🧊", say: "Cold ice." },
        }),
        bit("Open door", "🚪", "Open and closed are opposites.", {
          ask: "Tap open",
          left: { word: "Open", emoji: "🚪", say: "The door is open." },
          right: { word: "Closed", emoji: "🔒", say: "It is closed." },
        }),
        bit("Fast car", "🏎️", "Fast and slow are opposites.", {
          ask: "Tap fast",
          left: { word: "Fast", emoji: "🏎️", say: "A fast car." },
          right: { word: "Slow", emoji: "🐢", say: "A slow turtle." },
        }),
        bit("Full cup", "🥛", "Full and empty are opposites.", {
          ask: "Tap the full cup",
          left: { word: "Full", emoji: "🥛", say: "A full cup." },
          right: { word: "Empty", emoji: "🥤", say: "An empty cup." },
        }),
        bit("Loud drum", "🥁", "Loud and quiet are opposites.", {
          ask: "Tap loud",
          left: { word: "Loud", emoji: "🥁", say: "A loud drum.", motion: "big" },
          right: { word: "Quiet", emoji: "🤫", say: "A quiet whisper.", motion: "small" },
        }),
        bit("Wet rain", "🌧️", "Wet and dry are opposites.", {
          ask: "Tap wet",
          left: { word: "Wet", emoji: "🌧️", say: "Wet rain." },
          right: { word: "Dry", emoji: "🏜️", say: "Dry sand." },
        }),
        bit("Happy face", "😊", "Happy and sad are opposite feelings.", {
          ask: "Tap happy",
          left: { word: "Happy", emoji: "😊", say: "A happy face." },
          right: { word: "Sad", emoji: "😢", say: "A sad face." },
        }),
        bit("Day sky", "🌤️", "Day and night are opposites.", {
          ask: "Tap day",
          left: { word: "Day", emoji: "🌤️", say: "Bright day." },
          right: { word: "Night", emoji: "🌙", say: "Dark night." },
        }),
      ],
    ),
  ],
};

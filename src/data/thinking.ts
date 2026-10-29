import type { Category, Opt, QuizQ } from "../types";
import { bit, lesson } from "./helpers";

function colors(answer: string, picture: string, say: string): QuizQ {
  const options: Opt[] = [
    { word: "Red", emoji: "🍓", swatch: "#ef4444" },
    { word: "Blue", emoji: "🐳", swatch: "#3b82f6" },
    { word: "Yellow", emoji: "🌟", swatch: "#facc15" },
    { word: "Green", emoji: "🐸", swatch: "#22c55e" },
  ];
  return { say, answer, picture, options };
}

const shapeOptions: Opt[] = [
  { word: "Circle", emoji: "⭕", shape: "circle" },
  { word: "Square", emoji: "🟦", shape: "square" },
  { word: "Triangle", emoji: "🔺", shape: "triangle" },
  { word: "Star", emoji: "⭐", shape: "star" },
];

export const thinking: Category = {
  id: 7,
  name: "Thinking and Brain Development",
  emoji: "🧩",
  tint: "#0d9488",
  ink: "#fff",
  blurb: "Look carefully, then tap the answer",
  topics: [
    lesson(
      "Match the Colors",
      "🎨",
      "cards",
      "Look at the picture. Find its color.",
      [
        bit("Red", "🍓", "A strawberry is red.", { swatch: "#ef4444" }),
        bit("Blue", "🐳", "A whale is blue.", { swatch: "#3b82f6" }),
        bit("Yellow", "🌟", "The sun looks yellow.", { swatch: "#facc15" }),
        bit("Green", "🐸", "A frog is green.", { swatch: "#22c55e" }),
      ],
      {
        game: {
          type: "pick",
          rounds: [
            colors("Red", "🍓", "What color is the strawberry?"),
            colors("Yellow", "🌟", "What color is the sun?"),
            colors("Blue", "🐳", "What color is the whale?"),
            colors("Green", "🐸", "What color is the frog?"),
          ],
        },
      },
    ),
    lesson(
      "Match the Shapes",
      "🔺",
      "cards",
      "Everyday things have shapes.",
      [
        bit("Circle", "⚽", "A ball is a circle.", { shape: "circle" }),
        bit("Square", "🪟", "This window is a square.", { shape: "square" }),
        bit("Triangle", "🍕", "A pizza slice is a triangle.", { shape: "triangle" }),
        bit("Star", "⭐", "A sticker can be a star.", { shape: "star" }),
      ],
      {
        game: {
          type: "pick",
          rounds: [
            { say: "What shape is the ball?", answer: "Circle", picture: "⚽", options: shapeOptions },
            { say: "What shape is the window?", answer: "Square", picture: "🪟", options: shapeOptions },
            { say: "What shape is the pizza slice?", answer: "Triangle", picture: "🍕", options: shapeOptions },
            { say: "What shape is the sticker?", answer: "Star", picture: "⭐", options: shapeOptions },
          ],
        },
      },
    ),
    lesson(
      "Find the Missing Object",
      "❓",
      "cards",
      "Look at what is gone. Then bring it back.",
      [
        bit("Bunny", "🐰", "Cat, mouse, and bunny were playing.", { sub: "remember" }),
        bit("Ball", "⚽", "The puppy had a ball.", { sub: "remember" }),
        bit("Hat", "🎩", "The snowman had a hat.", { sub: "remember" }),
        bit("Apple", "🍎", "The basket had an apple.", { sub: "remember" }),
      ],
      {
        game: {
          type: "pick",
          rounds: [
            {
              say: "Who hopped away?",
              answer: "Bunny",
              picture: "🐱🐭❓",
              options: [
                { word: "Bunny", emoji: "🐰" },
                { word: "Lion", emoji: "🦁" },
                { word: "Fish", emoji: "🐟" },
              ],
            },
            {
              say: "What did the puppy lose?",
              answer: "Ball",
              picture: "🐶🏠❓",
              options: [
                { word: "Ball", emoji: "⚽" },
                { word: "Boat", emoji: "⛵" },
                { word: "Moon", emoji: "🌙" },
              ],
            },
            {
              say: "What is missing from the snowman?",
              answer: "Hat",
              picture: "⛄❓",
              options: [
                { word: "Hat", emoji: "🎩" },
                { word: "Fish", emoji: "🐟" },
                { word: "Car", emoji: "🚗" },
              ],
            },
            {
              say: "What belongs in the basket?",
              answer: "Apple",
              picture: "🧺❓",
              options: [
                { word: "Apple", emoji: "🍎" },
                { word: "Sock", emoji: "🧦" },
                { word: "Drum", emoji: "🥁" },
              ],
            },
          ],
        },
      },
    ),
    lesson(
      "Guess the Animal",
      "🐮",
      "cards",
      "Listen to the sound. Guess who it is.",
      [
        bit("Cow", "🐄", "Moo belongs to the cow.", { cue: "moo" }),
        bit("Duck", "🦆", "Quack belongs to the duck.", { cue: "quack" }),
        bit("Lion", "🦁", "Roar belongs to the lion.", { cue: "roar" }),
        bit("Cat", "🐱", "Meow belongs to the cat.", { cue: "meow" }),
      ],
      {
        game: {
          type: "pick",
          rounds: [
            {
              say: "Who says moo?",
              answer: "Cow",
              cue: "moo",
              picture: "❓",
              options: [
                { word: "Cow", emoji: "🐄" },
                { word: "Pig", emoji: "🐷" },
                { word: "Duck", emoji: "🦆" },
              ],
            },
            {
              say: "Who says quack?",
              answer: "Duck",
              cue: "quack",
              picture: "❓",
              options: [
                { word: "Duck", emoji: "🦆" },
                { word: "Horse", emoji: "🐴" },
                { word: "Fish", emoji: "🐟" },
              ],
            },
            {
              say: "Who says roar?",
              answer: "Lion",
              cue: "roar",
              picture: "❓",
              options: [
                { word: "Lion", emoji: "🦁" },
                { word: "Sheep", emoji: "🐑" },
                { word: "Bird", emoji: "🐦" },
              ],
            },
            {
              say: "Who says meow?",
              answer: "Cat",
              cue: "meow",
              picture: "❓",
              options: [
                { word: "Cat", emoji: "🐱" },
                { word: "Dog", emoji: "🐶" },
                { word: "Frog", emoji: "🐸" },
              ],
            },
          ],
        },
      },
    ),
    lesson(
      "Which One Is Different",
      "👀",
      "cards",
      "Three match. One does not.",
      [
        bit("Look closely", "👀", "Find the picture that is not like the others.", { sub: "one is different" }),
        bit("Dogs and a cat", "🐶", "Most are dogs. One is a cat.", { sub: "example" }),
        bit("Apples and a banana", "🍎", "Most are apples. One is a banana.", { sub: "example" }),
      ],
      {
        game: {
          type: "odd",
          rounds: [
            {
              say: "Tap the one that is different.",
              items: [
                { word: "Dog", emoji: "🐶" },
                { word: "Dog again", emoji: "🐶" },
                { word: "Dog too", emoji: "🐶" },
                { word: "Cat", emoji: "🐱", odd: true },
              ],
            },
            {
              say: "Tap the different fruit.",
              items: [
                { word: "Apple", emoji: "🍎" },
                { word: "Apple two", emoji: "🍎" },
                { word: "Banana", emoji: "🍌", odd: true },
                { word: "Apple three", emoji: "🍎" },
              ],
            },
            {
              say: "Tap the one that is not a star.",
              items: [
                { word: "Star", emoji: "⭐" },
                { word: "Heart", emoji: "❤️", odd: true },
                { word: "Star two", emoji: "⭐" },
                { word: "Star three", emoji: "⭐" },
              ],
            },
            {
              say: "Tap the different ride.",
              items: [
                { word: "Car", emoji: "🚗" },
                { word: "Car two", emoji: "🚗" },
                { word: "Car three", emoji: "🚗" },
                { word: "Boat", emoji: "⛵", odd: true },
              ],
            },
          ],
        },
      },
    ),
    lesson(
      "What Comes Next",
      "➡️",
      "cards",
      "Patterns repeat. Guess the next picture.",
      [
        bit("Apple apple banana", "🍎", "Apple, apple, banana. The pattern likes a turn.", { sub: "pattern" }),
        bit("Star heart star", "⭐", "Star, heart, star. What repeats?", { sub: "pattern" }),
      ],
      {
        game: {
          type: "next",
          rounds: [
            { say: "What comes next?", pattern: ["🍎", "🍎", "🍌", "🍎", "🍎"], answer: "🍌", options: ["🍌", "🍇", "🥕"] },
            { say: "What comes next?", pattern: ["⭐", "❤️", "⭐", "❤️"], answer: "⭐", options: ["⭐", "🌙", "🐟"] },
            { say: "What comes next?", pattern: ["🐶", "🐶", "🐱", "🐶", "🐶"], answer: "🐱", options: ["🐱", "🐸", "🚗"] },
            { say: "What comes next?", pattern: ["🔵", "🔵", "🟡"], answer: "🔵", options: ["🔵", "🟡", "🟢"] },
          ],
        },
      },
    ),
    lesson(
      "Count the Objects",
      "🔢",
      "cards",
      "Count slowly. Touch each one in your mind.",
      [
        bit("Two", "⭐", "One, two.", { count: 2, sub: "two" }),
        bit("Three", "🐸", "One, two, three.", { count: 3, sub: "three" }),
        bit("Four", "🍎", "One, two, three, four.", { count: 4, sub: "four" }),
      ],
      {
        game: {
          type: "count",
          rounds: [
            { say: "How many stars?", emoji: "⭐", n: 2, choices: [1, 2, 3] },
            { say: "How many frogs?", emoji: "🐸", n: 3, choices: [2, 3, 4] },
            { say: "How many apples?", emoji: "🍎", n: 4, choices: [3, 4, 5] },
            { say: "How many ducks?", emoji: "🦆", n: 5, choices: [3, 5, 6] },
          ],
        },
      },
    ),
    lesson(
      "Find the Shadow",
      "🌑",
      "cards",
      "A shadow is the same shape, but dark.",
      [
        bit("Cat shadow", "🐱", "The cat and the dark cat shape match.", { sub: "shadow" }),
        bit("Fish shadow", "🐟", "Match the fish to its shadow.", { sub: "shadow" }),
        bit("Star shadow", "⭐", "The star shadow has points too.", { sub: "shadow" }),
      ],
      {
        game: {
          type: "shadow",
          rounds: [
            {
              say: "Find the cat's shadow.",
              answer: "Cat",
              options: [
                { word: "Cat", emoji: "🐱" },
                { word: "Fish", emoji: "🐟" },
                { word: "Car", emoji: "🚗" },
              ],
            },
            {
              say: "Find the star's shadow.",
              answer: "Star",
              options: [
                { word: "Heart", emoji: "❤️" },
                { word: "Star", emoji: "⭐" },
                { word: "Ball", emoji: "⚽" },
              ],
            },
            {
              say: "Find the fish's shadow.",
              answer: "Fish",
              options: [
                { word: "Bird", emoji: "🐦" },
                { word: "Hat", emoji: "🎩" },
                { word: "Fish", emoji: "🐟" },
              ],
            },
            {
              say: "Find the flower's shadow.",
              answer: "Flower",
              options: [
                { word: "Flower", emoji: "🌸" },
                { word: "Shoe", emoji: "👟" },
                { word: "Cup", emoji: "🥤" },
              ],
            },
          ],
        },
      },
    ),
    lesson(
      "Complete the Picture",
      "🧩",
      "cards",
      "Something is missing. Pick the piece that finishes it.",
      [
        bit("Snowman", "⛄", "A snowman needs a hat.", { sub: "missing piece" }),
        bit("Face", "🙂", "A face needs eyes.", { sub: "missing piece" }),
        bit("House", "🏠", "A house needs a door.", { sub: "missing piece" }),
      ],
      {
        game: {
          type: "pick",
          rounds: [
            {
              say: "The snowman needs a hat. What is missing?",
              answer: "Hat",
              picture: "⛄",
              options: [
                { word: "Hat", emoji: "🎩" },
                { word: "Boat", emoji: "⛵" },
                { word: "Fish", emoji: "🐟" },
              ],
            },
            {
              say: "The face needs eyes. What is missing?",
              answer: "Eyes",
              picture: "🙂",
              options: [
                { word: "Eyes", emoji: "👀" },
                { word: "Shoe", emoji: "👟" },
                { word: "Car", emoji: "🚗" },
              ],
            },
            {
              say: "The house needs a door. What is missing?",
              answer: "Door",
              picture: "🏠",
              options: [
                { word: "Door", emoji: "🚪" },
                { word: "Moon", emoji: "🌙" },
                { word: "Spoon", emoji: "🥄" },
              ],
            },
            {
              say: "The flower needs a stem. What is missing?",
              answer: "Stem",
              picture: "🌸",
              options: [
                { word: "Stem", emoji: "🌱" },
                { word: "Drum", emoji: "🥁" },
                { word: "Hat", emoji: "🎩" },
              ],
            },
          ],
        },
      },
    ),
    lesson(
      "Where Does It Belong",
      "🌍",
      "cards",
      "Some things live on land, in water, or in the air.",
      [
        bit("Land", "🌳", "Cars and dogs belong on land.", { sub: "land" }),
        bit("Water", "💧", "Fish and boats belong in water.", { sub: "water" }),
        bit("Air", "☁️", "Birds and planes belong in the air.", { sub: "air" }),
      ],
      {
        game: {
          type: "sort",
          prompt: "Where does it belong?",
          bins: [
            { id: "land", label: "Land", emoji: "🌳" },
            { id: "water", label: "Water", emoji: "💧" },
            { id: "air", label: "Air", emoji: "☁️" },
          ],
          items: [
            { word: "Dog", emoji: "🐶", bin: "land", say: "A dog walks on land." },
            { word: "Fish", emoji: "🐟", bin: "water", say: "A fish lives in water." },
            { word: "Bird", emoji: "🐦", bin: "air", say: "A bird flies in the air." },
            { word: "Boat", emoji: "⛵", bin: "water", say: "A boat floats on water." },
            { word: "Car", emoji: "🚗", bin: "land", say: "A car drives on land." },
            { word: "Plane", emoji: "✈️", bin: "air", say: "A plane flies in the air." },
          ],
        },
      },
    ),
  ],
};

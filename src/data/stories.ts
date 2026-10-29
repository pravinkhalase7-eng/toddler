import type { Category } from "../types";
import { bit, lesson, q } from "./helpers";

export const stories: Category = {
  id: 8,
  name: "Simple Stories",
  emoji: "📖",
  tint: "#f97316",
  ink: "#fff",
  blurb: "Short picture stories with a kind ending",
  topics: [
    lesson(
      "The Lion and the Mouse",
      "🦁",
      "story",
      "A tiny friend can be a big help.",
      [
        bit("Sleeping lion", "🦁", "A big lion was asleep in the warm grass.", { sub: "Page 1" }),
        bit("Tiny mouse", "🐭", "A tiny mouse ran by and woke him. The lion let the mouse go.", { sub: "Page 2" }),
        bit("A tangled net", "🪢", "Later the lion was caught in a rope net. He could not get out.", { sub: "Page 3" }),
        bit("Friends", "🤝", "The mouse chewed a little hole. The lion stepped free. Thank you, little friend.", { sub: "Page 4" }),
      ],
      {
        quiz: [
          q("Who helped the lion?", "The mouse", [
            ["The mouse", "🐭"],
            ["A fish", "🐟"],
            ["A bus", "🚌"],
          ]),
          q("What did the mouse do?", "Chewed a hole in the net", [
            ["Chewed a hole in the net", "🪢"],
            ["Flew away", "✈️"],
            ["Hid the sun", "🌙"],
          ]),
        ],
      },
    ),
    lesson(
      "The Thirsty Crow",
      "🐦",
      "story",
      "Thinking can solve a problem.",
      [
        bit("Thirsty", "🐦", "A crow was thirsty on a hot day.", { sub: "Page 1" }),
        bit("The jug", "🏺", "He found a jug of water, but the water was too low to reach.", { sub: "Page 2" }),
        bit("Pebbles", "🪨", "He dropped pebbles in, one by one.", { sub: "Page 3" }),
        bit("A drink", "💧", "The water rose up. The crow drank. Slow ideas can work.", { sub: "Page 4" }),
      ],
      {
        quiz: [
          q("What did the crow drop into the jug?", "Pebbles", [
            ["Pebbles", "🪨"],
            ["Shoes", "👟"],
            ["Stars", "⭐"],
          ]),
          q("Why did the water rise?", "The pebbles took up space", [
            ["The pebbles took up space", "💧"],
            ["The jug ran away", "🏃"],
            ["It started to snow", "❄️"],
          ]),
        ],
      },
    ),
    lesson(
      "The Tortoise and the Hare",
      "🐢",
      "story",
      "Keep going. Steady steps finish the path.",
      [
        bit("A race", "🏁", "Hare was fast. Tortoise was slow. They started a race.", { sub: "Page 1" }),
        bit("Hare naps", "🐰", "Hare ran ahead and took a nap. He thought he had lots of time.", { sub: "Page 2" }),
        bit("Slow steps", "🐢", "Tortoise kept walking. Step, step, step.", { sub: "Page 3" }),
        bit("The finish", "🌟", "Tortoise reached the end first. Hare woke up and smiled. Friends again.", { sub: "Page 4" }),
      ],
      {
        quiz: [
          q("Who kept going?", "The tortoise", [
            ["The tortoise", "🐢"],
            ["The sleeping hare", "🐰"],
            ["A cloud", "☁️"],
          ]),
          q("What is the lesson?", "Keep taking small steps", [
            ["Keep taking small steps", "🚶"],
            ["Naps win races", "😴"],
            ["Never try", "🚫"],
          ]),
        ],
      },
    ),
    lesson(
      "The Hungry Caterpillar",
      "🐛",
      "story",
      "An original story about Coco, a little caterpillar.",
      [
        bit("Coco", "🐛", "Coco the caterpillar was hungry.", { sub: "Page 1" }),
        bit("A leaf and an apple", "🍏", "She munched a green leaf and a sweet apple.", { sub: "Page 2" }),
        bit("A cozy wrap", "🫧", "Then she felt sleepy and spun a cozy wrap.", { sub: "Page 3" }),
        bit("Butterfly", "🦋", "When she came out, she had wings. Coco was a butterfly.", { sub: "Page 4" }),
      ],
      {
        quiz: [
          q("What did Coco become?", "A butterfly", [
            ["A butterfly", "🦋"],
            ["A truck", "🚚"],
            ["A shoe", "👟"],
          ]),
          q("What did she eat?", "A leaf and an apple", [
            ["A leaf and an apple", "🍏"],
            ["A drum", "🥁"],
            ["A hat", "🎩"],
          ]),
        ],
      },
    ),
    lesson(
      "The Little Lost Puppy",
      "🐶",
      "story",
      "If you are lost, stay where a helper can find you.",
      [
        bit("Puppy", "🐶", "A little puppy wandered one path too far.", { sub: "Page 1" }),
        bit("Sit and wait", "🌳", "He sat by a big tree and gave a small woof.", { sub: "Page 2", cue: "bark" }),
        bit("A helper", "🧒", "A child told a grown-up. They looked together.", { sub: "Page 3" }),
        bit("Found", "🏡", "The puppy's family hugged him. Staying put helped.", { sub: "Page 4" }),
      ],
      {
        quiz: [
          q("What helped the puppy get found?", "He stayed and called", [
            ["He stayed and called", "🐶"],
            ["He ran farther", "🏃"],
            ["He hid in a car", "🚗"],
          ]),
          q("Who did the child tell?", "A grown-up", [
            ["A grown-up", "🧑"],
            ["A stranger in a hurry", "🚶"],
            ["Nobody", "🙈"],
          ]),
        ],
      },
    ),
    lesson(
      "The Sharing Teddy Bear",
      "🧸",
      "story",
      "One toy can be enough when friends take turns.",
      [
        bit("One teddy", "🧸", "Mina had one teddy. Jo wanted a hug too.", { sub: "Page 1" }),
        bit("Both wanted it", "🤝", "They both held on. Nobody was having fun.", { sub: "Page 2" }),
        bit("A turn", "⏳", "Mina hugged first. Then she passed the teddy to Jo.", { sub: "Page 3" }),
        bit("Play again", "😊", "They took turns all afternoon. The teddy felt very loved.", { sub: "Page 4" }),
      ],
      {
        quiz: [
          q("How did Mina and Jo solve it?", "They took turns", [
            ["They took turns", "🔁"],
            ["They hid the teddy", "🙈"],
            ["They threw it away", "🗑️"],
          ]),
        ],
      },
    ),
    lesson(
      "The Little Seed",
      "🌱",
      "story",
      "Growing takes water, sun, and time.",
      [
        bit("A seed", "🌰", "A little seed sat in dark, cozy soil.", { sub: "Page 1" }),
        bit("Water", "💧", "Rain gave it a drink.", { sub: "Page 2" }),
        bit("Sun", "☀️", "The sun warmed the ground.", { sub: "Page 3" }),
        bit("A flower", "🌻", "A green sprout came up and opened a yellow flower.", { sub: "Page 4" }),
      ],
      {
        quiz: [
          q("What did the seed need?", "Water and sun", [
            ["Water and sun", "☀️"],
            ["A bicycle", "🚲"],
            ["Loud drums all night", "🥁"],
          ]),
        ],
      },
    ),
    lesson(
      "The Rainbow Adventure",
      "🌈",
      "story",
      "After rain, friends name the colors.",
      [
        bit("Rain", "🌧️", "Rain tapped on the leaves. The friends waited.", { sub: "Page 1", cue: "rain" }),
        bit("Sun returns", "🌤️", "The sun came back out.", { sub: "Page 2" }),
        bit("A bow of color", "🌈", "A rainbow stretched across the sky.", { sub: "Page 3" }),
        bit("Name the colors", "🎨", "They pointed. Red, orange, yellow, green, blue, purple.", { sub: "Page 4" }),
      ],
      {
        quiz: [
          q("When can a rainbow show up?", "After rain and sun", [
            ["After rain and sun", "🌈"],
            ["Only inside a shoe", "👟"],
            ["Under the bed", "🛏️"],
          ]),
        ],
      },
    ),
    lesson(
      "The Little Star Who Was Afraid",
      "⭐",
      "story",
      "Your small light still matters.",
      [
        bit("Hiding", "⭐", "A little star hid behind a cloud. Shining felt scary.", { sub: "Page 1" }),
        bit("The moon", "🌙", "The moon said, Your light helps people find the path.", { sub: "Page 2" }),
        bit("A tiny glow", "✨", "The star peeked out and glowed, just a little.", { sub: "Page 3" }),
        bit("Brave light", "🌟", "That was enough. Being brave can start very small.", { sub: "Page 4" }),
      ],
      {
        quiz: [
          q("What helped the star try?", "The moon's kind words", [
            ["The moon's kind words", "🌙"],
            ["A loud horn", "📣"],
            ["Running away forever", "🏃"],
          ]),
        ],
      },
    ),
    lesson(
      "The Magic Fruit Basket",
      "🧺",
      "story",
      "A basket that is shared never feels empty.",
      [
        bit("A basket", "🧺", "Lila found a basket of fruit on the step.", { sub: "Page 1" }),
        bit("Friends arrive", "👧", "Friends came over. Everyone was hungry.", { sub: "Page 2" }),
        bit("Pass it on", "🍎", "Lila passed an apple, a banana, and grapes.", { sub: "Page 3" }),
        bit("Enough", "😊", "There was a piece for each friend. Sharing made it feel magic.", { sub: "Page 4" }),
      ],
      {
        quiz: [
          q("What was in the basket?", "Fruit", [
            ["Fruit", "🍎"],
            ["Rocks only", "🪨"],
            ["Shoes", "👟"],
          ]),
          q("What did Lila do with the fruit?", "Shared it", [
            ["Shared it", "🤝"],
            ["Hid it all", "🙈"],
            ["Threw it in the road", "🚗"],
          ]),
        ],
      },
    ),
  ],
};

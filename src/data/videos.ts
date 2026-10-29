import type { Category } from "../types";
import { bit, lesson, q } from "./helpers";

export const videos: Category = {
  id: 9,
  name: "Recommended Video Topics",
  emoji: "🎬",
  tint: "#2563eb",
  ink: "#fff",
  blurb: "Short animated shows you can watch and then practise",
  topics: [
    lesson(
      "Learn Colors with Cute Baby Animals",
      "🐤",
      "video",
      "A tiny show. Each baby animal wears a color.",
      [
        bit("Yellow chick", "🐤", "Yellow. The chick is yellow.", { swatch: "#facc15" }),
        bit("Green frog", "🐸", "Green. The baby frog is green.", { swatch: "#22c55e" }),
        bit("Pink piglet", "🐷", "Pink. The piglet is pink.", { swatch: "#f472b6" }),
        bit("Brown puppy", "🐶", "Brown. The puppy is brown.", { swatch: "#92400e" }),
        bit("Blue fish", "🐟", "Blue. The little fish is blue.", { swatch: "#3b82f6" }),
        bit("Red ladybug", "🐞", "Red. The ladybug is red.", { swatch: "#ef4444" }),
      ],
      {
        quiz: [
          q("What color is the chick?", "Yellow", [
            ["Yellow", "🐤"],
            ["Blue", "🐟"],
            ["Red", "🐞"],
          ], undefined, "🐤"),
          q("What color is the ladybug?", "Red", [
            ["Red", "🐞"],
            ["Green", "🐸"],
            ["Pink", "🐷"],
          ]),
        ],
      },
    ),
    lesson(
      "Learn ABC with a Funny Little Boy",
      "👦",
      "video",
      "A silly boy acts out each letter.",
      [
        bit("Apple", "🍎", "A is for apple. He pretends to take a bite. Mmm!", { letter: "A" }),
        bit("Ball", "⚽", "B is for ball. He bounce, bounce, bounces.", { letter: "B" }),
        bit("Cat", "🐱", "C is for cat. He says meow and giggles.", { letter: "C", cue: "meow" }),
        bit("Dog", "🐶", "D is for dog. He wags and says woof.", { letter: "D", cue: "bark" }),
        bit("Elephant", "🐘", "E is for elephant. He swings a pretend trunk.", { letter: "E" }),
        bit("Fish", "🐟", "F is for fish. He makes a splashy face.", { letter: "F", cue: "splash" }),
      ],
    ),
    lesson(
      "Count 1 to 10 with Jumping Frogs",
      "🐸",
      "video",
      "Frogs hop in, one by one.",
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) =>
        bit(String(n), "🐸", `${["zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"][n]}! ${n} jumping frog${n === 1 ? "" : "s"}.`, {
          count: n,
          cue: "ribbit",
        }),
      ),
    ),
    lesson(
      "Learn Animal Sounds on the Farm",
      "🚜",
      "video",
      "Visit the farm and copy each sound.",
      [
        bit("Cow", "🐄", "On the farm, the cow says moo.", { cue: "moo" }),
        bit("Pig", "🐷", "The pig says oink.", { cue: "oink" }),
        bit("Horse", "🐴", "The horse says neigh.", { cue: "neigh" }),
        bit("Sheep", "🐑", "The sheep says baa.", { cue: "baa" }),
        bit("Hen", "🐔", "The hen says cluck.", { cue: "cluck" }),
        bit("Duck", "🦆", "The duck says quack.", { cue: "quack" }),
      ],
      {
        quiz: [
          q("Who says moo?", "Cow", [
            ["Cow", "🐄"],
            ["Duck", "🦆"],
            ["Hen", "🐔"],
          ], "moo"),
        ],
      },
    ),
    lesson(
      "Learn Fruits with a Magic Basket",
      "🧺",
      "video",
      "A basket glows and a new fruit pops out.",
      [
        bit("Apple", "🍎", "The magic basket gives a red apple.", { swatch: "#ef4444" }),
        bit("Banana", "🍌", "Out pops a yellow banana.", { swatch: "#facc15" }),
        bit("Grapes", "🍇", "Purple grapes spill out, plink plink.", { swatch: "#a855f7" }),
        bit("Mango", "🥭", "A golden mango. Sweet!", { swatch: "#f59e0b" }),
        bit("Watermelon", "🍉", "A big watermelon. So juicy.", { swatch: "#16a34a" }),
      ],
    ),
    lesson(
      "Learn Shapes with Colorful Toys",
      "🧸",
      "video",
      "Toys on the rug show their shapes.",
      [
        bit("Ball", "⚽", "The ball is a circle. Round and round.", { shape: "circle" }),
        bit("Block", "🟦", "The block is a square.", { shape: "square" }),
        bit("Pizza toy", "🍕", "The play pizza slice is a triangle.", { shape: "triangle" }),
        bit("Book", "📕", "The board book is a rectangle.", { shape: "rectangle" }),
        bit("Star wand", "⭐", "The wand ends in a star.", { shape: "star" }),
      ],
    ),
    lesson(
      "Learn Days of the Week with Dancing Characters",
      "💃",
      "video",
      "Friends dance a new day onto the stage.",
      [
        bit("Monday", "🌞", "Monday dances in with a stretch.", { sub: "dance" }),
        bit("Tuesday", "🎾", "Tuesday bounces a ball.", { sub: "dance" }),
        bit("Wednesday", "📚", "Wednesday spins with a book.", { sub: "dance" }),
        bit("Thursday", "🎨", "Thursday paints in the air.", { sub: "dance" }),
        bit("Friday", "🎵", "Friday claps to the beat.", { sub: "dance" }),
        bit("Saturday", "🌳", "Saturday jumps toward the park.", { sub: "dance" }),
        bit("Sunday", "🤗", "Sunday sways with a family hug.", { sub: "dance" }),
      ],
    ),
    lesson(
      "Learn Body Parts with a Dancing Toddler",
      "💃",
      "video",
      "Dance and point. Copy the move.",
      [
        bit("Head", "🙂", "Pat your head.", { sub: "dance" }),
        bit("Shoulders", "🤷", "Wiggle your shoulders.", { sub: "dance" }),
        bit("Hands", "👏", "Clap your hands.", { sub: "dance", cue: "pop" }),
        bit("Tummy", "🟡", "Rub your tummy.", { sub: "dance" }),
        bit("Knees", "🦵", "Bend your knees.", { sub: "dance" }),
        bit("Toes", "🦶", "Tap your toes.", { sub: "dance" }),
      ],
    ),
    lesson(
      "Brush Your Teeth with Daddy",
      "🪥",
      "video",
      "Daddy and a little one brush together.",
      [
        bit("Daddy starts", "👨", "Daddy says, Teeth time. I will brush with you.", { sub: "together" }),
        bit("Two brushes", "🪥", "They each hold a toothbrush.", { sub: "together" }),
        bit("Little circles", "😁", "Little circles on the top teeth. Little circles on the bottom.", { sub: "together" }),
        bit("Rinse", "💧", "They spit and rinse. Daddy says, Nice work.", { sub: "together" }),
        bit("Smile", "✨", "They smile at each other. Clean teeth.", { sub: "together" }),
      ],
      {
        quiz: [
          q("Who helps with brushing?", "Daddy", [
            ["Daddy", "👨"],
            ["A fish", "🐟"],
            ["A bus", "🚌"],
          ]),
        ],
      },
    ),
    lesson(
      "Learn Vehicles with a Little Boy",
      "🚗",
      "video",
      "A little boy points at vehicles going by.",
      [
        bit("Car", "🚗", "Beep! A car rolls by.", { cue: "beep" }),
        bit("Bus", "🚌", "A big bus. So many windows.", { cue: "beep" }),
        bit("Train", "🚂", "Choo choo. A train on the tracks.", {}),
        bit("Bicycle", "🚲", "He pedals a little bicycle.", {}),
        bit("Airplane", "✈️", "An airplane draws a line in the sky.", {}),
        bit("Boat", "⛵", "A boat bobs on the water.", { cue: "splash" }),
      ],
    ),
    lesson(
      "Good Habits for Little Kids",
      "⭐",
      "video",
      "Four kind habits in one short show.",
      [
        bit("Wash hands", "🧼", "Wash, wash, wash with soap.", {}),
        bit("Drink water", "💧", "Sip water after play.", {}),
        bit("Tidy toys", "🧺", "Toys hop back into the basket.", {}),
        bit("Please", "🙏", "Please and thank you, every day.", {}),
        bit("Sleepy stretch", "😴", "Then a calm stretch for bedtime.", {}),
      ],
    ),
    lesson(
      "Learn Farm Animals and Their Babies",
      "🐮",
      "video",
      "Each grown-up animal stands with its baby.",
      [
        bit("Cow and calf", "🐄", "Cow and baby calf. Moo.", { cue: "moo", sub: "calf" }),
        bit("Pig and piglet", "🐷", "Pig and baby piglet. Oink.", { cue: "oink", sub: "piglet" }),
        bit("Horse and foal", "🐴", "Horse and baby foal.", { cue: "neigh", sub: "foal" }),
        bit("Sheep and lamb", "🐑", "Sheep and baby lamb. Baa.", { cue: "baa", sub: "lamb" }),
        bit("Hen and chick", "🐤", "Hen and baby chick. Peep.", { cue: "tweet", sub: "chick" }),
      ],
      {
        quiz: [
          q("A baby sheep is a…", "Lamb", [
            ["Lamb", "🐑"],
            ["Calf", "🐄"],
            ["Foal", "🐴"],
          ]),
        ],
      },
    ),
    lesson(
      "Opposites for Toddlers",
      "↔️",
      "video",
      "Watch two pictures. They are opposites.",
      [
        bit("Big and small", "🐘", "Big elephant. Small mouse.", {}),
        bit("Up and down", "🎈", "Balloon up. Ball down.", {}),
        bit("Hot and cold", "☀️", "Hot sun. Cold ice.", {}),
        bit("Open and closed", "🚪", "Open door. Closed lock.", {}),
        bit("Day and night", "🌤️", "Bright day. Quiet night.", {}),
      ],
    ),
    lesson(
      "Five Little Ducks Counting Song",
      "🦆",
      "video",
      "Watch the ducks. Count what you see.",
      [
        bit("Five", "🦆", "Five little ducks waddle out.", { count: 5, cue: "quack" }),
        bit("Four", "🦆", "Now four ducks splash.", { count: 4, cue: "quack" }),
        bit("Three", "🦆", "Three ducks bob on the pond.", { count: 3 }),
        bit("Two", "🦆", "Two ducks shake their feathers.", { count: 2 }),
        bit("One", "🦆", "One duck says quack. Then they all come home.", { count: 1, cue: "quack" }),
      ],
    ),
    lesson(
      "Bedtime Story: The Little Sleepy Bear",
      "🐻",
      "video",
      "A calm show for the end of the day.",
      [
        bit("Yawn", "🐻", "Little Bear yawned a big yawn.", {}),
        bit("Pajamas", "👕", "He put on soft pajamas.", {}),
        bit("Stars", "⭐", "Outside, the stars turned on one by one.", {}),
        bit("Story", "📖", "Mama Bear read one tiny story.", {}),
        bit("Sleep", "🌙", "Little Bear closed his eyes. The room was safe and quiet.", {}),
      ],
      {
        quiz: [
          q("What did Little Bear do at the end?", "He went to sleep", [
            ["He went to sleep", "🌙"],
            ["He drove a bus", "🚌"],
            ["He shouted all night", "📢"],
          ]),
        ],
      },
    ),
  ],
};

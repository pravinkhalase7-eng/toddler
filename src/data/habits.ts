import type { Category } from "../types";
import { bit, lesson, q } from "./helpers";

export const habits: Category = {
  id: 4,
  name: "Good Habits and Life Skills",
  emoji: "🪥",
  tint: "#f4b400",
  ink: "#4a3708",
  blurb: "Little routines that keep you healthy and safe",
  topics: [
    lesson(
      "Brushing Teeth",
      "🪥",
      "steps",
      "Brush with a grown-up, morning and night.",
      [
        bit("Get the brush", "🪥", "First, pick up your toothbrush.", { sub: "Step 1" }),
        bit("Tiny toothpaste", "🦷", "Add a tiny bit of toothpaste.", { sub: "Step 2" }),
        bit("Little circles", "😁", "Brush in little circles. Top and bottom.", { sub: "Step 3" }),
        bit("Spit and rinse", "💧", "Spit. Rinse with a sip of water.", { sub: "Step 4" }),
        bit("Sparkle smile", "✨", "Smile! Your teeth feel clean.", { sub: "Step 5" }),
      ],
      {
        quiz: [
          q("What do we use to clean teeth?", "Toothbrush", [
            ["Toothbrush", "🪥"],
            ["Shoe", "👟"],
            ["Book", "📚"],
          ]),
          q("When do we brush?", "Morning and night", [
            ["Morning and night", "🌅"],
            ["Only in the rain", "🌧️"],
            ["Never", "🚫"],
          ]),
        ],
      },
    ),
    lesson(
      "Washing Hands",
      "🧼",
      "steps",
      "Wash before eating and after the potty.",
      [
        bit("Water on", "🚰", "Turn on the water with help.", { sub: "Step 1" }),
        bit("Add soap", "🧼", "Add soap. It makes bubbles.", { sub: "Step 2" }),
        bit("Rub rub", "🙌", "Rub your palms, fingers, and thumbs.", { sub: "Step 3" }),
        bit("Rinse", "💧", "Rinse until the bubbles leave.", { sub: "Step 4" }),
        bit("Dry", "🧻", "Dry your hands on a towel.", { sub: "Step 5" }),
      ],
      {
        quiz: [
          q("What helps wash away germs?", "Soap and water", [
            ["Soap and water", "🧼"],
            ["Sand", "🏜️"],
            ["Paint", "🎨"],
          ]),
          q("We wash hands before we…", "Eat", [
            ["Eat", "🍽️"],
            ["Hide toys", "🙈"],
            ["Skip sleep", "😵"],
          ]),
        ],
      },
    ),
    lesson(
      "Bath Time",
      "🛁",
      "steps",
      "Bath time is warm, splashy, and calm.",
      [
        bit("Warm water", "🛁", "A grown-up checks the water is warm, not hot.", { sub: "Step 1" }),
        bit("Climb in", "🧴", "Sit down safely with a helper.", { sub: "Step 2" }),
        bit("Wash wash", "🧽", "Wash hair, face, tummy, and toes.", { sub: "Step 3" }),
        bit("Rinse off", "🚿", "Rinse the soap away.", { sub: "Step 4" }),
        bit("Cozy towel", "🧣", "Wrap up in a cozy towel.", { sub: "Step 5" }),
      ],
      {
        quiz: [
          q("Who checks the bath water?", "A grown-up", [
            ["A grown-up", "🧑"],
            ["The goldfish", "🐟"],
            ["A toy car", "🚗"],
          ]),
          q("After the bath we use a…", "Towel", [
            ["Towel", "🧣"],
            ["Umbrella", "☂️"],
            ["Spoon", "🥄"],
          ]),
        ],
      },
    ),
    lesson(
      "Healthy Eating",
      "🥗",
      "cards",
      "Try a little of each kind of food.",
      [
        bit("Fruit", "🍎", "Fruit is a sweet, colorful food.", { ask: "Tap the fruit" }),
        bit("Vegetables", "🥕", "Vegetables help you grow.", { ask: "Tap the vegetables" }),
        bit("Grains", "🍞", "Bread and rice give you energy.", { ask: "Tap the grains" }),
        bit("Milk foods", "🥛", "Milk and yogurt help bones.", { ask: "Tap the milk" }),
        bit("Water", "💧", "Water is the best everyday drink.", { ask: "Tap the water" }),
        bit("Slow bites", "😋", "Take small bites and chew.", { ask: "Tap slow bites" }),
      ],
      {
        quiz: [
          q("Which drink is best every day?", "Water", [
            ["Water", "💧"],
            ["Paint", "🎨"],
            ["Soap", "🧼"],
          ]),
          q("We take bites that are…", "Small", [
            ["Small", "🤏"],
            ["Bigger than your head", "😮"],
            ["Made of toys", "🧸"],
          ]),
        ],
      },
    ),
    lesson(
      "Drinking Water",
      "💧",
      "cards",
      "Sip water through the day.",
      [
        bit("Water cup", "🥤", "A cup of water is a happy choice.", { ask: "Tap the water cup" }),
        bit("Thirsty", "😮", "A dry mouth means it is time to sip.", { ask: "Tap thirsty" }),
        bit("After play", "⚽", "Drink water after you run and play.", { ask: "Tap after play" }),
        bit("With meals", "🍽️", "Have water with your food.", { ask: "Tap with meals" }),
      ],
      {
        quiz: [
          q("When you feel thirsty, you can…", "Sip water", [
            ["Sip water", "💧"],
            ["Eat crayons", "🖍️"],
            ["Drink bubble bath", "🛁"],
          ]),
        ],
      },
    ),
    lesson(
      "Cleaning Up Toys",
      "🧺",
      "steps",
      "Cleaning up is part of play.",
      [
        bit("Stop and look", "👀", "Look around. Where are the toys?", { sub: "Step 1" }),
        bit("Pick one up", "🧸", "Pick up one toy.", { sub: "Step 2" }),
        bit("Home for toys", "🧺", "Put it in the basket or on the shelf.", { sub: "Step 3" }),
        bit("Keep going", "🧱", "One more. Then another.", { sub: "Step 4" }),
        bit("All tidy", "✨", "The room looks calm. You did it!", { sub: "Step 5" }),
      ],
      {
        quiz: [
          q("Where do toys go when we finish?", "In the basket", [
            ["In the basket", "🧺"],
            ["On the stove", "🔥"],
            ["Out the window", "🪟"],
          ]),
        ],
      },
    ),
    lesson(
      "Sharing",
      "🤝",
      "cards",
      "Sharing means your friend gets a turn too.",
      [
        bit("One toy", "🧸", "There is one teddy and two friends.", { ask: "Tap the teddy" }),
        bit("My turn", "🙋", "I play for a little while.", { ask: "Tap my turn" }),
        bit("Your turn", "🧒", "Then I pass it to you.", { ask: "Tap your turn" }),
        bit("Both happy", "😊", "Taking turns helps everyone smile.", { ask: "Tap both happy" }),
      ],
      {
        quiz: [
          q("Sharing means…", "Your friend gets a turn", [
            ["Your friend gets a turn", "🤝"],
            ["You keep everything", "🙈"],
            ["You throw the toy", "😤"],
          ]),
        ],
      },
    ),
    lesson(
      "Please and Thank You",
      "🙏",
      "cards",
      "Kind words make asks and gifts feel warm.",
      [
        bit("Please", "🙏", "Please is a kind way to ask.", { ask: "Tap please" }),
        bit("Thank you", "🎁", "Thank you shows you noticed a kindness.", { ask: "Tap thank you" }),
        bit("Ask nicely", "🧃", "Can I have water, please?", { ask: "Tap ask nicely" }),
        bit("After help", "🤗", "Thank you for helping me.", { ask: "Tap after help" }),
      ],
      {
        quiz: [
          q("How do we ask for a snack?", "Please", [
            ["Please", "🙏"],
            ["Grab and run", "🏃"],
            ["Yell", "😠"],
          ]),
          q("Someone gives you a cup. You say…", "Thank you", [
            ["Thank you", "🎁"],
            ["Go away", "👋"],
            ["Mine forever", "😤"],
          ]),
        ],
      },
    ),
    lesson(
      "Potty Training",
      "🚽",
      "steps",
      "Tell a grown-up when your body says it is potty time.",
      [
        bit("Tell someone", "🗣️", "Say, I need the potty.", { sub: "Step 1" }),
        bit("Sit down", "🚽", "Sit on the potty. Take your time.", { sub: "Step 2" }),
        bit("You did it", "⭐", "Going on the potty is a big skill.", { sub: "Step 3" }),
        bit("Wipe with help", "🧻", "A grown-up helps you wipe.", { sub: "Step 4" }),
        bit("Wash hands", "🧼", "Always wash hands after.", { sub: "Step 5" }),
      ],
      {
        quiz: [
          q("When you need the potty, you…", "Tell a grown-up", [
            ["Tell a grown-up", "🗣️"],
            ["Hide", "🙈"],
            ["Wait all day", "⏳"],
          ]),
          q("After the potty we…", "Wash hands", [
            ["Wash hands", "🧼"],
            ["Skip soap", "🚫"],
            ["Touch food first", "🍞"],
          ]),
        ],
      },
    ),
    lesson(
      "Getting Dressed",
      "👕",
      "steps",
      "You can help put clothes on, one piece at a time.",
      [
        bit("Underwear", "🩳", "Start with clean underwear.", { sub: "Step 1" }),
        bit("Shirt", "👕", "Pull on a shirt. Head, then arms.", { sub: "Step 2" }),
        bit("Pants or dress", "👖", "Then pants, or a dress.", { sub: "Step 3" }),
        bit("Socks", "🧦", "Socks go on feet.", { sub: "Step 4" }),
        bit("Shoes", "👟", "Shoes go on when we leave home.", { sub: "Step 5" }),
      ],
      {
        quiz: [
          q("Socks go on your…", "Feet", [
            ["Feet", "🦶"],
            ["Ears", "👂"],
            ["Nose", "👃"],
          ]),
        ],
      },
    ),
    lesson(
      "Sleep Routine",
      "😴",
      "steps",
      "A calm routine tells your body it is bedtime.",
      [
        bit("Wash up", "🧼", "Wash face and hands.", { sub: "Step 1" }),
        bit("Pajamas", "👕", "Put on soft pajamas.", { sub: "Step 2" }),
        bit("Brush teeth", "🪥", "Brush teeth with a grown-up.", { sub: "Step 3" }),
        bit("Story cuddle", "📖", "A short story or a cuddle.", { sub: "Step 4" }),
        bit("Lights low", "🌙", "Lights low. Your bed is safe.", { sub: "Step 5" }),
      ],
      {
        quiz: [
          q("Bedtime clothes are called…", "Pajamas", [
            ["Pajamas", "👕"],
            ["Rain boots", "🥾"],
            ["A helmet", "⛑️"],
          ]),
        ],
      },
    ),
    lesson(
      "Safety at Home",
      "🏡",
      "cards",
      "Practise these with a grown-up. Home is safest with help.",
      [
        bit("Hot things", "🍲", "Stoves and kettles are for grown-ups. They are hot.", { ask: "Tap hot things" }),
        bit("Stairs", "🪜", "Hold a hand on the stairs.", { ask: "Tap the stairs" }),
        bit("Plugs", "🔌", "Plugs are not toys.", { ask: "Tap the plug" }),
        bit("Medicines", "💊", "Medicines are only from a grown-up.", { ask: "Tap medicines" }),
        bit("Ask first", "🗣️", "Ask before you climb or open a door.", { ask: "Tap ask first" }),
      ],
      {
        quiz: [
          q("The stove is…", "For grown-ups", [
            ["For grown-ups", "🍲"],
            ["A toy", "🧸"],
            ["A chair", "🪑"],
          ]),
          q("On the stairs we…", "Hold a hand", [
            ["Hold a hand", "🤝"],
            ["Run with eyes closed", "🙈"],
            ["Carry a big pot", "🍲"],
          ]),
        ],
      },
    ),
    lesson(
      "Road Safety",
      "🚦",
      "cards",
      "Roads are for cars. You stay with a grown-up.",
      [
        bit("Hold hands", "🤝", "Hold a grown-up's hand near the road.", { ask: "Tap hold hands" }),
        bit("Stop at the curb", "🛑", "Stop where the sidewalk ends.", { ask: "Tap stop" }),
        bit("Wait", "🚦", "Wait until your grown-up says go.", { ask: "Tap wait" }),
        bit("Look together", "👀", "Look both ways together.", { ask: "Tap look" }),
        bit("Walk, don't run", "🚶", "Walk across. Running is for the park.", { ask: "Tap walk" }),
      ],
      {
        quiz: [
          q("Near the road we…", "Hold a grown-up's hand", [
            ["Hold a grown-up's hand", "🤝"],
            ["Run into the street", "🏃"],
            ["Play ball there", "⚽"],
          ]),
          q("We cross when…", "A grown-up says go", [
            ["A grown-up says go", "🚦"],
            ["We feel bouncy", "😄"],
            ["A car beeps", "🚗"],
          ]),
        ],
      },
    ),
    lesson(
      "Stranger Safety",
      "👨‍👩‍👧",
      "cards",
      "Stay close to your grown-up. That is the safe plan.",
      [
        bit("Stay close", "🤝", "Stay near the grown-up you came with.", { ask: "Tap stay close" }),
        bit("Someone new", "🚪", "Do not go away with someone you do not know.", { ask: "Tap someone new" }),
        bit("Kind no", "🙅", "You can say, No, I need my grown-up.", { ask: "Tap kind no" }),
        bit("Trusted adult", "👩‍🏫", "If you feel unsure, tell a parent or teacher.", { ask: "Tap a trusted adult" }),
        bit("You are safe", "💛", "Grown-ups you trust will help you.", { ask: "Tap you are safe" }),
      ],
      {
        quiz: [
          q("If someone new says come with me, you…", "Stay with your grown-up", [
            ["Stay with your grown-up", "🤝"],
            ["Go with them", "🚶"],
            ["Hide alone outside", "🌲"],
          ]),
          q("A safe person to tell is…", "A parent or teacher", [
            ["A parent or teacher", "👩‍🏫"],
            ["A stranger in a car", "🚗"],
            ["Nobody", "🙈"],
          ]),
        ],
      },
    ),
    lesson(
      "Personal Hygiene",
      "✨",
      "cards",
      "Clean habits help your body feel good.",
      [
        bit("Wash face", "🧼", "A gentle wash wakes your face.", { ask: "Tap wash face" }),
        bit("Brush teeth", "🪥", "Clean teeth morning and night.", { ask: "Tap brush teeth" }),
        bit("Clean clothes", "👕", "Clean clothes feel fresh.", { ask: "Tap clean clothes" }),
        bit("Tissues", "🤧", "Use a tissue, then wash hands.", { ask: "Tap tissues" }),
        bit("Nails", "✋", "A grown-up keeps nails short and clean.", { ask: "Tap nails" }),
        bit("Hair", "💇", "Brush hair so it feels tidy.", { ask: "Tap hair" }),
      ],
      {
        quiz: [
          q("After you sneeze into a tissue, you…", "Wash hands", [
            ["Wash hands", "🧼"],
            ["Rub your eyes", "👀"],
            ["Share the tissue", "🤝"],
          ]),
        ],
      },
    ),
  ],
};

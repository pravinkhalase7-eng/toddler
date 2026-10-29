import type { Category } from "../types";
import { bit, lesson, q } from "./helpers";

export const feelings: Category = {
  id: 5,
  name: "Emotions and Social Skills",
  emoji: "💛",
  tint: "#e85d8c",
  ink: "#fff",
  blurb: "Feelings, kindness, and playing with friends",
  topics: [
    lesson(
      "Happy and Sad",
      "😊",
      "pairs",
      "Happy and sad are both okay feelings.",
      [
        bit("Happy smile", "😊", "Happy can feel warm and bouncy. Sad can feel heavy. Both are okay.", {
          ask: "Tap the happy smile",
          left: { word: "Happy", emoji: "😊", say: "Happy. A smile." },
          right: { word: "Sad", emoji: "😢", say: "Sad. Tears are okay." },
        }),
        bit("Laugh", "😄", "We laugh when we feel glad. We might cry when we feel sad.", {
          ask: "Tap laugh",
          left: { word: "Laugh", emoji: "😄", say: "Ha ha. That feels happy." },
          right: { word: "Cry", emoji: "😢", say: "Crying lets sad feelings out." },
        }),
        bit("Play", "🎈", "Play can bring happy. A hug can help sad.", {
          ask: "Tap play",
          left: { word: "Play", emoji: "🎈", say: "Playing can feel happy." },
          right: { word: "Hug", emoji: "🤗", say: "A hug can help when we are sad." },
        }),
      ],
      {
        quiz: [
          q("Is it okay to feel sad?", "Yes, feelings are okay", [
            ["Yes, feelings are okay", "💛"],
            ["No, never", "🚫"],
            ["Only toys feel things", "🧸"],
          ]),
        ],
      },
    ),
    lesson(
      "Angry and Calm",
      "😤",
      "pairs",
      "When anger shows up, a slow breath can help.",
      [
        bit("Angry face", "😠", "Angry feelings are loud. Calm feels softer.", {
          ask: "Tap the angry face",
          left: { word: "Angry", emoji: "😠", say: "Angry. My body feels tight." },
          right: { word: "Calm", emoji: "😌", say: "Calm. My body feels softer." },
        }),
        bit("Stomp", "🦶", "Stomping lets energy out. Then we breathe.", {
          ask: "Tap the big breath",
          left: { word: "Stomp", emoji: "🦶", say: "A stomp can let energy out." },
          right: { word: "Breathe", emoji: "🌬️", say: "Blow out like birthday candles." },
        }),
        bit("Tight hands", "✊", "Tight hands can open into soft hands.", {
          ask: "Tap soft hands",
          left: { word: "Tight", emoji: "✊", say: "Tight fists." },
          right: { word: "Soft", emoji: "🤲", say: "Soft open hands." },
        }),
      ],
      {
        quiz: [
          q("When you feel angry, you can…", "Take a slow breath", [
            ["Take a slow breath", "🌬️"],
            ["Hit a friend", "🚫"],
            ["Throw a chair", "🪑"],
          ]),
        ],
      },
    ),
    lesson(
      "Feeling Scared",
      "😨",
      "cards",
      "Scared feelings happen. A grown-up can stay close.",
      [
        bit("Scared", "😨", "Scared can feel fluttery in your tummy.", { ask: "Tap scared" }),
        bit("Night light", "💡", "A small light can help at bedtime.", { ask: "Tap the night light" }),
        bit("Tell someone", "🗣️", "Say, I feel scared.", { ask: "Tap tell someone" }),
        bit("Hug", "🤗", "A hug from your family can help.", { ask: "Tap a hug" }),
        bit("Slow breath", "🌬️", "Breathe in. Blow out. You are safe.", { ask: "Tap a slow breath" }),
      ],
      {
        quiz: [
          q("If you feel scared, a good plan is…", "Tell a grown-up", [
            ["Tell a grown-up", "🗣️"],
            ["Hide forever", "🙈"],
            ["Keep it a secret always", "🤐"],
          ]),
        ],
      },
    ),
    lesson(
      "Being Kind",
      "💗",
      "cards",
      "Kindness is something you do with your body and words.",
      [
        bit("Share", "🍪", "Sharing a turn is kind.", { ask: "Tap share" }),
        bit("Help", "🧺", "Helping tidy is kind.", { ask: "Tap help" }),
        bit("Smile", "😊", "A smile can welcome someone.", { ask: "Tap the smile" }),
        bit("Gentle hands", "🤲", "Gentle hands are kind hands.", { ask: "Tap gentle hands" }),
        bit("Please", "🙏", "Please and thank you are kind words.", { ask: "Tap please" }),
      ],
    ),
    lesson(
      "Making Friends",
      "👋",
      "cards",
      "Friends start with a hello.",
      [
        bit("Wave", "👋", "Wave hello.", { ask: "Tap wave" }),
        bit("Say hello", "🗣️", "Hello, I am playing too.", { ask: "Tap say hello" }),
        bit("Ask to play", "⚽", "Do you want to play?", { ask: "Tap ask to play" }),
        bit("Share a toy", "🧸", "Here is a toy we can share.", { ask: "Tap share a toy" }),
        bit("Smile", "😊", "A smile says you are friendly.", { ask: "Tap the smile" }),
      ],
    ),
    lesson(
      "Taking Turns",
      "🔁",
      "cards",
      "Turns make play fair.",
      [
        bit("My turn", "🙋", "My turn. I play for a little bit.", { ask: "Tap my turn" }),
        bit("Wait", "⏳", "I can wait. Waiting is a skill.", { ask: "Tap wait" }),
        bit("Your turn", "🧒", "Your turn. I pass it to you.", { ask: "Tap your turn" }),
        bit("Again", "🔁", "Then it comes back. My turn again.", { ask: "Tap again" }),
      ],
      {
        quiz: [
          q("When it is your friend's turn, you…", "Wait", [
            ["Wait", "⏳"],
            ["Grab it", "✊"],
            ["Walk away mad", "😠"],
          ]),
        ],
      },
    ),
    lesson(
      "Saying Sorry",
      "💌",
      "steps",
      "Sorry helps when someone gets hurt feelings.",
      [
        bit("Oops", "😅", "Sometimes we bump or grab by mistake.", { sub: "Step 1" }),
        bit("Stop", "🛑", "Stop and look at your friend.", { sub: "Step 2" }),
        bit("Sorry", "💌", "Say, I am sorry.", { sub: "Step 3" }),
        bit("Check", "🤗", "Ask, Are you okay?", { sub: "Step 4" }),
        bit("Try again", "🤝", "Play gently this time.", { sub: "Step 5" }),
      ],
      {
        quiz: [
          q("If you bump a friend, you can say…", "I am sorry", [
            ["I am sorry", "💌"],
            ["Your fault", "👉"],
            ["Nothing ever", "🤐"],
          ]),
        ],
      },
    ),
    lesson(
      "Being Gentle",
      "🐰",
      "cards",
      "Gentle means soft body and soft voice.",
      [
        bit("Pet", "🐶", "Pets like slow, soft pats.", { ask: "Tap the pet" }),
        bit("Baby", "👶", "Babies need quiet, gentle hands.", { ask: "Tap the baby" }),
        bit("Flowers", "🌸", "We smell flowers. We do not crush them.", { ask: "Tap the flowers" }),
        bit("Soft voice", "🤫", "A soft voice is gentle indoors.", { ask: "Tap soft voice" }),
        bit("Friend", "🧒", "Gentle play keeps friends safe.", { ask: "Tap the friend" }),
      ],
    ),
    lesson(
      "Expressing Feelings",
      "💬",
      "cards",
      "You can use words for feelings.",
      [
        bit("I feel happy", "😊", "I feel happy.", { ask: "Tap I feel happy" }),
        bit("I feel sad", "😢", "I feel sad.", { ask: "Tap I feel sad" }),
        bit("I feel angry", "😠", "I feel angry.", { ask: "Tap I feel angry" }),
        bit("I feel scared", "😨", "I feel scared.", { ask: "Tap I feel scared" }),
        bit("I need a hug", "🤗", "I need a hug.", { ask: "Tap I need a hug" }),
      ],
      {
        quiz: [
          q("Which sentence tells a feeling?", "I feel sad", [
            ["I feel sad", "😢"],
            ["The cup is blue", "🥤"],
            ["Two plus two", "🔢"],
          ]),
        ],
      },
    ),
    lesson(
      "Being Brave",
      "🌟",
      "cards",
      "Brave means you try, even if you feel a little flutter.",
      [
        bit("New slide", "🛝", "Trying the little slide with a grown-up is brave.", { ask: "Tap the slide" }),
        bit("Say hello", "👋", "Saying hello to someone new is brave.", { ask: "Tap say hello" }),
        bit("Ask for help", "🙋", "Asking for help is brave, not small.", { ask: "Tap ask for help" }),
        bit("New food", "🥦", "One tiny bite of a new food is brave.", { ask: "Tap new food" }),
        bit("Night light", "💡", "Staying in bed with a night light is brave.", { ask: "Tap the night light" }),
      ],
      {
        quiz: [
          q("Brave can look like…", "Trying with a helper", [
            ["Trying with a helper", "🌟"],
            ["Never feeling nervous", "🤖"],
            ["Doing a dangerous thing", "⚠️"],
          ]),
        ],
      },
    ),
  ],
};

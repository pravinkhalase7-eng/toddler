import type { Category } from "../types";
import { bit, lesson } from "./helpers";

const C = 262;
const D = 294;
const E = 330;
const F = 349;
const G = 392;
const A = 440;

export const songs: Category = {
  id: 6,
  name: "Rhymes, Songs and Movement",
  emoji: "🎵",
  tint: "#8b5cf6",
  ink: "#fff",
  blurb: "Short songs to sing, clap, and move",
  topics: [
    lesson("ABC Song", "🔤", "song", "Sing the letters in little groups.", [
      bit("A to G", "🔤", "A, B, C, D, E, F, G.", { notes: [C, D, E, F, G] }),
      bit("H to P", "🔠", "H, I, J, K, L, M, N, O, P.", { notes: [C, D, E, F, G] }),
      bit("Q to V", "✨", "Q, R, S, T, U, V.", { notes: [E, F, G, A] }),
      bit("W to Z", "🌟", "W, X, Y, and Z.", { notes: [G, A, C * 2] }),
    ]),
    lesson("Counting Song", "🔢", "song", "Count and clap with the tune.", [
      bit("One two", "1️⃣", "One, two, I see you.", { notes: [C, E, G] }),
      bit("Three four", "4️⃣", "Three, four, tap the floor.", { notes: [E, G, A] }),
      bit("Five six", "6️⃣", "Five, six, little clicks.", { notes: [G, A, G] }),
      bit("Up to ten", "🔟", "Seven, eight, nine, ten. We count again!", { notes: [C, E, G, C * 2] }),
    ]),
    lesson("Color Song", "🎨", "song", "Sing a color, then point to something that color.", [
      bit("Red", "🍓", "Red like a strawberry.", { swatch: "#ef4444", notes: [C, E, G] }),
      bit("Blue", "🐳", "Blue like the sky and the sea.", { swatch: "#3b82f6", notes: [E, G, A] }),
      bit("Yellow", "🌟", "Yellow like the sun.", { swatch: "#facc15", notes: [G, E, C] }),
      bit("Green", "🐸", "Green like the grass.", { swatch: "#22c55e", notes: [C, D, E, G] }),
    ]),
    lesson("Animal Sounds Song", "🐄", "song", "The tune plays, then the animal answers.", [
      bit("Cow", "🐄", "The cow says moo.", { cue: "moo" }),
      bit("Pig", "🐷", "The pig says oink.", { cue: "oink" }),
      bit("Duck", "🦆", "The duck says quack.", { cue: "quack" }),
      bit("Sheep", "🐑", "The sheep says baa.", { cue: "baa" }),
      bit("Dog", "🐶", "The dog says woof.", { cue: "bark" }),
      bit("Cat", "🐱", "The cat says meow.", { cue: "meow" }),
    ]),
    lesson("Days of the Week", "📅", "song", "Seven days make a week.", [
      bit("Monday", "🌞", "Monday starts the week.", { notes: [C, E, G] }),
      bit("Tuesday", "🎾", "Tuesday is a day to play.", { notes: [D, F, A] }),
      bit("Wednesday", "📚", "Wednesday is a story day.", { notes: [E, G, C * 2] }),
      bit("Thursday", "🎨", "Thursday is a day to draw.", { notes: [F, A, C * 2] }),
      bit("Friday", "🎵", "Friday is a day to sing.", { notes: [G, E, C] }),
      bit("Saturday", "🌳", "Saturday is park day.", { notes: [A, G, E] }),
      bit("Sunday", "👨‍👩‍👧", "Sunday is family day.", { notes: [C, E, G, C * 2] }),
    ]),
    lesson("Months of the Year", "🗓️", "song", "Twelve months make a year.", [
      bit("January", "❄️", "January.", { notes: [C, E] }),
      bit("February", "💌", "February.", { notes: [D, F] }),
      bit("March", "🌱", "March.", { notes: [E, G] }),
      bit("April", "🌧️", "April.", { notes: [F, A] }),
      bit("May", "🌸", "May.", { notes: [G, E] }),
      bit("June", "☀️", "June.", { notes: [A, F] }),
      bit("July", "🏖️", "July.", { notes: [C, G] }),
      bit("August", "🍉", "August.", { notes: [D, A] }),
      bit("September", "📚", "September.", { notes: [E, C] }),
      bit("October", "🍂", "October.", { notes: [F, D] }),
      bit("November", "🍁", "November.", { notes: [G, E] }),
      bit("December", "⭐", "December. The year is complete.", { notes: [C, E, G, C * 2] }),
    ]),
    lesson("Head Shoulders Knees and Toes", "🙆", "song", "Touch each part when you hear it.", [
      bit("Head", "🙂", "Touch your head.", { notes: [C, E, G] }),
      bit("Shoulders", "🤷", "Touch your shoulders.", { notes: [E, G, E] }),
      bit("Knees", "🦵", "Touch your knees.", { notes: [G, E, C] }),
      bit("Toes", "🦶", "Touch your toes.", { notes: [C, G, C] }),
    ]),
    lesson("If You're Happy and You Know It", "👏", "song", "Move your body with the feeling.", [
      bit("Clap", "👏", "Clap your hands if you feel glad.", { notes: [C, C, G, G], cue: "pop" }),
      bit("Stomp", "🦶", "Stomp your feet if you feel glad.", { notes: [E, E, G, E], cue: "drum" }),
      bit("Hooray", "🎉", "Say hooray if you feel glad.", { notes: [G, A, G, E] }),
      bit("Hug", "🤗", "Give a hug if you feel glad.", { notes: [C, E, G, C * 2] }),
    ]),
    lesson("Wheels on the Bus", "🚌", "song", "A little bus song with actions.", [
      bit("Wheels", "🚌", "Round and round the big bus wheels go.", { notes: [C, E, G, E] }),
      bit("Wipers", "🌧️", "Swish, swish go the wipers.", { notes: [E, C, E, C] }),
      bit("Horn", "📣", "Beep, beep goes the little horn.", { notes: [G, G, E], cue: "beep" }),
      bit("People", "🙂", "Up and down the people bounce.", { notes: [C, G, C] }),
    ]),
    lesson("Five Little Ducks", "🦆", "song", "Count the ducks as they splash.", [
      bit("Five ducks", "🦆", "Five little ducks went out to play.", { notes: [C, E, G], cue: "quack", count: 5 }),
      bit("One swims off", "💦", "One duck splashed and swam away.", { notes: [E, D, C], cue: "splash" }),
      bit("Four ducks", "🦆", "Four little ducks are in the pond.", { notes: [C, E, G], count: 4 }),
      bit("Count with me", "🔢", "Count the ducks. Four, three, two, one.", { notes: [G, E, C], cue: "quack" }),
    ]),
    lesson("Twinkle Twinkle Little Star", "⭐", "song", "A quiet night song.", [
      bit("Little star", "⭐", "Twinkle, twinkle, little star.", { notes: [C, C, G, G] }),
      bit("What you are", "✨", "How I wonder what you are.", { notes: [A, A, G] }),
      bit("Up above", "🌍", "Up above the world so high.", { notes: [F, F, E, E] }),
      bit("Like a diamond", "💎", "Like a diamond in the sky.", { notes: [D, D, C] }),
    ]),
    lesson("Weather Song", "⛅", "song", "Sing the sky you see today.", [
      bit("Sun", "☀️", "Sun means a bright day.", { notes: [C, E, G] }),
      bit("Rain", "🌧️", "Rain goes pitter pat.", { notes: [E, D, C], cue: "rain" }),
      bit("Wind", "💨", "Wind says whoosh.", { notes: [G, E, C], cue: "wind" }),
      bit("Rainbow", "🌈", "A rainbow can come after rain.", { notes: [C, E, G, C * 2] }),
    ]),
    lesson("Fruit Song", "🍎", "song", "Name the fruit, then pretend to taste it.", [
      bit("Apple banana", "🍎", "Apple red, banana yellow.", { notes: [C, E, G] }),
      bit("Grapes", "🍇", "Grapes are purple and round.", { notes: [E, G, A] }),
      bit("Mango orange", "🥭", "Mango sweet, orange juicy.", { notes: [G, E, C] }),
      bit("Grow", "💪", "Fruit helps our bodies grow.", { notes: [C, E, G, C * 2] }),
    ]),
    lesson("Clean-Up Song", "🧺", "song", "Sing while the toys find their homes.", [
      bit("Basket", "🧺", "Toys go in the basket.", { notes: [C, E, G] }),
      bit("Shelf", "📚", "Books go on the shelf.", { notes: [E, G, E] }),
      bit("Together", "🤝", "We tidy up together.", { notes: [G, E, C] }),
      bit("Happy room", "✨", "Now the room looks happy.", { notes: [C, G, C * 2] }),
    ]),
    lesson("Good Morning Song", "🌅", "song", "A hello for a new day.", [
      bit("Sunshine", "🌅", "Good morning, sunshine.", { notes: [C, E, G] }),
      bit("Stretch", "🙆", "Stretch your arms up high.", { notes: [E, G, C * 2] }),
      bit("Wash", "🧼", "Wash your face, little star.", { notes: [G, E, C] }),
      bit("New day", "🌟", "Hello, brand new day.", { notes: [C, E, G, C * 2] }),
    ]),
  ],
};

// ──────────────────────────────────────────────────────────────────────────────
// Narration Scripts — Multiplication as Repeated Addition
// Rule: only body/paragraph text and question stems are narrated.
// Titles, headings, and section labels are NEVER narrated.
// Numeric values in practice questions are rendered visually, not spoken.
// ──────────────────────────────────────────────────────────────────────────────

import { say, ask, cheer, emphasize, think, celebrate, instruct } from './audio';

// ─── INTRO SCREEN ─────────────────────────────────────────────────────────────
export function introNarration() {
  return [
    cheer("Welcome to Multiplication as Repeated Addition!"),
    say("Today, we are going to discover that multiplication is just a clever shortcut for adding the same number again and again."),
    ask("Have you ever wondered if there is a faster way to add the same number many times?"),
    cheer("Get ready to explore equal groups, build multiplication sentences, and solve fun challenges! Let's begin our adventure!"),
  ];
}

// ─── WONDER PHASE ─────────────────────────────────────────────────────────────
const WONDER_PAIRS = [
  {
    q: "If every basket has the same number of apples, is there a faster way to find the total without adding one by one?",
    s: "Equal groups hold a secret — can you figure it out?",
  },
  {
    q: "What if we had three plates, each with four dumplings? Adding them one by one takes a while... but what if there was a shortcut?",
    s: "Multiplication is that shortcut — and you are about to discover it!",
  },
  {
    q: "Imagine rows of seats at a school event. Every row has the same number of chairs. How do we count them all quickly?",
    s: "Equal groups are everywhere — once you see them, you cannot un-see them!",
  },
  {
    q: "What if I told you that adding the same number over and over has a secret name?",
    s: "That secret name is multiplication, and today you will unlock it!",
  },
  {
    q: "How many pencils are there if every pack has the same number?",
    s: "Counting equal groups is the key to multiplication!",
  },
];

export function getWonderPair() {
  return WONDER_PAIRS[Math.floor(Math.random() * WONDER_PAIRS.length)];
}

export function wonderNarration(questionText, subtext) {
  return [ask(questionText), say(subtext)];
}

export function wonderDiscoverNarration() { return []; }

// ─── STORY / CONCEPT TEACHING ─────────────────────────────────────────────────
export function getStoryNarration(slideIndex) {
  switch (slideIndex) {
    case 0:
      return [
        say("Alice is setting up her stall at the school fair. She arranges her packs of stickers in equal rows."),
        ask("Each pack has the same number of stickers. Alice wonders how many stickers she has altogether."),
        cheer("Let's help Alice count her stickers!"),
      ];
    case 1:
      return [
        say("Instead of counting one by one, Alice groups them equally — that means every group has exactly the same number inside."),
        emphasize("Equal groups means every group has the same number inside."),
        say("When we add the same number again and again, we call it repeated addition."),
        emphasize("Repeated addition is adding the same number over and over."),
      ];
    case 2:
      return [
        say("Alice has three packs, each with four stickers. So she writes: four plus four plus four equals twelve!"),
        say("But writing the same number so many times is slow. There is a faster way — using the multiplication symbol!"),
        emphasize("The times symbol is our shortcut sign. It means groups of."),
      ];
    case 3:
      return [
        say("Four times three means four, three times. It is the same as four plus four plus four!"),
        say("So repeated addition and multiplication sentences always give the same answer."),
        say("Alice is so happy! She can now write a multiplication sentence for any equal group she sees."),
        cheer("Let's see if we can do it too!"),
      ];
    default:
      return [];
  }
}

// ─── SIMULATION STATIONS ──────────────────────────────────────────────────────
export function simulateStation1Intro() {
  return [
    instruct("Tap each group to build your equal groups, and watch the addition sentence grow!"),
    ask("Every time you add a group, the total goes up by the same amount. Do you see the pattern?"),
  ];
}

export function simulateStation2Intro() {
  return [
    instruct("Now look at the repeated addition sentence on screen. Can you turn it into a multiplication sentence?"),
    say("The number of groups tells us how many times we add. The group size is the number we keep adding."),
  ];
}

export function simulateStation3Intro() {
  return [
    instruct("Look at this real-world scene. Count the equal groups and find the total!"),
    say("You can see equal groups all around us — at the hawker centre, the playground, and even the classroom!"),
  ];
}

export function simulateStation1Complete() {
  return [celebrate("Amazing! You built the groups and found the total. Well done!")];
}

export function simulateStation2Complete() {
  return [celebrate("Fantastic! You matched the sentence perfectly!")];
}

export function simulateStation3Complete() {
  return [celebrate("Brilliant! You found the total from the real-world scene!")];
}

// ─── REFLECT / CHECK ──────────────────────────────────────────────────────────
export function reflectIntroNarration() {
  return [
    ask("What did we learn today about equal groups and multiplication?"),
    say("Let's review the key ideas one more time."),
  ];
}

export function reflectConfidenceNarration() {
  return [ask("How confident do you feel about writing multiplication sentences from equal groups?")];
}

export function reflectCertificateNarration(pct) {
  return [celebrate("You completed the Multiplication as Repeated Addition adventure!")];
}

export function reflectCorrectNarration() { return []; }
export function reflectWrongNarration()   { return []; }

// ─── PRACTICE QUESTION STEMS ──────────────────────────────────────────────────
// Numeric values are intentionally excluded — conveyed visually via GroupSimulationCanvas.
export const QUESTION_STEM_NARRATIONS = {
  groupsToAddition:         "Look at the equal groups on screen. Write the repeated addition sentence.",
  additionToMultiplication: "Look at the repeated addition sentence on screen. Choose the matching multiplication sentence.",
  multiplicationToTotal:    "Look at the multiplication sentence on screen. Work out the total by counting the equal groups.",
  multiplicationToAddition: "Look at the multiplication sentence on screen. Write the matching repeated addition sentence.",
  wordProblem:              "Listen to the story problem. Find the total by identifying the equal groups.",
  matchPicture:             "Look at the groups of objects on screen. Choose the multiplication sentence that matches.",
};

export function practiceQuestionNarration(type) {
  const text = QUESTION_STEM_NARRATIONS[type] || QUESTION_STEM_NARRATIONS.groupsToAddition;
  return [ask(text)];
}

// ─── PRACTICE FEEDBACK ────────────────────────────────────────────────────────
export function practiceCorrectNarration(streak = 0) {
  if (streak >= 5) return [celebrate("Fantastic work! Keep that streak going!")];
  if (streak >= 3) return [celebrate("Wonderful! You are a multiplication superstar!")];
  return [celebrate("You got it! That is exactly right!")];
}

export function practiceWrongNarration() {
  const options = [
    [think("Not quite — but great thinking! Let us count the groups one more time, slowly.")],
    [think("Hmm, let us look at this again together. How many groups do we have?")],
    [cheer("Almost! Remember, the number we keep adding is the group size.")],
    [cheer("Good try! Count each group carefully and then add them all up.")],
  ];
  return options[Math.floor(Math.random() * options.length)];
}

// ─── WORLD INTRO ──────────────────────────────────────────────────────────────
export function practiceWorldIntro(worldName) {
  return [celebrate(`Welcome to ${worldName}!`)];
}

export function practiceWorldComplete(worldName, score, total) {
  return [say(`${worldName} complete! You scored ${score} out of ${total}.`)];
}

// ─── SUMMARY ──────────────────────────────────────────────────────────────────
export function summaryNarration() {
  return [
    celebrate("You completed the Multiplication as Repeated Addition adventure!"),
    say("You have discovered that equal groups, repeated addition, and multiplication sentences all tell the same story — just in different ways."),
    celebrate("You are now a multiplication explorer!"),
  ];
}

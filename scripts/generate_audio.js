import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiKey = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
const forceRegenerate = process.argv.includes('--force');
const voiceId = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const audioDir = path.join(__dirname, '../public/assets/audio/multiplication');

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const getElevenLabsSettings = (style) => {
  switch (style) {
    case 'celebration':   return { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true };
    case 'encouragement': return { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true };
    case 'question':      return { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true };
    case 'emphasis':      return { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true };
    case 'thinking':      return { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true };
    default:              return { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true };
  }
};

// ─── ALL NARRATION PHRASES FOR THE MULTIPLICATION MODULE ───────────────────
// Rule: only paragraph/body text and question stems — never titles or headings.
// Numeric values are NOT spoken in question stems; they are displayed visually.

const phrases = [
  // ── INTRO ──────────────────────────────────────────────────────────────────
  { text: "Welcome to Multiplication as Repeated Addition!", style: 'encouragement' },
  { text: "Today, we are going to discover that multiplication is just a clever shortcut for adding the same number again and again.", style: 'statement' },
  { text: "Have you ever wondered if there is a faster way to add the same number many times?", style: 'question' },
  { text: "Get ready to explore equal groups, build multiplication sentences, and solve fun challenges! Let's begin our adventure!", style: 'encouragement' },

  // ── WONDER PHASE ────────────────────────────────────────────────────────────
  { text: "If every basket has the same number of apples, is there a faster way to find the total without adding one by one?", style: 'question' },
  { text: "Equal groups hold a secret — can you figure it out?", style: 'statement' },
  { text: "What if we had three plates, each with four dumplings? Adding them one by one takes a while... but what if there was a shortcut?", style: 'question' },
  { text: "Multiplication is that shortcut — and you are about to discover it!", style: 'statement' },
  { text: "Imagine rows of seats at a school event. Every row has the same number of chairs. How do we count them all quickly?", style: 'question' },
  { text: "Equal groups are everywhere — once you see them, you cannot un-see them!", style: 'statement' },
  { text: "What if I told you that adding the same number over and over has a secret name?", style: 'question' },
  { text: "That secret name is multiplication, and today you will unlock it!", style: 'statement' },
  { text: "How many pencils are there if every pack has the same number?", style: 'question' },
  { text: "Counting equal groups is the key to multiplication!", style: 'statement' },

  // ── STORY / CONCEPT TEACHING ─────────────────────────────────────────────────
  { text: "Alice is setting up her stall at the school fair. She arranges her packs of stickers in equal rows.", style: 'statement' },
  { text: "Each pack has the same number of stickers. Alice wonders how many stickers she has altogether.", style: 'question' },
  { text: "Let's help Alice count her stickers!", style: 'encouragement' },
  { text: "Instead of counting one by one, Alice groups them equally — that means every group has exactly the same number inside.", style: 'statement' },
  { text: "Equal groups means every group has the same number inside.", style: 'emphasis' },
  { text: "When we add the same number again and again, we call it repeated addition.", style: 'statement' },
  { text: "Repeated addition is adding the same number over and over.", style: 'emphasis' },
  { text: "Alice has three packs, each with four stickers. So she writes: four plus four plus four equals twelve!", style: 'statement' },
  { text: "But writing the same number so many times is slow. There is a faster way — using the multiplication symbol!", style: 'statement' },
  { text: "The times symbol is our shortcut sign. It means groups of.", style: 'emphasis' },
  { text: "Four times three means four, three times. It is the same as four plus four plus four!", style: 'statement' },
  { text: "So repeated addition and multiplication sentences always give the same answer.", style: 'statement' },
  { text: "Alice is so happy! She can now write a multiplication sentence for any equal group she sees.", style: 'encouragement' },
  { text: "Let's see if we can do it too!", style: 'encouragement' },

  // ── SIMULATION STATIONS ──────────────────────────────────────────────────────
  { text: "Tap each group to build your equal groups, and watch the addition sentence grow!", style: 'instruction' },
  { text: "Every time you add a group, the total goes up by the same amount. Do you see the pattern?", style: 'question' },
  { text: "Now look at the repeated addition sentence on screen. Can you turn it into a multiplication sentence?", style: 'instruction' },
  { text: "The number of groups tells us how many times we add. The group size is the number we keep adding.", style: 'statement' },
  { text: "Look at the groups on screen and tell me how many there are in all.", style: 'question' },
  { text: "Look at this real-world scene. Count the equal groups and find the total!", style: 'instruction' },
  { text: "You can see equal groups all around us — at the hawker centre, the playground, and even the classroom!", style: 'statement' },
  { text: "Amazing! You built the groups and found the total. Well done!", style: 'celebration' },
  { text: "Fantastic! You matched the sentence perfectly!", style: 'celebration' },
  { text: "Brilliant! You found the total from the real-world scene!", style: 'celebration' },

  // ── REFLECT / CHECK ──────────────────────────────────────────────────────────
  { text: "What did we learn today about equal groups and multiplication?", style: 'question' },
  { text: "How confident do you feel about writing multiplication sentences from equal groups?", style: 'question' },
  { text: "Let's review the key ideas one more time.", style: 'statement' },

  // ── PRACTICE MODE — question stems (numbers displayed visually, not spoken) ──
  { text: "Look at the equal groups on screen. Write the repeated addition sentence.", style: 'question' },
  { text: "Look at the repeated addition sentence on screen. Choose the matching multiplication sentence.", style: 'question' },
  { text: "Look at the multiplication sentence on screen. Work out the total by counting the equal groups.", style: 'question' },
  { text: "Look at the multiplication sentence on screen. Write the matching repeated addition sentence.", style: 'question' },
  { text: "Listen to the story problem. Find the total by identifying the equal groups.", style: 'question' },
  { text: "Look at the groups of objects on screen. Choose the multiplication sentence that matches.", style: 'question' },

  // ── PRACTICE FEEDBACK ────────────────────────────────────────────────────────
  { text: "You got it! That is exactly right!", style: 'celebration' },
  { text: "Wonderful! You are a multiplication superstar!", style: 'celebration' },
  { text: "Fantastic work! Keep that streak going!", style: 'celebration' },
  { text: "Super! You found the equal groups perfectly!", style: 'celebration' },
  { text: "Not quite — but great thinking! Let us count the groups one more time, slowly.", style: 'thinking' },
  { text: "Hmm, let us look at this again together. How many groups do we have?", style: 'thinking' },
  { text: "Almost! Remember, the number we keep adding is the group size.", style: 'encouragement' },
  { text: "Good try! Count each group carefully and then add them all up.", style: 'encouragement' },

  // ── WORD PROBLEM SCENARIOS (Singapore-context templates) ────────────────────
  { text: "At the school canteen, each tray has the same number of curry puffs. Count the trays and find the total!", style: 'question' },
  { text: "At the hawker centre, there are rows of chairs with the same number in each row. How many chairs are there altogether?", style: 'question' },
  { text: "On the MRT, each carriage has the same number of seats. Count the carriages to find the total seats!", style: 'question' },
  { text: "At the void deck, children arranged their toys in equal piles. Count the piles to find how many toys there are in all.", style: 'question' },
  { text: "At the provision shop, drinks are packed in equal rows. How many drinks are there in total?", style: 'question' },

  // ── SUMMARY / CELEBRATION ────────────────────────────────────────────────────
  { text: "You completed the Multiplication as Repeated Addition adventure!", style: 'celebration' },
  { text: "You have discovered that equal groups, repeated addition, and multiplication sentences all tell the same story — just in different ways.", style: 'statement' },
  { text: "You are now a multiplication explorer!", style: 'celebration' },

  // ── PRACTICE WORLD INTROS ────────────────────────────────────────────────────
  { text: "Welcome to Sticker Street!", style: 'celebration' },
  { text: "Welcome to Apple Orchard!", style: 'celebration' },
  { text: "Welcome to Ocean Market!", style: 'celebration' },
  { text: "Welcome to Sky Carnival!", style: 'celebration' },
  { text: "Welcome to Hawker Haven!", style: 'celebration' },
  { text: "Welcome to Rocket Launch!", style: 'celebration' },
  { text: "Welcome to Dragon Cave!", style: 'celebration' },
  { text: "Welcome to Crystal Tower!", style: 'celebration' },
  { text: "Welcome to Rainbow Bridge!", style: 'celebration' },
  { text: "Welcome to Number Palace!", style: 'celebration' },
];

async function generate() {
  const mapData = {};

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const safeName = text.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50);
    const filename = `mult_${safeName}_${i}.mp3`;
    const filepath = path.join(audioDir, filename);

    mapData[text] = `/assets/audio/multiplication/${filename}`;

    if (!forceRegenerate && fs.existsSync(filepath)) {
      console.log(`Skipping (exists): ${filename}`);
      continue;
    }

    console.log(`Generating [${i + 1}/${phrases.length}]: ${filename}`);

    const settings = getElevenLabsSettings(style);

    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: settings,
        }),
      });

      if (!res.ok) {
        console.error(`Failed [${i}]: ${res.status} ${res.statusText}`);
        const errText = await res.text();
        console.error(errText);
        continue;
      }

      const buffer = await res.arrayBuffer();
      fs.writeFileSync(filepath, Buffer.from(buffer));
      console.log(`  ✓ Saved: ${filename}`);
    } catch (err) {
      console.error(`  ✗ Error with phrase ${i}:`, err.message);
    }

    // Rate-limit guard
    await new Promise(r => setTimeout(r, 600));
  }

  const mapFile = path.join(__dirname, '../src/utils/audioMap.js');

  const merged = mapData;
  fs.writeFileSync(mapFile, `export const audioMap = ${JSON.stringify(merged, null, 2)};\n`);
  console.log(`\n✅ Done! audioMap saved → src/utils/audioMap.js (${Object.keys(merged).length} entries)`);
}

generate();

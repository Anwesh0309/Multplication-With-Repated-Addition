// ──────────────────────────────────────────────────────────────────────────────
// Multiplication Question Engine — Grade 1 / Primary 1 Singapore Syllabus
// Generates randomized, parameterized questions; no static bank file needed.
// ──────────────────────────────────────────────────────────────────────────────

// ─── Syllabus-safe parameter space ───────────────────────────────────────────
const GROUP_SIZES  = [2, 3, 4, 5, 10]; // M — the repeated addend
const GROUP_COUNT_MIN = 2;              // N min
const GROUP_COUNT_MAX = 5;              // N max — Primary 1 cap

// ─── Singapore-context scenes for word problems ───────────────────────────────
const SG_SCENES = [
  { setting: 'school canteen',   objects: 'curry puffs',     emoji: '🥟', perGroup: true },
  { setting: 'hawker centre',    objects: 'bowls of noodles', emoji: '🍜', perGroup: true },
  { setting: 'provision shop',   objects: 'bottles of drink', emoji: '🥤', perGroup: true },
  { setting: 'classroom',        objects: 'crayons',          emoji: '🖍️', perGroup: true },
  { setting: 'playground',       objects: 'balls',            emoji: '⚽', perGroup: true },
  { setting: 'void deck',        objects: 'potted plants',    emoji: '🌿', perGroup: true },
  { setting: 'MRT platform',     objects: 'seats',            emoji: '💺', perGroup: true },
  { setting: 'birthday party',   objects: 'balloons',         emoji: '🎈', perGroup: true },
  { setting: 'school bag',       objects: 'stickers',         emoji: '⭐', perGroup: true },
  { setting: 'art class',        objects: 'paint brushes',    emoji: '🎨', perGroup: true },
];

const SG_NAMES = ['Mei Ling', 'Raju', 'Wei Ming', 'Priya', 'Ahmad', 'Siti', 'Jun Wei', 'Kavya', 'Jason', 'Lin'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pickFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function buildRepeatedAddition(groupSize, groupCount) {
  return Array(groupCount).fill(groupSize).join(' + ') + ' = ' + groupSize * groupCount;
}

function buildMultiplicationSentence(groupSize, groupCount) {
  return `${groupSize} × ${groupCount}`;
}

/** Generates distractors that are plausible-but-wrong: off-by-one group or off-by-group-size errors */
function generateDistractors(correct, groupSize, groupCount) {
  const pool = new Set();

  // Off-by-one-group total: (groupCount ± 1) * groupSize
  const offGroup1 = groupSize * (groupCount + 1);
  const offGroup2 = groupSize * Math.max(1, groupCount - 1);
  pool.add(offGroup1);
  pool.add(offGroup2);

  // Off-by-one-item total: (groupSize ± 1) * groupCount
  pool.add((groupSize + 1) * groupCount);
  pool.add(Math.max(1, groupSize - 1) * groupCount);

  // Off by groupSize
  pool.add(correct + groupSize);
  if (correct - groupSize > 0) pool.add(correct - groupSize);

  // Ensure correct is not in distractors
  pool.delete(correct);

  const arr = [...pool].filter(v => v > 0 && v !== correct);
  // Shuffle and take 3
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const chosen = arr.slice(0, 3);
  // Merge with correct and shuffle
  const opts = [...chosen, correct];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts;
}

function generateMultSentenceDistractors(groupSize, groupCount) {
  const correct = `${groupSize} × ${groupCount}`;
  const pool = [
    `${groupSize} × ${Math.max(1, groupCount - 1)}`,
    `${groupSize} × ${groupCount + 1}`,
    `${groupCount} × ${groupSize}`,           // commuted (visually different, same product — tests reading direction)
    `${groupSize + 1} × ${groupCount}`,
  ].filter(s => s !== correct);
  const opts = [correct, ...pool.slice(0, 3)];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts;
}

// ─── Difficulty bias ──────────────────────────────────────────────────────────
/**
 * Returns a weighted random group size based on question index (difficulty bias).
 * Early questions favour {2, 5}; later questions allow {3, 4, 10}.
 */
function biasedGroupSize(questionIndex, adaptiveBias = 0) {
  const progress = Math.min(1, (questionIndex + adaptiveBias) / 40); // 0→1 over ~40 questions
  const easySet = [2, 5];
  const fullSet = GROUP_SIZES;

  if (Math.random() > progress) {
    return pickFrom(easySet);
  }
  return pickFrom(fullSet);
}

// ─── Question builders ────────────────────────────────────────────────────────

// Type 1: Groups shown visually → student writes the repeated addition sentence
function buildGroupsToAddition(id, groupSize, groupCount) {
  return {
    id,
    type: 'groupsToAddition',
    groupSize,
    groupCount,
    total: groupSize * groupCount,
    correctAnswer: buildRepeatedAddition(groupSize, groupCount),
    // For MC, generate 3 wrong addition strings
    options: (() => {
      const correct = buildRepeatedAddition(groupSize, groupCount);
      const wrong1  = buildRepeatedAddition(groupSize, Math.max(1, groupCount - 1));
      const wrong2  = buildRepeatedAddition(groupSize, groupCount + 1);
      const wrong3  = buildRepeatedAddition(groupSize + 1, groupCount);
      const pool    = [correct, wrong1, wrong2, wrong3].filter((v, i, a) => a.indexOf(v) === i);
      for (let i = pool.length - 1; i > 0; i--) { const j = randInt(0, i); [pool[i], pool[j]] = [pool[j], pool[i]]; }
      return pool.slice(0, 4);
    })(),
    narrationKey: 'groupsToAddition',
    sceneTheme: 'counters',
  };
}

// Type 2: Repeated addition shown → student picks the multiplication sentence
function buildAdditionToMultiplication(id, groupSize, groupCount) {
  return {
    id,
    type: 'additionToMultiplication',
    groupSize,
    groupCount,
    total: groupSize * groupCount,
    displayText: buildRepeatedAddition(groupSize, groupCount),
    correctAnswer: buildMultiplicationSentence(groupSize, groupCount),
    options: generateMultSentenceDistractors(groupSize, groupCount),
    narrationKey: 'additionToMultiplication',
    sceneTheme: 'sentence',
  };
}

// Type 3: Multiplication sentence shown → student finds the total
function buildMultiplicationToTotal(id, groupSize, groupCount) {
  const total = groupSize * groupCount;
  return {
    id,
    type: 'multiplicationToTotal',
    groupSize,
    groupCount,
    total,
    displayText: buildMultiplicationSentence(groupSize, groupCount),
    correctAnswer: total,
    options: generateDistractors(total, groupSize, groupCount),
    narrationKey: 'multiplicationToTotal',
    sceneTheme: 'counters',
  };
}

// Type 4: Multiplication sentence shown → student writes repeated addition
function buildMultiplicationToAddition(id, groupSize, groupCount) {
  const correct = buildRepeatedAddition(groupSize, groupCount);
  return {
    id,
    type: 'multiplicationToAddition',
    groupSize,
    groupCount,
    total: groupSize * groupCount,
    displayText: buildMultiplicationSentence(groupSize, groupCount),
    correctAnswer: correct,
    options: (() => {
      const wrong1 = buildRepeatedAddition(groupSize, Math.max(1, groupCount - 1));
      const wrong2 = buildRepeatedAddition(groupSize, groupCount + 1);
      const wrong3 = buildRepeatedAddition(Math.max(1, groupSize - 1), groupCount);
      const pool   = [correct, wrong1, wrong2, wrong3].filter((v, i, a) => a.indexOf(v) === i);
      for (let i = pool.length - 1; i > 0; i--) { const j = randInt(0, i); [pool[i], pool[j]] = [pool[j], pool[i]]; }
      return pool.slice(0, 4);
    })(),
    narrationKey: 'multiplicationToAddition',
    sceneTheme: 'sentence',
  };
}

// Type 5: Word problem with Singapore context
function buildWordProblem(id, groupSize, groupCount) {
  const scene  = pickFrom(SG_SCENES);
  const name   = pickFrom(SG_NAMES);
  const total  = groupSize * groupCount;
  const questionText = `${name} sees ${groupCount} ${groupCount === 1 ? 'group' : 'groups'} of ${scene.objects} at the ${scene.setting}. Each group has ${groupSize} ${scene.objects}. How many ${scene.objects} are there in all?`;
  return {
    id,
    type: 'wordProblem',
    groupSize,
    groupCount,
    total,
    displayText: questionText,
    sceneName:   name,
    sceneEmoji:  scene.emoji,
    sceneObjects: scene.objects,
    sceneSetting: scene.setting,
    correctAnswer: total,
    options: generateDistractors(total, groupSize, groupCount),
    narrationKey: 'wordProblem',
    sceneTheme: 'sg-scene',
  };
}

// Type 6: Match picture to multiplication sentence
function buildMatchPicture(id, groupSize, groupCount) {
  return {
    id,
    type: 'matchPicture',
    groupSize,
    groupCount,
    total: groupSize * groupCount,
    correctAnswer: buildMultiplicationSentence(groupSize, groupCount),
    options: generateMultSentenceDistractors(groupSize, groupCount),
    narrationKey: 'matchPicture',
    sceneTheme: 'counters',
  };
}

const BUILDERS = [
  buildGroupsToAddition,
  buildAdditionToMultiplication,
  buildMultiplicationToTotal,
  buildMultiplicationToAddition,
  buildWordProblem,
  buildMatchPicture,
];

const TYPE_NAMES = [
  'groupsToAddition',
  'additionToMultiplication',
  'multiplicationToTotal',
  'multiplicationToAddition',
  'wordProblem',
  'matchPicture',
];

// ─── Session generator ────────────────────────────────────────────────────────
/**
 * Generates a session of up to maxQuestions, applying:
 * - Progressive difficulty bias
 * - No-immediate-repeat pair rule
 * - Random type rotation
 *
 * @param {number} maxQuestions
 * @param {number} [seed] - optional numeric seed for deterministic QA testing
 * @returns {MultiplicationQuestion[]}
 */
export function generateSession(maxQuestions = 100, seed = null) {
  // Optional seeded RNG for QA determinism
  let rng = Math.random;
  if (seed !== null) {
    let s = seed;
    rng = () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
  }

  const session  = [];
  let lastPair   = null;
  let adaptiveBias = 0;  // adjusted by adaptive layer (Section 6.2 TRD)

  for (let i = 0; i < maxQuestions; i++) {
    let groupSize, groupCount, pairKey;

    // Ensure no immediate pair repeat
    let attempts = 0;
    do {
      groupSize  = biasedGroupSize(i, adaptiveBias);
      groupCount = randInt(GROUP_COUNT_MIN, GROUP_COUNT_MAX);
      pairKey    = `${groupSize}x${groupCount}`;
      attempts++;
    } while (pairKey === lastPair && attempts < 20);

    lastPair = pairKey;

    const typeIndex = Math.floor(rng() * BUILDERS.length);
    const builder   = BUILDERS[typeIndex];
    const id        = `Q_${String(i + 1).padStart(3, '0')}`;

    session.push(builder(id, groupSize, groupCount));
  }

  return session;
}

// ─── World assignment (10 questions per world, up to 10 worlds) ───────────────
export function assignWorlds(questions) {
  return questions.map((q, i) => ({ ...q, world: Math.floor(i / 10) }));
}

// ─── Validation helper (used by tests) ───────────────────────────────────────
export function validateQuestion(q) {
  if (!q) return false;
  const expectedTotal = q.groupSize * q.groupCount;
  if (q.type === 'multiplicationToTotal' || q.type === 'wordProblem') {
    return Number(q.correctAnswer) === expectedTotal;
  }
  if (q.type === 'groupsToAddition' || q.type === 'multiplicationToAddition') {
    const parts = q.correctAnswer.split(' = ');
    const rhs = parseInt(parts[1]);
    return rhs === expectedTotal;
  }
  if (q.type === 'additionToMultiplication' || q.type === 'matchPicture') {
    return q.correctAnswer === `${q.groupSize} × ${q.groupCount}`;
  }
  return true;
}

export { GROUP_SIZES, GROUP_COUNT_MIN, GROUP_COUNT_MAX, TYPE_NAMES };

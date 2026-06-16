import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../../utils/audio';
import { celebrate, cheer } from '../../utils/audio';
import {
  simulateStation1Intro, simulateStation2Intro, simulateStation3Intro,
  simulateStation1Complete, simulateStation2Complete, simulateStation3Complete,
} from '../../utils/multiplicationNarration';
import GroupSimulationCanvas from './GroupSimulationCanvas';

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
const GROUP_SIZES  = [2, 3, 4, 5];
const GROUP_COUNTS = [2, 3, 4, 5];

const STATIONS = [
  { id: 0, title: 'Build the Groups',     subtitle: 'Tap to add equal groups',     icon: '🧺' },
  { id: 1, title: 'Match the Sentence',   subtitle: 'Connect repeated addition to ×',    icon: '🔗' },
  { id: 2, title: 'Real-World Scenes',    subtitle: 'Equal groups all around us!', icon: '🏪' },
];

// ─── Station 1: Build the Groups ─────────────────────────────────────────────
function Station1({ audioEnabled, onNext }) {
  const [groupSize,  setGroupSize]  = useState(() => GROUP_SIZES[randInt(0,3)]);
  const [groupCount, setGroupCount] = useState(() => GROUP_COUNTS[randInt(0,3)]);
  const [built,  setBuilt]  = useState(0);
  const [round,  setRound]  = useState(0);
  const [done,   setDone]   = useState(false);
  const narRef = useRef(null);

  const reset = useCallback(() => {
    const gs = GROUP_SIZES[randInt(0,3)];
    const gc = GROUP_COUNTS[randInt(0,3)];
    setGroupSize(gs); setGroupCount(gc); setBuilt(0); setDone(false);
  }, []);

  useEffect(() => { reset(); }, [round]);

  useEffect(() => {
    if (audioEnabled) {
      narRef.current?.cancel();
      narRef.current = narrate(simulateStation1Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [round, audioEnabled]);

  const handleGroupAdded = useCallback((count) => {
    setBuilt(count);
    if (count === groupCount) {
      setDone(true);
      sounds.correct();
      narRef.current?.cancel();
      if (audioEnabled) narRef.current = narrate(simulateStation1Complete(), true);
    }
  }, [groupCount, audioEnabled]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>🧺 Build the Groups</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: '1.05rem', fontWeight: 700 }}>
        Tap <strong style={{ color: 'var(--gold)' }}>＋</strong> to add{' '}
        <strong style={{ color: 'var(--gold)' }}>{groupCount}</strong> equal groups of{' '}
        <strong style={{ color: 'var(--coral)' }}>{groupSize}</strong>.
      </p>

      <GroupSimulationCanvas
        groupSize={groupSize} groupCount={groupCount}
        mode="build" revealAdditionSentence revealMultiplicationSentence={done}
        showSkipCount={done} theme="counters" onGroupAdded={handleGroupAdded}
      />

      {done && (
        <div style={{ marginTop: 20, animation: 'bounceIn 0.5s' }}>
          <p style={{ color: 'var(--green-light)', fontSize: '1.2rem', fontWeight: 800, marginBottom: 16 }}>
            🎉 {groupSize} × {groupCount} = {groupSize * groupCount}
          </p>
          <button className={`btn ${round < 2 ? 'btn-outline' : 'btn-primary'}`}
            onClick={() => { if (round < 2) { setRound(r => r + 1); } else onNext(); }}>
            {round < 2 ? 'Try Another! →' : 'Next Station! →'}
          </button>
        </div>
      )}
      <div style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
        Round {Math.min(round + 1, 3)} / 3
      </div>
    </div>
  );
}

// ─── Station 2: Match the Sentence ───────────────────────────────────────────
const SG_CONTEXTS = [
  { obj: '🥟', name: 'dumplings' }, { obj: '📦', name: 'boxes' },
  { obj: '⭐', name: 'stars' },     { obj: '🍎', name: 'apples' },
  { obj: '🖍️', name: 'crayons' },
];

function Station2({ audioEnabled, onNext }) {
  const [groupSize,  setGroupSize]  = useState(2);
  const [groupCount, setGroupCount] = useState(3);
  const [options,    setOptions]    = useState([]);
  const [selected,   setSelected]   = useState(null);
  const [round,      setRound]      = useState(0);
  const narRef = useRef(null);

  const buildOptions = (gs, gc) => {
    const correct = `${gs} × ${gc}`;
    const pool = [
      `${gs} × ${Math.max(1, gc - 1)}`,
      `${gs} × ${gc + 1}`,
      `${Math.max(1, gs - 1)} × ${gc}`,
      `${gs + 1} × ${gc}`,
    ].filter(s => s !== correct);
    const opts = [correct, ...pool.slice(0, 3)];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  };

  const reset = () => {
    const gs = GROUP_SIZES[randInt(0, 3)];
    const gc = GROUP_COUNTS[randInt(0, 3)];
    setGroupSize(gs); setGroupCount(gc);
    setOptions(buildOptions(gs, gc));
    setSelected(null);
  };

  useEffect(() => { reset(); }, [round]);

  useEffect(() => {
    if (audioEnabled) {
      narRef.current?.cancel();
      narRef.current = narrate(simulateStation2Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [round, audioEnabled]);

  const correct = `${groupSize} × ${groupCount}`;

  const handleSelect = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    if (opt === correct) {
      sounds.correct();
      narRef.current?.cancel();
      if (audioEnabled) narRef.current = narrate(simulateStation2Complete(), true);
    } else {
      sounds.wrong();
    }
  };

  const isDone = selected !== null;

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>🔗 Match the Sentence</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: '1.05rem', fontWeight: 700 }}>
        Look at the repeated addition below. Choose the matching multiplication sentence!
      </p>

      <div className="addition-display-box" style={{ margin: '0 auto 20px' }}>
        {Array(groupCount).fill(groupSize).join(' + ')} = {groupSize * groupCount}
      </div>

      <GroupSimulationCanvas
        groupSize={groupSize} groupCount={groupCount}
        mode="display" revealAdditionSentence={false} revealMultiplicationSentence={false}
        theme="counters"
      />

      <div className="options-grid" style={{ maxWidth: 500, margin: '20px auto 0' }}>
        {options.map((opt, i) => {
          let cls = 'option-btn';
          if (isDone) cls += ' disabled';
          if (selected === opt) cls += opt === correct ? ' correct' : ' wrong';
          else if (isDone && opt === correct) cls += ' correct';
          return (
            <button key={i} className={cls} onClick={() => handleSelect(opt)} style={{ fontSize: '1.3rem' }}>
              {opt}
            </button>
          );
        })}
      </div>

      {isDone && (
        <div style={{ marginTop: 20, animation: 'bounceIn 0.5s' }}>
          <button className={`btn ${round < 2 ? 'btn-outline' : 'btn-primary'}`}
            onClick={() => { if (round < 2) { setRound(r => r + 1); } else onNext(); }}>
            {round < 2 ? 'Try Another! →' : 'Next Station! →'}
          </button>
        </div>
      )}
      <div style={{ marginTop: 14, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
        Round {Math.min(round + 1, 3)} / 3
      </div>
    </div>
  );
}

// ─── Station 3: Real-World Scenes ────────────────────────────────────────────
const SCENE_CONFIGS = [
  { setting: 'school canteen', object: 'curry puffs', emoji: '🥟' },
  { setting: 'hawker centre', object: 'bowls of noodles', emoji: '🍜' },
  { setting: 'classroom', object: 'crayons per box', emoji: '🖍️' },
  { setting: 'playground', object: 'balls per basket', emoji: '⚽' },
  { setting: 'birthday party', object: 'balloons per bunch', emoji: '🎈' },
];

function Station3({ audioEnabled, onComplete }) {
  const [scene, setScene] = useState(() => SCENE_CONFIGS[randInt(0, SCENE_CONFIGS.length - 1)]);
  const [groupSize,  setGroupSize]  = useState(() => GROUP_SIZES[randInt(0, 3)]);
  const [groupCount, setGroupCount] = useState(() => GROUP_COUNTS[randInt(0, 3)]);
  const [selected,   setSelected]   = useState(null);
  const [options,    setOptions]    = useState([]);
  const [round,      setRound]      = useState(0);
  const narRef = useRef(null);

  const buildOptions = (gs, gc) => {
    const correct = gs * gc;
    const pool = new Set([correct + gc, correct - gc, correct + gs, correct - gs].filter(v => v > 0 && v !== correct));
    const arr  = [...pool].slice(0, 3);
    const opts = [correct, ...arr];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  };

  const reset = () => {
    const s  = SCENE_CONFIGS[randInt(0, SCENE_CONFIGS.length - 1)];
    const gs = GROUP_SIZES[randInt(0, 3)];
    const gc = GROUP_COUNTS[randInt(0, 3)];
    setScene(s); setGroupSize(gs); setGroupCount(gc);
    setOptions(buildOptions(gs, gc)); setSelected(null);
  };

  useEffect(() => { reset(); }, [round]);

  useEffect(() => {
    if (audioEnabled) {
      narRef.current?.cancel();
      narRef.current = narrate(simulateStation3Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [round, audioEnabled]);

  const correct = groupSize * groupCount;

  const handleSelect = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    if (opt === correct) {
      sounds.correct();
      narRef.current?.cancel();
      if (audioEnabled) narRef.current = narrate(simulateStation3Complete(), true);
    } else {
      sounds.wrong();
    }
  };

  const isDone = selected !== null;

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>🏪 Real-World Scenes</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 8, fontSize: '1.05rem', fontWeight: 700 }}>
        Count the equal groups and find the total!
      </p>

      <div className="word-problem-box" style={{ maxWidth: 480, margin: '0 auto 16px' }}>
        <span className="sg-scene-emoji">{scene.emoji}</span>
        At the <strong style={{ color: 'var(--gold)' }}>{scene.setting}</strong>, there are{' '}
        <strong style={{ color: 'var(--gold)' }}>{groupCount}</strong> groups of{' '}
        <strong style={{ color: 'var(--coral)' }}>{scene.object}</strong>. Each group has{' '}
        <strong style={{ color: 'var(--coral)' }}>{groupSize}</strong>.
        How many <strong>{scene.object}</strong> are there in all?
      </div>

      <GroupSimulationCanvas
        groupSize={groupSize} groupCount={groupCount}
        mode="display" revealAdditionSentence revealMultiplicationSentence={isDone}
        theme="sg-scene" sceneEmoji={scene.emoji}
      />

      <div className="options-grid" style={{ maxWidth: 380, margin: '16px auto 0' }}>
        {options.map((opt, i) => {
          let cls = 'option-btn';
          if (isDone) cls += ' disabled';
          if (selected === opt) cls += opt === correct ? ' correct' : ' wrong';
          else if (isDone && opt === correct) cls += ' correct';
          return (
            <button key={i} className={cls} onClick={() => handleSelect(opt)} style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {opt}
            </button>
          );
        })}
      </div>

      {isDone && (
        <div style={{ marginTop: 22, animation: 'bounceIn 0.5s' }}>
          <button className={`btn ${round < 2 ? 'btn-outline' : 'btn-green btn-lg'}`}
            onClick={() => {
              if (round < 2) { setRound(r => r + 1); }
              else { narRef.current?.cancel(); stopNarration(); onComplete(); }
            }}>
            {round < 2 ? 'Try Another! →' : '🎮 Start Play Mode!'}
          </button>
        </div>
      )}
      <div style={{ marginTop: 14, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
        Round {Math.min(round + 1, 3)} / 3
      </div>
    </div>
  );
}

// ─── Main StationsPhase ───────────────────────────────────────────────────────
export default function StationsPhase({ onComplete, audioEnabled }) {
  const [station, setStation] = useState(0);
  const nextStation = useCallback(() => { if (station < 2) setStation(s => s + 1); }, [station]);

  return (
    <div className="simulate-phase">
      <div className="simulate-header">
        <h3 className="simulate-label">🧪 Simulate</h3>
        <p className="simulate-sublabel">Explore equal groups — build, match, and discover!</p>
      </div>

      <div className="progress-dots">
        {STATIONS.map((s, i) => (
          <div key={i} className="simulate-dot-wrapper">
            <div className={`progress-dot ${i === station ? 'active' : i < station ? 'completed' : ''}`} />
            <span className="simulate-dot-label">{s.icon}</span>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ maxWidth: 820, width: '100%', animation: 'slideUp 0.4s ease' }}>
        {station === 0 && <Station1 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 1 && <Station2 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 2 && <Station3 audioEnabled={audioEnabled} onComplete={onComplete} />}
      </div>
    </div>
  );
}

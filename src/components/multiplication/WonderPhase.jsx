import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration } from '../../utils/audio';
import { getWonderPair, wonderNarration, wonderDiscoverNarration } from '../../utils/multiplicationNarration';

const BG_EMOJIS_BY_WONDER = [
  ['🍎', '✕', '➕', '🧺', '🔢'],
  ['🥟', '🍽️', '✕', '➕', '✨'],
  ['💺', '🪑', '✕', '📊', '🔢'],
  ['❓', '✕', '💡', '🔢', '✨'],
  ['✏️', '📦', '✕', '➕', '🔢'],
];

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [pair]  = useState(() => getWonderPair());
  const [bgEmojis] = useState(() => BG_EMOJIS_BY_WONDER[Math.floor(Math.random() * BG_EMOJIS_BY_WONDER.length)]);
  const [stage, setStage] = useState(0);
  const [particles, setParticles] = useState([]);
  const narRef = useRef(null);

  useEffect(() => {
    const p = Array.from({ length: 22 }, (_, i) => ({
      id: i, emoji: bgEmojis[i % bgEmojis.length],
      x: Math.random() * 100, y: Math.random() * 100,
      delay: Math.random() * 5, duration: 8 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.5,
    }));
    setParticles(p);
  }, [bgEmojis]);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (stage === 1 && audioEnabled) {
      narRef.current = narrate(wonderNarration(pair.q, pair.s), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [stage, pair, audioEnabled]);

  const handleDiscover = useCallback(() => {
    narRef.current?.cancel();
    stopNarration();
    if (audioEnabled) {
      const n = narrate(wonderDiscoverNarration(), true);
      n.promise.then(() => onComplete());
      setTimeout(() => onComplete(), 3000);
    } else {
      setTimeout(() => onComplete(), 500);
    }
  }, [onComplete, audioEnabled]);

  return (
    <div className="wonder-phase">
      <div className="wonder-particles">
        {particles.map(p => (
          <span key={p.id} className="wonder-particle" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
            fontSize: `${p.size}rem`,
          }}>{p.emoji}</span>
        ))}
      </div>

      <div className="wonder-content">
        <div className={`wonder-qmark ${stage >= 1 ? 'revealed' : ''}`}>
          <span className="wonder-qmark-icon">✕</span>
          <div className="wonder-qmark-glow" />
        </div>

        <div className={`wonder-mascot ${stage >= 1 ? 'visible' : ''}`}>
          <div className="mascot thinking">🤖</div>
          <div className="speech-bubble wonder-bubble" style={{ fontSize: '0.95rem' }}>Hmm... I wonder... 🤔</div>
        </div>

        <div className={`wonder-question-card ${stage >= 1 ? 'visible' : ''}`}>
          <div className="wonder-emoji">🧺</div>
          <h2 className="wonder-question-text">{pair.q}</h2>
          <p className="wonder-subtext">{pair.s}</p>
        </div>

        <button className={`btn btn-wonder ${stage >= 2 ? 'visible' : ''}`} onClick={handleDiscover} id="discover-btn">
          <span className="wonder-btn-sparkle">✨</span>
          Let's Discover!
          <span className="wonder-btn-sparkle">✨</span>
        </button>
      </div>
    </div>
  );
}

import { useEffect, useRef } from 'react';
import { narrate, stopNarration } from '../../utils/audio';
import { introNarration } from '../../utils/multiplicationNarration';

const JOURNEY_PHASES = [
  { icon: '🔮', label: 'Wonder',   desc: 'A multiplication mystery!' },
  { icon: '📖', label: 'Story',    desc: 'Meet Alice' },
  { icon: '🧪', label: 'Simulate', desc: 'Build equal groups' },
  { icon: '🎮', label: 'Play',     desc: '100 fun challenges' },
  { icon: '📓', label: 'Reflect',  desc: 'Check your learning' },
];

export default function IntroScreen({ onStart, onPractice, audioEnabled, learnDone }) {
  const narRef = useRef(null);

  useEffect(() => {
    if (audioEnabled) {
      const t = setTimeout(() => {
        narRef.current = narrate(introNarration(), true);
      }, 300);
      return () => { clearTimeout(t); narRef.current?.cancel(); stopNarration(); };
    }
  }, [audioEnabled]);

  const handleStart = () => { narRef.current?.cancel(); stopNarration(); onStart(); };
  const handlePractice = () => { narRef.current?.cancel(); stopNarration(); onPractice(); };

  return (
    <div className="intro-screen">
      <div className="intro-badge">✨ Singapore MOE Curriculum · Grade 1 Maths</div>

      <h1 className="intro-title">
        <span style={{ color: 'var(--coral)' }}>Multiplication</span>{' '}as{' '}
        <span style={{ color: 'var(--gold)' }}>Repeated Addition</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: 4, fontFamily: 'var(--font-display)', fontWeight: 700 }}>
        Lesson 4.1 · Equal Groups, Repeated Addition, and the × Symbol
      </p>

      <div className="mascot-container">
        <div className="mascot">🤖</div>
        <div className="speech-bubble">Let's discover the multiplication shortcut! ✕</div>
      </div>

      <p className="intro-desc">
        Discover that <strong style={{ color: 'var(--gold)' }}>multiplication</strong> is just a clever shortcut
        for <strong style={{ color: 'var(--coral)' }}>repeated addition</strong>. Build equal groups,
        write multiplication sentences, and solve real-world problems!
      </p>

      <div className="intro-journey-map">
        <h3 className="intro-journey-title">Your Learning Journey</h3>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon">{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{p.label}</div>
                <div className="intro-journey-desc">{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && <div className="intro-journey-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary btn-lg intro-start-btn" onClick={handleStart} id="start-journey-btn">
        🚀 Begin Your Journey!
      </button>

      {learnDone && (
        <button className="btn btn-outline" onClick={handlePractice} style={{ marginTop: 8 }}>
          🎮 Jump to Practice
        </button>
      )}

      <div className="feature-cards">
        <div className="feature-card"><div className="feature-card-icon">🎯</div><div className="feature-card-label">100 Questions</div></div>
        <div className="feature-card"><div className="feature-card-icon">✕</div><div className="feature-card-label">Equal Groups</div></div>
        <div className="feature-card"><div className="feature-card-icon">⭐</div><div className="feature-card-label">XP &amp; Streaks</div></div>
      </div>
    </div>
  );
}

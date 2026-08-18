import { useEffect } from 'react';
import { stopNarration } from '../../utils/audio';

const JOURNEY_PHASES = [
  { id: 'wonder', icon: '🔮', label: 'Wonder', desc: 'A multiplication mystery!' },
  { id: 'story', icon: '📖', label: 'Story', desc: 'Meet Alice' },
  { id: 'stations', icon: '🧪', label: 'Simulate', desc: 'Build equal groups' },
  { id: 'practice', icon: '🎮', label: 'Practice', desc: '100 fun challenges' },
  { id: 'reflect', icon: '📓', label: 'Reflect', desc: 'Check your learning' },
];

export default function IntroScreen({ onStart, onSelectPhase }) {
  useEffect(() => {
    stopNarration();
  }, []);

  const handleStart = () => { stopNarration(); onStart(); };
  const handlePhaseClick = (id) => { stopNarration(); onSelectPhase(id); };

  return (
    <div className="intro-screen">
      <div className="intro-badge">✨ MOE Curriculum · Grade 2 Maths</div>

      <h1 className="intro-title">
        <span style={{ color: 'var(--coral)' }}>Multiplication</span>{' '}as{' '}
        <span style={{ color: 'var(--gold)' }}>Repeated Addition</span>
      </h1>
      <p className="intro-subtitle">
        Lesson 4.1 · Equal Groups, Repeated Addition, and the × Symbol
      </p>

      <div className="mascot-container">
        <div className="mascot">🦁</div>
        <div className="speech-bubble">Let's discover the multiplication shortcut! ✕</div>
      </div>

      <p className="intro-desc">
        Discover that <strong style={{ color: 'var(--gold)' }}>multiplication</strong> is just a clever shortcut
        for <strong style={{ color: 'var(--coral)' }}>repeated addition</strong>. Build equal groups,
        write multiplication sentences, and solve real-world problems!
      </p>

      <div className="intro-journey-map">
        <h3 className="intro-journey-title">Your Learning Journey — Click Any Phase To Start!</h3>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <div key={p.id} className="intro-journey-step clickable" onClick={() => handlePhaseClick(p.id)} role="button" tabIndex={0}>
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

      <div className="feature-cards">
        <div className="feature-card"><div className="feature-card-icon">🎯</div><div className="feature-card-label">100 Questions</div></div>
        <div className="feature-card"><div className="feature-card-icon">✕</div><div className="feature-card-label">Equal Groups</div></div>
        <div className="feature-card"><div className="feature-card-icon">⭐</div><div className="feature-card-label">XP &amp; Streaks</div></div>
      </div>
    </div>
  );
}

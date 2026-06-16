import { useState, useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../../utils/audio';
import { summaryNarration } from '../../utils/multiplicationNarration';

export default function SummaryScreen({ stats, onRestart, onGoHome, audioEnabled }) {
  const [confetti, setConfetti] = useState([]);
  const narRef = useRef(null);

  const { score = 0, xp = 0, maxStreak = 0, totalAnswered = 0, worldResults = {} } = stats || {};
  const pct = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
  const totalStars = Object.values(worldResults).reduce((a, r) => a + (r.stars || 0), 0);

  useEffect(() => {
    sounds.badge();
    setConfetti(Array.from({ length: 50 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 2,
      color: ['#ffc107','#e91e63','#4caf50','#2196f3','#ff5722','#9c27b0','#00bcd4'][i % 7],
      size: 7 + Math.random() * 11, duration: 2.5 + Math.random() * 3,
    })));
    if (audioEnabled) {
      const t = setTimeout(() => { narRef.current = narrate(summaryNarration(), true); }, 600);
      return () => { clearTimeout(t); narRef.current?.cancel(); };
    }
  }, [audioEnabled]);

  useEffect(() => () => { narRef.current?.cancel(); stopNarration(); }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
      <div className="confetti-container">
        {confetti.map(p => (
          <div key={p.id} className="confetti-piece" style={{ left: `${p.x}%`, animationDelay: `${p.delay}s`, backgroundColor: p.color, width: p.size, height: p.size, animationDuration: `${p.duration}s` }} />
        ))}
      </div>

      <div className="certificate-card">
        <div className="cert-badge">🏆</div>
        <h2 className="cert-title">Journey Complete!</h2>
        <p className="cert-subtitle">You are now a Multiplication Explorer!</p>

        <div className="score-circle">
          <span className="score-number">{pct}%</span>
          <span className="score-label">{score}/{totalAnswered}</span>
        </div>

        <div style={{ fontSize: '2.2rem', display: 'flex', gap: 8, justifyContent: 'center', margin: '18px 0' }}>
          {[1,2,3].map(i => <span key={i} style={{ opacity: i <= Math.ceil(totalStars / 3) ? 1 : 0.2 }}>⭐</span>)}
        </div>

        <div className="cert-stats">
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--gold)' }}>{xp}</div>
            <div className="cert-stat-label">XP Earned</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--coral)' }}>🔥 {maxStreak}</div>
            <div className="cert-stat-label">Best Streak</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--green-light)' }}>{totalStars}</div>
            <div className="cert-stat-label">Stars ⭐</div>
          </div>
        </div>

        <div className="cert-worlds">
          {Object.entries(worldResults).slice(0, 5).map(([id, r]) => (
            <div key={id} className="cert-world-item">
              <span>{['⭐','🍎','🌊','☁️','🍜','🚀','🐉','💎','🌈','🏰'][id] || '🎯'}</span>
              <span>{r.score}/{r.total}</span>
              <span>{Array.from({ length: 3 }, (_, i) => i < r.stars ? '⭐' : '☆').join('')}</span>
            </div>
          ))}
        </div>

        <div className="mascot-container" style={{ marginTop: 18 }}>
          <div className="mascot happy" style={{ width: 84, height: 84, fontSize: '2.2rem' }}>🤖</div>
          <div className="speech-bubble">
            {pct >= 80 ? 'Incredible! Multiplication Master! 🏆' : pct >= 50 ? 'Great effort! Keep practising! 💪' : 'Good start! Try again to improve! 📚'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 26 }}>
          <button className="btn btn-primary btn-lg" onClick={() => { narRef.current?.cancel(); stopNarration(); onRestart(); }}>🔄 Play Again</button>
          <button className="btn btn-secondary" onClick={() => { narRef.current?.cancel(); stopNarration(); onGoHome(); }}>🏠 Home</button>
        </div>
      </div>
    </div>
  );
}

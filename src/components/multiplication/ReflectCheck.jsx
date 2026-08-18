import { useState, useCallback, useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../../utils/audio';
import { reflectIntroNarration, reflectConfidenceNarration, reflectCorrectNarration, reflectWrongNarration } from '../../utils/multiplicationNarration';

const REFLECT_QUESTIONS = [
  {
    q: "What does 3 × 4 mean?",
    options: [
      { text: "3 groups of 4 — equal groups!", correct: true,  emoji: '✅' },
      { text: "Add 3 and 4 together",           correct: false, emoji: '❌' },
      { text: "Count to 34",                    correct: false, emoji: '❓' },
    ],
  },
  {
    q: "Which is the same as 5 + 5 + 5?",
    options: [
      { text: "5 × 3 = 5, three times!", correct: true,  emoji: '✨' },
      { text: "5 + 3",                   correct: false, emoji: '➕' },
      { text: "5 - 3",                   correct: false, emoji: '➖' },
    ],
  },
  {
    q: "In equal groups, every group has…",
    options: [
      { text: "the same number inside",    correct: true,  emoji: '🧺' },
      { text: "a different number inside", correct: false, emoji: '❌' },
      { text: "no objects at all",         correct: false, emoji: '❓' },
    ],
  },
];

const CONFIDENCE_LEVELS = [
  { emoji: '🌟', label: 'I can write multiplication sentences easily!', color: '#ffc107' },
  { emoji: '😊', label: 'I understand equal groups and working on ×!',   color: '#4caf50' },
  { emoji: '🙂', label: "I'm still practising — that's totally okay!",    color: '#42a5f5' },
];

export default function ReflectCheck({ onComplete, audioEnabled }) {
  const [step,          setStep]          = useState(0);
  const [qIdx,          setQIdx]          = useState(0);
  const [answered,      setAnswered]      = useState(false);
  const [selectedOpt,   setSelectedOpt]   = useState(null);
  const [confidence,    setConfidence]    = useState(null);
  const [confetti,      setConfetti]      = useState([]);
  const [showConfetti,  setShowConfetti]  = useState(false);
  const narRef = useRef(null);

  useEffect(() => {
    if (step === 0 && audioEnabled) {
      narRef.current = narrate(reflectIntroNarration(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [step, audioEnabled]);

  useEffect(() => {
    if (showConfetti) {
      setConfetti(Array.from({ length: 40 }, (_, i) => ({
        id: i, x: Math.random() * 100, delay: Math.random() * 2,
        color: ['#ffc107','#e91e63','#4caf50','#2196f3','#ff5722','#9c27b0'][i % 6],
        size: 7 + Math.random() * 10, duration: 2 + Math.random() * 3,
      })));
    }
  }, [showConfetti]);

  const handleAnswer = useCallback((opt) => {
    if (answered) return;
    setSelectedOpt(opt);
    setAnswered(true);
    narRef.current?.cancel();
    if (opt.correct) {
      sounds.correct();
      if (audioEnabled) narRef.current = narrate(reflectCorrectNarration(), true);
    } else {
      sounds.wrong();
      if (audioEnabled) narRef.current = narrate(reflectWrongNarration(), true);
    }
    setTimeout(() => {
      setAnswered(false);
      setSelectedOpt(null);
      if (qIdx + 1 < REFLECT_QUESTIONS.length) setQIdx(i => i + 1);
      else setStep(1);
    }, 1600);
  }, [answered, qIdx, audioEnabled]);

  const handleConfidence = useCallback((idx) => {
    setConfidence(idx);
    sounds.badge();
    setShowConfetti(true);
    narRef.current?.cancel();
    setTimeout(() => { narRef.current?.cancel(); stopNarration(); onComplete(); }, 1400);
  }, [onComplete]);

  useEffect(() => {
    if (step === 1 && audioEnabled) {
      narRef.current?.cancel();
      narRef.current = narrate(reflectConfidenceNarration(), true);
    }
  }, [step, audioEnabled]);

  useEffect(() => () => { narRef.current?.cancel(); stopNarration(); }, []);

  // Step 0 — Reflect Questions
  if (step === 0) {
    const rq = REFLECT_QUESTIONS[qIdx];
    return (
      <div className="reflect-phase">
        {showConfetti && (
          <div className="confetti-container">
            {confetti.map(p => (
              <div key={p.id} className="confetti-piece" style={{ left: `${p.x}%`, animationDelay: `${p.delay}s`, backgroundColor: p.color, width: p.size, height: p.size, animationDuration: `${p.duration}s` }} />
            ))}
          </div>
        )}
        <div className="reflect-header">
          <h3 className="reflect-label">📓 Reflect Check</h3>
          <p className="reflect-sublabel">Teach Leo the lion what you learned today!</p>
        </div>
        <div className="reflect-card">
          <div className="reflect-mascot-row">
            <div className="mascot thinking" style={{ width: 76, height: 76, fontSize: '2.4rem' }}>🦁</div>
            <div className="speech-bubble" style={{ maxWidth: 320, fontSize: '1.2rem', fontWeight: 800 }}>Can you help me? {rq.q}</div>
          </div>
          <div className="reflect-options">
            {rq.options.map((opt, i) => {
              const isSelected = selectedOpt === opt;
              const isCorrect = opt.correct;
              let statusClass = '';
              if (answered) {
                if (isCorrect) statusClass = 'correct';
                else if (isSelected) statusClass = 'wrong';
              }
              return (
                <button key={i}
                  className={`reflect-option ${statusClass}`}
                  onClick={() => handleAnswer(opt)} disabled={answered}>
                  <span className="reflect-option-emoji">{opt.emoji}</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>{opt.text}</span>
                </button>
              );
            })}
          </div>
          <div className="reflect-progress">
            {REFLECT_QUESTIONS.map((_, i) => (
              <div key={i} className={`reflect-dot ${i === qIdx ? 'active' : i < qIdx ? 'done' : ''}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 1 — Confidence Check
  return (
    <div className="reflect-phase">
      {showConfetti && (
        <div className="confetti-container">
          {confetti.map(p => (
            <div key={p.id} className="confetti-piece" style={{ left: `${p.x}%`, animationDelay: `${p.delay}s`, backgroundColor: p.color, width: p.size, height: p.size, animationDuration: `${p.duration}s` }} />
          ))}
        </div>
      )}
      <div className="reflect-card">
        <div className="reflect-mascot-row" style={{ marginBottom: 14 }}>
          <div className="mascot happy" style={{ width: 76, height: 76, fontSize: '2.4rem' }}>🦁</div>
          <div className="speech-bubble" style={{ maxWidth: 320, fontSize: '1.2rem', fontWeight: 800 }}>Awesome work! How do you feel about multiplication?</div>
        </div>
        <h3 className="reflect-card-title" style={{ fontSize: '1.85rem', color: 'var(--gold)', marginBottom: 8 }}>Choose your confidence level</h3>
        <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 20, fontWeight: 800, fontSize: '1.1rem' }}>Every answer is great — be proud of your learning!</p>
        <div className="confidence-grid">
          {CONFIDENCE_LEVELS.map((c, i) => (
            <button key={i} className={`confidence-btn ${confidence === i ? 'selected' : ''}`}
              onClick={() => handleConfidence(i)} style={{ '--conf-color': c.color }}>
              <span className="confidence-emoji">{c.emoji}</span>
              <span className="confidence-label" style={{ fontSize: '1.25rem', fontWeight: 900 }}>{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

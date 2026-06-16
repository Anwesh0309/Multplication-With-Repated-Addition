import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration, preloadNarration } from '../../utils/audio';
import { getStoryNarration } from '../../utils/multiplicationNarration';

const STORY_SLIDES = [
  {
    image: '/images/story_sticker_stall.png',
    title: "Alice's Sticker Stall",
    text: "Alice is setting up her stall at the school fair. She arranges her packs of stickers in equal rows.",
    highlight: '"Each pack has the same number of stickers. How many altogether?"',
    mascotText: "Let's help Alice! 🏷️",
  },
  {
    image: '/images/story_equal_groups.png',
    title: 'Equal Groups',
    text: "Instead of counting one by one, Alice groups them equally — that means every group has exactly the same number inside. When we add the same number again and again, we call it repeated addition.",
    highlight: '"Equal groups means every group has the same number inside."',
    mascotText: 'Repeated addition is the key! ➕',
  },
  {
    image: '/images/story_multiplication_shortcut.png',
    title: 'The Multiplication Shortcut',
    text: "Alice has three packs, each with four stickers. She writes: 4 + 4 + 4 = 12. But writing the same number so many times is slow. There is a faster way — the times symbol! It means groups of.",
    highlight: '"The × symbol is our shortcut sign — it means groups of!"',
    mascotText: "The × is our shortcut! ✕",
  },
  {
    image: '/images/story_multiplication_sentence.png',
    title: 'Multiplication Sentence',
    text: "4 × 3 means four, three times. It is the same as 4 + 4 + 4! Repeated addition and multiplication sentences always give the same answer. Alice can now write a multiplication sentence for any equal group she sees!",
    highlight: '"4 + 4 + 4 = 4 × 3 = 12 — they are the same!"',
    mascotText: "Let's practise together! 🚀",
  },
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slide, setSlide]   = useState(0);
  const [anim, setAnim]     = useState(false);
  const [textVis, setTextVis] = useState(false);
  const [hlVis, setHlVis]   = useState(false);
  const narRef = useRef(null);
  const s = STORY_SLIDES[slide];
  const isLast = slide === STORY_SLIDES.length - 1;
  const pct = ((slide + 1) / STORY_SLIDES.length) * 100;

  useEffect(() => {
    if (audioEnabled) {
      preloadNarration(getStoryNarration(slide));
      if (slide + 1 < STORY_SLIDES.length) preloadNarration(getStoryNarration(slide + 1));
    }
  }, [slide, audioEnabled]);

  useEffect(() => {
    setTextVis(false); setHlVis(false);
    const t1 = setTimeout(() => setTextVis(true), 100);
    const t2 = setTimeout(() => setHlVis(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [slide]);

  useEffect(() => {
    if (textVis && audioEnabled) {
      narRef.current?.cancel();
      narRef.current = narrate(getStoryNarration(slide), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [textVis, slide, audioEnabled]);

  const goNext = useCallback(() => {
    if (anim) return;
    narRef.current?.cancel(); stopNarration();
    setAnim(true);
    setTimeout(() => { isLast ? onComplete() : setSlide(i => i + 1); setAnim(false); }, 400);
  }, [anim, isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (anim || slide === 0) return;
    narRef.current?.cancel(); stopNarration();
    setAnim(true);
    setTimeout(() => { setSlide(i => i - 1); setAnim(false); }, 400);
  }, [anim, slide]);

  return (
    <div className="story-phase">
      <div className="story-progress">
        <div className="story-progress-bar"><div className="story-progress-fill" style={{ width: `${pct}%` }} /></div>
        <span className="story-progress-label">{slide + 1} / {STORY_SLIDES.length}</span>
      </div>

      <div className={`story-card ${anim ? 'flipping' : ''}`}>
        <div className="story-image-section">
          <img src={s.image} alt={s.title} className="story-image" />
          <div className="story-image-overlay" />
        </div>
        <div className="story-text-section">
          <h2 className="story-title">{s.title}</h2>
          <p className={`story-text ${textVis ? 'revealed' : ''}`}>{s.text}</p>
          <div className={`story-highlight ${hlVis ? 'visible' : ''}`}>
            <span>✨</span>
            <span className="story-highlight-text">{s.highlight}</span>
            <span>✨</span>
          </div>
          <div className="story-mascot">
            <div className="mascot" style={{ width: 52, height: 52, fontSize: '1.5rem' }}>🤖</div>
            <div className="speech-bubble" style={{ fontSize: '0.85rem', padding: '10px 16px', maxWidth: 200 }}>{s.mascotText}</div>
          </div>
        </div>
      </div>

      <div className="story-nav">
        <button className="btn btn-outline btn-sm" onClick={goPrev} disabled={slide === 0} style={{ opacity: slide === 0 ? 0.3 : 1 }}>← Back</button>
        <div className="story-dots">
          {STORY_SLIDES.map((_, i) => (
            <div key={i} className={`story-dot ${i === slide ? 'active' : i < slide ? 'completed' : ''}`} />
          ))}
        </div>
        <button className={`btn ${isLast ? 'btn-green' : 'btn-primary'} btn-sm`} onClick={goNext}>
          {isLast ? "🧪 Let's Explore!" : 'Next →'}
        </button>
      </div>
    </div>
  );
}

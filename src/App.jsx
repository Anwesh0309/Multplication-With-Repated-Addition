import { useState, useCallback } from 'react';
import IntroScreen from './components/multiplication/IntroScreen';
import WonderPhase from './components/multiplication/WonderPhase';
import StoryPhase from './components/multiplication/StoryPhase';
import StationsPhase from './components/multiplication/StationsPhase';
import ReflectCheck from './components/multiplication/ReflectCheck';
import PracticeMode from './components/multiplication/PracticeMode';
import SummaryScreen from './components/multiplication/SummaryScreen';
import FloatingNumbers from './components/multiplication/FloatingNumbers';
import { stopNarration } from './utils/audio';

const PHASES = [
  { id: 'wonder',   label: 'Wonder',   icon: '🔮', num: '01' },
  { id: 'story',    label: 'Story',    icon: '📖', num: '02' },
  { id: 'stations', label: 'Simulate', icon: '🧪', num: '03' },
  { id: 'practice', label: 'Practice', icon: '🎮', num: '04' },
  { id: 'reflect',  label: 'Reflect',  icon: '📓', num: '05' },
];

const STORAGE_KEY = 'intellia_multiplication_repeated_addition_v1';

function saveProgress(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, timestamp: Date.now() })); } catch {}
}

export default function App() {
  const [phase, setPhase]             = useState('intro');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [learnDone, setLearnDone]     = useState(false);
  const [practiceStats, setPracticeStats] = useState(null);

  const goHome = useCallback(() => setPhase('intro'), []);

  const handleWonderComplete  = useCallback(() => setPhase('story'), []);
  const handleStoryComplete   = useCallback(() => setPhase('stations'), []);
  const handleStationsComplete = useCallback(() => { setLearnDone(true); setPhase('practice'); }, []);
  const handlePracticeComplete = useCallback((stats) => {
    setPracticeStats(stats);
    saveProgress({ phase: 'reflect', stats });
    setPhase('reflect');
  }, []);
  const handleReflectComplete = useCallback(() => {
    saveProgress({ phase: 'summary', stats: practiceStats });
    setPhase('summary');
  }, [practiceStats]);

  const handleRestart = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setPhase('intro');
    setPracticeStats(null);
    setLearnDone(false);
  }, []);

  const currentPhaseIndex = PHASES.findIndex(p => p.id === phase);

  return (
    <>
      <FloatingNumbers />
      <div className="app-container">
        {/* Top Header & Navigation */}
        {phase !== 'intro' && phase !== 'summary' && (
          <div className="nav-header-container">
            <div className="journey-bar">
              {PHASES.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => { stopNarration(); setPhase(p.id); }}
                  className={`journey-step ${p.id === phase ? 'active' : i < currentPhaseIndex ? 'completed' : ''}`}
                  aria-label={`Navigate to ${p.label} phase`}
                >
                  <div className="journey-step-dot">
                    {i < currentPhaseIndex ? '✓' : p.num}
                  </div>
                  <span className="journey-step-label">{p.icon} {p.label}</span>
                  {i < PHASES.length - 1 && (
                    <div className={`journey-connector ${i < currentPhaseIndex ? 'filled' : ''}`} />
                  )}
                </button>
              ))}
            </div>

            {/* Audio toggle beside nav bar */}
            <button
              onClick={() => {
                setAudioEnabled(a => {
                  if (a) stopNarration();
                  return !a;
                });
              }}
              className="audio-toggle-btn beside-nav"
              aria-label="Toggle audio"
            >
              {audioEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        )}

        {/* Home button */}
        {phase !== 'intro' && phase !== 'summary' && (
          <button className="home-btn" onClick={goHome} aria-label="Go home">🏠 Home</button>
        )}

        {/* Phases */}
        {phase === 'intro' && (
          <IntroScreen
            onStart={() => setPhase('wonder')}
            onSelectPhase={(targetPhase) => setPhase(targetPhase)}
            audioEnabled={audioEnabled}
            learnDone={learnDone}
          />
        )}
        {phase === 'wonder' && (
          <WonderPhase onComplete={handleWonderComplete} audioEnabled={audioEnabled} />
        )}
        {phase === 'story' && (
          <StoryPhase onComplete={handleStoryComplete} audioEnabled={audioEnabled} />
        )}
        {phase === 'stations' && (
          <StationsPhase onComplete={handleStationsComplete} audioEnabled={audioEnabled} />
        )}
        {phase === 'practice' && (
          <PracticeMode onComplete={handlePracticeComplete} audioEnabled={audioEnabled} />
        )}
        {phase === 'reflect' && (
          <ReflectCheck onComplete={handleReflectComplete} audioEnabled={audioEnabled} />
        )}
        {phase === 'summary' && (
          <SummaryScreen stats={practiceStats} onRestart={handleRestart} onGoHome={goHome} audioEnabled={audioEnabled} />
        )}
      </div>
    </>
  );
}

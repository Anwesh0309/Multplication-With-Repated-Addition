// QuestionCard — renders any of the 6 question types for the practice mode.
import { useState, useCallback } from 'react';
import GroupSimulationCanvas from './GroupSimulationCanvas';

function Visual({ question }) {
  const { type, groupSize, groupCount, sceneEmoji } = question;

  if (type === 'groupsToAddition' || type === 'multiplicationToTotal' || type === 'matchPicture') {
    return (
      <div style={{ margin: '12px 0' }}>
        <GroupSimulationCanvas
          groupSize={groupSize} groupCount={groupCount}
          mode="display" revealAdditionSentence={false} revealMultiplicationSentence={false}
          theme="counters"
        />
      </div>
    );
  }

  if (type === 'additionToMultiplication' || type === 'multiplicationToAddition') {
    return (
      <div className={type === 'additionToMultiplication' ? 'addition-display-box' : 'mult-display-box'}
        style={{ margin: '16px auto' }}>
        {question.displayText}
      </div>
    );
  }

  if (type === 'wordProblem') {
    return (
      <div>
        {question.sceneEmoji && <span className="sg-scene-emoji">{question.sceneEmoji}</span>}
        <div className="word-problem-box">{question.displayText}</div>
      </div>
    );
  }

  return null;
}

export default function QuestionCard({ question, onAnswer, disabled }) {
  const [selected, setSelected] = useState(null);

  const handleClick = useCallback((opt) => {
    if (disabled) return;
    setSelected(opt);
    const isCorrect = String(opt) === String(question.correctAnswer);
    setTimeout(() => { onAnswer(isCorrect); setSelected(null); }, 650);
  }, [disabled, question.correctAnswer, onAnswer]);

  const TYPE_LABELS = {
    groupsToAddition:         '➕ REPEATED ADDITION',
    additionToMultiplication: '✕ MULTIPLICATION',
    multiplicationToTotal:    '🔢 FIND THE TOTAL',
    multiplicationToAddition: '➕ REPEATED ADDITION',
    wordProblem:              '🏪 WORD PROBLEM',
    matchPicture:             '✕ MATCH THE SENTENCE',
  };

  const TYPE_COLORS = {
    groupsToAddition:         'var(--gold)',
    additionToMultiplication: 'var(--teal)',
    multiplicationToTotal:    'var(--coral)',
    multiplicationToAddition: 'var(--gold)',
    wordProblem:              'var(--orange)',
    matchPicture:             'var(--teal)',
  };

  return (
    <div>
      <div style={{
        display: 'inline-block', background: TYPE_COLORS[question.type],
        color: 'white', padding: '5px 14px', borderRadius: '14px',
        fontSize: '0.85rem', fontWeight: 800, marginBottom: 14, letterSpacing: '0.5px',
      }}>
        {TYPE_LABELS[question.type] || '✕ MULTIPLICATION'}
      </div>

      <Visual question={question} />

      <div className="options-grid" style={{ marginTop: 16 }}>
        {question.options && question.options.map((opt, i) => {
          let cls = 'option-btn';
          if (disabled) cls += ' disabled';
          if (selected === opt) cls += String(opt) === String(question.correctAnswer) ? ' correct' : ' wrong';
          else if (disabled && String(opt) === String(question.correctAnswer)) cls += ' correct';
          return (
            <button key={i} className={cls} onClick={() => handleClick(opt)}
              style={{ fontSize: question.type === 'additionToMultiplication' || question.type === 'multiplicationToAddition' ? '1rem' : '1.4rem' }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// GroupSimulationCanvas — the visual centrepiece for the multiplication module.
// Renders equal groups of themed objects; supports build, display, and interactive modes.

import { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';

const THEMES = {
  baskets:  { obj: '🧺', label: 'baskets' },
  plates:   { obj: '🍽️', label: 'plates' },
  counters: { obj: '🔵', label: 'counters' },
  apples:   { obj: '🍎', label: 'apples' },
  stars:    { obj: '⭐', label: 'stars' },
  'sg-scene': { obj: '🥟', label: 'items' },
};

function buildAdditionStr(groupSize, groupCount) {
  if (groupCount === 0) return '...';
  return Array(groupCount).fill(groupSize).join(' + ') + ' = ' + groupSize * groupCount;
}

function buildMultStr(groupSize, groupCount) {
  return `${groupSize} × ${groupCount} = ${groupSize * groupCount}`;
}

export default function GroupSimulationCanvas({
  groupSize = 3,
  groupCount = 3,
  mode = 'display',             // 'display' | 'build' | 'interactive'
  revealAdditionSentence = true,
  revealMultiplicationSentence = false,
  showSkipCount = false,
  onGroupAdded = null,
  theme = 'counters',
  sceneEmoji = null,            // override per word-problem
  maxGroups = null,             // cap for build mode
}) {
  const [builtCount, setBuiltCount] = useState(mode === 'display' ? groupCount : 0);
  const t = THEMES[theme] || THEMES.counters;
  const emoji = sceneEmoji || t.obj;
  const cap = maxGroups || groupCount;

  // Reset when props change
  useEffect(() => {
    if (mode === 'display') setBuiltCount(groupCount);
    else setBuiltCount(0);
  }, [groupSize, groupCount, mode]);

  const addGroup = () => {
    if (builtCount >= cap) return;
    sounds.pop();
    const next = builtCount + 1;
    setBuiltCount(next);
    onGroupAdded?.(next);
  };

  const displayCount = mode === 'display' ? groupCount : builtCount;
  const skipCounts = Array.from({ length: displayCount }, (_, i) => groupSize * (i + 1));

  return (
    <div className="group-simulation">
      {/* Groups */}
      <div className="groups-row">
        {Array.from({ length: displayCount }, (_, gi) => (
          <div key={gi} className={`group-container ${mode === 'display' ? 'display' : ''}`}>
            <div className="group-objects">
              {Array.from({ length: groupSize }, (_, oi) => (
                <span key={oi} className="group-object"
                  style={{ animationDelay: `${oi * 0.05}s` }}>{emoji}</span>
              ))}
            </div>
            <div className="group-label">Group {gi + 1}</div>
          </div>
        ))}

        {/* Add-group button for build/interactive mode */}
        {(mode === 'build' || mode === 'interactive') && builtCount < cap && (
          <button className="group-add-btn" onClick={addGroup} aria-label="Add a group">
            ＋
          </button>
        )}
      </div>

      {/* Skip-count overlay */}
      {showSkipCount && displayCount > 0 && (
        <div className="skip-count-row">
          {skipCounts.map((v, i) => (
            <span key={i} className="skip-count-chip" style={{ animationDelay: `${i * 0.1}s` }}>
              {v}
            </span>
          ))}
        </div>
      )}

      {/* Addition sentence */}
      {revealAdditionSentence && displayCount > 0 && (
        <div className="addition-sentence">
          {buildAdditionStr(groupSize, displayCount)}
        </div>
      )}

      {/* Multiplication sentence */}
      {revealMultiplicationSentence && displayCount === groupCount && (
        <div className="multiplication-sentence">
          {buildMultStr(groupSize, groupCount)}
        </div>
      )}
    </div>
  );
}

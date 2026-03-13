import { useState } from 'react';
import { strumPatterns, difficultyLevels } from '../../data/strumPatterns';
import StrumPattern from '../../components/StrumPattern/StrumPattern';
import './Strumming.css';

export default function Strumming() {
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = activeDifficulty === 'all'
    ? strumPatterns
    : strumPatterns.filter((p) => p.difficulty === activeDifficulty);

  return (
    <div className="page fade-in">
      <h1 className="page__title">דפוסי פריטה</h1>
      <p className="page__subtitle">למדו דפוסי פריטה שונים — מבסיסיים ועד מתקדמים</p>

      <div className="strumming__filters">
        {difficultyLevels.map((level) => (
          <button
            key={level.id}
            className={`chip ${activeDifficulty === level.id ? 'chip--active' : ''}`}
            onClick={() => setActiveDifficulty(level.id)}
          >
            {level.label}
          </button>
        ))}
      </div>

      <div className="strumming__list">
        {filtered.map((sp) => {
          const isExpanded = expandedId === sp.id;
          return (
            <div key={sp.id} className={`card strumming__card ${isExpanded ? 'strumming__card--expanded' : ''}`}>
              <div className="strumming__card-header" onClick={() => setExpandedId(isExpanded ? null : sp.id)}>
                <div className="strumming__card-title-wrap">
                  <h2 className="strumming__card-title">{sp.name}</h2>
                  <span className="strumming__card-en">{sp.nameEn}</span>
                </div>
                <div className="strumming__card-meta">
                  <span className={`strumming__difficulty strumming__difficulty--${sp.difficulty}`}>
                    {sp.difficultyHe}
                  </span>
                  <span className="strumming__card-bpm">{sp.defaultBpm} BPM</span>
                </div>
                <span className={`theory__card-chevron ${isExpanded ? 'theory__card-chevron--open' : ''}`}>
                  ◀
                </span>
              </div>

              {isExpanded && (
                <div className="strumming__card-body fade-in">
                  <p className="strumming__desc">{sp.description}</p>

                  <StrumPattern
                    pattern={sp.pattern}
                    defaultBpm={sp.defaultBpm}
                    beatsPerMeasure={sp.beatsPerMeasure ?? 4}
                  />

                  <div className="strumming__tip">
                    <span className="strumming__tip-icon">💡</span>
                    <p>{sp.tip}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

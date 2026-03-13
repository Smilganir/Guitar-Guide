import { useState } from 'react';
import { theoryTopics } from '../../data/theory';
import { chords } from '../../data/chords';
import ChordDiagram from '../../components/ChordDiagram/ChordDiagram';
import './Theory.css';

export default function Theory() {
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => setExpandedId(expandedId === id ? null : id);

  return (
    <div className="page fade-in">
      <h1 className="page__title">תיאוריה מוזיקלית</h1>
      <p className="page__subtitle">הבינו איך אקורדים בנויים ומה ההבדל ביניהם</p>

      <div className="theory__topics">
        {theoryTopics.map((topic) => {
          const isExpanded = expandedId === topic.id;
          const exampleChords = topic.examples
            .map((name) => chords.find((c) => c.id === name))
            .filter(Boolean);

          return (
            <div
              key={topic.id}
              className={`card theory__card ${isExpanded ? 'theory__card--expanded' : ''}`}
              style={{ '--topic-color': topic.color }}
            >
              <div className="theory__card-header" onClick={() => toggle(topic.id)}>
                <div className="theory__card-icon-wrap">
                  <span className="theory__card-icon">{topic.icon}</span>
                </div>
                <div className="theory__card-header-text">
                  <h2 className="theory__card-title">{topic.title}</h2>
                  <p className="theory__card-summary">{topic.summary}</p>
                </div>
                <span className={`theory__card-chevron ${isExpanded ? 'theory__card-chevron--open' : ''}`}>
                  ◀
                </span>
              </div>

              {isExpanded && (
                <div className="theory__card-body fade-in">
                  <div className="theory__formula-box">
                    <div className="theory__formula-row">
                      <span className="theory__formula-label">נוסחה:</span>
                      <span>{topic.formula}</span>
                    </div>
                    <div className="theory__formula-row">
                      <span className="theory__formula-label">מרווחים:</span>
                      <span dir="ltr" className="theory__intervals">{topic.intervals}</span>
                    </div>
                    <div className="theory__formula-row">
                      <span className="theory__formula-label">חצאי טונים:</span>
                      <span dir="ltr" className="theory__intervals">{topic.semitones}</span>
                    </div>
                  </div>

                  <div className="theory__explanation">
                    {topic.explanation.split('\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  {exampleChords.length > 0 && (
                    <div className="theory__examples">
                      <h3>דוגמאות:</h3>
                      <div className="theory__examples-grid">
                        {exampleChords.map((chord) => (
                          <div key={chord.id} className="theory__example-chord">
                            <ChordDiagram chord={chord} size={0.9} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

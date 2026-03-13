import { useState } from 'react';
import { chords, chordTypes } from '../../data/chords';
import ChordDiagram from '../../components/ChordDiagram/ChordDiagram';
import LeftHandFingers from '../../components/LeftHandFingers/LeftHandFingers';
import { useChordSound } from '../../hooks/useChordSound';
import './Chords.css';

export default function Chords() {
  const [activeType, setActiveType] = useState('all');
  const [selectedChord, setSelectedChord] = useState(null);
  const { playChord } = useChordSound();

  const filtered =
    activeType === 'all'
      ? chords
      : activeType === 'barre'
        ? chords.filter((c) => c.barres?.length > 0)
        : chords.filter((c) => c.type === activeType);

  return (
    <div className="page fade-in">
      <div className="chords__header">
        <div>
          <h1 className="page__title">אקורדים</h1>
          <p className="page__subtitle">לחצו על אקורד כדי לראות אותו בגדול</p>
        </div>
        <LeftHandFingers />
      </div>

      <div className="chords__filters">
        {chordTypes.map((type) => (
          <button
            key={type.id}
            className={`chip ${activeType === type.id ? 'chip--active' : ''}`}
            onClick={() => setActiveType(type.id)}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="grid chords__grid">
        {filtered.map((chord) => (
          <div
            key={chord.id}
            className={`card chords__card ${selectedChord?.id === chord.id ? 'chords__card--selected' : ''}`}
            onClick={() => {
              const next = selectedChord?.id === chord.id ? null : chord;
              setSelectedChord(next);
              if (next) playChord(next);
            }}
          >
            <ChordDiagram chord={chord} coloredFingers />
            <div className="chords__card-info">
              <span className="chords__card-type">{chord.typeHe}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedChord && (
        <div className="chords__modal-overlay" onClick={() => setSelectedChord(null)}>
          <div className="chords__modal card" onClick={(e) => e.stopPropagation()}>
            <button className="chords__modal-close" onClick={() => setSelectedChord(null)}>✕</button>

            <ChordDiagram chord={selectedChord} size={2} coloredFingers showNotes />

            <button
              type="button"
              className="chords__modal-play"
              onClick={(e) => { e.stopPropagation(); playChord(selectedChord); }}
            >
              ▶ השמע אקורד
            </button>

            <h2 className="chords__modal-name">{selectedChord.name}</h2>
            <p className="chords__modal-he">{selectedChord.nameHe}</p>
            <div className="chords__modal-type">
              <span className="chip chip--active">{selectedChord.typeHe}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { songs } from '../../data/songs';
import { strumPatterns } from '../../data/strumPatterns';
import ChordDiagram from '../../components/ChordDiagram/ChordDiagram';
import '../../components/StrumPattern/StrumPattern.css';
import { useChordSound } from '../../hooks/useChordSound';
import { useSongPlayer } from '../../hooks/useSongPlayer';
import './Songs.css';

export default function Songs() {
  const [selectedSong, setSelectedSong] = useState(null);
  const { playChord } = useChordSound();
  const player = useSongPlayer(selectedSong, playChord);

  const patternDef = selectedSong
    ? strumPatterns.find((p) => p.id === selectedSong.patternId)
    : null;

  return (
    <div className="page fade-in page-songs">
      <h1 className="page__title">נגן שירים</h1>
      <p className="page__subtitle">בחרו שיר ונגנו יחד — אקורדים, דפוס פריטה ומטרונום מסונכרנים</p>

      <div className="songs__grid">
        {songs.map((song) => {
          const cardPattern = strumPatterns.find((p) => p.id === song.patternId);
          return (
            <button
              key={song.id}
              type="button"
              className={`card songs__card ${selectedSong?.id === song.id ? 'songs__card--selected' : ''}`}
              onClick={() => setSelectedSong(selectedSong?.id === song.id ? null : song)}
            >
              <span className="songs__card-title">{song.titleHe}</span>
              <span className="songs__card-artist">{song.artist}</span>
              <span className="songs__card-progression" dir="ltr">
                {song.progression.join(' → ')}
              </span>
              <span className="songs__card-meta">
                {song.bpm} BPM
                {cardPattern && (
                  <span className="songs__card-pattern"> · {cardPattern.name}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {selectedSong && (
        <div className="songs__player card">
          <div className="songs__player-header">
            <h2 className="songs__player-title">{selectedSong.titleHe}</h2>
            <p className="songs__player-subtitle">
              {selectedSong.titleEn !== selectedSong.titleHe && `${selectedSong.titleEn} · `}
              {selectedSong.artist}
            </p>
          </div>

          <div className="songs__player-progression-wrap">
            <p className="songs__player-progression-label">הרצף</p>
            <div className="songs__player-progression" dir="ltr">
              {selectedSong.progression.map((id, i) => (
                <span key={`${id}-${i}`}>
                  <span
                    className={`songs__player-chord-name ${player.chordIndex === i && player.phase === 'playing' ? 'songs__player-chord-name--active' : ''}`}
                  >
                    {id}
                  </span>
                  {i < selectedSong.progression.length - 1 && (
                    <span className="songs__player-progression-arrow" aria-hidden> → </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="songs__player-diagrams">
            {player.chordObjects.map((chord, i) => (
              <div
                key={`${chord.id}-${i}`}
                className={`songs__player-diagram-wrap ${player.chordIndex === i && player.phase === 'playing' ? 'songs__player-diagram-wrap--active' : ''}`}
              >
                <ChordDiagram chord={chord} size={0.85} coloredFingers />
              </div>
            ))}
          </div>

          {patternDef && (
            <div className="songs__player-strum">
              <p className="songs__player-strum-label">{patternDef.name}</p>
              <div className="songs__player-strum-arrows">
                {patternDef.pattern.map((item, i) => (
                  <div
                    key={i}
                    className={`strum-arrow strum-arrow--${item.type} ${item.isGhost ? 'strum-arrow--ghost' : ''} ${player.strumIndex === i && player.phase === 'playing' ? 'strum-arrow--active' : ''}`}
                  >
                    <span className="strum-arrow__icon">
                      {item.type === 'D' ? '↓' : item.type === 'U' ? '↑' : '•'}
                    </span>
                    <span className="strum-arrow__label">
                      {item.isGhost ? 'רוח' : item.type === 'D' ? 'למטה' : item.type === 'U' ? 'למעלה' : 'דלג'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {player.phase === 'countin' && (
            <div className="songs__player-countin">
              <span className="songs__player-countin-num">{player.countInBeat + 1}</span>
              <span className="songs__player-countin-text">הכנה...</span>
            </div>
          )}

          <div className="songs__player-controls">
            <div className="songs__player-bpm">
              <label className="songs__player-bpm-label">BPM</label>
              <input
                type="range"
                min="-20"
                max="20"
                step="1"
                value={player.bpmOffset}
                onChange={(e) => player.setBpmOffset(Number(e.target.value))}
                disabled={player.phase === 'playing' || player.phase === 'countin'}
                className="songs__player-bpm-slider"
              />
              <span className="songs__player-bpm-value">
                {player.effectiveBpm != null ? player.effectiveBpm : selectedSong.bpm} BPM
              </span>
            </div>

            <label className="songs__player-loop">
              <input
                type="checkbox"
                checked={player.loop}
                onChange={(e) => player.setLoop(e.target.checked)}
                disabled={player.phase === 'playing' || player.phase === 'countin'}
              />
              <span>לופ</span>
            </label>

            <button
              type="button"
              className={`songs__player-btn ${player.phase === 'playing' || player.phase === 'countin' ? 'songs__player-btn--stop' : ''}`}
              onClick={() => (player.phase === 'playing' || player.phase === 'countin' ? player.stop() : player.start())}
            >
              {player.phase === 'countin' ? 'מתחיל...' : player.phase === 'playing' ? '⏹ עצור' : '▶ הפעל'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { chords } from '../../data/chords';
import ChordDiagram from '../../components/ChordDiagram/ChordDiagram';
import Metronome from '../../components/Metronome/Metronome';
import { useLocale } from '../../contexts/LocaleContext';
import './Practice.css';

function getRandomChord(exclude = null) {
  const pool = exclude ? chords.filter((c) => c.id !== exclude.id) : chords;
  return pool[Math.floor(Math.random() * pool.length)];
}

function PracticeTimer() {
  const { t } = useLocale();
  const [duration, setDuration] = useState(5);
  const [remaining, setRemaining] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = () => {
    setRemaining(duration * 60);
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setRemaining(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!isRunning || remaining === null) return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (secs) => {
    if (secs === null) return '--:--';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="practice__timer card">
      <h2>{t('practice.timer')}</h2>
      {!isRunning && remaining === null && (
        <div className="practice__timer-setup">
          <p>{t('practice.howManyMins')}</p>
          <div className="practice__timer-buttons">
            {[3, 5, 10, 15].map((mins) => (
              <button
                key={mins}
                className={`chip ${duration === mins ? 'chip--active' : ''}`}
                onClick={() => setDuration(mins)}
              >
                {mins} {t('practice.mins')}
              </button>
            ))}
          </div>
          <button className="practice__start-btn" onClick={startTimer}>
            {t('practice.startPractice')}
          </button>
        </div>
      )}
      {(isRunning || remaining !== null) && (
        <div className="practice__timer-running">
          <div className={`practice__timer-display ${remaining === 0 ? 'practice__timer-display--done' : ''}`}>
            {formatTime(remaining)}
          </div>
          {remaining === 0 ? (
            <div className="practice__timer-done">
              <p>{t('practice.done')}</p>
              <button className="practice__start-btn" onClick={stopTimer}>{t('practice.again')}</button>
            </div>
          ) : (
            <button className="practice__stop-btn" onClick={stopTimer}>⏹ {t('songs.stop')}</button>
          )}
        </div>
      )}
    </div>
  );
}

function ChordDrill() {
  const { t } = useLocale();
  const [chord1, setChord1] = useState(() => getRandomChord());
  const [chord2, setChord2] = useState(() => getRandomChord(chord1));
  const [practiced, setPracticed] = useState(() => JSON.parse(localStorage.getItem('practiced') || '[]'));

  const newDrill = useCallback(() => {
    const c1 = getRandomChord();
    setChord1(c1);
    setChord2(getRandomChord(c1));
  }, []);

  const markPracticed = useCallback((chordId) => {
    setPracticed((prev) => {
      const updated = prev.includes(chordId) ? prev : [...prev, chordId];
      localStorage.setItem('practiced', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <div className="practice__drill card">
      <h2>🔄 {t('practice.chordTransition')}</h2>
      <p className="practice__drill-desc">{t('practice.chordTransitionDesc')}</p>

      <div className="practice__drill-chords">
        <div className="practice__drill-chord">
          <ChordDiagram chord={chord1} size={1.3} />
          <button
            className={`practice__practiced-btn ${practiced.includes(chord1.id) ? 'practice__practiced-btn--done' : ''}`}
            onClick={() => markPracticed(chord1.id)}
          >
            {practiced.includes(chord1.id) ? t('practice.practiced') : t('practice.markPracticed')}
          </button>
        </div>
        <div className="practice__drill-arrow">⟷</div>
        <div className="practice__drill-chord">
          <ChordDiagram chord={chord2} size={1.3} />
          <button
            className={`practice__practiced-btn ${practiced.includes(chord2.id) ? 'practice__practiced-btn--done' : ''}`}
            onClick={() => markPracticed(chord2.id)}
          >
            {practiced.includes(chord2.id) ? t('practice.practiced') : t('practice.markPracticed')}
          </button>
        </div>
      </div>

      <button className="practice__new-drill-btn" onClick={newDrill}>
        {t('practice.newChords')}
      </button>
    </div>
  );
}

function ProgressTracker() {
  const { t } = useLocale();
  const practiced = JSON.parse(localStorage.getItem('practiced') || '[]');

  const clearProgress = () => {
    localStorage.removeItem('practiced');
    window.location.reload();
  };

  return (
    <div className="practice__progress card">
      <h2>{t('practice.progress')}</h2>
      <p>{t('practice.practicedOf', { n: practiced.length, total: chords.length })}</p>
      <div className="practice__progress-bar">
        <div
          className="practice__progress-fill"
          style={{ width: `${(practiced.length / chords.length) * 100}%` }}
        />
      </div>
      <div className="practice__progress-chords">
        {chords.map((chord) => (
          <span
            key={chord.id}
            className={`practice__progress-chip ${practiced.includes(chord.id) ? 'practice__progress-chip--done' : ''}`}
          >
            {chord.name}
          </span>
        ))}
      </div>
      {practiced.length > 0 && (
        <button className="practice__clear-btn" onClick={clearProgress}>
          {t('practice.clearProgress')}
        </button>
      )}
    </div>
  );
}

export default function Practice() {
  const { t } = useLocale();
  return (
    <div className="page fade-in">
      <h1 className="page__title">{t('practice.title')}</h1>
      <p className="page__subtitle">{t('practice.subtitle')}</p>

      <div className="practice__layout">
        <PracticeTimer />
        <div className="practice__metronome-section card">
          <h2>{t('practice.metronome')}</h2>
          <Metronome defaultBpm={80} />
        </div>
        <ChordDrill />
        <ProgressTracker />
      </div>
    </div>
  );
}

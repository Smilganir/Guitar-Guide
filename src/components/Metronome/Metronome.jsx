import useMetronome from './useMetronome';
import { useLocale } from '../../contexts/LocaleContext';
import './Metronome.css';

export default function Metronome({ defaultBpm = 80, compact = false }) {
  const { t } = useLocale();
  const { bpm, setBpm, isPlaying, currentBeat, toggle } = useMetronome(defaultBpm);

  return (
    <div className={`metronome ${compact ? 'metronome--compact' : ''}`}>
      <div className="metronome__display">
        <span className="metronome__bpm-value">{bpm}</span>
        <span className="metronome__bpm-label">BPM</span>
      </div>
      <input
        type="range"
        min="40"
        max="200"
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
        className="metronome__slider"
      />
      <button
        onClick={() => toggle(4)}
        className={`metronome__btn ${isPlaying ? 'metronome__btn--playing' : ''}`}
      >
        {isPlaying ? `⏹ ${t('songs.stop')}` : `▶ ${t('songs.play')}`}
      </button>
      {isPlaying && (
        <div className="metronome__beats">
          {[0, 1, 2, 3].map((beat) => (
            <span
              key={beat}
              className={`metronome__beat-dot ${currentBeat === beat ? 'metronome__beat-dot--active' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

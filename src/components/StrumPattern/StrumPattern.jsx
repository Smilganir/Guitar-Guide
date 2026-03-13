import { useState, useEffect, useRef, useCallback } from 'react';
import './StrumPattern.css';

export default function StrumPattern({ pattern, defaultBpm = 80, beatsPerMeasure = 4 }) {
  const [bpm, setBpm] = useState(defaultBpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const timeoutsRef = useRef([]);
  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);

  const hasGhost = pattern.some((p) => p.isGhost);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const playStrum = useCallback((type) => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'D') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(220, now);
      osc1.frequency.exponentialRampToValueAtTime(160, now + 0.08);
      osc2.type = 'sine';
      osc2.frequency.value = 330;
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.12);
      osc2.stop(now + 0.12);
    } else if (type === 'U') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.exponentialRampToValueAtTime(520, now + 0.06);
      osc2.type = 'triangle';
      osc2.frequency.value = 660;
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.08);
      osc2.stop(now + 0.08);
    }
  }, [getAudioContext]);

  const start = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (intervalRef.current) clearInterval(intervalRef.current);

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const beatMs = (60 / bpm) * 1000;
    const measureMs = beatMs * beatsPerMeasure;
    const baseBeat = pattern[0]?.beat ?? 1;

    const scheduleMeasure = (measureStartMs) => {
      pattern.forEach((item, i) => {
        const delayMs = (item.beat - baseBeat) * beatMs + measureStartMs;
        const t = setTimeout(() => {
          setActiveIndex(i);
          if (!item.isGhost && item.type !== 'x') playStrum(item.type);
        }, delayMs);
        timeoutsRef.current.push(t);
      });
    };

    scheduleMeasure(0);
    let measureStart = measureMs;
    intervalRef.current = setInterval(() => {
      scheduleMeasure(measureStart);
      measureStart += measureMs;
    }, measureMs);
    setIsPlaying(true);
  }, [bpm, pattern, beatsPerMeasure, playStrum, getAudioContext]);

  const stop = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setActiveIndex(-1);
  }, []);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      stop();
      start();
    }
  }, [bpm]);

  const getArrowLabel = (item) => {
    if (item.type === 'D') return 'למטה';
    if (item.type === 'U') return 'למעלה';
    return 'דלג';
  };

  const getArrowIcon = (item) => {
    if (item.type === 'D') return '↓';
    if (item.type === 'U') return '↑';
    return '•';
  };

  return (
    <div className="strum-pattern">
      {hasGhost && (
        <p className="strum-pattern__ghost-legend">
          <span className="strum-pattern__ghost-icon" aria-hidden>◇</span>
          חץ מקווקו = פריטת רוח (Ghost Strum) — תנועת יד בלי לגעת במיתרים
        </p>
      )}
      <div className="strum-pattern__arrows">
        {pattern.map((item, i) => (
          <div
            key={i}
            className={`strum-arrow ${activeIndex === i ? 'strum-arrow--active' : ''} strum-arrow--${item.type} ${item.isGhost ? 'strum-arrow--ghost' : ''}`}
          >
            <span className="strum-arrow__icon">
              {getArrowIcon(item)}
            </span>
            <span className="strum-arrow__label">
              {item.isGhost ? 'רוח' : getArrowLabel(item)}
            </span>
          </div>
        ))}
      </div>

      <div className="strum-pattern__controls">
        <div className="strum-pattern__bpm">
          <span className="strum-pattern__bpm-value">{bpm}</span>
          <span className="strum-pattern__bpm-label">BPM</span>
        </div>
        <input
          type="range"
          min="40"
          max="180"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="strum-pattern__slider"
        />
        <button
          onClick={() => (isPlaying ? stop() : start())}
          className={`strum-pattern__btn ${isPlaying ? 'strum-pattern__btn--playing' : ''}`}
        >
          {isPlaying ? '⏹ עצור' : '▶ הפעל'}
        </button>
      </div>
    </div>
  );
}

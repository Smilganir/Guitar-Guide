import { useState, useEffect, useRef, useCallback } from 'react';
import './StrumPattern.css';

export default function StrumPattern({ pattern, defaultBpm = 80 }) {
  const [bpm, setBpm] = useState(defaultBpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const intervalRef = useRef(null);
  const indexRef = useRef(0);
  const audioCtxRef = useRef(null);

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
      // Down strum: lower pitch, fuller sound with two layered oscillators
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
    } else {
      // Up strum: higher pitch, brighter and shorter
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
    if (intervalRef.current) clearInterval(intervalRef.current);
    indexRef.current = 0;
    setActiveIndex(0);
    setIsPlaying(true);
    playStrum(pattern[0].type);

    const halfBeatMs = (60 / bpm) * 1000 / 2;
    intervalRef.current = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % pattern.length;
      setActiveIndex(indexRef.current);
      const strumType = pattern[indexRef.current].type;
      if (strumType !== 'x') playStrum(strumType);
    }, halfBeatMs);
  }, [bpm, pattern, playStrum]);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsPlaying(false);
    setActiveIndex(-1);
  }, []);

  useEffect(() => {
    return () => {
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

  return (
    <div className="strum-pattern">
      <div className="strum-pattern__arrows">
        {pattern.map((item, i) => (
          <div
            key={i}
            className={`strum-arrow ${activeIndex === i ? 'strum-arrow--active' : ''} strum-arrow--${item.type}`}
          >
            <span className="strum-arrow__icon">
              {item.type === 'D' ? '↓' : item.type === 'U' ? '↑' : '•'}
            </span>
            <span className="strum-arrow__label">
              {item.type === 'D' ? 'למטה' : item.type === 'U' ? 'למעלה' : 'דלג'}
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

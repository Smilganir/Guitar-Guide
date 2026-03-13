import { useRef, useState, useCallback, useEffect } from 'react';

export default function useMetronome(initialBpm = 80) {
  const [bpm, setBpm] = useState(initialBpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);
  const beatRef = useRef(0);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const playClick = useCallback((accent = false) => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = accent ? 1000 : 800;
    gain.gain.setValueAtTime(accent ? 0.3 : 0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  }, [getAudioContext]);

  const start = useCallback((beatsPerMeasure = 4) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    beatRef.current = 0;
    setIsPlaying(true);
    setCurrentBeat(0);
    playClick(true);

    const intervalMs = (60 / bpm) * 1000;
    intervalRef.current = setInterval(() => {
      beatRef.current = (beatRef.current + 1) % beatsPerMeasure;
      setCurrentBeat(beatRef.current);
      playClick(beatRef.current === 0);
    }, intervalMs);
  }, [bpm, playClick]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentBeat(-1);
  }, []);

  const toggle = useCallback((beatsPerMeasure = 4) => {
    if (isPlaying) stop();
    else start(beatsPerMeasure);
  }, [isPlaying, start, stop]);

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

  return { bpm, setBpm, isPlaying, currentBeat, start, stop, toggle };
}

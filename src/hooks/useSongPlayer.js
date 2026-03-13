import { useState, useRef, useCallback, useEffect } from 'react';
import { chords } from '../data/chords';
import { strumPatterns } from '../data/strumPatterns';

function getChordById(id) {
  return chords.find((c) => c.id === id) || null;
}

function playCountClick(accent = false) {
  const ctx = window.__songAudioContext || (window.__songAudioContext = new (window.AudioContext || window.webkitAudioContext)());
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = accent ? 1000 : 800;
  gain.gain.setValueAtTime(accent ? 0.35 : 0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.06);
}

export function useSongPlayer(song, playChord) {
  const [phase, setPhase] = useState('idle'); // 'idle' | 'countin' | 'playing'
  const [countInBeat, setCountInBeat] = useState(-1);
  const [chordIndex, setChordIndex] = useState(0);
  const [strumIndex, setStrumIndex] = useState(-1);
  const [loop, setLoop] = useState(false);
  const [bpmOffset, setBpmOffset] = useState(0); // -20 to +20 from song.bpm

  const startTimeRef = useRef(null);
  const tickRef = useRef(null);
  const countInTimeoutsRef = useRef([]);
  const lastChordIndexRef = useRef(-1);

  const pattern = song ? strumPatterns.find((p) => p.id === song.patternId)?.pattern || [] : [];
  const chordObjects = song ? song.progression.map((id) => getChordById(id)).filter(Boolean) : [];

  const stop = useCallback(() => {
    countInTimeoutsRef.current.forEach(clearTimeout);
    countInTimeoutsRef.current = [];
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
    setPhase('idle');
    setCountInBeat(-1);
    setChordIndex(0);
    setStrumIndex(-1);
    lastChordIndexRef.current = -1;
  }, []);

  const start = useCallback(() => {
    if (!song || !playChord) return;
    stop();

    const effectiveBpm = Math.max(40, Math.min(200, song.bpm + bpmOffset));
    const beatMs = 60000 / effectiveBpm;

    setPhase('countin');
    setCountInBeat(0);
    playCountClick(true);

    for (let b = 1; b < 4; b++) {
      const t = setTimeout(() => {
        setCountInBeat(b);
        playCountClick(b === 0);
      }, b * beatMs);
      countInTimeoutsRef.current.push(t);
    }

    const startPlayback = setTimeout(() => {
      countInTimeoutsRef.current = [];
      setPhase('playing');
      setCountInBeat(-1);
      startTimeRef.current = Date.now();
      lastChordIndexRef.current = -1;

      const chord0 = getChordById(song.progression[0]);
      if (chord0) playChord(chord0, { force: true });

      const barMs = beatMs * 4;
      const progressionBeats = song.progression.length * 4;

      tickRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        let playbackBeat = elapsed / beatMs;
        if (!loop && playbackBeat >= progressionBeats) {
          stop();
          return;
        }
        playbackBeat = playbackBeat % progressionBeats;
        const barIndex = Math.floor(playbackBeat / 4);
        const ci = barIndex % song.progression.length;
        const beatInBar = playbackBeat - barIndex * 4;
        const currentBeat1Based = beatInBar + 1;

        if (ci !== lastChordIndexRef.current) {
          lastChordIndexRef.current = ci;
          const chord = getChordById(song.progression[ci]);
          if (chord) playChord(chord, { force: true });
        }

        setChordIndex(ci);

        let si = -1;
        for (let i = pattern.length - 1; i >= 0; i--) {
          if (pattern[i].beat <= currentBeat1Based) {
            si = i;
            break;
          }
        }
        setStrumIndex(si);
      }, 50);
    }, 4 * beatMs);

    countInTimeoutsRef.current.push(startPlayback);
  }, [song, bpmOffset, loop, playChord, stop]);

  useEffect(() => {
    return () => {
      countInTimeoutsRef.current.forEach(clearTimeout);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  useEffect(() => {
    setBpmOffset(0);
  }, [song?.id]);

  const effectiveBpm = song ? Math.max(40, Math.min(200, song.bpm + bpmOffset)) : null;

  return {
    phase,
    countInBeat,
    chordIndex,
    strumIndex,
    loop,
    setLoop,
    bpmOffset,
    setBpmOffset,
    effectiveBpm,
    start,
    stop,
    pattern,
    chordObjects,
  };
}

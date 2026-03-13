import { useRef, useCallback } from 'react';
import { chordToNotes } from '../utils/noteUtils';

const STRUM_DELAY_MS = 38;
const BASE = import.meta.env.BASE_URL || '/';

const bufferCache = new Map();
let sharedContext = null;

function getContext() {
  if (!sharedContext) sharedContext = new (window.AudioContext || window.webkitAudioContext)();
  return sharedContext;
}

function playSynthNote(ctx, frequency, startTime, duration = 1.2) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'triangle';
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

async function loadSample(ctx, fileName) {
  const key = fileName;
  if (bufferCache.has(key)) return bufferCache.get(key);
  const url = `${BASE}audio/notes/${fileName}.ogg`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = await ctx.decodeAudioData(arrayBuffer);
    bufferCache.set(key, buffer);
    return buffer;
  } catch {
    return null;
  }
}

function playBuffer(ctx, buffer, startTime, gainValue = 0.5) {
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = buffer;
  src.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(gainValue, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2);
  src.start(startTime);
  src.stop(startTime + 2);
}

export function useChordSound() {
  const playingRef = useRef(false);

  const playChord = useCallback(async (chord, options = {}) => {
    if (!chord?.frets) return;
    if (!options.force && playingRef.current) return;
    playingRef.current = true;

    const ctx = getContext();
    if (ctx.state === 'suspended') await ctx.resume();

    const notes = chordToNotes(chord);
    const now = ctx.currentTime;

    // Load all samples in parallel, then schedule playback with strum delay
    const results = await Promise.all(
      notes.map(async (n) => ({ ...n, buffer: await loadSample(ctx, n.fileName) }))
    );

    results.forEach(({ buffer, frequency, delayMs }) => {
      const startTime = now + (delayMs / 1000);
      if (buffer) playBuffer(ctx, buffer, startTime);
      else playSynthNote(ctx, frequency, startTime);
    });

    setTimeout(() => { playingRef.current = false; }, 1200);
  }, []);

  return { playChord };
}

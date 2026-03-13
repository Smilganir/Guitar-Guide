import { useState, useRef, useCallback, useEffect } from 'react';
import { noteToFrequency } from '../utils/noteUtils';

const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const STRINGS = [
  { index: 0, note: 'E', octave: 2, label: '6' },
  { index: 1, note: 'A', octave: 2, label: '5' },
  { index: 2, note: 'D', octave: 3, label: '4' },
  { index: 3, note: 'G', octave: 3, label: '3' },
  { index: 4, note: 'B', octave: 3, label: '2' },
  { index: 5, note: 'E', octave: 4, label: '1' },
];

STRINGS.forEach(s => { s.freq = noteToFrequency(s.note, s.octave); });

function autoCorrelate(buf, sampleRate) {
  let rms = 0;
  for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / buf.length);
  if (rms < 0.02) return -1;

  let r1 = 0, r2 = buf.length - 1;
  const thresh = 0.2;
  for (let i = 0; i < buf.length / 2; i++) {
    if (Math.abs(buf[i]) < thresh) { r1 = i; break; }
  }
  for (let i = buf.length - 1; i >= buf.length / 2; i--) {
    if (Math.abs(buf[i]) < thresh) { r2 = i; break; }
  }
  const trimmed = buf.slice(r1, r2);
  const len = trimmed.length;

  const c = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    let sum = 0;
    for (let j = 0; j < len - i; j++) sum += trimmed[j] * trimmed[j + i];
    c[i] = sum;
  }

  let d1 = 0;
  while (c[d1] > c[d1 + 1]) { d1++; if (d1 >= len - 1) return -1; }

  let maxVal = -1, maxPos = -1;
  for (let i = d1; i < len; i++) {
    if (c[i] > maxVal) { maxVal = c[i]; maxPos = i; }
  }
  const t0 = maxPos;

  // Parabolic interpolation for sub-sample accuracy
  const prev = c[t0 - 1] || 0;
  const next = c[t0 + 1] || 0;
  const shift = (prev - next) / (2 * (prev - 2 * maxVal + next));
  return sampleRate / (t0 + (Number.isFinite(shift) ? shift : 0));
}

function freqToNoteData(freq) {
  if (freq <= 0) return null;
  const semitones = 12 * Math.log2(freq / 16.3516);
  const rounded = Math.round(semitones);
  const cents = (semitones - rounded) * 100;
  const noteIndex = ((rounded % 12) + 12) % 12;
  const octave = Math.floor(rounded / 12);
  const name = CHROMATIC[noteIndex];
  const targetFreq = 16.3516 * Math.pow(2, rounded / 12);

  let closestString = null;
  let minDist = Infinity;
  for (const s of STRINGS) {
    const dist = Math.abs(12 * Math.log2(freq / s.freq));
    if (dist < minDist) { minDist = dist; closestString = s; }
  }

  return { name, octave, cents, targetFreq, closestString, frequency: freq };
}

export function useTuner() {
  const [listening, setListening] = useState(false);
  const [detected, setDetected] = useState(null);
  const [refPlaying, setRefPlaying] = useState(null);
  const [micError, setMicError] = useState(null);

  const ctxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const refOscRef = useRef(null);
  const refGainRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const smoothFreqRef = useRef(0);
  const silenceCountRef = useRef(0);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return ctxRef.current;
  }, []);

  const startListening = useCallback(async () => {
    try {
      setMicError(null);
      const ctx = getCtx();
      if (ctx.state === 'suspended') await ctx.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      streamRef.current = stream;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 4096;
      source.connect(analyser);
      analyserRef.current = analyser;

      const buf = new Float32Array(analyser.fftSize);

      smoothFreqRef.current = 0;
      silenceCountRef.current = 0;
      lastUpdateRef.current = 0;

      const detect = (timestamp) => {
        if (timestamp - lastUpdateRef.current < 80) {
          rafRef.current = requestAnimationFrame(detect);
          return;
        }
        lastUpdateRef.current = timestamp;

        analyser.getFloatTimeDomainData(buf);
        const freq = autoCorrelate(buf, ctx.sampleRate);

        if (freq > 50 && freq < 1200) {
          silenceCountRef.current = 0;
          const prev = smoothFreqRef.current;
          smoothFreqRef.current = prev > 0 ? prev * 0.7 + freq * 0.3 : freq;
          setDetected(freqToNoteData(smoothFreqRef.current));
        } else {
          silenceCountRef.current++;
          if (silenceCountRef.current > 8) {
            smoothFreqRef.current = 0;
            setDetected(null);
          }
        }
        rafRef.current = requestAnimationFrame(detect);
      };
      rafRef.current = requestAnimationFrame(detect);
      setListening(true);
    } catch (err) {
      setMicError(err.name === 'NotAllowedError' ? 'denied' : 'error');
      setListening(false);
    }
  }, [getCtx]);

  const stopListening = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
    setListening(false);
    setDetected(null);
  }, []);

  const playReference = useCallback((stringObj) => {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    if (refOscRef.current) {
      refOscRef.current.stop();
      refOscRef.current.disconnect();
      refOscRef.current = null;
    }

    if (refPlaying?.index === stringObj.index) {
      setRefPlaying(null);
      return;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = stringObj.freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.18, ctx.currentTime + 2.8);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 3);
    osc.onended = () => {
      if (refOscRef.current === osc) {
        refOscRef.current = null;
        setRefPlaying(null);
      }
    };
    refOscRef.current = osc;
    refGainRef.current = gain;
    setRefPlaying(stringObj);
  }, [getCtx, refPlaying]);

  const stopReference = useCallback(() => {
    if (refOscRef.current) {
      refOscRef.current.stop();
      refOscRef.current.disconnect();
      refOscRef.current = null;
    }
    setRefPlaying(null);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (refOscRef.current) { refOscRef.current.stop(); refOscRef.current.disconnect(); }
    };
  }, []);

  return {
    STRINGS,
    listening,
    detected,
    refPlaying,
    micError,
    startListening,
    stopListening,
    playReference,
    stopReference,
  };
}

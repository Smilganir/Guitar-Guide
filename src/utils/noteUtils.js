// Standard tuning: E2 A2 D3 G3 B3 E4 (string index 0 = low E)
const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OPEN_INDICES = [4, 9, 2, 7, 11, 4]; // semitone index for open string (E=4, A=9, ...)

export function getNoteAtFret(stringIndex, fret) {
  if (fret < 0) return null;
  const noteIndex = (OPEN_INDICES[stringIndex] + fret) % 12;
  return CHROMATIC[noteIndex];
}

export function getNoteNameAndOctave(stringIndex, fret) {
  if (fret < 0) return null;
  const openMidi = [40, 45, 50, 55, 59, 64]; // E2=40, A2=45, D3=50, G3=55, B3=59, E4=64
  const midi = openMidi[stringIndex] + fret;
  const noteIndex = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  return { name: CHROMATIC[noteIndex], octave };
}

/** Note name like "C#" to safe filename (e.g. Cs) and octave for file: "Cs3.ogg" */
export function noteToFileName(name, octave) {
  const safe = name.replace('#', 's').replace('b', 'b');
  return `${safe}${octave}`;
}

/** Get frequency in Hz for a note name + octave (A4 = 440) */
export function noteToFrequency(name, octave) {
  const index = CHROMATIC.indexOf(name);
  if (index === -1) return 440;
  const A4 = 440;
  const semitonesFromA4 = (octave - 4) * 12 + (index - 9); // C=0, so A=9
  return A4 * Math.pow(2, semitonesFromA4 / 12);
}

/** For a chord, return list of { stringIndex, noteName, octave, delayMs } for playback */
export function chordToNotes(chord) {
  const openMidi = [40, 45, 50, 55, 59, 64];
  const result = [];
  for (let i = 0; i < 6; i++) {
    const fret = chord.frets[i];
    if (fret === -1) continue;
    const { name, octave } = getNoteNameAndOctave(i, fret);
    result.push({
      stringIndex: i,
      name,
      octave,
      fileName: noteToFileName(name, octave),
      frequency: noteToFrequency(name, octave),
      delayMs: i * 35, // strum low to high
    });
  }
  return result;
}

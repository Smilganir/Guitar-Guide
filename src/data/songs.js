// Song library for Interactive Song Player
// progression: chord IDs from chords.js (order = left to right: first → second → …)
// patternId: id from strumPatterns.js — 'island' | 'ballad' | 'ddu-udu' (Rock)
// Display progression with → (LTR) e.g. Gm → Bb → F → Cm

export const songs = [
  {
    id: 'kachi-lach-zman',
    titleHe: 'קחי לך זמן',
    titleEn: 'Kachi Lach Zman',
    artist: 'יציאת חירום',
    progression: ['Gm', 'Bb', 'F', 'Cm'],
    bpm: 82,
    patternId: 'island',
  },
  {
    id: 'yasmin',
    titleHe: 'יסמין',
    titleEn: 'Yasmin',
    artist: 'הפיל הכחול',
    progression: ['C', 'G', 'Am', 'F'],
    bpm: 88,
    patternId: 'ballad',
  },
  {
    id: 'zahav',
    titleHe: 'זהב',
    titleEn: 'Zahav',
    artist: 'סטטיק ובן אל',
    progression: ['C', 'Am', 'F', 'G', 'C'],
    bpm: 105,
    patternId: 'ddu-udu',
  },
  {
    id: 'dance-monkey',
    titleHe: 'Dance Monkey',
    titleEn: 'Dance Monkey',
    artist: 'Tones and I',
    progression: ['F#m', 'D', 'E', 'C#m'],
    bpm: 98,
    patternId: 'island',
  },
  {
    id: 'all-of-me',
    titleHe: 'All of Me',
    titleEn: 'All of Me',
    artist: 'John Legend',
    progression: ['Em', 'C', 'G', 'D'],
    bpm: 63,
    patternId: 'ballad',
  },
  {
    id: 'wonderwall',
    titleHe: 'Wonderwall',
    titleEn: 'Wonderwall',
    artist: 'Oasis',
    progression: ['Em', 'G', 'D', 'A'],
    bpm: 87,
    patternId: 'island',
  },
  {
    id: 'eicha',
    titleHe: 'אייכה',
    titleEn: 'Eicha',
    artist: 'שולי רנד',
    progression: ['Am', 'F', 'C', 'G'],
    bpm: 70,
    patternId: 'ballad',
  },
  {
    id: 'one-day',
    titleHe: 'One Day',
    titleEn: 'One Day',
    artist: 'Matisyahu',
    progression: ['C', 'G', 'Am', 'F'],
    bpm: 80,
    patternId: 'island',
  },
];

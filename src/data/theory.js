export const theoryTopics = [
  {
    id: 'major',
    title: 'אקורד מז\'ור (Major)',
    titleEn: 'Major Chord',
    summary: 'אקורד שמח ובהיר — הבסיס של רוב השירים',
    summaryEn: 'A bright, happy chord — the foundation of most songs',
    formula: 'שורש + טרצה גדולה + קווינטה טהורה',
    formulaEn: 'Root + Major 3rd + Perfect 5th',
    intervals: '1 — 3 — 5',
    semitones: '0 — 4 — 7',
    explanation: `אקורד מז'ור בנוי משלושה צלילים: השורש (הנוטה הראשית), טרצה גדולה (4 חצאי טונים מעל השורש), וקווינטה טהורה (7 חצאי טונים מעל השורש).

הצליל שלו נשמע "שמח" ו"בהיר". רוב השירים הפופולריים משתמשים באקורדים מז'וריים.

לדוגמה, באקורד C מז'ור יש את הנוטות: C, E, G.`,
    explanationEn: `A major chord is built from three notes: the root (the main note), a major third (4 semitones above the root), and a perfect fifth (7 semitones above the root).

It sounds "happy" and "bright". Most popular songs use major chords.

For example, a C major chord has the notes: C, E, G.`,
    examples: ['C', 'D', 'E', 'G', 'A'],
  },
  {
    id: 'minor',
    title: 'אקורד מינור (Minor)',
    titleEn: 'Minor Chord',
    icon: '🎶',
    color: '#85CDCA',
    summary: 'אקורד עצוב ורגשי — נותן עומק למוזיקה',
    summaryEn: 'A sad, emotional chord — adds depth to music',
    formula: 'שורש + טרצה קטנה + קווינטה טהורה',
    formulaEn: 'Root + Minor 3rd + Perfect 5th',
    intervals: '1 — ♭3 — 5',
    semitones: '0 — 3 — 7',
    explanation: `אקורד מינור דומה לאקורד מז'ור, אבל הטרצה (הנוטה האמצעית) יורדת בחצי טון. זה מה שהופך את הצליל מ"שמח" ל"עצוב".

ההבדל בין C מז'ור ל-Cm (דו מינור) הוא רק נוטה אחת: E יורדת ל-E♭.

אקורדים מינוריים נפוצים מאוד בבלדות, שירי רוק, ומוזיקה רגשית.`,
    explanationEn: `A minor chord is similar to major, but the third (the middle note) is lowered by a half step. That's what turns the sound from "happy" to "sad".

The difference between C major and Cm is just one note: E becomes E♭.

Minor chords are very common in ballads, rock, and emotional music.`,
    examples: ['Am', 'Dm', 'Em'],
  },
  {
    id: 'seventh',
    title: 'אקורד שביעית (7th)',
    titleEn: '7th Chord',
    icon: '7️⃣',
    color: '#D4A5A5',
    summary: 'אקורד עשיר ומתוחכם — מוסיף צבע וציפייה',
    summaryEn: 'A rich, sophisticated chord — adds color and anticipation',
    formula: 'שורש + טרצה + קווינטה + שביעית',
    formulaEn: 'Root + 3rd + 5th + 7th',
    intervals: '1 — 3 — 5 — ♭7',
    semitones: '0 — 4 — 7 — 10',
    explanation: `אקורד שביעית (דומיננטית) הוא אקורד מז'ור שמוסיפים לו נוטה רביעית — השביעית השטוחה (♭7). 

הוא יוצר תחושה של "ציפייה" או "מתח" שרוצה להתפתח לאקורד אחר. לכן הוא נקרא "דומיננטי" — הוא מוביל את האוזן לאקורד הבא.

לדוגמה, G7 מוביל בטבעיות לאקורד C.

יש גם סוגים נוספים:
• מז'ור שביעית (Maj7) — צליל חלומי ורך
• מינור שביעית (m7) — צליל ג'אזי ורגוע`,
    explanationEn: `A dominant 7th chord is a major chord with an added fourth note — the flat 7th (♭7).

It creates a feeling of "anticipation" or "tension" that wants to resolve to another chord. That's why it's called "dominant" — it leads the ear to the next chord.

For example, G7 naturally leads to C.

There are also other types:
• Major 7th (Maj7) — dreamy, soft sound
• Minor 7th (m7) — jazzy, relaxed sound`,
    examples: ['A7', 'B7', 'D7', 'E7', 'G7'],
  },
  {
    id: 'sus',
    title: 'אקורד סאס (Sus)',
    titleEn: 'Sus Chord',
    icon: '⏸️',
    color: '#C9B1FF',
    summary: 'אקורד "מושהה" — לא שמח ולא עצוב, אלא מרחף',
    summaryEn: 'A "suspended" chord — neither happy nor sad, but floating',
    formula: 'שורש + רביעית/שנייה + קווינטה',
    formulaEn: 'Root + 4th (or 2nd) + 5th',
    intervals: 'Sus4: 1 — 4 — 5  |  Sus2: 1 — 2 — 5',
    semitones: 'Sus4: 0 — 5 — 7  |  Sus2: 0 — 2 — 7',
    explanation: `"Sus" זה קיצור של "Suspended" — מושהה. באקורד הזה, הטרצה (הנוטה שקובעת אם זה מז'ור או מינור) מוחלפת בנוטה אחרת:

• Sus4 — הטרצה מוחלפת ברביעית (הנוטה הרביעית בסולם)
• Sus2 — הטרצה מוחלפת בשנייה (הנוטה השנייה בסולם)

בגלל שאין טרצה, האקורד לא נשמע "שמח" ולא "עצוב" — הוא נשמע "פתוח" ו"מרחף". הרבה פעמים הוא מתפתח חזרה לאקורד מז'ור או מינור.`,
    explanationEn: `"Sus" is short for "Suspended". In this chord, the third (which decides major or minor) is replaced by another note:

• Sus4 — the third is replaced by the fourth
• Sus2 — the third is replaced by the second

With no third, the chord doesn't sound "happy" or "sad" — it sounds "open" and "floating". It often resolves back to a major or minor chord.`,
    examples: ['Asus2', 'Asus4', 'Dsus2', 'Dsus4', 'Esus4'],
  },
  {
    id: 'dim',
    title: 'אקורד דימיניש (Dim) ואוגמנט (Aug)',
    titleEn: 'Diminished (Dim) & Augmented (Aug)',
    icon: '✨',
    color: '#FFB7B2',
    summary: 'אקורדים מיוחדים — מתח דרמטי וצליל חלומי',
    summaryEn: 'Special chords — dramatic tension and dreamy sound',
    formula: 'Dim: 1-♭3-♭5  |  Aug: 1-3-#5',
    formulaEn: 'Dim: Root + Minor 3rd + Diminished 5th  |  Aug: Root + Major 3rd + Augmented 5th',
    intervals: 'Dim: 1 — ♭3 — ♭5  |  Aug: 1 — 3 — #5',
    semitones: 'Dim: 0 — 3 — 6  |  Aug: 0 — 4 — 8',
    explanation: `אלה אקורדים מיוחדים שמשנים את הקווינטה:

דימיניש (Dim) — הקווינטה יורדת בחצי טון. הצליל נשמע "מתוח" ו"דרמטי", כמו במוזיקה של סרטי מתח. הוא גם מינורי (הטרצה קטנה).

אוגמנט (Aug) — הקווינטה עולה בחצי טון. הצליל נשמע "חלומי" ו"מסתורי". הוא מז'ורי (הטרצה גדולה), אבל עם טוויסט.

שני הסוגים פחות נפוצים מאקורדים רגילים, אבל מוסיפים צבע מיוחד למוזיקה.`,
    explanationEn: `These are special chords that change the fifth:

Diminished (Dim) — the fifth is lowered by a half step. The sound is "tense" and "dramatic", like in thriller movie music. It's also minor (the third is flat).

Augmented (Aug) — the fifth is raised by a half step. The sound is "dreamy" and "mysterious". It's major (the third is natural), but with a twist.

Both types are less common than regular chords, but add special color to music.`,
    examples: [],
  },
];

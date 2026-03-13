import './ChordDiagram.css';

const STRING_COUNT = 6;
const FRET_COUNT = 5;
const SVG_WIDTH = 120;
const SVG_HEIGHT = 160;
const PADDING_TOP = 36;
const PADDING_SIDE = 20;
const FRETBOARD_WIDTH = SVG_WIDTH - PADDING_SIDE * 2;
const FRETBOARD_HEIGHT = SVG_HEIGHT - PADDING_TOP - 16;
const STRING_SPACING = FRETBOARD_WIDTH / (STRING_COUNT - 1);
const FRET_SPACING = FRETBOARD_HEIGHT / FRET_COUNT;
const DOT_RADIUS = 7;

export default function ChordDiagram({ chord, size = 1 }) {
  const { name, frets, fingers, baseFret = 1, barres } = chord;

  const getX = (stringIndex) => PADDING_SIDE + stringIndex * STRING_SPACING;
  const getY = (fretIndex) => PADDING_TOP + fretIndex * FRET_SPACING;

  return (
    <div className="chord-diagram" style={{ transform: `scale(${size})` }}>
      <svg
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x={SVG_WIDTH / 2}
          y={14}
          textAnchor="middle"
          className="chord-name-label"
          fontSize="16"
          fontWeight="700"
        >
          {name}
        </text>

        {baseFret === 1 ? (
          <line
            x1={PADDING_SIDE}
            y1={PADDING_TOP}
            x2={SVG_WIDTH - PADDING_SIDE}
            y2={PADDING_TOP}
            stroke="var(--text-primary)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ) : (
          <text
            x={PADDING_SIDE - 14}
            y={PADDING_TOP + FRET_SPACING / 2 + 5}
            textAnchor="middle"
            fontSize="11"
            fill="var(--text-secondary)"
            fontWeight="600"
          >
            {baseFret}
          </text>
        )}

        {/* Fret lines */}
        {Array.from({ length: FRET_COUNT + 1 }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={PADDING_SIDE}
            y1={getY(i)}
            x2={SVG_WIDTH - PADDING_SIDE}
            y2={getY(i)}
            stroke="var(--fret-color)"
            strokeWidth={i === 0 && baseFret === 1 ? 0 : 1.5}
          />
        ))}

        {/* String lines */}
        {Array.from({ length: STRING_COUNT }).map((_, i) => (
          <line
            key={`string-${i}`}
            x1={getX(i)}
            y1={PADDING_TOP}
            x2={getX(i)}
            y2={getY(FRET_COUNT)}
            stroke="var(--string-color)"
            strokeWidth={1 + i * 0.2}
          />
        ))}

        {/* Barre chords */}
        {barres?.map((barre, idx) => {
          const displayFret = barre.fret - (baseFret - 1);
          const fromX = getX(STRING_COUNT - barre.fromString);
          const toX = getX(STRING_COUNT - barre.toString);
          const y = getY(displayFret) - FRET_SPACING / 2;
          return (
            <rect
              key={`barre-${idx}`}
              x={Math.min(fromX, toX) - DOT_RADIUS}
              y={y - DOT_RADIUS}
              width={Math.abs(toX - fromX) + DOT_RADIUS * 2}
              height={DOT_RADIUS * 2}
              rx={DOT_RADIUS}
              fill="var(--dot-color)"
            />
          );
        })}

        {/* Finger dots, open, and muted markers */}
        {frets.map((fret, i) => {
          const x = getX(i);
          if (fret === -1) {
            return (
              <text
                key={`m-${i}`}
                x={x}
                y={PADDING_TOP - 8}
                textAnchor="middle"
                fontSize="14"
                fill="var(--muted-color)"
                fontWeight="600"
              >
                ✕
              </text>
            );
          }
          if (fret === 0) {
            return (
              <circle
                key={`o-${i}`}
                cx={x}
                cy={PADDING_TOP - 12}
                r={5}
                fill="none"
                stroke="var(--open-color)"
                strokeWidth="1.5"
              />
            );
          }
          const displayFret = fret - (baseFret - 1);
          const y = getY(displayFret) - FRET_SPACING / 2;
          const hasBarre = barres?.some(
            (b) => b.fret === fret && i >= STRING_COUNT - b.fromString && i <= STRING_COUNT - b.toString
          );
          if (hasBarre) return null;

          return (
            <g key={`f-${i}`}>
              <circle
                cx={x}
                cy={y}
                r={DOT_RADIUS}
                fill="var(--dot-color)"
              />
              {fingers[i] > 0 && (
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="9"
                  fill="white"
                  fontWeight="600"
                >
                  {fingers[i]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

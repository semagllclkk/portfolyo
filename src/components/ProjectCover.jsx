// Fotoğrafı olmayan projeler için elle çizilmiş kapaklar

// MediaPipe el iskeleti: 21 nokta (bilek + 5 parmak x 4 eklem)
const HAND = [
  [100, 182],
  [72, 168], [52, 146], [40, 124], [30, 104],
  [78, 112], [72, 80], [69, 60], [67, 42],
  [98, 106], [98, 70], [98, 48], [98, 28],
  [117, 110], [122, 78], [125, 58], [127, 41],
  [134, 122], [144, 98], [150, 82], [155, 68],
]
const BONES = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [9, 10], [10, 11], [11, 12],
  [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17],
]

function HandCover() {
  return (
    <svg className="cover-hand" viewBox="0 0 320 210" role="img" aria-label="Hand landmarks">
      {/* hedef */}
      <g className="cover-target">
        <circle cx="238" cy="78" r="34" />
        <circle cx="238" cy="78" r="20" />
        <circle cx="238" cy="78" r="6" className="fill" />
      </g>
      {/* işaret parmağından hedefe atış çizgisi */}
      <line x1="67" y1="42" x2="204" y2="72" className="cover-aim" />
      {BONES.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={HAND[a][0]} y1={HAND[a][1]} x2={HAND[b][0]} y2={HAND[b][1]} className="cover-bone" />
      ))}
      {HAND.map(([x, y], i) => (
        <rect key={i} x={x - 3} y={y - 3} width="6" height="6" className={`cover-joint${i === 8 ? ' tip' : ''}`} />
      ))}
      <text x="18" y="24" className="cover-hud">hand_landmarks: 21</text>
      <text x="18" y="198" className="cover-hud">fps 60 · dt 16.6ms</text>
    </svg>
  )
}

function LogsCover() {
  return (
    <pre className="cover-logs" aria-label="Log masking example">
      <span className="dim"># in</span>{'\n'}
      09:12:07 INFO login user=<b>ayse.kaya</b> tc=<b>12345678901</b>{'\n'}
      09:12:09 WARN retry tel=<b>05321234567</b>{'\n'}
      {'\n'}
      <span className="dim"># mask → enrich → out</span>{'\n'}
      09:12:07 INFO login user=<i>a***.k***</i> tc=<i>*********01</i> <u>svc=auth</u>{'\n'}
      09:12:09 WARN retry tel=<i>*******4567</i> <u>svc=sms</u>
    </pre>
  )
}

export default function ProjectCover({ type }) {
  return (
    <div className={`card-cover card-cover-${type}`}>
      {type === 'hand' ? <HandCover /> : <LogsCover />}
    </div>
  )
}

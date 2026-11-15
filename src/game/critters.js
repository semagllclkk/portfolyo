// ── TAVUKLAR ────────────────────────────────────────────────────────────────
// 12×11, sola bakar (sağ = ayna). Kareler: 0 duruş, 1 adım, 2 yem gagalama.
import { sprite, grid, makeCanvas } from './art'

const CHICKEN = [
  [
    '..rr........',
    '.rWWW.......',
    'yWEWW....WW.',
    '.WWWWW..WWW.',
    '.WWWWWWWWWW.',
    '.wWWWvvWWWw.',
    '..wWWWWWWw..',
    '...wwwwww...',
    '....o..o....',
    '....o..o....',
    '...oo.oo....',
  ],
  [
    '..rr........',
    '.rWWW.......',
    'yWEWW....WW.',
    '.WWWWW..WWW.',
    '.WWWWWWWWWW.',
    '.wWWWvvWWWw.',
    '..wWWWWWWw..',
    '...wwwwww...',
    '....o...o...',
    '...o....o...',
    '..oo...oo...',
  ],
  [
    '............',
    '............',
    '.........WW.',
    '..rr....WWW.',
    '.rWWWWWWWWW.',
    '.WEWWvvWWWw.',
    'yWWWWWWWWw..',
    '.y.wwwwww...',
    '....o..o....',
    '....o..o....',
    '...oo.oo....',
  ],
]

const COATS = [
  { W: '#fffaf0', w: '#d9cdbd', v: '#eadfce', r: '#e04848', y: '#f2a83a', o: '#e08a2e', E: '#33203a' },
  { W: '#c98850', w: '#8f5a38', v: '#a86e42', r: '#e04848', y: '#f2c04a', o: '#e08a2e', E: '#33203a' },
]

function mirror(s) {
  const c = makeCanvas(s.img.width, s.img.height)
  const ctx = c.getContext('2d')
  ctx.scale(-1, 1)
  ctx.drawImage(s.img, -c.width, 0)
  return { img: c, w: s.w, h: s.h }
}

// frames[coat][facingRight ? 1 : 0][frame]
let cache = null
export function chickenFrames() {
  return (cache ??= COATS.map(pal => {
    const left = CHICKEN.map(rows => sprite(12, 11, p => grid(p, rows, pal), { shadow: [6, 10, 4, 1] }))
    return [left, left.map(mirror)]
  }))
}

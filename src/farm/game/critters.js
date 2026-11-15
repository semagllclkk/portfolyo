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

// ── SARMAN KEDİ ─────────────────────────────────────────────────────────────
// 14×10, sola bakar. Kareler: 0 oturuş, 1–2 yürüyüş, 3 uyku, 4 oturuşta göz kırpma.
const CAT = [
  [
    '..O.O.........',
    '..OOOO........',
    '.OEOEO........',
    '.OOnOO........',
    '..cccOO.......',
    '..cOOOOO......',
    '..cOOoOOO.....',
    '..cOOOoOO.....',
    '..OOOOOOOo....',
    '..cc.OOOOOoO..',
  ],
  [
    '.O.O..........',
    '.OOOO.......oO',
    'OEOEO.......O.',
    'OOnOOOoOOoOOO.',
    '.cccOOoOOoOOO.',
    '..cOOOOOOOOOO.',
    '..OOOOOOOOOO..',
    '..OO.....OO...',
    '.OO......O....',
    '.c.......c....',
  ],
  [
    '.O.O..........',
    '.OOOO.......oO',
    'OEOEO.......O.',
    'OOnOOOoOOoOOO.',
    '.cccOOoOOoOOO.',
    '..cOOOOOOOOOO.',
    '..OOOOOOOOOO..',
    '...OO...OO....',
    '...O.....OO...',
    '...c......c...',
  ],
  [
    '..............',
    '..............',
    '..............',
    '..............',
    '..............',
    '.O.O.OOOOOO...',
    '.OOOOOoOOoOOO.',
    'OoOoOOoOOoOOOO',
    'OOnOOOOOOOOOoO',
    '.cccOOOOOoooO.',
  ],
]
CAT.push(CAT[0].map((row, y) => (y === 2 ? row.replace(/E/g, 'o') : row)))

const TABBY = { O: '#ec9a3c', o: '#b9662c', c: '#fde8c4', E: '#33203a', n: '#f08a9a' }

let catCache = null
export function catFrames() {
  return (catCache ??= (() => {
    const left = CAT.map(rows => sprite(14, 10, p => grid(p, rows, TABBY), { shadow: [7, 9, 5, 1] }))
    return [left, left.map(mirror)]
  })())
}

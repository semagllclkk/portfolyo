// ── KARAKTERLER ─────────────────────────────────────────────────────────────
// 16×28 piksel, elle çizilmiş. Her karakter üç yönde (aşağı, yukarı, yan) baş,
// gövde ve bacak ızgaralarından oluşur; sağa bakış sol karelerin aynasıdır.
// Harfler: H/h/j saç ya da başörtüsü, K/k ten, E/e göz (üst/alt piksel),
// B allık, m ağız, S/s/T üst, P/p/Q elbise-tulum, N kemer-kurdele,
// L/l bacak, F/f ayakkabı.
import { sprite, grid, makeCanvas } from './art'

const SKIN = { K: '#f8d2ac', k: '#e0a184', E: '#33203a', e: '#33203a', B: '#f4a394', m: '#c9665e' }

const HEADS = {
  player: {
    down: [
      '.....YAAAAa.....',
      '....YAAAAAAa....',
      '....YAAAAAAa....',
      '....NNNNNNNn....',
      'YAAAAAAAAAAAAAAa',
      '.aaaaaaaaaaaaaa.',
      '..hHHjKKKKHHHh..',
      '..hHKKKKKKKKHh..',
      '..hKKEKKKKEKKh..',
      '..hKKeKKKKeKKh..',
      '...KBKKKKKKBK...',
      '...KKKKmmKKKK...',
      '...kKKKKKKKKk...',
      '....kkkkkkkk....',
    ],
    up: [
      '.....YAAAAa.....',
      '....YAAAAAAa....',
      '....YAAAAAAa....',
      '....NNNNNNNn....',
      'YAAAAAAAAAAAAAAa',
      '.aaaaaaaaaaaaaa.',
      '..hHHjHHHHHHHh..',
      '..hHjHHHHHHHHh..',
      '..hHHHHHHHHHHh..',
      '..hHHHHHHHHHHh..',
      '..hhHHHHHHHHhh..',
      '...hhHHHHHHhh...',
      '...kKKKKKKKKk...',
      '....kkkkkkkk....',
    ],
    side: [
      '.....YAAAAa.....',
      '....YAAAAAAa....',
      '....YAAAAAAa....',
      '....NNNNNNNn....',
      'YAAAAAAAAAAAAAa.',
      '.aaaaaaaaaaaaa..',
      '..KKKHjHHHHHh...',
      '..KKKKHHHHHHh...',
      '..KEKKKHHHHHh...',
      '..KeKKKkHHHHh...',
      '..KKBKKkHHHhh...',
      '...KKKKkhhhh....',
      '...kKKKk........',
      '....kkk.........',
    ],
  },
  playerGirl: {
    down: [
      '................',
      '.....hHHHHh.....',
      '...hHHjjjHHHh...',
      '..hHjjjHHHHHHh..',
      '..HHjHHHHHHHHH..',
      '.hHHHHHHHHHHHHh.',
      '.hHHhHKKKKHhHHh.',
      '.hHhKKKKKKKKhHh.',
      '.hHKKEKKKKEKKHh.',
      '.hHKKeKKKKeKKHh.',
      '.hHKBKKKKKKBKHh.',
      '.hHhKKKmmKKKhHh.',
      '.hHHhkKKKKkhHHh.',
      '.hHH.hkkkkh.HHh.',
    ],
    up: [
      '................',
      '.....hHHHHh.....',
      '...hHHjjjHHHh...',
      '..hHjjjHHHHHHh..',
      '..HHjHHHHHHHHH..',
      '.hHHHHHHHHHHHHh.',
      '.hHHHHHHHHHHHHh.',
      '.hHjHHHHHHHHHHh.',
      '.hHjHHHHHHHHHHh.',
      '.hHHHHhHHHHHHHh.',
      '.hHHHHhHHHhHHHh.',
      '.hHhHHhHHHhHHHh.',
      '.hHhHHHHHHhHHHh.',
      '.hHhHHHhHHHHHHh.',
    ],
    side: [
      '................',
      '.....hHHHHh.....',
      '...hHHjjHHHHh...',
      '..hHjjHHHHHHHh..',
      '..HjHHHHHHHHHH..',
      '.hHHHHHHHHHHHHh.',
      '.hKKHHHHHHHHHHh.',
      '.KKKKHhHHHHHHHh.',
      '.KEKKKhHHHHHHHh.',
      '.KeKKKkHHHHHHHh.',
      '.KKBKKkHHHHHHHh.',
      '..KKKKkhHHHHHHh.',
      '..kKKkhhHHHHHHh.',
      '...kk...hHHHHHh.',
    ],
  },
  sema: {
    down: [
      '................',
      '.....hHHHHh.....',
      '...hHHjjjHHHh...',
      '..hHjjHHHHqHHh..',
      '..HjHHHHHHHHHH..',
      '.hHHHHHHHHHHHHh.',
      '.hHHhhhhhhhhHHh.',
      '.hHhKKKKKKKKhHh.',
      '.hHhKEKKKKEKhHh.',
      '.hqhKeKKKKeKhHh.',
      '.hHhBKKKKKKBhHh.',
      '.hHHhKKmmKKhHHh.',
      '.hHHHhkkkkhHqHh.',
      '..hHHHHhhHHHHh..',
    ],
    up: [
      '................',
      '.....hHHHHh.....',
      '...hHHjjjHHHh...',
      '..hHjjHHHHqHHh..',
      '..HjHHHHHHHHHH..',
      '.hHHHHHHHHHHHHh.',
      '.hHHHqHHHHHHHHh.',
      '.hHHHHHHhHHHHHh.',
      '.hHHHHHHhHHqHHh.',
      '.hHqHHHHhHHHHHh.',
      '.hHHHHHHhHHHHHh.',
      '.hHHHHHhHHHHHHh.',
      '.hHHHHHhHHHqHHh.',
      '..hHHHHhHHHHHh..',
    ],
    side: [
      '................',
      '....hHHHHHh.....',
      '..hHHjjHHHHHh...',
      '.hHjjHHHHHqHHh..',
      '.HjHHHHHHHHHHh..',
      '.HHHHHHHHHHHHh..',
      '.hhhhhHHHHHHHh..',
      '.KKKKKhHHHqHHh..',
      '.KEKKKhHHHHHHh..',
      '.KeKKKhHHHHHHh..',
      '.KKBKKhHHqHHHh..',
      '..KKKKhHHHHHHh..',
      '..hkkkhHHHHHh...',
      '..hHHHHHHHHHh...',
    ],
  },
}

// Gövde: satır 14'ten başlar (8 satır)
const TORSOS = {
  player: {
    down: ['....SSkkkkSS....', '....SPSSSSPS....', '....SPPPPPPS....', '....sPQPPQPs....', '....pPPPPPPp....', '....pPPPPPPp....', '....pPPPPPPp....', '....pPPPPPPp....'],
    up: ['....SSkkkkSS....', '....SPSSSSPS....', '....SSPSSPSS....', '....sPPPPPPs....', '....pPPPPPPp....', '....pPPPPPPp....', '....pPPPPPPp....', '....pPPPPPPp....'],
    side: ['......SSSS......', '.....SSSPSs.....', '.....PPPPPs.....', '.....PQPPPp.....', '.....PPPPPp.....', '.....PPPPPp.....', '.....pPPPPp.....', '.....pPPPPp.....'],
  },
  playerGirl: {
    down: ['....SSSkkSSS....', '....PPSSSSPP....', '....PPPPPPPP....', '....NNNNNNNN....', '...PPPPPPPPPP...', '...PQPPPPPPPp...', '..pPQPPPPPPPPp..', '..ppPPPPPPPPpp..'],
    up: ['....SSSSSSSS....', '....PPSSSSPP....', '....PPPPPPPP....', '....NNNNNNNN....', '...PPPPPPPPPP...', '...PPPPPPPPPp...', '..pPPPPPPPPPPp..', '..ppPPPPPPPPpp..'],
    side: ['......SSSS......', '.....PSSSSP.....', '.....PPPPPP.....', '.....NNNNNN.....', '....PPPPPPPP....', '....PQPPPPPp....', '...pPQPPPPPPp...', '...ppPPPPPPpp...'],
  },
  sema: {
    down: ['....SSSSSSSS....', '....SSSSSSSS....', '....SSSSSSSS....', '....SSSSSSSS....', '....SSSSSSSS....', '...sSSSSSSSSs...', '...sSTSSSSSSs...', '...ssssssssss...'],
    up: ['....SSSSSSSS....', '....SSSSSSSS....', '....SSSSSSSS....', '....SSSSSSSS....', '....SSSSSSSS....', '...sSSSSSSSSs...', '...sSSSSSSSSs...', '...ssssssssss...'],
    side: ['......SSSS......', '.....SSSSSS.....', '.....SSSSSS.....', '.....SSSSSS.....', '.....SSSSSS.....', '....sSSSSSSs....', '....STSSSSSs....', '....ssssssss....'],
  },
}

// Kolların üstüne gelen parçalar: omuza dökülen saç (kız), göğse inen başörtüsü (Sema)
const DRAPES = {
  playerGirl: {
    down: ['.hH..........Hh.', '.hH..........Hh.', '..h..........h..'],
    up: ['.hHhHHHhHHHhHHh.', '.hHHHHHhHHHhHHh.', '..hHHhHHHHhHHh..', '...hhHhhHhHhh...'],
    side: ['.........hHHHHh.', '.........hHHHHh.', '..........hHHh..', '...........hh...'],
  },
  sema: {
    down: ['..hHHHHHHHHHHh..', '...hHHHqHHHHh...', '....hHHHHHHh....', '.....hhHHhh.....'],
    up: ['..hHHHHhHHHHHh..', '...hHHHhHHqHh...', '....hHHhHHHh....', '.....hhhhhh.....'],
    side: ['...hHHHHHHHh....', '....hHHHqHh.....', '.....hHHHh......', '......hhh.......'],
  },
}

// Bacaklar: satır 22'den başlar (6 satır)
const LEGS = {
  front: [
    ['.....LL..LL.....', '.....LL..LL.....', '.....LL..LL.....', '.....ll..ll.....', '....FFF..FFF....', '....fff..fff....'],
    ['.....LL..LL.....', '.....LL..LL.....', '.....LL..ll.....', '.....ll..FF.....', '....FFF..ff.....', '....fff.........'],
  ],
  side: [
    ['......LLLL......', '......LLLL......', '......LLLl......', '......lLLl......', '.....FFFFF......', '.....fffff......'],
    ['......LLLL......', '.....LLLLLL.....', '....LLL..LLL....', '....ll....ll....', '...FFF....FFF...', '...fff.....ff...'],
    ['......LLLL......', '......LLLL......', '......lLLL......', '.....FFlLL......', '.....ff.FFF.....', '........fff.....'],
  ],
}

export const LOOKS = {
  player: {
    ...SKIN,
    H: '#7a4a2e', h: '#54302a', j: '#a8703f',
    Y: '#fff0a8', A: '#ebc664', a: '#b98840', N: '#c2503c', n: '#93382f',
    S: '#7cbf5a', s: '#4f8f4a', T: '#a8dc78',
    P: '#4f74ba', p: '#3a5596', Q: '#f2d064',
    L: '#4f74ba', l: '#3a5596', F: '#7a4a38', f: '#4f2c2c',
  },
  playerGirl: {
    ...SKIN,
    H: '#c8643a', h: '#8f3c30', j: '#ee9a5c',
    S: '#fff6e6', s: '#dccab2', T: '#ffffff',
    P: '#d9566b', p: '#a83c58', Q: '#f08a9a', N: '#ffd35a',
    L: '#f8d2ac', l: '#fff6e6', F: '#7a4234', f: '#4f282b',
  },
  sema: {
    ...SKIN,
    H: '#5f8fd4', h: '#3f62a6', j: '#9cc2f0', q: '#dfeafc',
    S: '#e07f9a', s: '#b05a78', T: '#f2a6ba',
    L: '#39457a', l: '#293260', F: '#3d2b38', f: '#2a1e28',
  },
}

// dir: 0 aşağı, 1 yukarı, 2 sol; frame: 0 duruş, 1–2 adım. blink: gözler kapalı
function drawPerson(p, look, dir, frame, blink) {
  const pal = blink ? { ...LOOKS[look], E: LOOKS[look].K } : LOOKS[look]
  const D = ['down', 'up', 'side'][dir]
  const b = frame ? -1 : 0 // adımda gövde 1 piksel yükselir
  const mirrorRow = s => s.split('').reverse().join('')
  if (dir === 2) grid(p, LEGS.side[frame], pal, 0, 22)
  else grid(p, frame === 2 ? LEGS.front[1].map(mirrorRow) : LEGS.front[frame ? 1 : 0], pal, 0, 22)
  grid(p, TORSOS[look][D], pal, 0, 14 + b)
  // Kollar: adımda biri öne (uzun), diğeri geriye (kısa) sallanır
  const arm = (x, len, dark) => {
    const y = 15 + b
    p(pal.S, x, y, 2, len)
    p(pal.s, x + (dark ? 1 : 0), y + 1, 1, len - 1)
    p(pal.K, x, y + len, 2, 1)
    p(pal.k, x + (dark ? 1 : 0), y + len, 1, 1)
  }
  if (dir === 2) {
    const ax = frame === 1 ? 6 : frame === 2 ? 9 : 7
    p(pal.S, ax, 15 + b, 2, 4)
    p(pal.s, ax + 1, 16 + b, 1, 3)
    p(pal.K, ax + (frame === 1 ? -1 : frame === 2 ? 1 : 0), 19 + b, 2, 1)
  } else {
    arm(2, frame === 1 ? 3 : frame === 2 ? 5 : 4, false)
    arm(12, frame === 2 ? 3 : frame === 1 ? 5 : 4, true)
  }
  if (DRAPES[look]) grid(p, DRAPES[look][D], pal, 0, 14 + b)
  grid(p, HEADS[look][D], pal, 0, b)
}

function mirror(s) {
  const c = makeCanvas(s.img.width, s.img.height)
  const ctx = c.getContext('2d')
  ctx.scale(-1, 1)
  ctx.drawImage(s.img, -c.width, 0)
  return { img: c, w: s.w, h: s.h }
}

export const PERSON_H = 28

// frames[dir][frame]; frame 3 = duruşta göz kırpma. dir 3 (sağ) sol karelerin aynası
export function personFrames(look) {
  const key = LOOKS[look] ? look : 'player'
  const make = (dir, f, blink) => sprite(16, PERSON_H, p => drawPerson(p, key, dir, f, blink), { shadow: [8, 26, 5, 2] })
  const frames = [0, 1, 2].map(dir => [make(dir, 0), make(dir, 1), make(dir, 2), make(dir, 0, true)])
  frames.push(frames[2].map(mirror))
  return frames
}

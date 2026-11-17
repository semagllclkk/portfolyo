// ── SARMAŞIK ÇERÇEVE ────────────────────────────────────────────────────────
// Beceri kutularının etrafındaki pembe çiçekli sarmaşık. 28×28 piksellik bir
// 9 dilimli çerçeve olarak çizilir (köşede çiçek, kenarda yapraklı dal ve
// tomurcuk) ve CSS border-image ile her kutuya sarılır. Pikseller 2× büyütülür.
import { makeCanvas } from './art'

const COL = {
  P: '#f27aa4', p: '#c94a7e', Y: '#ffd35a', W: '#ffe3ee',
  V: '#4f8a3a', G: '#86c45e', g: '#4c8a3c',
}

// Sol üst köşe (7×7): dışa bakan çiçek, dal sağa ve aşağı devam eder
const CORNER = [
  '.pPp...',
  'pWPPp..',
  'PPYPPV.',
  'pPPPpVV',
  '.pPpV..',
  '..VV...',
  '...V...',
]

// Üst kenar (14×7): dalgalı dal, bir yaprak çifti ve küçük bir tomurcuk
const EDGE = [
  '..........pPp.',
  '..GG......PYP.',
  '..gGG.....pPp.',
  'VVVVVVV..VVVVV',
  '.......VV.....',
  '........gG....',
  '.........G....',
]

const N = 28, C = 7, S = 2

let url = null
export function vineUrl() {
  if (url) return url
  const grid = Array.from({ length: N }, () => new Array(N).fill('.'))
  const put = (x, y, ch) => { if (ch !== '.') grid[y][x] = ch }
  for (let y = 0; y < C; y++) {
    for (let x = 0; x < C; x++) {
      const ch = CORNER[y][x]
      put(x, y, ch); put(N - 1 - x, y, ch); put(x, N - 1 - y, ch); put(N - 1 - x, N - 1 - y, ch)
    }
    for (let x = 0; x < N - 2 * C; x++) {
      const ch = EDGE[y][x]
      put(C + x, y, ch)               // üst
      put(C + x, N - 1 - y, ch)       // alt (ayna)
      put(y, C + x, ch)               // sol (devrik)
      put(N - 1 - y, C + x, ch)       // sağ
    }
  }
  const c = makeCanvas(N * S, N * S)
  const ctx = c.getContext('2d')
  grid.forEach((row, y) => row.forEach((ch, x) => {
    if (ch === '.') return
    ctx.fillStyle = COL[ch]
    ctx.fillRect(x * S, y * S, S, S)
  }))
  url = c.toDataURL()
  return url
}

export const VINE_SLICE = C * S

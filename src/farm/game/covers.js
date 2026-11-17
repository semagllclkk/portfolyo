// ── PROJE KAPAKLARI ─────────────────────────────────────────────────────────
// Fotoğrafı olmayan projeler için 144×48 piksellik elle çizilmiş sahneler.
// Küçük bir canvas'a çizilir, panelde pikselleri bozulmadan büyütülür.
import { makeCanvas, rng } from './art'

const W = 144, H = 48
const INK = '#2a1a2e'

function scene(draw) {
  const c = makeCanvas(W, H)
  const ctx = c.getContext('2d')
  const r = (col, x, y, w = 1, h = 1) => { ctx.fillStyle = col; ctx.fillRect(x, y, w, h) }
  draw(r)
  return c.toDataURL()
}

// Kenarlıklı kutu: koyu çerçeve, üstte açık, altta koyu kenar
function box(r, x, y, w, h, [dark, mid, light]) {
  r(INK, x - 1, y - 1, w + 2, h + 2)
  r(mid, x, y, w, h)
  r(light, x, y, w, 1); r(light, x, y, 1, h)
  r(dark, x, y + h - 1, w, 1); r(dark, x + w - 1, y, 1, h)
}

// Parşömen: satırlar `rows` ile verilir ([x, uzunluk, renk])
function scroll(r, x, y, rows) {
  r(INK, x - 1, y - 1, 24, 30)
  r('#f6e2b4', x, y, 22, 28)
  r('#fff3d2', x, y, 22, 1); r('#fff3d2', x, y, 1, 28)
  r('#d9b983', x, y + 27, 22, 1); r('#d9b983', x + 21, y, 1, 28)
  r('#c99a5c', x - 1, y - 2, 24, 2); r('#c99a5c', x - 1, y + 28, 24, 2)
  r(INK, x - 2, y - 2, 1, 2); r(INK, x + 23, y - 2, 1, 2); r(INK, x - 2, y + 28, 1, 2); r(INK, x + 23, y + 28, 1, 2)
  rows.forEach((row, i) => row.forEach(([dx, len, col]) => r(col, x + 3 + dx, y + 4 + i * 4, len, 2)))
}

function arrow(r, x, y) {
  r('#ffd23f', x, y, 6, 2)
  r('#ffd23f', x + 5, y - 2, 1, 6); r('#ffd23f', x + 6, y - 1, 1, 4); r('#ffd23f', x + 7, y, 1, 2)
}

// Data Middleware: ham kayıt → maskeleme → zenginleştirme → temiz kayıt
function logs(r) {
  const TXT = '#8a6a4a', SECRET = '#e8558f', MASK = '#4a3a44', TAG = '#5fa04a'
  r('#3b2620', 0, 0, W, H)
  for (let y = 0; y < H; y += 8) r('#2e1c19', 0, y + 7, W, 1)
  for (let i = 0; i < 9; i++) r('#2e1c19', 8 + i * 17, (i % 3) * 8, 1, 7)
  // taşıma bandı
  r(INK, 0, 40, W, 6); r('#5a5568', 0, 41, W, 4); r('#8a8698', 0, 41, W, 1)
  for (let x = 2; x < W; x += 6) r('#3d3a4a', x, 43, 3, 1)

  scroll(r, 4, 9, [
    [[0, 10, TXT], [11, 5, SECRET]],
    [[0, 6, TXT], [7, 9, SECRET]],
    [[0, 14, TXT]],
    [[0, 4, TXT], [5, 8, SECRET]],
    [[0, 12, TXT]],
  ])
  arrow(r, 30, 22)

  // maskeleme makinesi: üstünde yıldızlar
  box(r, 42, 14, 22, 26, ['#34406e', '#4f62a0', '#7c90cc'])
  r(INK, 45, 18, 16, 8); r('#1d2440', 46, 19, 14, 6)
  for (let i = 0; i < 3; i++) { r('#ffd23f', 48 + i * 4, 21, 2, 2) }
  r('#e04848', 45, 30, 3, 3); r('#5fa04a', 50, 30, 3, 3); r('#ffd23f', 55, 30, 3, 3)
  r(INK, 51, 9, 4, 5); r('#8a8698', 52, 10, 2, 4)
  arrow(r, 67, 22)

  // zenginleştirme makinesi: etiket basar
  box(r, 79, 14, 22, 26, ['#2f6a3a', '#4c9542', '#8fc54d'])
  r(INK, 82, 18, 16, 8); r('#1c3a22', 83, 19, 14, 6)
  r('#b7f08a', 89, 20, 2, 4); r('#b7f08a', 88, 21, 4, 2)
  r('#ffd23f', 82, 30, 16, 2); r('#c99a2c', 82, 32, 16, 1)
  r(INK, 88, 9, 4, 5); r('#8a8698', 89, 10, 2, 4)
  arrow(r, 104, 22)

  scroll(r, 116, 9, [
    [[0, 10, TXT], [11, 5, MASK]],
    [[0, 6, TXT], [7, 9, MASK]],
    [[0, 14, TXT]],
    [[0, 4, TXT], [5, 8, MASK]],
    [[0, 9, TXT], [10, 6, TAG]],
  ])
}

// VisionStrike: el iskeleti nişan alıyor, top hedefe uçuyor
function hand(r) {
  const rand = rng(21)
  r('#1b1f3a', 0, 0, W, H)
  r('#242a4c', 0, 30, W, 18); r('#2e3560', 0, 30, W, 1)
  for (let i = 0; i < 46; i++) {
    const x = Math.floor(rand() * W), y = Math.floor(rand() * 28)
    r(rand() < 0.25 ? '#ffe9a0' : '#8f9bd0', x, y)
  }
  // el: avuç + dört parmak + başparmak
  const SK = '#f8d2ac', SD = '#e0a184'
  const fingers = [[22, 12, 14], [27, 8, 18], [32, 10, 16], [37, 14, 12]]
  r(INK, 20, 25, 23, 17); r(SK, 21, 26, 21, 15); r(SD, 21, 39, 21, 2); r(SD, 40, 26, 2, 15)
  fingers.forEach(([x, y, h]) => { r(INK, x - 1, y - 1, 6, h + 2); r(SK, x, y, 4, h + 1); r(SD, x + 3, y + 1, 1, h) })
  r(INK, 12, 26, 9, 6); r(INK, 10, 22, 6, 6); r(SK, 13, 27, 8, 4); r(SK, 11, 23, 4, 5); r(SD, 13, 30, 8, 1)
  r(INK, 23, 42, 17, 6); r(SK, 24, 42, 15, 6); r(SD, 37, 42, 2, 6)
  // iskelet: eklem noktaları ve bağlantılar
  const LINE = '#7fe0d0', DOT = '#e8558f'
  const wrist = [31, 40]
  fingers.forEach(([x, y, h]) => {
    r(LINE, x + 1, y + 2, 1, h + 6)
    for (const k of [0.1, 0.45, 0.8]) r(DOT, x + 1 - 0, y + Math.round(h * k), 2, 2)
  })
  r(LINE, 23, 33, 17, 1); r(LINE, 14, 28, 9, 1); r(LINE, 12, 25, 1, 3)
  r(DOT, 12, 24, 2, 2); r(DOT, 17, 28, 2, 2); r(DOT, wrist[0], wrist[1], 2, 2)
  r('#b7f08a', 28, 8, 2, 2) // işaret parmağı ucu

  // nişan çizgisi ve top
  for (let i = 0; i < 9; i++) r('#b7f08a', 36 + i * 7, 9 + Math.round(((i - 4) ** 2) / 5) - 3, 2, 1)
  r(INK, 73, 4, 7, 7); r('#ffd23f', 74, 5, 5, 5); r('#fff3a8', 74, 5, 2, 2); r('#e8a030', 78, 8, 1, 2)
  r('#ffd23f', 68, 7, 3, 1); r('#e8a030', 63, 8, 3, 1)

  // hedef tahtası
  const cx = 116, cy = 20
  const ring = (rad, col) => {
    for (let y = -rad; y <= rad; y++) {
      const hw = Math.round(Math.sqrt(rad * rad - y * y))
      r(col, cx - hw, cy + y, hw * 2 + 1, 1)
    }
  }
  ring(15, INK); ring(14, '#fff6e6'); ring(11, '#e04848'); ring(8, '#fff6e6'); ring(5, '#e04848'); ring(2, '#ffd23f')
  r(INK, cx - 1, 35, 3, 9); r('#8a5c3e', cx, 35, 1, 9)
  r(INK, cx - 7, 43, 15, 3); r('#8a5c3e', cx - 6, 43, 13, 2)
}

const SCENES = { logs, hand }
const cache = {}
export const coverUrl = (kind) => (SCENES[kind] ? (cache[kind] ??= scene(SCENES[kind])) : null)

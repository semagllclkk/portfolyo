// ── PIXEL ART ────────────────────────────────────────────────────────────────
// Tüm çizimler özgün ve koddan üretilir (Stardew Valley'den esinlenildi).
// Her sprite bir kez offscreen canvas'a çizilir, oyun döngüsünde sadece kopyalanır.

export const TILE = 16
export const SEASONS = ['spring', 'summer', 'fall', 'winter']

// Tohumlu rastgele sayı üreteci: harita her açılışta aynı görünsün
export function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function makeCanvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

const OUTLINE = [43, 26, 16, 255]

// Saydam olup dolu bir komşusu olan her piksele koyu kontur çizer
function addOutline(c) {
  const ctx = c.getContext('2d')
  const { width: w, height: h } = c
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  const out = new Uint8ClampedArray(d)
  const a = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : d[(y * w + x) * 4 + 3])
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (a(x, y) > 0) continue
      if (a(x - 1, y) || a(x + 1, y) || a(x, y - 1) || a(x, y + 1)) out.set(OUTLINE, (y * w + x) * 4)
    }
  }
  ctx.putImageData(new ImageData(out, w, h), 0, 0)
}

// Kontura yer açmak için canvas her yönde 1px büyük; çizerken (x-1, y-1) kullanılır
function sprite(w, h, draw, { outline = true, shadow } = {}) {
  const c = makeCanvas(w + 2, h + 2)
  const ctx = c.getContext('2d')
  ctx.translate(1, 1)
  const p = (col, x, y, pw = 1, ph = 1) => {
    ctx.fillStyle = col
    ctx.fillRect(x, y, pw, ph)
  }
  draw(p, ctx)
  if (outline) addOutline(c)
  if (shadow) {
    const [cx, cy, rx, ry] = shadow
    ctx.globalCompositeOperation = 'destination-over'
    ctx.fillStyle = 'rgba(30, 40, 20, .28)'
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  return { img: c, w, h }
}

export function drawSprite(ctx, s, x, y) {
  ctx.drawImage(s.img, Math.round(x) - 1, Math.round(y) - 1)
}

function disc(p, col, cx, cy, r) {
  for (let y = -r; y <= r; y++) {
    const hw = Math.floor(Math.sqrt(r * r - y * y) + 0.3)
    p(col, cx - hw, cy + y, hw * 2 + 1, 1)
  }
}

// ── Mevsim paletleri ─────────────────────────────────────────────────────────
const GREEN = ['#2f6b2a', '#4f9a3a', '#86cf5c']
const TEAL = ['#25645f', '#3c978c', '#7cd0bf']
const FOLIAGE = {
  spring: { blossom: ['#b04a78', '#ee86b0', '#ffc9df'], oak: GREEN, teal: TEAL },
  summer: { blossom: ['#2a6326', '#46913a', '#7cc455'], oak: GREEN, teal: TEAL },
  fall: {
    blossom: ['#962b1f', '#d4502f', '#f28a5c'],
    oak: ['#a1501a', '#dd842c', '#f6c057'],
    teal: ['#7d6a1c', '#bfa02a', '#ecd46a'],
  },
  winter: { blossom: ['#3f5a5e', '#6f8f92', '#dfeaf0'], oak: ['#3f5a5e', '#6f8f92', '#dfeaf0'], teal: ['#36555a', '#5f8488', '#dfeaf0'] },
}

export const GROUND = {
  spring: { grass: ['#7cc552', '#6bb345', '#93d966'], path: ['#e8d1a0', '#d6ba84', '#f3e2bb'], water: ['#4ba3e3', '#79c3f2'], flowers: ['#ff9db5', '#fff3a8', '#ffffff'] },
  summer: { grass: ['#6cb843', '#5ca53a', '#84cc58'], path: ['#e8d1a0', '#d6ba84', '#f3e2bb'], water: ['#3f9be0', '#73bff2'], flowers: ['#ffd23f', '#c38cff', '#ffffff'] },
  fall: { grass: ['#a9ad4c', '#959a40', '#c2c35e'], path: ['#e0c28e', '#cba873', '#efd7a8'], water: ['#3f8fcf', '#6fb2e4'], flowers: ['#f4a62a', '#e0352b'] },
  winter: { grass: ['#eef3f7', '#d7e1ea', '#ffffff'], path: ['#d9d3c7', '#c4bcae', '#ece8e0'], water: ['#8ccbe9', '#c4e7f7'], flowers: [] },
}

// ── Ağaç ────────────────────────────────────────────────────────────────────
export function treeSprite(kind, season, variant) {
  const [dk, md, lt] = FOLIAGE[season][kind]
  const r = rng(variant * 977 + kind.length * 31)
  const blobs = [[17, 14, 12], [9, 21, 8], [25, 21, 8], [17, 24, 9]]
  return sprite(34, 46, (p) => {
    p('#6b3f20', 14, 30, 6, 13)
    p('#8a5530', 15, 30, 2, 12)
    p('#5a331a', 12, 41, 10, 2)
    blobs.forEach(([x, y, rr]) => disc(p, dk, x, y, rr))
    blobs.forEach(([x, y, rr]) => disc(p, md, x - 1, y - 2, rr - 2))
    ;[[13, 9, 4], [22, 11, 3], [8, 18, 3], [19, 19, 2]].forEach(([x, y, rr]) => disc(p, lt, x, y, rr))
    // Yaprak dokusu: noktalar yalnızca tacın içine düşer
    const dots = kind === 'blossom' && season === 'spring' ? [dk, lt, '#ffffff'] : [dk, lt]
    for (let i = 0; i < 34; i++) {
      const [bx, by, br] = blobs[Math.floor(r() * blobs.length)]
      const ang = r() * Math.PI * 2, dist = r() * (br - 3)
      p(dots[i % dots.length], Math.round(bx + Math.cos(ang) * dist), Math.round(by + Math.sin(ang) * dist), 1 + (i % 3 === 0), 1)
    }
    if (season === 'winter') {
      disc(p, '#ffffff', 16, 6, 6)
      disc(p, '#ffffff', 8, 15, 3)
      disc(p, '#ffffff', 25, 15, 3)
    }
  }, { shadow: [17, 43, 10, 3] })
}

// ── Çiftlik evi (7×6 karo) ──────────────────────────────────────────────────
export const HOUSE_WINDOWS = [[20, 56], [76, 56]]

export function houseSprite(season) {
  return sprite(112, 96, (p) => {
    // Duvar ve ahşap kirişler
    p('#efe3c8', 10, 44, 92, 44)
    p('#e0d2b3', 10, 80, 92, 8)
    ;[10, 40, 70, 99].forEach(x => p('#9a6236', x, 44, 3, 44))
    p('#9a6236', 10, 46, 92, 3)
    // Taş temel
    p('#a39c90', 8, 86, 96, 8)
    for (let x = 8; x < 104; x += 8) p('#7f786e', x, 86, 1, 4)
    for (let x = 12; x < 104; x += 8) p('#7f786e', x, 90, 1, 4)
    p('#7f786e', 8, 89, 96, 1)
    // Pencereler + çiçek saksıları
    HOUSE_WINDOWS.forEach(([x, y]) => {
      p('#5a331a', x, y, 18, 18)
      p('#a9d8f0', x + 2, y + 2, 14, 14)
      p('#e2f4ff', x + 3, y + 3, 4, 3)
      p('#5a331a', x + 8, y + 2, 2, 14)
      p('#5a331a', x + 2, y + 8, 14, 2)
      p('#8a5530', x - 1, y + 19, 20, 4)
      p('#3f9b2f', x, y + 17, 18, 2)
      ;[1, 6, 11, 15].forEach((fx, i) => p(i % 2 ? '#ffd23f' : '#ff7fb0', x + fx, y + 16, 2, 2))
    })
    // Kapı (24. karoya hizalı) ve basamak
    p('#5a331a', 46, 60, 20, 30)
    p('#8a5530', 48, 62, 16, 28)
    p('#74431f', 52, 62, 1, 28)
    p('#74431f', 58, 62, 1, 28)
    p('#a8703a', 49, 63, 2, 26)
    p('#ffd23f', 60, 76, 2, 2)
    p('#bdb6aa', 42, 90, 28, 6)
    p('#948d82', 42, 94, 28, 2)
    // Çatı: sırttan saçağa genişleyen kiremit sıraları
    for (let y = 6; y <= 44; y++) {
      const t = Math.min(1, (y - 6) / 24)
      const left = Math.round(30 - 28 * t), right = Math.round(82 + 28 * t)
      const row = (y - 6) % 6
      p(row === 0 ? '#6e2f1c' : row < 3 ? '#a34a2c' : '#b85a36', left, y, right - left, 1)
      if (row > 0) {
        const k = Math.floor((y - 6) / 6)
        for (let x = left + 2 + (k % 2) * 4; x < right - 1; x += 8) p('#8e3d24', x, y, 1, 1)
      }
    }
    p('#7a3420', 30, 4, 52, 3)
    p('#5a2a18', 0, 44, 112, 4)
    p('#8e3d24', 0, 44, 112, 1)
    // Baca
    p('#8b8378', 80, 0, 10, 16)
    p('#6f685f', 80, 0, 10, 2)
    p('#6f685f', 80, 7, 10, 1)
    p('#6f685f', 84, 2, 1, 5)
    if (season === 'winter') {
      p('#ffffff', 28, 2, 56, 4)
      p('#ffffff', 0, 41, 112, 3)
      p('#ffffff', 79, -1, 12, 2)
      for (let x = 6; x < 108; x += 9) p('#ffffff', x, 38 - (x % 4), 5, 3)
    }
  })
}

// ── Küçük nesneler ──────────────────────────────────────────────────────────
export function boardSprite() {
  return sprite(48, 32, (p) => {
    p('#6b3f20', 5, 10, 4, 22)
    p('#6b3f20', 39, 10, 4, 22)
    p('#9a6236', 1, 4, 46, 20)
    p('#b5793f', 3, 6, 42, 16)
    p('#6b3f20', 0, 1, 48, 4)
    p('#8a5530', 0, 1, 48, 1)
    const notes = [[6, 8, 10, 11, '#fff6dc'], [19, 7, 10, 12, '#ffe08a'], [32, 9, 10, 10, '#fff6dc']]
    notes.forEach(([x, y, w, h, col]) => {
      p(col, x, y, w, h)
      for (let ly = y + 4; ly < y + h - 1; ly += 2) p('#c9a46b', x + 2, ly, w - 4, 1)
      p('#e0352b', x + Math.floor(w / 2) - 1, y, 2, 2)
    })
  }, { shadow: [24, 31, 22, 2] })
}

export function chestSprite() {
  return sprite(16, 16, (p) => {
    p('#8a4d1f', 1, 6, 14, 9)
    p('#a8622a', 1, 3, 14, 4)
    p('#c27a3a', 2, 3, 12, 1)
    p('#5b2f12', 1, 7, 14, 1)
    p('#d9a441', 1, 3, 2, 12)
    p('#d9a441', 13, 3, 2, 12)
    p('#ffd23f', 7, 6, 2, 3)
    p('#5b2f12', 7, 8, 2, 1)
  }, { shadow: [8, 15, 8, 2] })
}

export function binSprite() {
  return sprite(32, 16, (p) => {
    p('#8a4d1f', 1, 5, 30, 10)
    for (let x = 6; x < 30; x += 6) p('#6b3a16', x, 6, 1, 9)
    p('#b5651d', 0, 1, 32, 5)
    p('#e9a956', 1, 1, 30, 1)
    p('#5b2f12', 0, 5, 32, 1)
    p('#d9d4cc', 13, 2, 6, 2)
  }, { shadow: [16, 15, 15, 2] })
}

export function mailboxSprite() {
  return sprite(16, 28, (p) => {
    p('#6b3f20', 6, 12, 3, 16)
    p('#3d86e0', 1, 4, 11, 9)
    p('#3d86e0', 2, 3, 9, 1)
    p('#8fd0ff', 2, 5, 3, 1)
    p('#26408f', 1, 11, 11, 2)
    p('#26408f', 9, 6, 2, 3)
    p('#5d5550', 12, 3, 1, 8)
    p('#e0352b', 13, 3, 3, 3)
  }, { shadow: [7, 27, 6, 2] })
}

export function signSprite() {
  return sprite(16, 20, (p) => {
    p('#6b3f20', 7, 10, 2, 10)
    p('#a8622a', 1, 2, 14, 9)
    p('#c98a4a', 2, 3, 12, 1)
    p('#6b3f20', 3, 5, 10, 1)
    p('#6b3f20', 3, 7, 7, 1)
  }, { shadow: [8, 19, 5, 2] })
}

export function bushSprite(season) {
  const leaf = season === 'winter' ? ['#3f5a5e', '#6f8f92'] : ['#2f6b2a', '#4f9a3a']
  const flower = season === 'fall' ? ['#e07b2a', '#ffd23f'] : season === 'winter' ? ['#ffffff', '#dfeaf0'] : ['#8a3fd1', '#c38cff']
  return sprite(16, 16, (p) => {
    disc(p, leaf[0], 8, 9, 6)
    disc(p, leaf[1], 7, 8, 4)
    ;[[4, 5], [9, 3], [11, 8], [5, 10], [8, 7]].forEach(([x, y], i) => {
      p(flower[i % 2], x, y, 3, 3)
      p('#ffffff', x + 1, y + 1, 1, 1)
    })
  }, { shadow: [8, 15, 7, 2] })
}

// ── Ekinler: her proje bir ekin (2×2 karoluk parsel) ────────────────────────
export const CROPS = [
  { leaf: '#3f9b2f', fruit: ['#3d6fe0', '#a8c8ff'], shape: 'berries' },
  { leaf: '#4f9a3a', fruit: ['#ebe7d6', '#ffffff'], shape: 'head' },
  { leaf: '#3f9b2f', fruit: ['#e0352b', '#ff9a8a'], shape: 'berries' },
  { leaf: '#6aa63a', fruit: ['#f4c430', '#fff08a'], shape: 'tall' },
  { leaf: '#3f9b2f', fruit: ['#ffd23f', '#7a4a26'], shape: 'flower' },
  { leaf: '#4f9a3a', fruit: ['#f08a24', '#ffc06a'], shape: 'pumpkin' },
  { leaf: '#3f9b2f', fruit: ['#8a3fd1', '#c38cff'], shape: 'tall' },
  { leaf: '#3f9b2f', fruit: ['#e0352b', '#ffffff'], shape: 'flower' },
]

export function cropSprite(i) {
  const { leaf, fruit, shape } = CROPS[i % CROPS.length]
  const dark = '#2a6a22'
  return sprite(32, 32, (p) => {
    if (shape === 'berries') {
      disc(p, dark, 16, 20, 9)
      disc(p, leaf, 15, 18, 7)
      ;[[10, 14], [19, 12], [22, 19], [12, 21], [17, 17], [15, 24]].forEach(([x, y]) => {
        p(fruit[0], x, y, 3, 3)
        p(fruit[1], x, y, 1, 1)
      })
    } else if (shape === 'head') {
      disc(p, dark, 16, 21, 9)
      disc(p, leaf, 16, 20, 7)
      disc(p, fruit[0], 16, 17, 6)
      ;[[13, 14], [17, 13], [15, 18], [19, 17]].forEach(([x, y]) => p(fruit[1], x, y, 2, 2))
    } else if (shape === 'tall') {
      p(dark, 15, 4, 3, 26)
      p(leaf, 15, 4, 1, 26)
      disc(p, leaf, 10, 22, 4)
      disc(p, leaf, 22, 18, 4)
      disc(p, dark, 21, 26, 3)
      p(fruit[0], 18, 9, 5, 9)
      p(fruit[1], 19, 10, 1, 6)
      p(fruit[0], 10, 12, 4, 8)
      p(fruit[1], 11, 13, 1, 5)
    } else if (shape === 'flower') {
      p(dark, 15, 10, 3, 20)
      disc(p, leaf, 10, 22, 4)
      disc(p, leaf, 21, 19, 4)
      disc(p, fruit[0], 16, 9, 6)
      disc(p, fruit[1], 16, 9, 2)
      p('#ffffff', 13, 5, 2, 1)
    } else {
      disc(p, dark, 11, 14, 5)
      disc(p, leaf, 20, 12, 5)
      disc(p, fruit[0], 16, 22, 7)
      p('#c4661a', 13, 16, 1, 13)
      p('#c4661a', 19, 16, 1, 13)
      p(fruit[1], 11, 19, 2, 3)
      p('#5a331a', 15, 13, 2, 3)
    }
  }, { shadow: [16, 30, 10, 2] })
}

// ── Karakterler (16×24, 4 yön × 3 kare) ─────────────────────────────────────
export const LOOKS = {
  player: { skin: '#f5c9a0', hair: '#7a4a26', shirt: '#4f9a3a', pants: '#3d5fa8', shoes: '#3b2414', hat: '#ecc45e', band: '#b5651d' },
  sema: { skin: '#f6cfae', hair: '#3b2414', shirt: '#ee86b0', pants: '#6a3f8a', shoes: '#3b2414', long: true },
}

const EYE = '#2b1a10'

// dir: 0 aşağı, 1 yukarı, 2 sol (sağ = sol'un aynası); frame: 0 duruş, 1–2 adım
function drawPerson(p, L, dir, frame) {
  const b = frame ? -1 : 0
  const side = dir === 2
  // Bacaklar
  if (side) {
    if (frame) {
      p(L.pants, 4, 17, 3, 4); p(L.shoes, 4, 21, 3, 1)
      p(L.pants, 9, 17, 3, 4); p(L.shoes, 9, 21, 3, 1)
    } else {
      p(L.pants, 6, 17, 4, 4); p(L.shoes, 5, 21, 5, 1)
    }
  } else {
    const ly = frame === 1 ? -1 : 0, ry = frame === 2 ? -1 : 0
    p(L.pants, 5, 17 + ly, 3, 4); p(L.shoes, 5, 21 + ly, 3, 1)
    p(L.pants, 9, 17 + ry, 3, 4); p(L.shoes, 9, 21 + ry, 3, 1)
  }
  // Gövde
  if (L.long && dir === 1) p(L.hair, 4, 9 + b, 8, 6)
  p(L.shirt, 4, 11 + b, 8, 7)
  if (L.hat) {
    p(L.pants, 5, 11 + b, 1, 3); p(L.pants, 10, 11 + b, 1, 3); p(L.pants, 5, 14 + b, 6, 4)
  } else {
    p(L.pants, 4, 17 + b, 8, 1)
  }
  if (side) {
    const sw = frame === 1 ? -1 : frame === 2 ? 1 : 0
    p(L.shirt, 7 + sw, 12 + b, 2, 4); p(L.skin, 7 + sw, 16 + b, 2, 1)
  } else {
    const sw = frame === 1 ? 1 : 0, sw2 = frame === 2 ? 1 : 0
    p(L.shirt, 3, 12 + b + sw, 1, 4); p(L.skin, 3, 16 + b + sw, 1, 1)
    p(L.shirt, 12, 12 + b + sw2, 1, 4); p(L.skin, 12, 16 + b + sw2, 1, 1)
  }
  // Baş
  p(L.skin, 4, 3 + b, 8, 8)
  if (dir === 0) {
    p(L.hair, 3, 2 + b, 10, 3)
    p(L.hair, 3, 4 + b, 1, L.long ? 10 : 4); p(L.hair, 12, 4 + b, 1, L.long ? 10 : 4)
    if (L.long) { p(L.hair, 2, 5 + b, 1, 8); p(L.hair, 13, 5 + b, 1, 8) }
    p(L.hair, 4, 5 + b, 3, 1)
    p(EYE, 6, 7 + b, 1, 2); p(EYE, 9, 7 + b, 1, 2)
    p('#f29b9b', 5, 9 + b, 1, 1); p('#f29b9b', 10, 9 + b, 1, 1)
  } else if (dir === 1) {
    p(L.hair, 3, 2 + b, 10, 9)
    if (L.long) p(L.hair, 3, 10 + b, 10, 4)
  } else {
    p(L.hair, 3, 2 + b, 10, 3)
    p(L.hair, 8, 4 + b, 5, L.long ? 10 : 5)
    p(L.hair, 4, 5 + b, 2, 1)
    p(EYE, 5, 7 + b, 1, 2)
    p('#f29b9b', 5, 9 + b, 1, 1)
    p(L.skin, 3, 7 + b, 1, 2)
  }
  if (L.hat) {
    p(L.hat, 4, 0 + b, 8, 3)
    p(L.band, 4, 2 + b, 8, 1)
    p(L.hat, 1, 3 + b, 14, 2)
    p('#d9a441', 1, 4 + b, 14, 1)
  }
}

function mirror(s) {
  const c = makeCanvas(s.img.width, s.img.height)
  const ctx = c.getContext('2d')
  ctx.scale(-1, 1)
  ctx.drawImage(s.img, -c.width, 0)
  return { img: c, w: s.w, h: s.h }
}

// frames[dir][frame]; dir 3 (sağ) sol karelerin aynası
export function personFrames(look) {
  const L = LOOKS[look]
  const frames = [0, 1, 2].map(dir =>
    [0, 1, 2].map(f => sprite(16, 24, p => drawPerson(p, L, dir, f), { shadow: [8, 22, 5, 2] })))
  frames.push(frames[2].map(mirror))
  return frames
}

// ── Göstergeler ─────────────────────────────────────────────────────────────
export function bubbleSprite() {
  return sprite(9, 11, (p) => {
    p('#ffffff', 0, 1, 9, 7)
    p('#ffffff', 1, 0, 7, 9)
    p('#ffffff', 3, 9, 2, 1)
    p('#e0352b', 4, 2, 1, 3)
    p('#e0352b', 4, 6, 1, 1)
  })
}

export function arrowSprite() {
  return sprite(9, 9, (p) => {
    p('#ffd23f', 3, 0, 3, 4)
    p('#ffd23f', 0, 4, 9, 1)
    p('#ffd23f', 1, 5, 7, 1)
    p('#ffd23f', 2, 6, 5, 1)
    p('#ffd23f', 3, 7, 3, 1)
    p('#fff3a8', 3, 0, 1, 4)
  })
}

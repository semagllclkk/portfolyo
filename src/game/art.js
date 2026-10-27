// ── PIXEL ART ────────────────────────────────────────────────────────────────
// Tüm çizimler özgün ve elle tasarlandı (Stardew Valley'den esinlenildi).
// Küçük nesneler ve karakterler harf ızgarası olarak çizilir; ağaç tacı gibi
// kümeli dokular ışığı sol üstten alan küçük bir gölgelendiriciyle üretilir.
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

// ── Renk yardımcıları ───────────────────────────────────────────────────────
const RGB = {}
export function rgb(h) {
  return (RGB[h] ??= [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)))
}
const INK = [34, 20, 44]

// Renkli kontur: dolu komşunun rengini mora kaydırarak koyulaştırır.
// Işık sol üstten geldiği için o kenarlardaki kontur biraz daha açıktır.
function addOutline(c) {
  const ctx = c.getContext('2d')
  const { width: w, height: h } = c
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  const out = new Uint8ClampedArray(d)
  const filled = (x, y) => x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 200
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (d[(y * w + x) * 4 + 3]) continue
      let best = -1, lum = 1e9, lit = false
      for (const [nx, ny, l] of [[x, y + 1, true], [x + 1, y, true], [x - 1, y, false], [x, y - 1, false]]) {
        if (!filled(nx, ny)) continue
        const i = (ny * w + nx) * 4
        const v = d[i] * 3 + d[i + 1] * 6 + d[i + 2]
        if (v < lum) { lum = v; best = i; lit = l }
      }
      if (best < 0) continue
      const k = lit ? 0.56 : 0.7
      const o = (y * w + x) * 4
      for (let j = 0; j < 3; j++) out[o + j] = d[best + j] + (INK[j] - d[best + j]) * k
      out[o + 3] = 255
    }
  }
  ctx.putImageData(new ImageData(out, w, h), 0, 0)
}

// Piksel kenarlı yumuşak gölge (mora çalan, yarı saydam)
function pixelShadow(ctx, cx, cy, rx, ry) {
  ctx.save()
  ctx.globalCompositeOperation = 'destination-over'
  ctx.fillStyle = 'rgba(52, 36, 78, .26)'
  for (let y = -ry; y <= ry; y++) {
    const hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y / (ry + 0.5)) ** 2)))
    if (hw > 0) ctx.fillRect(cx - hw, cy + y, hw * 2, 1)
  }
  ctx.restore()
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
  if (shadow) pixelShadow(ctx, ...shadow)
  return { img: c, w, h }
}

export function drawSprite(ctx, s, x, y) {
  ctx.drawImage(s.img, Math.round(x) - 1, Math.round(y) - 1)
}

// Harf ızgarası çizer: her harf paletteki bir renktir, '.' saydam
export function grid(p, rows, pal, ox = 0, oy = 0, flip = false) {
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const col = pal[row[x]]
      if (col) p(col, ox + (flip ? row.length - 1 - x : x), oy + y)
    }
  })
}

// ── Kümeli yaprak gölgelendiricisi ──────────────────────────────────────────
// Üst üste binen yumrular (öndekiler aşağıda) + her yumrunun içinde küçük
// yaprak kümeleri. R: koyudan açığa 5 tonluk, tonu kaydırılmış rampa.
function clumps(p, list, R, o = {}) {
  const { seed = 1, cell = 4.2, snow, sparkle = 0, bias = 0, spark = '#ffffff', mask } = o
  const r = rng(seed)
  const cl = list
    .map(([x, y, rad]) => ({ x, y, r: rad, n: Math.max(5, Math.round(rad * 1.35)), ph: r() * 6.28 }))
    .sort((a, b) => a.y - b.y)
  const x0 = Math.floor(Math.min(...cl.map(c => c.x - c.r))) - 1
  const x1 = Math.ceil(Math.max(...cl.map(c => c.x + c.r))) + 1
  const y0 = Math.floor(Math.min(...cl.map(c => c.y - c.r))) - 1
  const y1 = Math.ceil(Math.max(...cl.map(c => c.y + c.r))) + 1
  const W = x1 - x0 + 1, H = y1 - y0 + 1
  const own = new Int16Array(W * H).fill(-1)
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      for (let i = cl.length - 1; i >= 0; i--) {
        const c = cl[i]
        const dx = x + 0.5 - c.x, dy = y + 0.5 - c.y
        const d = Math.hypot(dx, dy)
        if (d > c.r + 0.5) continue
        // Tırtıklı kenar: yuvarlak değil, yumru yumru
        const rr = c.r - 1.15 * (1 - Math.abs(Math.sin(Math.atan2(dy, dx) * c.n / 2 + c.ph)))
        if (d <= rr) { own[(y - y0) * W + (x - x0)] = i; break }
      }
    }
  }
  const at = (x, y) => (x < x0 || y < y0 || x > x1 || y > y1 ? -1 : own[(y - y0) * W + (x - x0)])
  // Yaprak kümeleri için titreşimli ızgara noktaları
  const pts = []
  for (let k = 0, y = y0 - cell; y <= y1 + cell; y += cell * 0.8, k++) {
    for (let x = x0 - cell + (k % 2) * cell / 2; x <= x1 + cell; x += cell) {
      pts.push([x + (r() - 0.5) * cell * 0.5, y + (r() - 0.5) * cell * 0.5])
    }
  }
  const out = []
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = at(x, y)
      if (i < 0) continue
      const c = cl[i]
      const dx = (x + 0.5 - c.x) / c.r, dy = (y + 0.5 - c.y) / c.r
      const nz = Math.sqrt(Math.max(0, 1 - dx * dx - dy * dy))
      const Ib = -dx * 0.55 - dy * 0.65 + nz * 0.52
      let d1 = 1e9, d2 = 1e9, best = pts[0]
      for (const pt of pts) {
        const d = (x + 0.5 - pt[0]) ** 2 + (y + 0.5 - pt[1]) ** 2
        if (d < d1) { d2 = d1; d1 = d; best = pt } else if (d < d2) d2 = d
      }
      const sx = (x + 0.5 - best[0]) / (cell * 0.7), sy = (y + 0.5 - best[1]) / (cell * 0.7)
      const sz = Math.sqrt(Math.max(0, 1 - sx * sx - sy * sy))
      const Is = -sx * 0.55 - sy * 0.65 + sz * 0.52
      const gy = (y - y0) / (y1 - y0), gx = (x - x0) / (x1 - x0)
      const I = 0.5 * Ib + 0.32 * Is - 0.32 * gy - 0.12 * gx + 0.32 + bias
      let b = I < 0.06 ? 0 : I < 0.3 ? 1 : I < 0.54 ? 2 : I < 0.76 ? 3 : 4
      // Yaprak kümesinin alt kenarı koyu bir yay çizer
      if (Math.sqrt(d2) - Math.sqrt(d1) < 0.9 && y + 0.5 > best[1]) b = Math.max(0, b - 1)
      // Önde duran yumrunun hemen üstü (girinti) en koyu
      const below = at(x, y + 1)
      if (below > i) b = 0
      else if (at(x, y + 2) > i) b = Math.max(0, b - 1)
      if (mask && !mask(x, y)) continue
      let col = R[b]
      if (snow) {
        const sy2 = dy + 0.22 * Math.sin(x * 1.3 + c.ph) + 0.1 * Math.sin(x * 3.1)
        if (sy2 < -0.12 && below <= i) col = snow[b >= 3 ? 2 : b >= 1 ? 1 : 0]
      }
      if (sparkle && b >= 3 && r() < sparkle) col = spark
      out.push([col, x, y, b])
      p(col, x, y)
    }
  }
  return out
}

// ── Mevsim paletleri (5 tonluk, gölgeler maviye/mora, ışıklar sarıya kayar) ──
const LEAF = {
  green: ['#294a3c', '#33703f', '#4c9542', '#77b94c', '#b2dc6a'],
  lime: ['#2c4c38', '#3d7a3b', '#5ea13f', '#8fc54d', '#c8e57a'],
  teal: ['#1c3a40', '#22594f', '#2c7a5c', '#4a9c66', '#8cc480'],
  pink: ['#6a2c5a', '#a8457a', '#d86a98', '#f39abb', '#ffd0df'],
  orange: ['#55253a', '#923a33', '#c95a2e', '#eb8a36', '#fac35c'],
  gold: ['#4d3a2c', '#86642a', '#b99329', '#dcbf3d', '#f5e37a'],
  red: ['#4f1f39', '#8c2a3a', '#c23e3a', '#e2683e', '#f6a260'],
  pine: ['#1d2f42', '#24484f', '#2f6460', '#43806f', '#6aa384'],
}
const SNOW = ['#a9b8dc', '#d4e0f1', '#ffffff']
const BARK = { d: '#3f2631', D: '#5e3a36', M: '#7f5440', L: '#a2724f', h: '#c49568' }

const FOLIAGE = {
  spring: { blossom: 'pink', oak: 'green', teal: 'teal' },
  summer: { blossom: 'lime', oak: 'green', teal: 'teal' },
  fall: { blossom: 'red', oak: 'orange', teal: 'gold' },
  winter: { blossom: null, oak: null, teal: 'pine' },
}

// Zemin paletleri: world.js renderGround kullanır
export const GROUND = {
  spring: {
    grass: ['#3f7f4c', '#58a053', '#6fb85a', '#86c964', '#b6e283'],
    path: ['#a07150', '#c49464', '#dcb47c', '#e8c994', '#f5dfb3'],
    sand: ['#c08c5c', '#d9ab74', '#ead08f', '#f4e0ae', '#fdf2d4'],
    water: ['#2f4f93', '#3a6db5', '#4a8fd2', '#6db4e6', '#c4ecfa'],
    flowers: ['#ffb3cc', '#ffffff', '#ffe27a', '#ff8fb1'],
  },
  summer: {
    grass: ['#367547', '#4f994d', '#64ae52', '#7fc25b', '#acd977'],
    path: ['#a07150', '#c49464', '#dcb47c', '#e8c994', '#f5dfb3'],
    sand: ['#c08c5c', '#d9ab74', '#ead08f', '#f4e0ae', '#fdf2d4'],
    water: ['#2c4c90', '#3669b3', '#4589d0', '#68b0e6', '#c4ecfa'],
    flowers: ['#ffe27a', '#c9a0ff', '#ffffff', '#7fb8ff'],
  },
  fall: {
    grass: ['#6a6a3a', '#8c8a40', '#a6a04a', '#bdb45a', '#d8cd7c'],
    path: ['#986848', '#bb8a5c', '#d4aa74', '#e2bf8b', '#f0d7aa'],
    sand: ['#b8855a', '#d3a470', '#e4c78a', '#f0daa8', '#faeccc'],
    water: ['#2b4785', '#34629f', '#4380be', '#64a3d6', '#bfe3f4'],
    flowers: ['#e8743a', '#c9442f', '#f2b046'],
  },
  winter: {
    grass: ['#8d9cc8', '#b3c1e0', '#d3ddef', '#e8eef8', '#ffffff'],
    path: ['#8c7f96', '#a89cad', '#c2b8c4', '#d6cfd8', '#e9e5ec'],
    sand: ['#a49aae', '#bdb4c4', '#d4cdd9', '#e6e1ea', '#f6f3f8'],
    water: ['#3a5a94', '#4777b2', '#5e96cc', '#8cbfe4', '#e2f4fc'],
    flowers: [],
  },
}

// ── Ağaçlar ─────────────────────────────────────────────────────────────────
// 40×56; gövde ortası x=20, taban y=54. world.js bu noktayı karoya oturtur.
export const TREE_ANCHOR = [20, 54]
const TRUNK = [
  '....hLMMD...',
  '....hLMMD...',
  '....hLMDD...',
  '....hLMMD...',
  '....hLLMDd..',
  '....hLMMDd..',
  '...hhLMMDd..',
  '...hLMMMDd..',
  '...hLMDMMDd.',
  '..hLLMDMMMDd',
  '..hLMd.dMMDd',
  '.hLMd...dDDd',
]

const CANOPY = {
  blossom: [[20, 8, 7.5], [12, 11, 7], [28, 11, 7], [6, 19, 6], [34, 19, 6], [15, 18, 8], [25, 18, 8], [20, 26, 8], [10, 28, 6.5], [30, 28, 6.5], [16, 34, 6], [24, 34, 6]],
  oak: [[20, 7, 6.5], [14, 10, 6], [26, 10, 6], [20, 14, 7], [10, 17, 6], [30, 17, 6], [15, 21, 7], [25, 21, 7], [20, 25, 7], [8, 26, 5.5], [32, 26, 5.5], [13, 30, 6.5], [27, 30, 6.5], [20, 33, 6.5], [9, 34, 4.5], [31, 34, 4.5]],
  teal: [[20, 4, 4.5], [17, 9, 4.5], [23, 9, 4.5], [20, 13, 5.5], [14, 17, 5], [26, 17, 5], [20, 21, 6], [12, 25, 5.5], [28, 25, 5.5], [17, 28, 6], [23, 28, 6], [10, 32, 5], [30, 32, 5], [20, 35, 6.5], [14, 38, 5], [26, 38, 5]],
}

// Kışın yaprak döken ağaçlar: karlı çıplak dallar
function bareTree(p, seed) {
  const r = rng(seed)
  const W = 40, H = 56
  const m = new Uint8Array(W * H)
  const put = (x, y) => { if (x >= 0 && y >= 0 && x < W && y < H) m[y * W + x] = 1 }
  const branch = (x, y, a, len, th, depth) => {
    for (let i = 0; i < len; i++) {
      x += Math.cos(a); y += Math.sin(a)
      for (let t = 0; t < th; t++) put(Math.round(x) + t - (th >> 1), Math.round(y))
      a += (r() - 0.5) * 0.18
    }
    if (depth <= 0) return
    const n = depth > 1 ? 2 : 2 + (r() < 0.5)
    for (let k = 0; k < n; k++) {
      const da = (k - (n - 1) / 2) * (0.75 + r() * 0.25)
      branch(x, y, a + da, len * (0.66 + r() * 0.12), Math.max(1, th - 1), depth - 1)
    }
  }
  branch(20, 43, -Math.PI / 2 - 0.55, 9, 3, 3)
  branch(20, 42, -Math.PI / 2 + 0.5, 9, 3, 3)
  branch(20, 41, -Math.PI / 2 + 0.05, 11, 3, 2)
  const on = (x, y) => x >= 0 && y >= 0 && x < W && y < H && m[y * W + x]
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!on(x, y)) continue
      p(!on(x - 1, y) ? BARK.L : !on(x + 1, y) ? BARK.D : BARK.M, x, y)
    }
  }
  // Dalların üstünde kar
  for (let y = 1; y < 42; y++) {
    for (let x = 0; x < W; x++) {
      if (on(x, y) && !on(x, y - 1) && r() < 0.75) p(r() < 0.3 ? SNOW[1] : SNOW[2], x, y - 1)
    }
  }
}

export function treeSprite(kind, season, variant) {
  // Pembe çiçekli ağaçlar yalnızca ilkbaharda ve seyrek bir vurgu
  let ramp = FOLIAGE[season][kind]
  if (ramp === 'pink' && variant !== 0) ramp = 'lime'
  const r = rng(variant * 977 + kind.length * 31 + 5)
  const flip = variant === 1
  const base = CANOPY[kind].map(([x, y, rad]) => [
    (flip ? 40 - x : x) + Math.round((r() - 0.5) * 2), y + Math.round((r() - 0.5) * 2) + (variant === 2 ? 1 : 0), rad + (r() - 0.5) * 0.8,
  ])
  return sprite(40, 56, (p) => {
    grid(p, TRUNK, BARK, 14, 42, flip)
    if (!ramp) { bareTree(p, variant * 31 + kind.length); return }
    const px = clumps(p, base, LEAF[ramp], {
      seed: variant * 13 + kind.length,
      cell: kind === 'teal' ? 3.8 : 4.8,
      snow: season === 'winter' ? SNOW : null,
      sparkle: ramp === 'pink' ? 0.06 : 0,
      spark: '#fff4f8',
    })
    // Tacın altında gövdeye düşen koyu gölge
    const bottom = {}
    px.forEach(([, x, y]) => { bottom[x] = Math.max(bottom[x] ?? -1, y) })
    TRUNK.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) {
        if (row[i] === '.') continue
        const x = 14 + (flip ? row.length - 1 - i : i), y = 42 + j
        const gap = y - (bottom[x] ?? -9)
        if (gap >= 1 && gap <= 2) p(BARK.d, x, y)
        else if (gap === 3 || gap === 4) p(row[i] === 'h' || row[i] === 'L' ? BARK.M : BARK.D, x, y)
      }
    })
  }, { shadow: [20, 53, 13, 3] })
}

// ── Çiftlik evi (7×6 karo = 112×96) ─────────────────────────────────────────
export const HOUSE_WINDOWS = [[20, 56], [76, 56]]

const ROOF = ['#3e1f2e', '#66303a', '#8e4440', '#b25d48', '#d07f5a']
const ROOF_SNOW = ['#8d9cc4', '#b4c3e2', '#dbe4f3', '#f4f7fc', '#ffffff']
const WALL = ['#9c8a92', '#cdbdb0', '#e9dcc6', '#f6eedc']
const WOOD = ['#3a2430', '#5c3a34', '#7f5440', '#a6754f', '#c99a68']
const STONE = ['#4a4559', '#6c687c', '#918da0', '#b6b2bf', '#d8d5dd']
const GLASS = ['#5a83b8', '#7fb0d8', '#a8d4ee', '#e4f6ff']

export function houseSprite(season) {
  const winter = season === 'winter'
  const r = rng(77)
  return sprite(112, 96, (p) => {
    // Duvar (sıva) ve hafif doku
    p(WALL[2], 8, 46, 96, 40)
    for (let i = 0; i < 70; i++) {
      const x = 9 + Math.floor(r() * 94), y = 52 + Math.floor(r() * 32)
      p(r() < 0.5 ? WALL[3] : WALL[1], x, y, 1 + (r() < 0.4), 1)
    }
    p(WALL[1], 8, 80, 96, 6)
    // Saçak altı gölgesi
    p(WALL[0], 8, 46, 96, 3)
    p(WALL[1], 8, 49, 96, 2)
    // Ahşap kirişler
    const beam = (x, y, w, h) => {
      p(WOOD[2], x, y, w, h)
      if (w > h) { p(WOOD[3], x, y, w, 1); p(WOOD[1], x, y + h - 1, w, 1) } else { p(WOOD[3], x, y, 1, h); p(WOOD[1], x + w - 1, y, 1, h) }
    }
    ;[8, 43, 66, 101].forEach(x => beam(x, 46, 3, 40))
    beam(8, 51, 96, 3)
    // Taş temel: düzensiz taşlar
    p(STONE[0], 6, 84, 100, 10)
    for (let row = 0, y = 84; row < 2; row++, y += 5) {
      let x = 6 + (row ? 4 : 0)
      if (row) p(STONE[2], 6, y, 4, 4)
      while (x < 106) {
        const w = Math.min(106 - x, 6 + Math.floor(r() * 6))
        p(STONE[2], x, y, w - 1, 4)
        p(STONE[3], x, y, w - 2, 1)
        p(STONE[3], x, y, 1, 3)
        p(STONE[1], x + 1, y + 3, w - 2, 1)
        p(STONE[1], x + w - 2, y + 1, 1, 3)
        if (r() < 0.35) p(STONE[4], x + 1, y + 1, 1, 1)
        x += w
      }
    }
    // Pencereler: panjur, cam, çiçek saksısı
    HOUSE_WINDOWS.forEach(([x, y]) => {
      ;[x - 6, x + 19].forEach(sx => {
        p('#2f5c5a', sx, y - 1, 5, 20)
        p('#4f8c7e', sx + 1, y, 3, 18)
        for (let k = 2; k < 18; k += 3) p('#3a6f68', sx + 1, y + k, 3, 1)
        p('#79b59a', sx + 1, y, 1, 18)
      })
      p(WOOD[1], x - 1, y - 1, 20, 20)
      p(WOOD[3], x, y, 18, 18)
      p(WOOD[4], x, y, 18, 1)
      p(GLASS[1], x + 2, y + 2, 14, 14)
      p(GLASS[2], x + 2, y + 2, 6, 6)
      p(GLASS[2], x + 10, y + 2, 6, 2)
      p(GLASS[0], x + 10, y + 12, 6, 4)
      p(GLASS[0], x + 2, y + 14, 6, 2)
      // Camda küçük parıltı
      p(GLASS[3], x + 4, y + 3, 2, 1); p(GLASS[3], x + 4, y + 4, 1, 1); p(GLASS[3], x + 12, y + 11, 1, 2)
      // Perde
      p('#f6d6c8', x + 2, y + 2, 2, 6); p('#f6d6c8', x + 14, y + 2, 2, 6)
      p('#d9aa9c', x + 3, y + 2, 1, 6); p('#d9aa9c', x + 14, y + 2, 1, 6)
      p(WOOD[2], x + 8, y + 2, 2, 14)
      p(WOOD[2], x + 2, y + 8, 14, 2)
      p(WOOD[3], x + 8, y + 2, 1, 14)
      // Saksı ve çiçekler
      p(WOOD[1], x - 2, y + 19, 22, 4)
      p(WOOD[3], x - 2, y + 19, 22, 1)
      p(WOOD[0], x - 1, y + 23, 20, 1)
      if (!winter) {
        for (let k = 0; k < 20; k++) {
          const fx = x - 1 + k
          p(k % 3 ? '#3f8a45' : '#5ea84d', fx, y + 17 + (k % 2), 1, 2 - (k % 2))
        }
        ;[0, 4, 8, 12, 16].forEach((fx, i) => {
          const col = ['#ff8fb1', '#ffe27a', '#ffffff', '#ff8fb1', '#c9a0ff'][i]
          p(col, x + fx, y + 16, 2, 2)
          p('#fff6d8', x + fx, y + 16, 1, 1)
        })
      } else {
        p(SNOW[2], x - 2, y + 18, 22, 2)
        p(SNOW[1], x - 1, y + 19, 20, 1)
      }
    })
    // Kapı (24. karoya hizalı: x 48–63) ve kemerli kasa
    p(WOOD[0], 45, 58, 22, 30)
    p(WOOD[1], 46, 57, 20, 1)
    p(WOOD[3], 46, 59, 20, 1)
    for (let k = 0; k < 4; k++) {
      const x = 48 + k * 4
      p(WOOD[2], x, 61, 4, 27)
      p(WOOD[3], x, 61, 1, 27)
      p(WOOD[1], x + 3, 61, 1, 27)
    }
    p(WOOD[1], 48, 65, 16, 2); p(WOOD[3], 48, 65, 16, 1)
    p(WOOD[1], 48, 80, 16, 2); p(WOOD[3], 48, 80, 16, 1)
    p(GLASS[1], 52, 68, 8, 6); p(GLASS[2], 52, 68, 4, 3); p(WOOD[1], 55, 68, 2, 6)
    p('#f2c14e', 60, 75, 2, 2); p('#fff0a0', 60, 75, 1, 1)
    // Kapı feneri
    p(WOOD[0], 69, 60, 1, 3)
    p('#3a3440', 68, 62, 4, 6)
    p('#ffd77a', 69, 63, 2, 4)
    p('#fff4c0', 69, 63, 1, 1)
    // Basamak
    p(STONE[2], 42, 88, 28, 6)
    p(STONE[3], 42, 88, 28, 1)
    p(STONE[1], 42, 93, 28, 1)
    p(STONE[1], 55, 89, 1, 4)
    // Çatı: sırttan saçağa genişleyen pul kiremitler
    const L = y => Math.round(30 - (y - 8) * (28 / 36)), R = y => Math.round(82 + (y - 8) * (28 / 36))
    const snowLine = x => 40 + Math.round(Math.sin(x * 0.7) * 1.5 + Math.sin(x * 0.23) * 1.5)
    // Bir kiremit pikselinin tonu (0–4); kar varsa kar rampası
    const tile = (x, y, l, top, snowy) => {
      const row = Math.floor((y - top) / 5), ly = (y - top) % 5
      const off = (row % 2) * 3, sx = (x - l - off + 60) % 6
      const tint = rng(row * 131 + Math.floor((x - l - off + 60) / 6) * 7 + top)()
      if (snowy) {
        // Karın altında yumuşak sıralar, sol üst daha parlak
        let t = ly === 4 && sx > 0 && sx < 5 ? 2 : 3
        if (t === 3 && (y - top < 10 || tint > 0.8)) t = 4
        return ROOF_SNOW[t]
      }
      let t = 2 + (tint < 0.2 ? -1 : tint > 0.85 ? 1 : 0)
      if (ly === 0) t = 3
      if (ly === 4 || (ly === 3 && (sx === 0 || sx === 5))) t = 1
      if (sx === 0 && ly > 0 && ly < 3) t = 1
      if (y - top < 8 && t === 2 && tint > 0.5) t = 3
      return ROOF[t]
    }
    for (let y = 8; y <= 44; y++) {
      const l = L(y), rr = R(y)
      for (let x = l; x < rr; x++) {
        const snowy = winter && y < snowLine(x)
        p(y < 9 ? ROOF[1] : tile(x, y, l, 9, snowy), x, y)
        if (snowy && y === snowLine(x) - 1) p(ROOF_SNOW[1], x, y)
      }
      // Kenar tahtaları
      p(WOOD[3], l, y, 2, 1)
      p(WOOD[1], rr - 2, y, 2, 1)
    }
    // Çatı penceresi (kapının üstünde): küçük duvar, yuvarlak cam, üçgen çatı
    p(ROOF[0], 45, 40, 22, 2)
    p(WALL[2], 47, 25, 18, 15)
    p(WALL[1], 47, 37, 18, 3)
    p(WOOD[2], 47, 25, 2, 15); p(WOOD[1], 63, 25, 2, 15)
    p(WOOD[1], 51, 28, 10, 10); p(WOOD[1], 52, 27, 8, 1)
    p(GLASS[1], 52, 29, 8, 8); p(GLASS[1], 53, 28, 6, 1)
    p(GLASS[2], 52, 29, 3, 3); p(GLASS[3], 53, 29, 1, 1)
    p(GLASS[0], 56, 34, 4, 3)
    p(WOOD[2], 55, 28, 2, 9); p(WOOD[2], 52, 32, 8, 1)
    p(WOOD[3], 50, 38, 12, 2)
    for (let y = 14; y <= 28; y++) {
      const hw = Math.round(2 + (y - 14) * 0.85), l = 56 - hw, rr = 56 + hw
      for (let x = l; x < rr; x++) {
        const snowy = winter && y < 26 + Math.round(Math.sin(x * 0.9))
        p(tile(x, y, l, 15, snowy), x, y)
      }
      p(WOOD[3], l, y, 2, 1)
      p(WOOD[1], rr - 2, y, 2, 1)
    }
    p(WOOD[1], 42, 28, 28, 2); p(WOOD[3], 42, 28, 28, 1)
    if (winter) { p(ROOF_SNOW[4], 42, 27, 28, 1); for (let x = 44; x < 68; x += 5) p('#e6f4ff', x, 30, 1, 2) }
    // Mahya ve saçak tahtası
    p(ROOF[0], 30, 6, 52, 3)
    p(ROOF[3], 31, 6, 50, 1)
    p(WOOD[1], 0, 44, 112, 3)
    p(WOOD[3], 0, 44, 112, 1)
    p(WOOD[0], 2, 47, 108, 1)
    // Baca
    p(STONE[1], 80, 2, 11, 16)
    for (let y = 3; y < 18; y += 4) {
      p(STONE[2], 80, y, 5, 3); p(STONE[2], 86, y, 5, 3)
      p(STONE[3], 80, y, 4, 1); p(STONE[3], 86, y, 4, 1)
      p(STONE[2], 82, y + 2, 1, 1)
    }
    p(STONE[0], 79, 0, 13, 3)
    p(STONE[2], 79, 0, 13, 1)
    p('#2a2530', 81, 0, 9, 1)
    if (winter) {
      p(ROOF_SNOW[4], 29, 5, 54, 2)
      p(ROOF_SNOW[3], 30, 7, 52, 1)
      p(SNOW[2], 0, 43, 112, 2)
      p(SNOW[1], 0, 45, 112, 1)
      // Buz sarkıtları
      for (let x = 3; x < 110; x += 4 + Math.floor(r() * 5)) {
        const len = 2 + Math.floor(r() * 4)
        p('#e6f4ff', x, 47, 1, len)
        p('#b4d4f0', x, 47 + len - 1, 1, 1)
      }
      p(SNOW[2], 78, -1, 15, 2)
      p(SNOW[2], 42, 87, 28, 2)
    }
  })
}

// ── Küçük nesneler ──────────────────────────────────────────────────────────
const OBJ = {
  d: WOOD[0], D: WOOD[1], M: WOOD[2], L: WOOD[3], h: WOOD[4],
  Y: '#f2c14e', y: '#b8862f', k: '#2d2130', s: STONE[2], S: STONE[3],
  w: '#fff7e4', W: '#f1e2bf', c: '#cdb48a', r: '#e04848', R: '#a8323d', b: '#6b8fd6',
  N: '#3d5fa8', n: '#283f78', B: '#5a86d1', l: '#9cc2f0', g: '#8a8494', G: '#bdb8c2', e: '#4f9a4a', E: '#2f6a42',
}

const BOARD = [
  '..dddddddddddddddddddddddddddddddddddddddddddd..',
  '.dDDMMDDMMDDMMDDMMDDMMDDMMDDMMDDMMDDMMDDMMDDMDd.',
  'dLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLd',
  'dDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDd',
  '.ddddddddddddddddddddddddddddddddddddddddddddddd',
  '..dLLMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMd..',
  '..dLDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDMd..',
  '..dLDMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMDMd..',
  '..dLDMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMDMd..',
  '..dLDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDMd..',
  '..dLDMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMDMd..',
  '..dLDMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMDMd..',
  '..dLDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDMd..',
  '..dLDMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMDMd..',
  '..dLDMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMDMd..',
  '..dLDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDMd..',
  '..dLDMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMDMd..',
  '..dLDMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMDMd..',
  '..dLMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMd..',
  '..dDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDd..',
  '...dddddddddddddddddddddddddddddddddddddddddd...',
  '.....dLMDd..........................dLMDd.......',
  '.....dLMDd..........................dLMDd.......',
  '.....dLMDd..........................dLMDd.......',
  '.....dLMDd..........................dLMDd.......',
  '.....dLMDd..........................dLMDd.......',
  '.....dLMDd..........................dLMDd.......',
  '.....dLMDd..........................dLMDd.......',
  '.....dLDDd..........................dLDDd.......',
  '....dLDDDDd........................dLDDDDd......',
]

export function boardSprite(season) {
  return sprite(48, 32, (p) => {
    grid(p, BOARD, OBJ, 0, 2)
    // İlan kâğıtları: hafif eğik, raptiyeli
    const note = (x, y, w, h, col, pin) => {
      p(col, x, y, w, h)
      p('#c4ab84', x + 1, y + h, w, 1)
      p('#c4ab84', x + w, y + 1, 1, h)
      for (let ly = y + 3; ly < y + h - 1; ly += 2) p('#a8916e', x + 2, ly, w - 4 - (ly % 3), 1)
      p(pin, x + Math.floor(w / 2) - 1, y, 2, 2)
      p('#ffffff', x + Math.floor(w / 2) - 1, y, 1, 1)
    }
    note(7, 10, 10, 12, '#fff7e4', '#e04848')
    note(20, 9, 9, 10, '#ffe7a0', '#3d86e0')
    note(32, 11, 9, 11, '#fff7e4', '#4f9a4a')
    p('#e04848', 22, 15, 5, 1)
    if (season === 'winter') { p(SNOW[2], 1, 1, 46, 2); p(SNOW[1], 2, 3, 44, 1) }
  }, { shadow: [24, 31, 22, 2] })
}

const CHEST = [
  '................',
  '................',
  '...dLLLLLLLLd...',
  '..dYLhhhhhhLYd..',
  '..dYMLLLLLLMYd..',
  '..dyMMMMMMMMyd..',
  '..kkkkkYYkkkkk..',
  '..dYDDDYyDDDYd..',
  '..dYMMMyyMMMYd..',
  '..dYMMMMMMMMYd..',
  '..dYDDDDDDDDYd..',
  '..dYMMMMMMMMYd..',
  '..dyDDDDDDDDyd..',
  '..dyMMMMMMMMyd..',
  '..dddddddddddd..',
  '................',
]

export function chestSprite(season) {
  return sprite(16, 16, (p) => {
    grid(p, CHEST, OBJ)
    if (season === 'winter') { p(SNOW[2], 3, 1, 10, 2); p(SNOW[1], 3, 3, 10, 1) }
  }, { shadow: [8, 15, 8, 2] })
}

const BIN = [
  '.dddddddddddddddddddddddddddddd.',
  'dLhhhhhhhhhhhhhhhhhhhhhhhhhhhhLd',
  'dLLLLLLLLLLLLggGGggLLLLLLLLLLLLd',
  'dDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDd',
  'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',
  'dsMMMMLMMMMLMMMMLMMMMLMMMMLMMMsd',
  'dsMMMMLMMMMLMMMMLMMMMLMMMMLMMMsd',
  'dSMMMMLMMMMLMMMMLMMMMLMMMMLMMMSd',
  'dsDDDDDDDDDDDDDDDDDDDDDDDDDDDDsd',
  'dsMMMMLMMMMLMMMMLMMMMLMMMMLMMMsd',
  'dsMMMMLMMMMLMMMMLMMMMLMMMMLMMMsd',
  'dsMMMMLMMMMLMMMMLMMMMLMMMMLMMMsd',
  'dsDDDDDDDDDDDDDDDDDDDDDDDDDDDDsd',
  'dgDDDDDDDDDDDDDDDDDDDDDDDDDDDDgd',
  '.dddddddddddddddddddddddddddddd.',
  '................................',
]

export function binSprite(season) {
  return sprite(32, 16, (p) => {
    grid(p, BIN, OBJ)
    if (season === 'winter') { p(SNOW[2], 1, -1, 30, 2); p(SNOW[1], 2, 1, 28, 1) }
  }, { shadow: [16, 15, 15, 2] })
}

const MAILBOX = [
  '................',
  '................',
  '............rR..',
  '...nnnnnnn..rrR.',
  '..nNlllBBNn.rR..',
  '.nNlwlBBBBNng...',
  '.nNlBBBBBBNng...',
  '.nNBnnnnnBNng...',
  '.nNBnNNNnBNng...',
  '.nNBnNNNnBNng...',
  '.nNBnnnnnBNng...',
  '.nNBBBBBBBNng...',
  '.nnNNNNNNNNng...',
  '..nnnnnnnnnn....',
  '.....dLMDd......',
  '.....dLMDd......',
  '.....dLMDd......',
  '.....dLMDd......',
  '.....dLMDd......',
  '.....dLMDd......',
  '.....dLMDd......',
  '.....dLMDd......',
  '.....dLMDd......',
  '.....dLMDd......',
  '.....dLMDd......',
  '.....dLDDd......',
  '....dLDDDDd.....',
  '................',
]

export function mailboxSprite(season) {
  return sprite(16, 28, (p) => {
    grid(p, MAILBOX, OBJ)
    if (season === 'winter') { p(SNOW[2], 3, 2, 7, 2); p(SNOW[2], 2, 4, 2, 1) }
  }, { shadow: [7, 27, 6, 2] })
}

const SIGN = [
  '................',
  '................',
  '.dddddddddddddd.',
  'dLhhhhhhhhhhhhLd',
  'dLLLLLLLLLLLLLMd',
  'dLkMMMMMMMMMkMDd',
  'dLMMDDDDDDDMMMDd',
  'dLMMMMMMMMMMMMDd',
  'dLMDDDDDDMMMMMDd',
  'dLMMMMMMMMMMMMDd',
  'dMDDDDDDDDDDDDDd',
  '.dddddLMDddddddd',
  '......dLMDd.....',
  '......dLMDd.....',
  '......dLMDd.....',
  '......dLMDd.....',
  '......dLMDd.....',
  '......dLDDd.....',
  '.....dLDDDDd....',
  '................',
]

export function signSprite(season) {
  return sprite(16, 20, (p) => {
    grid(p, SIGN, OBJ)
    if (season === 'winter') { p(SNOW[2], 0, 1, 16, 2); p(SNOW[1], 1, 3, 14, 1) }
  }, { shadow: [8, 19, 5, 2] })
}

// Beş yapraklı küçük çiçek
function blossom(p, x, y, col, mid) {
  p(col, x, y - 1); p(col, x - 1, y); p(col, x + 1, y); p(col, x, y + 1)
  p(mid, x, y)
}

export function bushSprite(season) {
  const ramp = season === 'fall' ? LEAF.orange : season === 'winter' ? LEAF.pine : LEAF.green
  const flower = season === 'spring' ? ['#ffb3cc', '#ff7fa8'] : season === 'summer' ? ['#c9a0ff', '#8a5ad6'] : null
  return sprite(16, 16, (p) => {
    const px = clumps(p, [[8, 7, 4.5], [4.5, 10, 4], [11.5, 10, 4], [8, 11.5, 4]], ramp, {
      seed: 9, cell: 3.2, snow: season === 'winter' ? SNOW : null,
    })
    const r = rng(41)
    if (flower) {
      ;[[5, 6], [10, 5], [12, 10], [6, 11], [8, 8], [3, 9]].forEach(([x, y], i) => blossom(p, x, y, i % 3 ? flower[0] : '#ffffff', i % 3 ? '#fff2a0' : flower[1]))
    } else if (season === 'fall') {
      px.forEach(([, x, y, b]) => { if (b >= 2 && r() < 0.06) p('#c9303c', x, y) })
    }
  }, { shadow: [8, 15, 7, 2] })
}

// ── Ekinler: her proje bir ekin; 2×2 karoluk parselde 4 bitki ───────────────
const CROP_LEAF = { g: '#2b4f3c', G: '#3f7f3f', L: '#68ac48', Y: '#a8d665', s: '#5e8a3a', S: '#3d6436' }

// Elle çizilmiş bitki ızgaraları (16 genişlik, taban son satır)
const PLANTS = {
  corn: [
    '.......Y........',
    '......yYy.......',
    '.....y.Y.y......',
    '.......s........',
    '......gsY.......',
    '.....gLsLL......',
    '....gL.sGLL.....',
    '...gL..sGcLg....',
    '.......sFHFg....',
    '......gsFHF.....',
    '.....gLsFHF.....',
    '....gL.sFFf.....',
    '...gL..sGff.....',
    '..gg...sGG......',
    '.......sG.......',
    '.....L.sG.g.....',
    '....gL.sGLLg....',
    '...gL..sG..Lg...',
    '...g...sG...g...',
    '......gsGg......',
  ],
  sunflower: [
    '....yyYYyy......',
    '...yYYYYYYy.....',
    '..yYYbbbbYYy....',
    '.yYYbBBdBbYYy...',
    '.yYbBdBBBBbYy...',
    '.YYbBBBBdBbYY...',
    '.yYbBdBBBBbYy...',
    '.yYYbBBdBbYYy...',
    '..yYYbbbbYYy....',
    '...yYYYYYYy.....',
    '....yyYYyy......',
    '.......sS.......',
    '...gg..sS.......',
    '..gLLg.sS..gg...',
    '..gLYLgsSggLLg..',
    '...gLLgsSgLYLg..',
    '....gg.sSggLg...',
    '.......sS.gg....',
    '.......sS.......',
    '......gsSg......',
  ],
  pumpkin: [
    '................',
    '.....gg.........',
    '...ggLLg........',
    '..gLYLLGg.SS....',
    '..gLLGGg..S.....',
    '...ggg.dOSOd....',
    '....dOOHOdOOOd..',
    '...dOHHOdOOOOOd.',
    '..dOHHOOdOOOOOOd',
    '..dOHOOOdOOOOOod',
    '..dOOOOOdOOOOOod',
    '..ddOOOOdOOOOood',
    '...ddooOdOOoodd.',
    '.....dddddddd...',
  ],
  poppy: [
    '...rRR....rRR...',
    '..rRHRr..rRHRr..',
    '..RRkRR..RRkRR..',
    '..rRRRr..rRRRr..',
    '...rrs....srr...',
    '.....s.rRR.s....',
    '..gg.srRHRrs.gg.',
    '.gLLgsRRkRRsgLLg',
    '.gLYLsrRRRrsLYLg',
    '..gLLgsrrrsgLLg.',
    '...gg.s.s..sgg..',
    '......s.s.s.....',
    '.....gsgsgsg....',
    '......gggg......',
  ],
}

// Meyve damgaları
const BERRY = ['.H.', 'HFf', '.ff']
const TOMATO = ['.gG.', 'FHFF', 'FHFf', '.ff.']
const EGGPLANT = ['.gG.', 'gGGg', '.HF.', 'fHFf', 'fFFf', 'fFFf', '.ff.']

export const CROPS = [
  { kind: 'bush', fruit: { H: '#a8c8ff', F: '#4a6fd8', f: '#2e3f94' }, stamp: BERRY, spots: [[3, 4], [9, 3], [11, 8], [5, 9], [8, 6]] },
  { kind: 'cauli' },
  { kind: 'bush', tall: true, fruit: { H: '#ffb0a0', F: '#e0413a', f: '#9c2738', g: '#2b4f3c', G: '#3f7f3f' }, stamp: TOMATO, spots: [[2, 5], [9, 3], [10, 10], [4, 11]] },
  { kind: 'grid', plant: 'corn', pal: { Y: '#fbe48a', y: '#d9a84a', F: '#f2c94a', H: '#fff1a0', f: '#c8902f', c: '#a8d665' } },
  { kind: 'grid', plant: 'sunflower', pal: { Y: '#ffd84a', y: '#e8962e', b: '#6a3a26', B: '#8a5232', d: '#4a2420' } },
  { kind: 'grid', plant: 'pumpkin', pal: { O: '#eb8a36', H: '#fac35c', o: '#c45e2c', d: '#8a3a2e' } },
  { kind: 'bush', tall: true, fruit: { H: '#c9a0ff', F: '#7a3fc0', f: '#4a2380', g: '#2b4f3c', G: '#3f7f3f' }, stamp: EGGPLANT, spots: [[3, 6], [10, 5], [7, 10]] },
  { kind: 'grid', plant: 'poppy', pal: { r: '#b8303c', R: '#e8483e', H: '#ff9a80', k: '#2a1a24' } },
]

const CAULI = ['#8a7a86', '#c4b6a8', '#e6dcc4', '#f6f0de', '#ffffff']

// Tek bitki: (ox, oy) tabanın sol üstü, h bitki yüksekliği
function drawPlant(p, c, ox, base, seed, flip) {
  if (c.kind === 'grid') {
    const rows = PLANTS[c.plant]
    grid(p, rows, { ...CROP_LEAF, ...c.pal }, ox, base - rows.length + 1, flip)
    return
  }
  if (c.kind === 'cauli') {
    // Dört yandan kucaklayan yapraklar ve kümeli beyaz baş
    const leaves = [
      '..gg........gg..',
      '.gLLg......gLLg.',
      '.gLYLg....gLYLg.',
      '..gLLGg..gGLLg..',
      '...........,....',
      '..gGLg....gLGg..',
      '.gGLLLg..gLLLGg.',
      '.gGGLLLggLLLGGg.',
      '..ggGGGLLGGGgg..',
      '....ggggggggg...',
    ]
    grid(p, leaves, CROP_LEAF, ox, base - 9, flip)
    clumps(p, [[ox + 8, base - 6, 4.2], [ox + 5.5, base - 4.5, 3], [ox + 10.5, base - 4.5, 3]], CAULI, { seed, cell: 2.6, bias: 0.12 })
    grid(p, ['.gG..', 'gLLg.', '.gLLg'], CROP_LEAF, ox + (flip ? 10 : 1), base - 3, flip)
    return
  }
  // Yapraklı çalı + meyve damgaları
  const t = c.tall ? 2 : 0
  const top = base - 12 - t
  if (c.tall) { p('#a07a50', ox + 12, top - 3, 1, 15); p('#c89a68', ox + 12, top - 3, 1, 1) }
  clumps(p, [[ox + 8, top + 4, 4.2], [ox + 4.5, top + 7, 3.8], [ox + 11.5, top + 7, 3.8], [ox + 8, top + 9.5, 4], [ox + 5, top + 11 + t / 2, 3], [ox + 11, top + 11 + t / 2, 3]], LEAF.green, { seed, cell: 3 })
  const pal = { ...CROP_LEAF, ...c.fruit }
  c.spots.forEach(([x, y]) => grid(p, c.stamp, pal, ox + (flip ? 13 - x - c.stamp[0].length + 3 : x), top + y - 1))
}

export function cropSprite(i) {
  const c = CROPS[i % CROPS.length]
  const h = c.kind === 'grid' ? PLANTS[c.plant].length : c.tall ? 16 : 14
  const extra = Math.max(0, h - 14)
  return sprite(32, 32 + extra, (p) => {
    // Arka sıra önce, ön sıra sonra (derinlik)
    ;[[0, 13, false], [16, 12, true], [0, 29, true], [16, 28, false]].forEach(([x, y, f], k) => drawPlant(p, c, x, y + extra, i * 17 + k, f))
  }, { shadow: [16, 30 + extra, 13, 2] })
}

// ── Karakterler (16×24, 4 yön × 3 kare) ─────────────────────────────────────
// Harfler: K ten, k ten gölgesi, E göz, B allık, H/h/j saç (veya başörtüsü),
// A/a/Y şapka, N kurdele, S/s/T üst, P/p/Q tulum-elbise, L/l bacak, F/f ayakkabı
const SKIN = { K: '#f6cba4', k: '#dc9a80', E: '#2e1c34', B: '#f19a8c' }

const HEADS = {
  player: {
    down: [
      '................',
      '......YAAA......',
      '.....YAAAAa.....',
      '.....NNNNNn.....',
      '.YAAAAAAAAAAAAa.',
      '..aaaaaaaaaaaa..',
      '...hHHjHHjHHh...',
      '...HHKKKKKKHH...',
      '...HKEKKKKEKH...',
      '...hKEKKKKEKh...',
      '....KBKKKKBK....',
      '....kKKKKKKk....',
      '.....kkkkkk.....',
    ],
    up: [
      '................',
      '......YAAA......',
      '.....YAAAAa.....',
      '.....NNNNNn.....',
      '.YAAAAAAAAAAAAa.',
      '..aaaaaaaaaaaa..',
      '...HHHjHHHHHH...',
      '...HHjHHHHHHh...',
      '...HHHHHHHHHh...',
      '...hHHHHHHHhh...',
      '....hHHHHHhh....',
      '....kKKKKKKk....',
      '.....kkkkkk.....',
    ],
    side: [
      '................',
      '.......YAAA.....',
      '......YAAAAa....',
      '......NNNNNn....',
      '..YAAAAAAAAAAa..',
      '...aaaaaaaaaaa..',
      '....HHjHHHHHH...',
      '....KKKHHHHHH...',
      '...KKEKKkHHHh...',
      '...KKEKKKHHhh...',
      '....KBKKKkHh....',
      '....kKKKKkh.....',
      '.....kkkk.......',
    ],
  },
  playerGirl: {
    down: [
      '................',
      '................',
      '.....hHHHHh.....',
      '....hHjjHHHhxX..',
      '...hHjHHHHHHXx..',
      '...HHHKHHKHHH...',
      '...HHKKKKKKHH...',
      '..hHKKKKKKKKHh..',
      '..hHEEKKKKEEHh..',
      '..hHKEKKKKEKHh..',
      '..hhKBKKKKBKhh..',
      '..hH.kKKKKk.Hh..',
      '..hHh.kkkk.hHh..',
    ],
    up: [
      '................',
      '................',
      '.....hHHHHh.....',
      '....hHjjHHHh....',
      '...hHjjHHHHHh...',
      '...HHjHHHHHHH...',
      '...HHHHHHHHHH...',
      '..hHHHHHHHHHHh..',
      '..hHHHHHHHHHHh..',
      '..hHhHHHHHHhHh..',
      '..hHhhHHHHhhHh..',
      '..hH.hhhhhh.Hh..',
      '..hHh.kkkk.hHh..',
    ],
    side: [
      '................',
      '................',
      '......hHHHh.....',
      '.....hHjjHHhxX..',
      '....hHjHHHHHXx..',
      '....HHKHHHHHH...',
      '....KKKHHHHHHh..',
      '...KKKKKHHHHHh..',
      '...KEEKKkHHHHh..',
      '...KKEKKKHHHHh..',
      '....KBKKKkHHhh..',
      '....kKKKKkhHHh..',
      '.....kkkk..hHh..',
    ],
  },
  sema: {
    down: [
      '................',
      '................',
      '.....hHHHHh.....',
      '....hjjHHHHh....',
      '...hjjHHHqHHh...',
      '...jHHHHHHHHh...',
      '...HHhhKKhhHh...',
      '...HhKKKKKKhh...',
      '...HhKEKKEKhh...',
      '...qhKEKKEKhh...',
      '...HhBKKKKBhh...',
      '...hHhkKKkhHh...',
      '....hHhhhhHHh...',
    ],
    up: [
      '................',
      '................',
      '.....hHHHHh.....',
      '....hjjHHHHh....',
      '...hjjHHHHHHh...',
      '...jHHHqHHHHh...',
      '...HHHHHHHHHh...',
      '...HHHHhHHHhh...',
      '...HHqHhHHHhh...',
      '...HHHHhHHqhh...',
      '...hHHHhHHHhh...',
      '...hHHHHhHHhh...',
      '....hHHHhHHhh...',
    ],
    side: [
      '................',
      '................',
      '......hHHHh.....',
      '.....hjjHHHh....',
      '....hjHHHHqHh...',
      '....jHHHHHHHh...',
      '....hKKhHHHHh...',
      '...hKKKKhHHHh...',
      '...KKEKKhHHqh...',
      '...KKEKKhHHHh...',
      '....KBKKhHHhh...',
      '....kKKkhHHHh...',
      '....hhhhHHHHh...',
    ],
  },
}

const TORSOS = {
  player: {
    down: ['....SSPSSPSS....', '....sSPPPPSs....', '....sPQPPQPs....', '....pPPPPPPp....', '....pPPPPPPp....'],
    up: ['....SSPSSPSS....', '....sSSPPSSs....', '....sPPPPPPs....', '....pPPPPPPp....', '....pPPPPPPp....'],
    side: ['.....SSSSSs.....', '.....PPSSSs.....', '.....PQPPPp.....', '.....PPPPPp.....', '.....pPPPPp.....'],
  },
  playerGirl: {
    down: ['....TSSSSSSs....', '....sPPPPPPs....', '....sPQPPQPs....', '....NNNNNNNN....', '...pPPPPPPPPp...', '...pQPPPPPPPp...', '..ppPPPPPPPPpp..'],
    up: ['....TSSSSSSs....', '....sPPPPPPs....', '....sPPPPPPs....', '....NNNNNNNN....', '...pPPPPPPPPp...', '...pPPPPPPPPp...', '..ppPPPPPPPPpp..'],
    side: ['.....SSSSSs.....', '.....PPPPPs.....', '.....PQPPPp.....', '.....NNNNNN.....', '....pPPPPPPp....', '....PQPPPPPp....', '...ppPPPPPPpp...'],
  },
  sema: {
    down: ['....SSSSSSSS....', '....sSSSSSSs....', '....sSSTSSSs....', '....sSSSSSSs....', '...sSSSSSSSSs...', '...sSTSSSSSSs...', '...ssssssssss...'],
    up: ['....SSSSSSSS....', '....sSSSSSSs....', '....sSSSSSSs....', '....sSSSSSSs....', '...sSSSSSSSSs...', '...sSSSSSSSSs...', '...ssssssssss...'],
    side: ['.....SSSSSs.....', '.....SSSSSs.....', '.....STSSSs.....', '.....SSSSSs.....', '....sSSSSSSs....', '....STSSSSSs....', '....ssssssss....'],
  },
}

// Örgüler (kız) ve omuza dökülen başörtüsü (Sema): gövdenin önünde
const DRAPES = {
  playerGirl: {
    down: ['...hH......Hh...', '...hH......Hh...', '...NN......NN...'],
    up: ['...hH......Hh...', '...hH......Hh...', '...NN......NN...'],
    side: ['..........hH....', '..........hH....', '..........NN....'],
  },
  sema: {
    down: ['...hHHHHHHHHh...', '....hHHqHHHh....', '.....hhHHhh.....'],
    up: ['...hHHHHHHHHh...', '....hhHHHHhh....'],
    side: ['....hHHHHHHh....', '.....hHHHHh.....', '......hhh.......'],
  },
}

// Bacaklar: satır 17'den başlar (ilk satır gövdenin altında kalır)
const LEGS = {
  front: [
    ['....LLLLLLLL....', '.....LLLLLL.....', '.....LLllLL.....', '.....LL..LL.....', '.....LL..Ll.....', '....FFF..FFf....'],
    ['....LLLLLLLL....', '.....LLLLLL.....', '.....LLllLL.....', '.....LL..LL.....', '....FFF..Ll.....', '.........FFf....'],
  ],
  side: [
    ['.....LLLLLL.....', '......LLLL......', '......LLLl......', '......LLLl......', '......LLLl......', '.....FFFFf......'],
    ['.....LLLLLL.....', '.....LLLLLl.....', '.....LLl.Ll.....', '....LLl..lLl....', '....LL....Ll....', '...FFF....FFf...'],
    ['.....LLLLLL.....', '.....lLLLLL.....', '.....lLl.LL.....', '....lLl..LLL....', '....ll....LL....', '...fff....FFF...'],
  ],
}

export const LOOKS = {
  player: {
    ...SKIN,
    H: '#7a4a2e', h: '#4f2c2a', j: '#a8703f',
    Y: '#fff0a8', A: '#ebc664', a: '#b98840', N: '#c2503c',
    S: '#7cbf5a', s: '#4f8f4a', T: '#a8dc78',
    P: '#4f74ba', p: '#344d8c', Q: '#7c9fdc',
    L: '#4f74ba', l: '#344d8c', F: '#6e4234', f: '#46282c',
  },
  playerGirl: {
    ...SKIN,
    H: '#c2623c', h: '#87382f', j: '#e8935a', x: '#ffffff', X: '#ffd35a',
    S: '#fff4e0', s: '#dcc7ad', T: '#ffffff',
    P: '#d9566b', p: '#a23a55', Q: '#f2899a', N: '#ffd35a',
    L: '#fff4e0', l: '#dcc7ad', F: '#7a4234', f: '#4a2629',
  },
  sema: {
    ...SKIN,
    H: '#6e98d6', h: '#4a68a8', j: '#a8c8f0', q: '#e6eefb',
    S: '#d9738f', s: '#a8506e', T: '#ef9ab0',
    L: '#34406e', l: '#252d54', F: '#3a2a34', f: '#2a1e28',
  },
}

// dir: 0 aşağı, 1 yukarı, 2 sol (sağ = sol'un aynası); frame: 0 duruş, 1–2 adım
function drawPerson(p, look, dir, frame) {
  const pal = LOOKS[look]
  const D = ['down', 'up', 'side'][dir]
  const b = frame ? -1 : 0
  const mirrorRow = s => s.split('').reverse().join('')
  // Bacaklar
  if (dir === 2) grid(p, LEGS.side[frame], pal, 0, 17)
  else grid(p, frame === 2 ? LEGS.front[1].map(mirrorRow) : LEGS.front[frame ? 1 : 0], pal, 0, 17)
  // Gövde
  grid(p, TORSOS[look][D], pal, 0, 13 + b)
  // Kollar: adımda biri öne (uzun), diğeri geriye (kısa) sallanır
  const arm = (x, len, shadeRight) => {
    p(pal.S, x, 13 + b, 2, len - 1)
    p(pal.s, x + (shadeRight ? 1 : 0), 14 + b, 1, len - 2)
    p(pal.K, x, 12 + len + b, 2, 1)
    p(pal.k, x + (shadeRight ? 1 : 0), 12 + len + b, 1, 1)
  }
  if (dir === 2) {
    const ax = frame === 1 ? 6 : frame === 2 ? 9 : 7
    p(pal.S, ax, 13 + b, 2, 3)
    p(pal.s, ax + 1, 14 + b, 1, 2)
    p(pal.K, ax + (frame === 1 ? -1 : frame === 2 ? 1 : 0), 16 + b, 2, 1)
  } else {
    arm(2, frame === 1 ? 3 : frame === 2 ? 5 : 4, false)
    arm(12, frame === 2 ? 3 : frame === 1 ? 5 : 4, true)
  }
  if (DRAPES[look]) grid(p, DRAPES[look][D], pal, 0, 13 + b)
  // Baş
  grid(p, HEADS[look][D], pal, 0, b)
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
  const key = LOOKS[look] ? look : 'player'
  const frames = [0, 1, 2].map(dir =>
    [0, 1, 2].map(f => sprite(16, 24, p => drawPerson(p, key, dir, f), { shadow: [8, 22, 5, 2] })))
  frames.push(frames[2].map(mirror))
  return frames
}

// ── Göstergeler ─────────────────────────────────────────────────────────────
const BUBBLE = [
  '.wwwwwww.',
  'wwwwrwwww',
  'wwwwrwwww',
  'wwwwrwwww',
  'wwwwrwwww',
  'wwwwwwwww',
  'wwwwrwwww',
  'Wwwwwwwww',
  '.WWWWWWW.',
  '...WW....',
  '...W.....',
]

export function bubbleSprite() {
  return sprite(9, 11, p => grid(p, BUBBLE, { w: '#ffffff', W: '#d8e0f0', r: '#e04848' }))
}

const ARROW = [
  '...YYy...',
  '...hYy...',
  '...hYy...',
  '...hYy...',
  'YYYhYyyyy',
  '.YhhYYyy.',
  '..YhYYy..',
  '...YYy...',
  '....y....',
]

export function arrowSprite() {
  return sprite(9, 9, p => grid(p, ARROW, { Y: '#ffd23f', y: '#e8a030', h: '#fff3a8' }))
}

// ── ÇİFTLİK HARİTASI ─────────────────────────────────────────────────────────
// 40×28 karoluk harita. Her yapı portfolyonun bir bölümünü açar:
//   Çiftlik evi → Hakkımda · Görev panosu → Deneyim · Tarla → Projeler
//   Sandık → Beceriler · Posta kutusu → İletişim · Satış kutusu → CV
import {
  TILE, GROUND, rng, makeCanvas, treeSprite, houseSprite, boardSprite, chestSprite,
  binSprite, mailboxSprite, signSprite, bushSprite, cropSprite,
} from './art'

export const W = 40
export const H = 28
export const G = { GRASS: 0, PATH: 1, SOIL: 2, WATER: 3, SAND: 4, PLANK: 5, WET: 6 }

const grid = (v) => Array.from({ length: H }, () => new Array(W).fill(v))

const PLOTS = [[9, 15], [12, 15], [15, 15], [18, 15], [9, 18], [12, 18], [15, 18], [18, 18]]

function buildWorld() {
  const ground = grid(G.GRASS)
  const solid = grid(false)
  const fence = grid(false)
  const fill = (x0, y0, x1, y1, t) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) ground[y][x] = t
  }
  const block = (x0, y0, w, h) => {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) solid[y][x] = true
  }

  // Zemin: yollar, tarla, kıyı, nehir ve iskele
  fill(3, 11, 36, 12, G.PATH)
  fill(24, 9, 24, 10, G.PATH)
  fill(12, 9, 12, 10, G.PATH)
  fill(13, 13, 14, 13, G.PATH)
  fill(30, 13, 31, 22, G.PATH)
  fill(8, 14, 20, 20, G.SOIL)
  fill(0, 23, W - 1, 23, G.SAND)
  fill(0, 24, W - 1, H - 1, G.WATER)
  fill(30, 23, 31, 25, G.PLANK)
  for (let y = 24; y < H; y++) for (let x = 0; x < W; x++) if (ground[y][x] === G.WATER) solid[y][x] = true

  // Orman sınırı geçilmez
  block(0, 0, W, 3)
  block(0, 0, 2, H)
  block(W - 2, 0, 2, H)

  // Tarla çiti (üstte kapı ve tabela boşluğu)
  for (let x = 7; x <= 21; x++) { fence[13][x] = true; fence[21][x] = true }
  for (let y = 13; y <= 21; y++) { fence[y][7] = true; fence[y][21] = true }
  fence[13][13] = fence[13][14] = fence[13][16] = false
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (fence[y][x]) solid[y][x] = true

  // Ağaçlar: [x, y] gövde karosu
  const trees = []
  for (let x = 2; x <= 37; x += 2) trees.push([x, 2], [x + 1, 1])
  for (let y = 4; y <= 22; y += 2) trees.push([1, y], [0, y + 1], [38, y], [39, y + 1])
  trees.push(
    [5, 5], [8, 4], [16, 5], [18, 6], [30, 5], [33, 5], [35, 8], [4, 8],
    [4, 15], [5, 19], [3, 21], [34, 15], [35, 19], [27, 16], [24, 18], [25, 21], [34, 21], [27, 20],
  )
  const kinds = ['blossom', 'oak', 'teal', 'blossom', 'oak']
  const treeList = trees.map(([x, y], i) => {
    solid[y][x] = true
    return { x, y, kind: kinds[(x * 7 + y * 3 + i) % kinds.length], variant: (x + y) % 3 }
  })

  // Nesneler: konum (karo), boyut ve sprite üreticisi
  const objects = [
    { id: 'house', x: 21, y: 3, w: 7, h: 6, make: houseSprite },
    { id: 'board', x: 11, y: 7, w: 3, h: 2, make: boardSprite },
    { id: 'chest', x: 17, y: 9, w: 1, h: 1, make: chestSprite },
    { id: 'mailbox', x: 20, y: 9, w: 1, h: 1, make: mailboxSprite },
    { id: 'bin', x: 28, y: 8, w: 2, h: 1, make: binSprite },
    { id: 'sign', x: 22, y: 10, w: 1, h: 1, make: signSprite },
    { id: 'fieldSign', x: 16, y: 13, w: 1, h: 1, make: signSprite },
    { id: 'bush1', x: 22, y: 9, w: 1, h: 1, make: bushSprite },
    { id: 'bush2', x: 26, y: 9, w: 1, h: 1, make: bushSprite },
    { id: 'bush3', x: 6, y: 10, w: 1, h: 1, make: bushSprite },
    { id: 'bush4', x: 33, y: 10, w: 1, h: 1, make: bushSprite },
    ...PLOTS.map(([x, y], i) => ({ id: `crop${i}`, x, y, w: 2, h: 2, make: () => cropSprite(i) })),
  ]
  objects.forEach(o => block(o.x, o.y, o.w, o.h))
  PLOTS.forEach(([x, y]) => fill(x, y, x + 1, y + 1, G.WET))

  // Etkileşim noktaları: rect (karo) + oyuncunun duracağı yer (spot)
  const interactables = [
    { id: 'about', kind: 'about', rect: [24, 8, 1, 1], click: [21, 3, 7, 6], spot: [24, 9], main: true },
    { id: 'experience', kind: 'experience', rect: [11, 7, 3, 2], spot: [12, 9], main: true },
    { id: 'skills', kind: 'skills', rect: [17, 9, 1, 1], spot: [17, 10], main: true },
    { id: 'contact', kind: 'contact', rect: [20, 9, 1, 1], click: [20, 8, 1, 2], spot: [20, 10], main: true },
    { id: 'cv', kind: 'cv', rect: [28, 8, 2, 1], spot: [28, 9], main: true },
    { id: 'projects', kind: 'projects', rect: [16, 13, 1, 1], spot: [16, 12], main: true },
    { id: 'sign', kind: 'sign', rect: [22, 10, 1, 1], spot: [22, 11] },
    { id: 'fish', kind: 'fish', rect: [30, 25, 2, 1], spot: [30, 25] },
    ...PLOTS.map(([x, y], i) => ({ id: `project${i}`, kind: 'project', index: i, rect: [x, y, 2, 2], spot: [x, y + 2] })),
  ]

  return { ground, solid, fence, trees: treeList, objects, interactables, spawn: [24, 10] }
}

export const world = buildWorld()

export const isWalkable = (x, y) => x >= 0 && y >= 0 && x < W && y < H && !world.solid[y][x]

// ── Zemin katmanı: mevsim başına bir kez çizilir ─────────────────────────────
export function renderGround(season) {
  const pal = GROUND[season]
  const c = makeCanvas(W * TILE, H * TILE)
  const ctx = c.getContext('2d')
  const p = (col, x, y, w = 1, h = 1) => { ctx.fillStyle = col; ctx.fillRect(x, y, w, h) }
  const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? G.GRASS : world.ground[y][x])

  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W; tx++) {
      const r = rng(tx * 131 + ty * 7919)
      const X = tx * TILE, Y = ty * TILE
      const t = world.ground[ty][tx]
      if (t === G.GRASS) {
        p(pal.grass[0], X, Y, TILE, TILE)
        for (let i = 0; i < 5; i++) {
          const x = X + Math.floor(r() * 15), y = Y + Math.floor(r() * 14)
          p(pal.grass[1], x, y + 1, 1, 2)
          p(pal.grass[2], x + 1, y, 1, 2)
        }
        if (pal.flowers.length && r() < 0.08) {
          const x = X + 4 + Math.floor(r() * 8), y = Y + 4 + Math.floor(r() * 8)
          const col = pal.flowers[Math.floor(r() * pal.flowers.length)]
          p(col, x - 1, y, 3, 1); p(col, x, y - 1, 1, 3); p('#ffd23f', x, y, 1, 1)
        }
      } else if (t === G.PATH || t === G.SAND) {
        const base = t === G.SAND ? (season === 'winter' ? '#e4e0d6' : '#efdcab') : pal.path[0]
        p(base, X, Y, TILE, TILE)
        for (let i = 0; i < 4; i++) p(pal.path[1], X + Math.floor(r() * 15), Y + Math.floor(r() * 15), 2, 1)
        p(pal.path[2], X + Math.floor(r() * 14), Y + Math.floor(r() * 14), 1, 1)
        // Çimle komşu kenarlara yumuşak geçiş
        const edge = (nx, ny, fn) => { if (at(nx, ny) === G.GRASS) fn() }
        edge(tx, ty - 1, () => { p(pal.path[1], X, Y, TILE, 1); for (let x = 0; x < 16; x += 3) p(pal.grass[0], X + x, Y, 2, 1 + (x % 2)) })
        edge(tx, ty + 1, () => { p(pal.path[1], X, Y + 15, TILE, 1); for (let x = 1; x < 16; x += 4) p(pal.grass[0], X + x, Y + 15, 2, 1) })
        edge(tx - 1, ty, () => { p(pal.path[1], X, Y, 1, TILE); for (let y = 0; y < 16; y += 3) p(pal.grass[0], X, Y + y, 1 + (y % 2), 2) })
        edge(tx + 1, ty, () => { p(pal.path[1], X + 15, Y, 1, TILE); for (let y = 1; y < 16; y += 4) p(pal.grass[0], X + 15, Y + y, 1, 2) })
      } else if (t === G.SOIL || t === G.WET) {
        const wet = t === G.WET
        p(wet ? '#6e4423' : '#a06a3a', X, Y, TILE, TILE)
        for (let y = 3; y < 16; y += 4) p(wet ? '#5a361b' : '#8a5a2e', X, Y + y, TILE, 1)
        if (!wet) p('#b98250', X + Math.floor(r() * 14), Y + Math.floor(r() * 3) * 4 + 1, 2, 1)
        if (wet) {
          if (at(tx, ty - 1) !== G.WET) p('#8a5a2e', X, Y, TILE, 1)
          if (at(tx - 1, ty) !== G.WET) p('#8a5a2e', X, Y, 1, TILE)
        }
      } else if (t === G.WATER) {
        p(pal.water[0], X, Y, TILE, TILE)
        if (at(tx, ty - 1) !== G.WATER && at(tx, ty - 1) !== G.PLANK) {
          p('#3a7fb8', X, Y, TILE, 2)
          p('#e9f6ff', X, Y + 2, TILE, 1)
        }
      } else if (t === G.PLANK) {
        if (ty >= 24) p(pal.water[0], X, Y, TILE, TILE)
        p('#a8703a', X, Y, TILE, TILE)
        for (let y = 3; y < 16; y += 4) p('#7a4a26', X, Y + y, TILE, 1)
        p('#c48a4c', X, Y, TILE, 1)
        if (ty === 25) { p('#5a331a', X + (tx === 30 ? 1 : 12), Y + 12, 3, 4) }
      }
    }
  }

  // Çitler
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W; tx++) {
      if (!world.fence[ty][tx]) continue
      const X = tx * TILE, Y = ty * TILE
      const f = (x, y) => x >= 0 && y >= 0 && x < W && y < H && world.fence[y][x]
      if (f(tx - 1, ty)) { p('#5a331a', X, Y + 4, 8, 3); p('#a8703a', X, Y + 4, 8, 1); p('#5a331a', X, Y + 9, 8, 3); p('#a8703a', X, Y + 9, 8, 1) }
      if (f(tx + 1, ty)) { p('#5a331a', X + 8, Y + 4, 8, 3); p('#a8703a', X + 8, Y + 4, 8, 1); p('#5a331a', X + 8, Y + 9, 8, 3); p('#a8703a', X + 8, Y + 9, 8, 1) }
      if (f(tx, ty - 1) || f(tx, ty + 1)) { p('#5a331a', X + 6, Y, 4, 16); p('#8a5530', X + 7, Y, 2, 16) }
      p('#3b2414', X + 5, Y + 1, 6, 14)
      p('#8a5530', X + 6, Y + 1, 4, 13)
      p('#c48a4c', X + 6, Y + 1, 4, 1)
      if (season === 'winter') p('#ffffff', X + 5, Y, 6, 2)
    }
  }
  return c
}

// Bir mevsimin tüm sprite'larını Y sıralamasına hazır listeye çevirir
export function buildDrawables(season) {
  const treeCache = {}
  const list = world.trees.map(t => {
    const key = `${t.kind}${t.variant}`
    const s = (treeCache[key] ??= treeSprite(t.kind, season, t.variant))
    return { s, x: t.x * TILE + 8 - 17, y: t.y * TILE + 16 - 44, base: t.y * TILE + 15 }
  })
  world.objects.forEach(o => {
    const s = o.make(season)
    list.push({ s, id: o.id, x: o.x * TILE + (o.w * TILE - s.w) / 2, y: (o.y + o.h) * TILE - s.h, base: (o.y + o.h) * TILE - 1 })
  })
  return list
}

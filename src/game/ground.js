// ── ZEMİN ÇİZİMİ ────────────────────────────────────────────────────────────
// Haritanın zemini mevsim başına bir kez piksel piksel boyanır: çim kümeleri,
// yumuşak kenarlı patika, ıslak kum + köpüklü kıyı, sürülmüş toprak, iskele, çit.
import { TILE, GROUND, rng, rgb, makeCanvas } from './art'

const SOIL = ['#5a3a30', '#7a5038', '#966843', '#ae8053', '#c49a68']
const WET = ['#2a1a20', '#3d2627', '#51342e', '#634136', '#7c5a45']
const DOCK = ['#43282e', '#664133', '#8a5c3e', '#ab7a50', '#c99b6a']
const FENCE = { o: '#3a2430', d: '#5c3a34', m: '#8a5e40', l: '#b08058', h: '#d0a372' }
const STONES = ['#5a5568', '#8a8698', '#b4b0bf', '#dcd9e0']

// Yumuşak değer gürültüsü (0–1)
function noise(seed, cell) {
  const hash = (x, y) => {
    let h = (x * 374761393 + y * 668265263 + seed * 982451653) | 0
    h = Math.imul(h ^ (h >>> 13), 1274126177)
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296
  }
  return (x, y) => {
    const fx = x / cell, fy = y / cell
    const ix = Math.floor(fx), iy = Math.floor(fy)
    const tx = fx - ix, ty = fy - iy
    const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty)
    const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1)
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
  }
}

// Çim kümeleri (1 koyu, 3 açık, 4 parlak); kışın kar tümsekleri
const TUFTS = [
  ['4.4..', '3.3.4', '131.3', '.1.1.'],
  ['..4..', '4.3.4', '3.3.3', '1313.'],
  ['3..', '1.3', '.11'],
  ['.4.4', '3131', '.1..'],
  ['4...4.', '3.4.3.', '13.131', '.1..1.'],
]
const SNOW_BUMPS = [['.44.', '4333', '1111'], ['.4.', '433', '.11'], ['..44..', '.4333.', '113311']]

export function paintGround(world, G, W, H, season) {
  const pal = GROUND[season]
  const winter = season === 'winter'
  const PW = W * TILE, PH = H * TILE
  const c = makeCanvas(PW, PH)
  const ctx = c.getContext('2d')
  const img = ctx.createImageData(PW, PH)
  const d = img.data
  const set = (x, y, col) => {
    if (x < 0 || y < 0 || x >= PW || y >= PH) return
    const [r, g, b] = typeof col === 'string' ? rgb(col) : col
    const i = (y * PW + x) * 4
    d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255
  }
  // Yarı saydam mor gölge karışımı
  const shade = (x, y, a) => {
    if (x < 0 || y < 0 || x >= PW || y >= PH) return
    const i = (y * PW + x) * 4
    d[i] += (46 - d[i]) * a; d[i + 1] += (34 - d[i + 1]) * a; d[i + 2] += (72 - d[i + 2]) * a
  }
  const tileAt = (tx, ty) => world.ground[Math.min(H - 1, Math.max(0, ty))][Math.min(W - 1, Math.max(0, tx))]

  // 1) Piksel başına malzeme: yumuşak malzemeler arasında dalgalı sınır
  const SOFT = [G.GRASS, G.PATH, G.SAND, G.WATER]
  const nz = SOFT.map((m, k) => noise(11 + k * 7, 5))
  const nz2 = SOFT.map((m, k) => noise(91 + k * 3, 2.2))
  const mat = new Uint8Array(PW * PH)
  for (let y = 0; y < PH; y++) {
    for (let x = 0; x < PW; x++) {
      const tx = Math.floor(x / TILE), ty = Math.floor(y / TILE)
      const t = world.ground[ty][tx]
      let m = t
      if (SOFT.includes(t)) {
        let mixed = false
        for (let j = -1; j <= 1 && !mixed; j++) for (let i = -1; i <= 1; i++) { const n = tileAt(tx + i, ty + j); if (n !== t && SOFT.includes(n)) { mixed = true; break } }
        if (mixed) {
          const fx = x / TILE - 0.5 + 0.5 / TILE, fy = y / TILE - 0.5 + 0.5 / TILE
          const ix = Math.floor(fx), iy = Math.floor(fy), ax = fx - ix, ay = fy - iy
          let best = -1e9
          SOFT.forEach((s, k) => {
            const v = (a, b) => (tileAt(a, b) === s ? 1 : 0)
            const f = v(ix, iy) * (1 - ax) * (1 - ay) + v(ix + 1, iy) * ax * (1 - ay) + v(ix, iy + 1) * (1 - ax) * ay + v(ix + 1, iy + 1) * ax * ay
            if (f <= 0) return
            const score = f + (nz[k](x, y) - 0.5) * 0.32 + (nz2[k](x, y) - 0.5) * 0.1
            if (score > best) { best = score; m = s }
          })
        }
      }
      mat[y * PW + x] = m
    }
  }
  const M = (x, y) => (x < 0 || y < 0 || x >= PW || y >= PH ? G.GRASS : mat[y * PW + x])

  // Kıyıdan uzaklık (su derinliği için) ve sudan uzaklık (ıslak kum için)
  const depth = new Uint16Array(PW * PH)
  for (let x = 0; x < PW; x++) {
    let run = 0
    for (let y = 0; y < PH; y++) {
      if (M(x, y) === G.WATER) run++
      else run = 0
      depth[y * PW + x] = run
    }
  }
  const toWater = (x, y, n) => { for (let k = 1; k <= n; k++) if (M(x, y + k) === G.WATER) return k; return 0 }

  const patch = noise(5, 12), patch2 = noise(17, 5), fine = noise(23, 2)
  const G5 = pal.grass, P5 = pal.path, S5 = pal.sand, W5 = pal.water

  // 2) Taban boyama
  for (let y = 0; y < PH; y++) {
    for (let x = 0; x < PW; x++) {
      const m = mat[y * PW + x]
      const n = patch(x, y), n2 = patch2(x, y), f = fine(x, y)
      if (m === G.GRASS) {
        // Kışın taban bir ton açık (kar); lekeler yumuşak
        const b0 = winter ? 3 : 2
        let k = b0
        if (n > 0.72 && n2 > 0.35) k = b0 + 1
        else if (n < 0.2 && n2 < 0.4) k = b0 - 1
        // Kenarlar: patika/kumun üstünde koyu dudak, altında aydınlık kenar
        const below = M(x, y + 1), above = M(x, y - 1)
        if (below === G.PATH || below === G.SAND) k = 1
        else if (M(x, y + 2) === G.PATH || M(x, y + 2) === G.SAND) k = Math.min(k, 2)
        if (above === G.PATH || above === G.SAND) k = 3
        if (M(x - 1, y) === G.PATH || M(x + 1, y) === G.PATH) k = Math.min(k, 2)
        set(x, y, G5[k])
      } else if (m === G.PATH || m === G.SAND) {
        const R = m === G.PATH ? P5 : S5
        let k = 2
        if (n > 0.66) k = 3
        else if (n < 0.26) k = 1
        if (f > 0.86) k = Math.min(4, k + 1)
        else if (f < 0.1) k = Math.max(1, k - 1)
        // Çim kenarı altında gölge, yanlarda koyu kenar
        if (M(x, y - 1) === G.GRASS) k = 0
        else if (M(x, y - 2) === G.GRASS) k = 1
        else if (M(x - 1, y) === G.GRASS || M(x + 1, y) === G.GRASS || M(x, y + 1) === G.GRASS) k = 1
        if (m === G.SAND) {
          const w = toWater(x, y, 4)
          if (w) k = w <= 2 ? 0 : 1
        }
        set(x, y, R[k])
      } else if (m === G.WATER) {
        const dd = depth[y * PW + x]
        const wob = Math.round(Math.sin(x * 0.45) * 1.2 + Math.sin(x * 0.13 + 1) * 1)
        let k = dd <= 1 ? 4 : dd <= 3 + wob ? 3 : dd <= 10 + wob * 2 ? 2 : 1
        if (k === 1 && n < 0.18 && dd > 18) k = 0
        if (k === 1 && dd < 16 && n2 > 0.6) k = 2
        if (dd === 2 && (x % 5 === 0 || f > 0.7)) k = 4 // köpük kırıntıları
        set(x, y, W5[k])
      } else if (m === G.SOIL || m === G.WET) {
        let k
        if (m === G.WET) {
          // Çapalanmış ıslak toprak: sıra sıra karık
          const ly = y % 4
          k = ly === 0 ? 3 : ly === 3 ? 1 : 2
          if (f > 0.8 && ly !== 3) k = Math.min(4, k + 1)
          if (n2 < 0.25 && k > 1) k--
        } else {
          // Sürülmemiş toprak: benekli, çakıllı
          k = 2
          if (n > 0.68) k = 3
          else if (n < 0.28) k = 1
          if (f > 0.88) k = 3
          else if (f < 0.08) k = 1
        }
        set(x, y, (m === G.WET ? WET : SOIL)[k])
      } else if (m === G.PLANK) {
        set(x, y, W5[2])
      }
    }
  }

  // 3) Ayrıntılar: çim kümeleri, çiçekler, taşlar, toprak topakları
  const R5 = (row, X, Y, ramp, ok) => row.forEach((s, j) => {
    for (let i = 0; i < s.length; i++) {
      const ch = s[i]
      if (ch === '.' || !ok(X + i, Y + j)) continue
      set(X + i, Y + j, ramp[+ch])
    }
  })
  const isG = (x, y) => M(x, y) === G.GRASS
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W; tx++) {
      const r = rng(tx * 131 + ty * 7919 + 3)
      const X = tx * TILE, Y = ty * TILE
      const t = world.ground[ty][tx]
      if (t === G.GRASS || t === G.PATH) {
        const tufts = winter ? 1 + Math.floor(r() * 2) : 3 + Math.floor(r() * 4)
        for (let i = 0; i < tufts; i++) {
          const shape = winter ? SNOW_BUMPS[Math.floor(r() * SNOW_BUMPS.length)] : TUFTS[Math.floor(r() * TUFTS.length)]
          const x = X + Math.floor(r() * 14) - 1, y = Y + Math.floor(r() * 14) - 1
          const ok = (a, b) => isG(a, b) && isG(a, b + 2) && isG(a - 1, b) && isG(a + 1, b)
          if (ok(x + 1, y + shape.length - 1)) R5(shape, x, y, G5, ok)
        }
        // Küçük çiçekler (ilkbahar/yaz), dökülmüş yapraklar (sonbahar)
        if (pal.flowers.length && r() < (season === 'fall' ? 0.35 : 0.16)) {
          const x = X + 3 + Math.floor(r() * 10), y = Y + 3 + Math.floor(r() * 10)
          const col = pal.flowers[Math.floor(r() * pal.flowers.length)]
          if (isG(x, y) && isG(x - 1, y) && isG(x + 1, y) && isG(x, y + 1)) {
            if (season === 'fall') { set(x, y, col); set(x + 1, y, col); set(x, y + 1, G5[1]) }
            else {
              set(x, y - 1, col); set(x - 1, y, col); set(x + 1, y, col); set(x, y + 1, G5[1]); set(x, y, '#ffe9a0')
              set(x - 1, y + 1, G5[1]); set(x + 1, y + 1, G5[1])
            }
          }
        }
        // Yonca, çakıl ya da dal parçası
        const roll = r()
        const x = X + 2 + Math.floor(r() * 12), y = Y + 2 + Math.floor(r() * 12)
        if (roll < 0.12 && isG(x, y) && isG(x + 1, y + 1)) {
          set(x, y, STONES[2]); set(x + 1, y, STONES[1]); set(x, y + 1, STONES[1]); set(x + 1, y + 1, STONES[0]); set(x, y, STONES[3])
        } else if (roll < 0.2 && !winter && isG(x, y) && isG(x + 2, y + 1)) {
          set(x, y, '#7a5a3e'); set(x + 1, y, '#5c4030'); set(x + 2, y + 1, '#5c4030')
        } else if (roll < 0.32 && !winter && isG(x, y) && isG(x + 2, y + 2)) {
          set(x, y, G5[3]); set(x + 2, y, G5[3]); set(x + 1, y + 1, G5[4]); set(x + 1, y, G5[1]); set(x + 1, y + 2, G5[1])
        }
      }
      // Patika: çakıl taşları ve çatlaklar
      if (t === G.PATH || t === G.SAND) {
        const R = t === G.PATH ? P5 : S5
        for (let i = 0; i < 2 + Math.floor(r() * 2); i++) {
          const x = X + 1 + Math.floor(r() * 13), y = Y + 1 + Math.floor(r() * 13)
          if (M(x, y) !== t || M(x + 1, y + 1) !== t) continue
          if (r() < 0.6) { set(x, y, R[4]); set(x + 1, y, R[3]); set(x, y + 1, R[1]); set(x + 1, y + 1, R[0]) }
          else set(x, y, R[1])
        }
        if (t === G.SAND && !winter && r() < 0.18) {
          const x = X + 4 + Math.floor(r() * 8), y = Y + 3 + Math.floor(r() * 5)
          if (M(x, y) === G.SAND && !toWater(x, y, 5)) { set(x, y, '#fff2ec'); set(x + 1, y, '#f2b8b0'); set(x, y + 1, '#d89a94') }
        }
      }
      // Toprak topakları; ıslak parselin kenarı
      if (t === G.SOIL || t === G.WET) {
        const R = t === G.WET ? WET : SOIL
        for (let i = 0; i < 3; i++) {
          const x = X + Math.floor(r() * 14), y = Y + Math.floor(r() * 4) * 4 + 1
          set(x, y, R[4]); set(x + 1, y, R[3]); set(x, y + 1, R[1]); set(x + 1, y + 1, R[1])
        }
        if (t === G.WET) {
          if (tileAt(tx, ty - 1) !== G.WET) for (let i = 0; i < 16; i++) { set(X + i, Y, R[0]); set(X + i, Y + 1, SOIL[1]) }
          if (tileAt(tx - 1, ty) !== G.WET) for (let i = 0; i < 16; i++) set(X, Y + i, R[0])
          if (tileAt(tx + 1, ty) !== G.WET) for (let i = 0; i < 16; i++) set(X + 15, Y + i, R[1])
          if (tileAt(tx, ty + 1) !== G.WET) for (let i = 0; i < 16; i++) set(X + i, Y + 15, SOIL[3])
          if (r() < 0.5) set(X + 3 + Math.floor(r() * 10), Y + 2 + Math.floor(r() * 3) * 4, R[4])
        }
        if (winter) for (let i = 0; i < 10; i++) { const x = X + Math.floor(r() * 16), y = Y + Math.floor(r() * 4) * 4; set(x, y, r() < 0.5 ? '#e8eef8' : '#c2cde6') }
        // Çimle sınırda toprak kenarı
        if (t === G.SOIL) {
          if (!isSoil(tileAt(tx, ty - 1))) for (let i = 0; i < 16; i++) { set(X + i, Y, R[0]); set(X + i, Y + 1, R[1]) }
          if (!isSoil(tileAt(tx - 1, ty))) for (let i = 0; i < 16; i++) set(X, Y + i, R[1])
          if (!isSoil(tileAt(tx + 1, ty))) for (let i = 0; i < 16; i++) set(X + 15, Y + i, R[1])
          if (!isSoil(tileAt(tx, ty + 1))) for (let i = 0; i < 16; i++) set(X + i, Y + 15, R[3])
        }
      }
    }
  }
  function isSoil(t) { return t === G.SOIL || t === G.WET }

  // Su: küçük dalga parıltıları
  const wr = rng(4242)
  for (let i = 0; i < 420; i++) {
    const x = Math.floor(wr() * PW), y = Math.floor(wr() * PH)
    if (M(x, y) !== G.WATER || depth[y * PW + x] < 6 || M(x + 4, y) !== G.WATER) continue
    set(x, y, W5[3]); set(x + 1, y, W5[3]); set(x + 2, y + 1, W5[3]); set(x + 3, y, W5[2] === W5[3] ? W5[4] : W5[3])
  }

  // 4) İskele: yatay kalaslar, çiviler, suya inen direkler
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W; tx++) {
      if (world.ground[ty][tx] !== G.PLANK) continue
      const X = tx * TILE, Y = ty * TILE
      const leftEdge = tileAt(tx - 1, ty) !== G.PLANK, rightEdge = tileAt(tx + 1, ty) !== G.PLANK
      const r = rng(tx * 17 + ty * 29)
      for (let y = 0; y < 16; y++) {
        const ly = y % 4, plank = Math.floor((Y + y) / 4)
        for (let x = 0; x < 16; x++) {
          let k = ly === 0 ? 3 : ly === 3 ? 0 : 2
          const seam = (X + x + plank * 11) % 32 === 0
          if (seam && ly !== 3) k = 0
          if (ly === 1 && ((X + x) * 7 + plank * 13) % 9 === 0) k = 1 // damar
          if (ly === 2 && ((X + x) * 5 + plank * 3) % 11 === 0) k = 3
          if (leftEdge && x === 0) k = 0
          if (leftEdge && x === 1 && ly !== 3) k = 4
          if (rightEdge && x === 15) k = 0
          if (rightEdge && x === 14 && ly !== 3) k = 1
          set(X + x, Y + y, DOCK[k])
        }
        if (ly === 1) { set(X + 3, Y + y, DOCK[0]); set(X + 12, Y + y, DOCK[0]); set(X + 3, Y + y - 1, DOCK[4]) }
      }
      if (season === 'winter') for (let i = 0; i < 8; i++) set(X + Math.floor(r() * 16), Y + Math.floor(r() * 4) * 4, '#eef3fa')
      // İskelenin ucu: direkler ve suda gölge
      if (tileAt(tx, ty + 1) !== G.PLANK) {
        for (let x = 0; x < 16; x++) for (let y = 16; y < 20; y++) shade(X + x, Y + y, 0.35 - (y - 16) * 0.07)
        const px = leftEdge ? X + 1 : X + 12
        for (let y = 16; y < 21; y++) { set(px, Y + y, DOCK[3]); set(px + 1, Y + y, DOCK[2]); set(px + 2, Y + y, DOCK[1]) }
        set(px - 1, Y + 21, W5[4]); set(px, Y + 21, W5[4]); set(px + 2, Y + 21, W5[4]); set(px + 3, Y + 21, W5[4])
      }
    }
  }

  // 5) Çitler: ahşap dikmeler + iki kat korkuluk, altlarında gölge
  const fence = (x, y) => x >= 0 && y >= 0 && x < W && y < H && world.fence[y][x]
  const F = FENCE
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < W; tx++) {
      if (!fence(tx, ty)) continue
      const X = tx * TILE, Y = ty * TILE
      const rail = (x0, len, y0) => {
        for (let x = x0; x < x0 + len; x++) {
          set(X + x, Y + y0, F.o); set(X + x, Y + y0 + 1, F.l); set(X + x, Y + y0 + 2, F.m); set(X + x, Y + y0 + 3, F.o)
          if ((X + x) % 7 === 0) set(X + x, Y + y0 + 2, F.d)
          shade(X + x, Y + y0 + 5, 0.22)
          if (winter) set(X + x, Y + y0, '#ffffff')
        }
      }
      if (fence(tx - 1, ty)) { rail(0, 8, 4); rail(0, 8, 9) }
      if (fence(tx + 1, ty)) { rail(8, 8, 4); rail(8, 8, 9) }
      if (fence(tx, ty + 1)) {
        for (let y = 8; y < 24; y++) { set(X + 6, Y + y, F.o); set(X + 7, Y + y, F.l); set(X + 8, Y + y, F.m); set(X + 9, Y + y, F.o); shade(X + 10, Y + y, 0.25) }
      }
      // Dikme
      for (let y = 0; y < 15; y++) {
        for (let x = 5; x < 11; x++) {
          const edge = x === 5 || x === 10 || y === 0 || y === 14
          let col = edge ? F.o : x === 6 ? F.l : x === 9 ? F.d : F.m
          if (y === 1 && !edge) col = F.h
          if (!edge && (y === 6 || y === 11) && x === 8) col = F.d
          set(X + x, Y + y, col)
        }
      }
      set(X + 7, Y + 4, F.o); set(X + 7, Y + 9, F.o) // çiviler
      for (let x = 5; x < 12; x++) shade(X + x, Y + 15, 0.3)
      for (let y = 2; y < 15; y++) shade(X + 11, Y + y, 0.22)
      if (winter) { for (let x = 5; x < 11; x++) set(X + x, Y, '#ffffff'); set(X + 6, Y + 1, '#dfe8f6'); set(X + 7, Y + 1, '#ffffff'); set(X + 8, Y + 1, '#ffffff') }
    }
  }

  // 6) Evin önünde ortam gölgesi
  const house = world.objects.find(o => o.id === 'house')
  if (house) {
    const hx = house.x * TILE, hy = (house.y + house.h) * TILE
    for (let x = hx + 4; x < hx + house.w * TILE - 4; x++) { shade(x, hy, 0.4); shade(x, hy + 1, 0.22); shade(x, hy + 2, 0.1) }
  }

  ctx.putImageData(img, 0, 0)
  return c
}

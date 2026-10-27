import { useEffect, useRef, useState } from 'react'
import { TILE, HOUSE_WINDOWS, drawSprite, bubbleSprite, arrowSprite } from './art'
import { framesFor } from './frames'
import { world, W, H, G, isWalkable, renderGround, buildDrawables } from './world'

const WW = W * TILE, WH = H * TILE
const SPEED = 72         // px/sn (oyun pikseli)
const NPC_SPEED = 26
const NEAR = 14          // etkileşim mesafesi
const WALK = [1, 0, 2, 0]

const center = ([tx, ty]) => ({ x: tx * TILE + 8, y: ty * TILE + 12 })
const tileOf = (x, y) => [Math.floor(x / TILE), Math.floor(y / TILE)]

// 4 yönlü BFS; hedef karo geçilmezse null
function findPath(from, to) {
  if (!isWalkable(to[0], to[1])) return null
  const idx = (x, y) => y * W + x
  const prev = new Int32Array(W * H).fill(-1)
  const start = idx(from[0], from[1]), goal = idx(to[0], to[1])
  const queue = [start]
  prev[start] = start
  for (let qi = 0; qi < queue.length; qi++) {
    const cur = queue[qi]
    if (cur === goal) break
    const cx = cur % W, cy = (cur / W) | 0
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx, ny = cy + dy
      if (!isWalkable(nx, ny) || prev[idx(nx, ny)] !== -1) continue
      prev[idx(nx, ny)] = cur
      queue.push(idx(nx, ny))
    }
  }
  if (prev[goal] === -1) return null
  const path = []
  for (let n = goal; n !== start; n = prev[n]) path.push([n % W, (n / W) | 0])
  path.push(from)
  return path.reverse()
}

function distToRect(x, y, [rx, ry, rw, rh]) {
  const X = rx * TILE, Y = ry * TILE
  const dx = Math.max(X - x, 0, x - (X + rw * TILE))
  const dy = Math.max(Y - y, 0, y - (Y + rh * TILE))
  return Math.hypot(dx, dy)
}

function pickScale() {
  const vw = window.innerWidth, vh = window.innerHeight
  return Math.max(2, Math.min(Math.floor(vw / (TILE * 24)), Math.floor(vh / (TILE * 14))))
}

function nightAlpha(h) {
  if (h >= 21 || h < 5) return 0.42
  if (h >= 19) return 0.22
  if (h < 7) return 0.18
  return 0
}

const NPC_AREA = { x0: 25, x1: 33, y0: 11, y1: 12 }

export default function Game({ season, look, paused, onInteract, labelFor, keyHint, tapHint }) {
  const canvasRef = useRef(null)
  const labelRef = useRef(null)
  const [near, setNear] = useState(null)
  const props = useRef({})
  props.current = { season, look, paused, onInteract }
  const api = useRef({})

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const bubble = bubbleSprite(), arrow = arrowSprite()

    const spawn = center(world.spawn)
    const player = { ...spawn, dir: 0, anim: 0, moving: false, path: [], pending: null, stuck: 0 }
    const npc = { ...center([29, 12]), dir: 0, anim: 0, moving: false, path: [], wait: 1.5 }
    const keys = new Set()
    const visited = new Set()
    const cam = { x: 0, y: 0, w: 0, h: 0, scale: 3 }
    let nearTarget = null
    let art = { season: null }
    let particles = []
    let marker = null
    let hour = new Date().getHours()
    let raf = 0, last = performance.now()

    function ensureArt() {
      const s = props.current.season
      if (art.season === s) return
      art = { season: s, ground: renderGround(s), drawables: buildDrawables(s) }
      particles = []
    }

    function resize() {
      cam.scale = pickScale()
      cam.w = Math.ceil(window.innerWidth / cam.scale)
      cam.h = Math.ceil(window.innerHeight / cam.scale)
      canvas.width = cam.w
      canvas.height = cam.h
      canvas.style.width = `${cam.w * cam.scale}px`
      canvas.style.height = `${cam.h * cam.scale}px`
      ctx.imageSmoothingEnabled = false
    }

    // ── Çarpışma ──────────────────────────────────────────────────────────
    const solidAt = (px, py) => {
      const [tx, ty] = tileOf(px, py)
      return !isWalkable(tx, ty)
    }
    const boxFree = (x, y, other) =>
      !solidAt(x - 5, y - 5) && !solidAt(x + 4.9, y - 5) && !solidAt(x - 5, y - 0.1) && !solidAt(x + 4.9, y - 0.1) &&
      !(Math.abs(x - other.x) < 10 && Math.abs(y - other.y) < 9)

    function step(ent, dx, dy, speed, dt, other) {
      const len = Math.hypot(dx, dy)
      if (!len) { ent.moving = false; return false }
      const vx = (dx / len) * speed * dt, vy = (dy / len) * speed * dt
      let moved = false
      if (vx && boxFree(ent.x + vx, ent.y, other)) { ent.x += vx; moved = true }
      if (vy && boxFree(ent.x, ent.y + vy, other)) { ent.y += vy; moved = true }
      ent.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 2 : 3) : dy < 0 ? 1 : 0
      ent.moving = moved
      ent.anim += dt
      return moved
    }

    function followPath(ent, speed, dt, other) {
      const next = ent.path[0]
      if (!next) return false
      const c = center(next)
      const dx = c.x - ent.x, dy = c.y - ent.y
      if (Math.hypot(dx, dy) < 1.2) {
        ent.x = c.x; ent.y = c.y
        ent.path.shift()
        return true
      }
      return step(ent, dx, dy, speed, dt, other)
    }

    // ── Etkileşim ────────────────────────────────────────────────────────
    function faceTowards(x, y) {
      const dx = x - player.x, dy = y - player.y
      player.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 2 : 3) : dy < 0 ? 1 : 0
    }

    function interact(target) {
      if (!target || props.current.paused) return
      player.path = []
      player.pending = null
      if (target.kind === 'npc') {
        faceTowards(npc.x, npc.y)
        npc.path = []
        npc.dir = Math.abs(player.x - npc.x) > Math.abs(player.y - npc.y) ? (player.x < npc.x ? 2 : 3) : player.y < npc.y ? 1 : 0
      } else {
        const [rx, ry, rw, rh] = target.rect
        faceTowards((rx + rw / 2) * TILE, (ry + rh / 2) * TILE)
      }
      visited.add(target.id)
      props.current.onInteract(target)
    }
    api.current.interact = () => interact(nearTarget)

    function npcTarget() {
      return { id: 'npc', kind: 'npc' }
    }

    function findNear() {
      let best = null, bd = Infinity
      const fx = player.x, fy = player.y - 4
      for (const it of world.interactables) {
        const d = distToRect(fx, fy, it.rect)
        if (d < NEAR && d < bd) { best = it; bd = d }
      }
      const dn = Math.hypot(player.x - npc.x, player.y - npc.y)
      if (dn < 22 && dn < bd + 6) best = npcTarget()
      return best
    }

    // Tıklanan noktaya yürü; bir nesneye tıklandıysa varınca aç
    function walkTo(wx, wy) {
      const from = tileOf(player.x, player.y)
      if (Math.abs(wx - npc.x) < 9 && wy > npc.y - 26 && wy < npc.y + 3) {
        if (nearTarget?.kind === 'npc') return interact(nearTarget)
        const nt = tileOf(npc.x, npc.y)
        const options = [[0, 1], [0, -1], [1, 0], [-1, 0]]
          .map(([dx, dy]) => findPath(from, [nt[0] + dx, nt[1] + dy]))
          .filter(Boolean)
          .sort((a, b) => a.length - b.length)
        if (options[0]) { player.path = options[0]; player.pending = npcTarget() }
        return
      }
      const [tx, ty] = tileOf(wx, wy)
      // Evin tamamı ya da posta kutusunun üstü gibi geniş tıklama alanları `click` ile verilir
      const hit = world.interactables.find(it => {
        const [rx, ry, rw, rh] = it.click ?? it.rect
        return tx >= rx && tx < rx + rw && ty >= ry && ty < ry + rh
      })
      if (hit) {
        if (nearTarget?.id === hit.id) return interact(hit)
        const path = findPath(from, hit.spot)
        if (path) { player.path = path; player.pending = hit }
        return
      }
      const path = findPath(from, [tx, ty])
      if (path) {
        player.path = path
        player.pending = null
        marker = { x: tx * TILE + 8, y: ty * TILE + 8, t: 0.6 }
      }
    }

    // ── Güncelleme ───────────────────────────────────────────────────────
    function update(dt) {
      const paused = props.current.paused
      if (!paused) {
        let dx = 0, dy = 0
        if (keys.has('left')) dx -= 1
        if (keys.has('right')) dx += 1
        if (keys.has('up')) dy -= 1
        if (keys.has('down')) dy += 1
        if (dx || dy) {
          player.path = []
          player.pending = null
          step(player, dx, dy, SPEED, dt, npc)
        } else if (player.path.length) {
          const before = player.x + player.y
          followPath(player, SPEED, dt, npc)
          player.stuck = Math.abs(player.x + player.y - before) < 0.01 ? player.stuck + dt : 0
          if (player.stuck > 0.6) { player.path = []; player.stuck = 0 }
          if (!player.path.length && player.pending) {
            const target = player.pending
            player.pending = null
            const n = findNear()
            if (n && (n.id === target.id)) interact(n)
          }
        } else {
          player.moving = false
        }
      } else {
        player.moving = false
      }

      // Sema yakındaki oyuncuya döner, değilse etrafta dolaşır
      const talking = nearTarget?.kind === 'npc'
      if (talking || paused) {
        npc.moving = false
        if (talking) npc.dir = Math.abs(player.x - npc.x) > Math.abs(player.y - npc.y) ? (player.x < npc.x ? 2 : 3) : player.y < npc.y ? 1 : 0
      } else if (npc.path.length) {
        if (!followPath(npc, NPC_SPEED, dt, player) && npc.path.length) {
          npc.wait = 1
          npc.path = []
        }
        if (!npc.path.length) npc.wait = 2 + Math.random() * 4
      } else if ((npc.wait -= dt) <= 0) {
        const tx = NPC_AREA.x0 + Math.floor(Math.random() * (NPC_AREA.x1 - NPC_AREA.x0 + 1))
        const ty = NPC_AREA.y0 + Math.floor(Math.random() * (NPC_AREA.y1 - NPC_AREA.y0 + 1))
        npc.path = findPath(tileOf(npc.x, npc.y), [tx, ty]) ?? []
        npc.wait = 2
      } else {
        npc.moving = false
      }

      if (!paused) {
        const n = findNear()
        if (n?.id !== nearTarget?.id) {
          nearTarget = n
          setNear(n)
        }
      }

      // Kamera oyuncuyu izler, harita dışına taşmaz
      const clampCam = (v, size, world) => (size >= world ? (world - size) / 2 : Math.min(Math.max(v, 0), world - size))
      cam.x = Math.round(clampCam(player.x - cam.w / 2, cam.w, WW))
      cam.y = Math.round(clampCam(player.y - 8 - cam.h / 2, cam.h, WH))

      if (marker && (marker.t -= dt) <= 0) marker = null
    }

    // ── Mevsim parçacıkları (ekran koordinatında) ───────────────────────
    const PARTICLE = {
      spring: { n: 26, cols: ['#ffc9df', '#ff9db5', '#ffffff'], w: 2, h: 1, vy: 10, sway: 14 },
      summer: { n: 12, cols: ['#fff3a8', '#ffffff'], w: 1, h: 1, vy: -3, sway: 10 },
      fall: { n: 22, cols: ['#f4a62a', '#d4502f', '#f6c057'], w: 2, h: 2, vy: 12, sway: 18 },
      winter: { n: 60, cols: ['#ffffff', '#e8f1f8'], w: 1, h: 1, vy: 14, sway: 6 },
    }
    function drawParticles(dt, t) {
      if (reduce) return
      const cfg = PARTICLE[art.season]
      while (particles.length < cfg.n) {
        particles.push({ x: Math.random() * cam.w, y: Math.random() * cam.h, ph: Math.random() * 6, s: 0.6 + Math.random() * 0.8, c: cfg.cols[particles.length % cfg.cols.length] })
      }
      for (const pt of particles) {
        pt.y += cfg.vy * pt.s * dt
        pt.x += Math.sin(t * 0.8 + pt.ph) * cfg.sway * dt
        if (pt.y > cam.h + 2) { pt.y = -2; pt.x = Math.random() * cam.w }
        if (pt.y < -2) { pt.y = cam.h + 2; pt.x = Math.random() * cam.w }
        if (pt.x < -2) pt.x = cam.w + 1
        if (pt.x > cam.w + 2) pt.x = -1
        ctx.fillStyle = pt.c
        ctx.globalAlpha = art.season === 'summer' ? 0.5 + 0.5 * Math.sin(t * 3 + pt.ph) : 1
        ctx.fillRect(Math.round(pt.x), Math.round(pt.y), cfg.w + (pt.s > 1.2 ? 1 : 0), cfg.h)
      }
      ctx.globalAlpha = 1
    }

    // ── Çizim ────────────────────────────────────────────────────────────
    function personSprite(look, ent) {
      const f = ent.moving ? WALK[Math.floor(ent.anim * 8) % 4] : 0
      return framesFor(look)[ent.dir][f]
    }

    function draw(dt, t) {
      ctx.fillStyle = '#1f3a1d'
      ctx.fillRect(0, 0, cam.w, cam.h)
      ctx.drawImage(art.ground, -cam.x, -cam.y)

      // Su pırıltıları
      if (!reduce) {
        const x0 = Math.max(0, Math.floor(cam.x / TILE)), x1 = Math.min(W - 1, Math.ceil((cam.x + cam.w) / TILE))
        const y0 = Math.max(0, Math.floor(cam.y / TILE)), y1 = Math.min(H - 1, Math.ceil((cam.y + cam.h) / TILE))
        ctx.fillStyle = 'rgba(255,255,255,.55)'
        for (let ty = Math.max(y0, 24); ty <= y1; ty++) {
          for (let tx = x0; tx <= x1; tx++) {
            if (world.ground[ty][tx] !== G.WATER) continue
            const seed = (tx * 37 + ty * 17) % 16
            const ox = Math.floor((seed + t * 5) % 16)
            const oy = 5 + ((seed * 3) % 9)
            if ((Math.floor(t * 1.5) + tx + ty) % 3 === 0) continue
            ctx.fillRect(tx * TILE + ox - cam.x, ty * TILE + oy - cam.y, 3, 1)
          }
        }
      }

      // Y sıralı sprite'lar
      const list = art.drawables.filter(d => d.x + d.s.w > cam.x && d.x < cam.x + cam.w && d.y + d.s.h > cam.y && d.y < cam.y + cam.h)
      list.push({ s: personSprite('sema', npc), x: npc.x - 8, y: npc.y - 22, base: npc.y })
      list.push({ s: personSprite(props.current.look, player), x: player.x - 8, y: player.y - 22, base: player.y + 0.5 })
      list.sort((a, b) => a.base - b.base)
      for (const d of list) drawSprite(ctx, d.s, d.x - cam.x, d.y - cam.y)

      drawParticles(dt, t)

      // Gece karartması ve yanan pencereler
      const na = nightAlpha(hour)
      if (na) {
        ctx.fillStyle = `rgba(18, 22, 64, ${na})`
        ctx.fillRect(0, 0, cam.w, cam.h)
        const hx = 21 * TILE - cam.x, hy = 3 * TILE - cam.y
        HOUSE_WINDOWS.forEach(([x, y]) => {
          ctx.fillStyle = 'rgba(255, 200, 110, .18)'
          ctx.fillRect(hx + x - 4, hy + y - 3, 26, 26)
          ctx.fillStyle = '#ffd98a'
          ctx.fillRect(hx + x + 2, hy + y + 2, 6, 6); ctx.fillRect(hx + x + 10, hy + y + 2, 6, 6)
          ctx.fillRect(hx + x + 2, hy + y + 10, 6, 6); ctx.fillRect(hx + x + 10, hy + y + 10, 6, 6)
        })
      }

      // Henüz ziyaret edilmeyen bölümlerin üstünde "!" balonu, yakındakinde ok
      const bob = reduce ? 0 : Math.round(Math.sin(t * 4) * 1.5)
      for (const it of world.interactables) {
        if (!it.main || visited.has(it.id) || nearTarget?.id === it.id) continue
        const [rx, ry, rw] = it.rect
        const top = it.id === 'contact' ? ry * TILE - 12 : it.id === 'about' ? ry * TILE - 40 : ry * TILE - 6
        drawSprite(ctx, bubble, (rx + rw / 2) * TILE - 4 - cam.x, top - 11 + bob - cam.y)
      }
      let labelPos = null
      if (nearTarget && !props.current.paused) {
        let ax, ay
        if (nearTarget.kind === 'npc') { ax = npc.x; ay = npc.y - 26 }
        else {
          const [rx, ry, rw] = nearTarget.rect
          ax = (rx + rw / 2) * TILE
          ay = nearTarget.id === 'contact' ? ry * TILE - 12 : nearTarget.id === 'about' ? ry * TILE - 40 : nearTarget.kind === 'project' ? ry * TILE - 2 : ry * TILE - 4
        }
        drawSprite(ctx, arrow, ax - 4 - cam.x, ay - 10 + bob - cam.y)
        labelPos = [ax - cam.x, ay - 12 - cam.y]
      }
      if (marker) {
        ctx.strokeStyle = 'rgba(255,255,255,.8)'
        ctx.strokeRect(marker.x - 5 - cam.x + 0.5, marker.y - 5 - cam.y + 0.5, 10, 10)
      }

      const label = labelRef.current
      if (label) {
        if (labelPos) {
          label.style.transform = `translate(${labelPos[0] * cam.scale}px, ${labelPos[1] * cam.scale}px) translate(-50%, -100%)`
          label.style.opacity = '1'
        } else {
          label.style.opacity = '0'
        }
      }
    }

    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      ensureArt()
      update(dt)
      draw(dt, now / 1000)
      raf = requestAnimationFrame(loop)
    }

    // ── Girdi ────────────────────────────────────────────────────────────
    const KEYMAP = {
      ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right',
      ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down',
    }
    function onKeyDown(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (props.current.paused) return
      const k = KEYMAP[e.key]
      if (k) { keys.add(k); e.preventDefault(); return }
      if (e.key === 'e' || e.key === 'E' || e.key === ' ' || e.key === 'Enter') {
        if (e.target.closest?.('button, a')) return
        if (nearTarget) { e.preventDefault(); interact(nearTarget) }
      }
    }
    function onKeyUp(e) {
      const k = KEYMAP[e.key]
      if (k) keys.delete(k)
    }
    const onBlur = () => keys.clear()
    function onPointerDown(e) {
      if (props.current.paused) return
      const r = canvas.getBoundingClientRect()
      walkTo((e.clientX - r.left) / cam.scale + cam.x, (e.clientY - r.top) / cam.scale + cam.y)
    }
    const clock = setInterval(() => { hour = new Date().getHours() }, 60000)

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    canvas.addEventListener('pointerdown', onPointerDown)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(clock)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      canvas.removeEventListener('pointerdown', onPointerDown)
    }
  }, [])

  return (
    <div className="game">
      <canvas ref={canvasRef} className="game-canvas" aria-hidden="true" />
      <button
        ref={labelRef}
        type="button"
        className="game-label"
        style={{ opacity: 0 }}
        tabIndex={near && !paused ? 0 : -1}
        onClick={() => api.current.interact?.()}
      >
        {near && (
          <>
            <span>{labelFor(near)}</span>
            <kbd className="game-key">{keyHint}</kbd>
            <span className="game-tap">{tapHint}</span>
          </>
        )}
      </button>
    </div>
  )
}

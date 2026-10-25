import { useEffect } from 'react'

// Yıldız canvas sistemi — pembe parçacıklar + kayan yıldızlar
export function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Pembe yanıp sönen parçacıklar ─────────────────────────────
    const PINKS = ['233,30,140', '240,98,146', '244,143,177', '219,0,115', '255,105,180', '233,70,160']
    const DOT_COUNT = 130  // Artırıldı

    class Dot {
      constructor() { this.reset(true) }
      reset(initial = false) {
        this.x     = Math.random() * canvas.width
        this.y     = Math.random() * canvas.height
        this.r     = Math.random() * 2.6 + 0.5
        this.alpha = Math.random() * 0.7 + 0.2
        this.vx    = (Math.random() - 0.5) * 0.18
        this.vy    = (Math.random() - 0.5) * 0.18
        this.maxLife = Math.random() * 600 + 250
        this.life  = initial ? Math.random() * this.maxLife : 0
        this.color = PINKS[Math.floor(Math.random() * PINKS.length)]
        // yanıp sönme için faz
        this.blinkSpeed = Math.random() * 0.04 + 0.01
        this.blinkPhase = Math.random() * Math.PI * 2
      }
      tick() {
        this.x += this.vx
        this.y += this.vy
        this.life++
        this.blinkPhase += this.blinkSpeed
        if (this.life > this.maxLife) this.reset()
      }
      draw() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light'
        const p    = this.life / this.maxLife
        const fade = p < 0.1 ? p / 0.1 : p > 0.9 ? (1 - p) / 0.1 : 1
        const blink = (Math.sin(this.blinkPhase) + 1) / 2  // 0→1→0
        const alphaBoost = isLight ? 1.4 : 1.0  // light mode'da daha belirgin
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color},${Math.min(1, this.alpha * alphaBoost * fade * (0.4 + 0.6 * blink))})`
        ctx.fill()
      }
    }

    // ── Kayan yıldızlar (starfield) ───────────────────────────
    const STAR_COUNT = 120
    class Star {
      constructor() { this.reset(true) }
      reset(initial = false) {
        this.x  = Math.random() * canvas.width
        this.y  = initial ? Math.random() * canvas.height : -4
        this.r  = Math.random() * 0.9 + 0.15
        this.vy = Math.random() * 0.4 + 0.1
        this.alpha = Math.random() * 0.35 + 0.08
        this.color = Math.random() > 0.6
          ? PINKS[Math.floor(Math.random() * PINKS.length)]
          : '255,255,255'
      }
      tick() {
        this.y += this.vy
        if (this.y > canvas.height + 4) this.reset(false)
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color},${this.alpha})`
        ctx.fill()
      }
    }

    const dots  = Array.from({ length: DOT_COUNT },  () => new Dot())
    const stars = Array.from({ length: STAR_COUNT }, () => new Star())
    let raf

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => { s.tick(); s.draw() })
      dots.forEach(d  => { d.tick(); d.draw() })
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])
}

// Özel imleç — dot yerine gül görseli
export function useCursor() {
  useEffect(() => {
    // Gül imleci
    const roseEl = document.createElement('img')
    roseEl.className = 'cursor-rose'
    roseEl.src = '/favicon.svg'
    roseEl.setAttribute('aria-hidden', 'true')

    const ring = document.createElement('div')
    ring.className = 'cursor-ring'
    document.body.append(roseEl, ring)

    let mx = 0, my = 0, rx = 0, ry = 0
    // İlk hareketten önce imleci gizle (sol üst köşede beklemesin)
    const onMove = e => {
      mx = e.clientX; my = e.clientY
      if (!roseEl.classList.contains('ready')) {
        rx = mx; ry = my
        roseEl.classList.add('ready'); ring.classList.add('ready')
      }
    }
    const onLeave = () => { roseEl.classList.remove('ready'); ring.classList.remove('ready') }
    document.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)

    roseEl.style.left = '0px'
    roseEl.style.top  = '0px'

    let raf
    const tick = () => {
      roseEl.style.left  = mx + 'px'
      roseEl.style.top   = my + 'px'
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.left = rx + 'px'
      ring.style.top  = ry + 'px'
      raf = requestAnimationFrame(tick)
    }
    tick()

    // Event delegation: sonradan eklenen öğelerde de hover efekti çalışır
    const HOVER_SEL = 'a, button, .skill-tag, .work-card, .btn-primary, .btn-ghost, .avail-badge'
    const onOver = e => {
      const on = !!e.target.closest?.(HOVER_SEL)
      roseEl.classList.toggle('hover', on)
      ring.classList.toggle('hover', on)
    }
    document.addEventListener('mouseover', onOver)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
      roseEl.remove()
      ring.remove()
    }
  }, [])
}

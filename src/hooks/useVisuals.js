import { useEffect } from 'react'

// Yıldız canvas sistemi — parlayan pembe parçacıklar, kayan yıldızlar ve ara sıra bir kuyrukluyıldız.
// Performans: her renk için parlama bir kez önceden çizilir (drawImage ucuzdur),
// sekme gizliyken döngü durur, parçacık sayısı ekran alanına göre ayarlanır,
// "hareketi azalt" tercihinde tek bir sabit kare çizilir.
export function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    let W = 0, H = 0
    let isLight = document.documentElement.getAttribute('data-theme') === 'light'
    let onThemeChange = () => {}
    const themeObs = new MutationObserver(() => {
      isLight = document.documentElement.getAttribute('data-theme') === 'light'
      onThemeChange()
    })
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    const PINKS = ['233,30,140', '240,98,146', '244,143,177', '219,0,115', '255,105,180']

    // Önceden çizilmiş parlama sprite'ları (renk başına bir tane)
    const SPRITE = 32
    const makeSprite = (rgb) => {
      const c = document.createElement('canvas')
      c.width = c.height = SPRITE
      const g = c.getContext('2d')
      const grad = g.createRadialGradient(SPRITE / 2, SPRITE / 2, 0, SPRITE / 2, SPRITE / 2, SPRITE / 2)
      grad.addColorStop(0, `rgba(${rgb},1)`)
      grad.addColorStop(0.18, `rgba(${rgb},.85)`)
      grad.addColorStop(0.45, `rgba(${rgb},.18)`)
      grad.addColorStop(1, `rgba(${rgb},0)`)
      g.fillStyle = grad
      g.fillRect(0, 0, SPRITE, SPRITE)
      return c
    }
    const pinkSprites = PINKS.map(makeSprite)
    const whiteSprite = makeSprite('255,255,255')

    const rand = (a, b) => a + Math.random() * (b - a)

    const makeDot = (initial) => {
      const maxLife = rand(250, 850)
      return {
        x: rand(0, W), y: rand(0, H),
        size: rand(5, 13),
        vx: rand(-0.09, 0.09), vy: rand(-0.09, 0.09),
        alpha: rand(0.35, 0.9),
        life: initial ? rand(0, maxLife) : 0, maxLife,
        sprite: pinkSprites[(Math.random() * pinkSprites.length) | 0],
        phase: rand(0, Math.PI * 2), speed: rand(0.01, 0.045),
      }
    }
    const makeStar = (initial) => ({
      x: rand(0, W), y: initial ? rand(0, H) : -6,
      size: rand(2, 5), vy: rand(0.08, 0.4), alpha: rand(0.15, 0.55),
      sprite: Math.random() > 0.6 ? pinkSprites[(Math.random() * pinkSprites.length) | 0] : whiteSprite,
    })

    let dots = [], stars = []
    const resize = () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W * dpr; canvas.height = H * dpr
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const area = W * H
      const dotCount = Math.round(Math.min(110, Math.max(40, area / 13000)))
      const starCount = Math.round(Math.min(110, Math.max(40, area / 12000)))
      dots = Array.from({ length: dotCount }, () => makeDot(true))
      stars = Array.from({ length: starCount }, () => makeStar(true))
    }
    resize()
    window.addEventListener('resize', resize)

    // Kuyrukluyıldız: 7–14 sn'de bir, sadece koyu temada
    let comet = null
    let nextComet = performance.now() + rand(3000, 7000)
    const spawnComet = () => {
      const fromLeft = Math.random() > 0.5
      const speed = rand(9, 13)
      const angle = rand(0.35, 0.6)
      comet = {
        x: fromLeft ? rand(-50, W * 0.4) : rand(W * 0.6, W + 50),
        y: rand(-40, H * 0.3),
        vx: (fromLeft ? 1 : -1) * Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0, maxLife: rand(55, 80),
      }
    }

    const drawFrame = (now, animate) => {
      ctx.clearRect(0, 0, W, H)
      const boost = isLight ? 1.3 : 1

      for (const s of stars) {
        if (animate) { s.y += s.vy; if (s.y > H + 6) Object.assign(s, makeStar(false)) }
        ctx.globalAlpha = s.alpha
        ctx.drawImage(s.sprite, s.x - s.size / 2, s.y - s.size / 2, s.size, s.size)
      }

      for (const d of dots) {
        if (animate) {
          d.x += d.vx; d.y += d.vy; d.life++; d.phase += d.speed
          if (d.life > d.maxLife) Object.assign(d, makeDot(false))
        }
        const p = d.life / d.maxLife
        const fade = p < 0.1 ? p / 0.1 : p > 0.9 ? (1 - p) / 0.1 : 1
        const blink = (Math.sin(d.phase) + 1) / 2
        ctx.globalAlpha = Math.min(1, d.alpha * boost * fade * (0.35 + 0.65 * blink))
        ctx.drawImage(d.sprite, d.x - d.size / 2, d.y - d.size / 2, d.size, d.size)
      }

      if (animate && !isLight) {
        if (!comet && now > nextComet) spawnComet()
        if (comet) {
          comet.x += comet.vx; comet.y += comet.vy; comet.life++
          const t = comet.life / comet.maxLife
          const a = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8
          const tail = 14
          const grad = ctx.createLinearGradient(comet.x, comet.y, comet.x - comet.vx * tail, comet.y - comet.vy * tail)
          grad.addColorStop(0, 'rgba(255,220,240,1)')
          grad.addColorStop(1, 'rgba(233,30,140,0)')
          ctx.globalAlpha = Math.max(0, a)
          ctx.strokeStyle = grad
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.moveTo(comet.x, comet.y)
          ctx.lineTo(comet.x - comet.vx * tail, comet.y - comet.vy * tail)
          ctx.stroke()
          ctx.drawImage(whiteSprite, comet.x - 5, comet.y - 5, 10, 10)
          if (comet.life >= comet.maxLife) { comet = null; nextComet = now + rand(7000, 14000) }
        }
      }
      ctx.globalAlpha = 1
    }

    let raf = 0
    const loop = (now) => {
      drawFrame(now, true)
      raf = requestAnimationFrame(loop)
    }
    const start = () => { if (!raf && !reduceMotion) raf = requestAnimationFrame(loop) }
    const stop = () => { cancelAnimationFrame(raf); raf = 0 }
    const onVisibility = () => (document.hidden ? stop() : start())

    // Hareketi azalt: tek kare, boyut veya tema değişince yeniden çiz
    const drawStatic = () => drawFrame(0, false)
    if (reduceMotion) {
      drawStatic()
      window.addEventListener('resize', drawStatic)
      onThemeChange = drawStatic
    } else start()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', drawStatic)
      document.removeEventListener('visibilitychange', onVisibility)
      themeObs.disconnect()
    }
  }, [canvasRef])
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

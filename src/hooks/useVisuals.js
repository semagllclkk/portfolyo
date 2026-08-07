import { useEffect } from 'react'

// Parçacık canvas sistemi
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

    const PINKS = ['233,30,140', '240,98,146', '244,143,177']
    const COUNT = 55

    class Dot {
      constructor() { this.reset(true) }
      reset(initial = false) {
        this.x     = Math.random() * canvas.width
        this.y     = Math.random() * canvas.height
        this.r     = Math.random() * 1.5 + 0.3
        this.alpha = Math.random() * 0.45 + 0.1
        this.vx    = (Math.random() - 0.5) * 0.14
        this.vy    = (Math.random() - 0.5) * 0.14
        this.maxLife = Math.random() * 700 + 300
        this.life  = initial ? Math.random() * this.maxLife : 0
        this.color = PINKS[Math.floor(Math.random() * PINKS.length)]
      }
      tick() {
        this.x += this.vx
        this.y += this.vy
        this.life++
        if (this.life > this.maxLife) this.reset()
      }
      draw() {
        const p     = this.life / this.maxLife
        const fade  = p < 0.1 ? p / 0.1 : p > 0.9 ? (1 - p) / 0.1 : 1
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color},${this.alpha * fade})`
        ctx.fill()
      }
    }

    const dots = Array.from({ length: COUNT }, () => new Dot())
    let raf

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      dots.forEach(d => { d.tick(); d.draw() })
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])
}

// Özel imleç
export function useCursor() {
  useEffect(() => {
    const dot  = document.createElement('div')
    const ring = document.createElement('div')
    dot.className  = 'cursor-dot'
    ring.className = 'cursor-ring'
    document.body.append(dot, ring)

    let mx = 0, my = 0, rx = 0, ry = 0
    const onMove = e => { mx = e.clientX; my = e.clientY }
    document.addEventListener('mousemove', onMove)

    dot.style.left = '0px'
    dot.style.top  = '0px'

    let raf
    const tick = () => {
      dot.style.left  = mx + 'px'
      dot.style.top   = my + 'px'
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.left = rx + 'px'
      ring.style.top  = ry + 'px'
      raf = requestAnimationFrame(tick)
    }
    tick()

    const addHover = () => { dot.classList.add('hover'); ring.classList.add('hover') }
    const rmHover  = () => { dot.classList.remove('hover'); ring.classList.remove('hover') }

    const attachHover = () => {
      document.querySelectorAll('a, button, .skill-tag, .work-card, .btn-primary, .btn-ghost, .avail-badge').forEach(el => {
        el.addEventListener('mouseenter', addHover)
        el.addEventListener('mouseleave', rmHover)
      })
    }
    attachHover()

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      dot.remove()
      ring.remove()
    }
  }, [])
}

import { useEffect, useRef } from 'react'

const REVEAL_CLASSES = [
  '.reveal-child',
  '.reveal-left',
  '.reveal-right',
  '.reveal-scale',
]

export function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const children = el.querySelectorAll(REVEAL_CLASSES.join(', '))

    const childObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // küçük bir stagger ekle eğer delay zaten set değilse
            const el = entry.target
            if (!el.style.getPropertyValue('--delay')) {
              el.style.setProperty('--delay', `${i * 0.05}s`)
            }
            el.classList.add('visible')
            childObserver.unobserve(el)
          }
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    )

    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('section-visible')
          sectionObserver.disconnect()
        }
      },
      { threshold: 0.04 }
    )

    children.forEach(c => childObserver.observe(c))
    sectionObserver.observe(el)

    return () => {
      childObserver.disconnect()
      sectionObserver.disconnect()
    }
  }, [])

  return ref
}

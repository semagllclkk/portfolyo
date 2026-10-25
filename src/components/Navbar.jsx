import { useEffect, useRef, useState } from 'react'
import pixelRose from '../assets/pixel-rose.png'

export default function Navbar() {
  const navRef = useRef(null)
  // index.html'deki script temayı ilk boyamadan önce ayarlıyor; buradan okuyoruz
  const [dark, setDark] = useState(
    () => document.documentElement.getAttribute('data-theme') !== 'light'
  )
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => {
      navRef.current?.classList.toggle('scrolled', window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Dark / Light mode toggle
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggleTheme = () => {
    setDark(d => {
      try { localStorage.setItem('theme', d ? 'light' : 'dark') } catch { /* gizli sekme */ }
      return !d
    })
  }

  // Menü açıkken body scroll'u kilitle
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const links = [
    { href: '#about',      label: 'Hakkımda' },
    { href: '#experience', label: 'Deneyim'  },
    { href: '#works',      label: 'Projeler'  },
    { href: '#skills',  label: 'Beceriler' },
    { href: '#contact', label: 'İletişim'  },
  ]

  // Ekranın ortasındaki bölümü menüde vurgula
  useEffect(() => {
    const ids = links.map(l => l.href.slice(1))
    const onScroll = () => {
      const mid = window.innerHeight / 2
      let current = ''
      ids.forEach(id => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= mid) current = id
      })
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMobileLink = (href) => {
    setMenuOpen(false)
    // Kısa gecikmeyle scroll yap (drawer kapanma animasyonu tamamlansın)
    setTimeout(() => {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 320)
  }

  return (
    <>
      <nav ref={navRef} className="navbar">
        <a href="#hero" className="nav-logo">
          <img width={80} height={80} src={pixelRose} alt="logo" />
        </a>

        <ul className="nav-links">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className={`nav-link${active === l.href.slice(1) ? ' active' : ''}`}>{l.label}</a>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Dark / Light mode toggle */}
          <button
            id="theme-toggle"
            className="theme-toggle"
            aria-label={dark ? 'Açık moda geç' : 'Koyu moda geç'}
            onClick={toggleTheme}
          >
            <span className="theme-toggle-track">
              <span className="theme-toggle-thumb" />
              <span className="theme-toggle-icon theme-toggle-sun">☀️</span>
              <span className="theme-toggle-icon theme-toggle-moon">🌸</span>
            </span>
          </button>

          {/* Hamburger — sadece mobilde görünür */}
          <button
            id="hamburger-btn"
            className={`hamburger${menuOpen ? ' open' : ''}`}
            aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobil tam ekran drawer */}
      <div
        id="mobile-nav"
        className={`mobile-nav${menuOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigasyon"
      >
        {links.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            className="mobile-nav-link"
            onClick={(e) => { e.preventDefault(); handleMobileLink(l.href) }}
          >
            {l.label}
          </a>
        ))}

        {/* Mobil drawer'da tema toggle */}
        <div className="mobile-nav-divider" />
        <button
          className="theme-toggle"
          style={{ cursor: 'pointer' }}
          aria-label={dark ? 'Açık moda geç' : 'Koyu moda geç'}
          onClick={toggleTheme}
        >
          <span className="theme-toggle-track">
            <span className="theme-toggle-thumb" />
            <span className="theme-toggle-icon theme-toggle-sun">☀️</span>
            <span className="theme-toggle-icon theme-toggle-moon">🌸</span>
          </span>
        </button>
      </div>
    </>
  )
}

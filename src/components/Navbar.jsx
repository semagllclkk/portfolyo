import { useEffect, useRef, useState } from 'react'
import pixelRose from '../assets/pixel-rose.png'

export default function Navbar() {
  const navRef = useRef(null)
  const [dark, setDark] = useState(true)

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

  const links = [
    { href: '#about', label: 'Hakkımda' },
    { href: '#works', label: 'Projeler' },
    { href: '#skills', label: 'Beceriler' },
    { href: '#contact', label: 'İletişim' },
  ]

  return (
    <nav ref={navRef} className="navbar">
      <a href="#hero" className="nav-logo">
        <img width={50} height={50} src={pixelRose} alt="logo" />
      </a>

      <ul className="nav-links">
        {links.map(l => (
          <li key={l.href}>
            <a href={l.href} className="nav-link">{l.label}</a>
          </li>
        ))}
      </ul>

      {/* Dark / Light mode toggle */}
      <button
        id="theme-toggle"
        className="theme-toggle"
        aria-label={dark ? 'Açık moda geç' : 'Koyu moda geç'}
        onClick={() => setDark(d => !d)}
      >
        <span className="theme-toggle-track">
          <span className="theme-toggle-thumb" />
          <span className="theme-toggle-icon theme-toggle-sun">☀️</span>
          <span className="theme-toggle-icon theme-toggle-moon">🌸</span>
        </span>
      </button>
    </nav>
  )
}

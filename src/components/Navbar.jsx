import { useEffect, useRef } from 'react'
import { personal } from '../data'

export default function Navbar() {
  const navRef = useRef(null)
  const [mobileOpen, setMobileOpen] = [false, () => {}]

  useEffect(() => {
    const onScroll = () => {
      navRef.current?.classList.toggle('scrolled', window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#about',   label: 'Hakkımda' },
    { href: '#works',   label: 'Projeler' },
    { href: '#skills',  label: 'Beceriler' },
    { href: '#contact', label: 'İletişim' },
  ]

  return (
    <nav ref={navRef} className="navbar">
      <a href="#hero" className="nav-logo"><img width={50} height={50} src="\src\assets\pixel-rose.png"/></a>

      <ul className="nav-links">
        {links.map(l => (
          <li key={l.href}>
            <a href={l.href} className="nav-link">{l.label}</a>
          </li>
        ))}
      </ul>

      <div className="nav-line" />
    </nav>
  )
}

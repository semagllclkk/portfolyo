import { personal } from '../data'

export default function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="footer-inner">
        <span className="footer-name">{personal.name}</span>
        <span className="footer-copy">© {new Date().getFullYear()} — Tüm haklar saklıdır.</span>
        <a href="#hero" className="footer-top" id="back-to-top">↑ Yukarı</a>
      </div>
    </footer>
  )
}

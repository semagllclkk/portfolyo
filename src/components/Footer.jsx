import { useLang } from '../i18n'

export default function Footer() {
  const { c } = useLang()
  const { personal } = c
  return (
    <footer id="footer" className="footer">
      <div className="footer-inner">
        <span className="footer-name">{personal.name}</span>
        <span className="footer-copy">© {new Date().getFullYear()} — {c.ui.footerRights}</span>
        <a href="#hero" className="footer-top" id="back-to-top">{c.ui.backToTop}</a>
      </div>
    </footer>
  )
}

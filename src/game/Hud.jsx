import { useEffect, useState } from 'react'
import PixelIcon from '../components/PixelIcon'

// Stardew HUD'u: gerçek gün ve saat, 30 sn'de bir güncellenir
function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])
  return now
}

export function Hud({ c, season, onSeason }) {
  const now = useNow()
  const g = c.game
  const h = now.getHours()
  const time = `${String(h).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  return (
    <div className="hud">
      <button type="button" className="hud-date ui-box" onClick={onSeason} title={g.seasonHint} aria-label={`${g.seasonHint}: ${g.seasons[season]}`}>
        <span className="hud-day">{c.memes.hero.days[now.getDay()]} {now.getDate()} {g.seasons[season]}</span>
        <span className="hud-time">{time}</span>
        <PixelIcon name={h >= 6 && h < 19 ? 'sun' : 'moon'} size={24} className="hud-icon" />
      </button>
      <p className="hud-gold ui-box"><b>{g.gold}</b> {g.goldLabel}</p>
    </div>
  )
}

export function TopBar({ c, lang, onLang, onHelp }) {
  const g = c.game
  return (
    <div className="topbar">
      <button type="button" className="ui-btn" onClick={onLang} aria-label={c.ui.langSwitch} title={c.ui.langSwitch}>
        {lang === 'tr' ? 'EN' : 'TR'}
      </button>
      <button type="button" className="ui-btn" onClick={onHelp} aria-label={g.help} title={g.help}>?</button>
      <a className="ui-btn ui-btn-wide" href="https://semagulcelik.is-a.dev" title={g.classic}>{g.classic}</a>
    </div>
  )
}

const SLOTS = [
  ['about', 'heart'],
  ['experience', 'scroll'],
  ['projects', 'laptop'],
  ['skills', 'star'],
  ['contact', 'letter'],
  ['cv', 'crate'],
]

// Alt envanter çubuğu: bölümlere yürümeden doğrudan erişim (1–6 tuşları)
export function Hotbar({ c, active, onPick }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const n = Number(e.key)
      if (n >= 1 && n <= SLOTS.length) onPick(SLOTS[n - 1][0])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onPick])

  return (
    <nav className="hotbar ui-box" aria-label={c.game.hotbarLabel}>
      {SLOTS.map(([key, icon], i) => (
        <button
          key={key}
          type="button"
          className={`slot${active === key ? ' is-active' : ''}`}
          onClick={() => onPick(key)}
          title={`${i + 1} · ${c.game.hotbar[key]}`}
          aria-label={c.game.hotbar[key]}
        >
          <PixelIcon name={icon} size={28} />
          <span className="slot-num" aria-hidden="true">{i + 1}</span>
          <span className="slot-label" aria-hidden="true">{c.game.hotbar[key]}</span>
        </button>
      ))}
    </nav>
  )
}

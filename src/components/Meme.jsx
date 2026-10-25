import { useEffect, useState } from 'react'
import semaPhoto from '../assets/sema.webp'

// Stardew HUD saati: gerçek gün ve saati gösterir, 30 sn'de bir güncellenir
function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])
  return now
}

function Hud({ meme, cls }) {
  const now = useNow()
  const h = now.getHours()
  const time = `${String(h).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  return (
    <aside className={`${cls} meme-hud`} aria-label={meme.label}>
      <div className="meme-hud-top">
        <p className="sv-heading">{meme.days[now.getDay()]} {now.getDate()}</p>
        <span className="meme-hud-icon" aria-hidden="true">{h >= 6 && h < 19 ? '☀️' : '🌙'}</span>
      </div>
      <p className="meme-hud-time">{time}</p>
      <p className="meme-hud-gold"><span>{meme.gold}</span> {meme.goldLabel}</p>
    </aside>
  )
}

// Stardew Valley arayüzünden esinlenen pixel "meme" kutuları.
// İçerikler data.js → memes alanından gelir. Türler:
//   hud      — gün / saat / altın göstergesi (gerçek saat)
//   toast    — "Yeni eşya alındı!" bildirimi
//   levelup  — seviye atlama ekranı
//   bundle   — Topluluk Merkezi paketi
//   item     — eşya açıklaması (tooltip)
//   catch    — balık tutma ekranı
//   energy   — gece 02:00 enerji barı
//   calendar — takvim notları
//   mail     — posta kutusundan mektup
//   shipping — gün sonu satış kutusu
//   npc      — portreli diyalog kutusu
//   image    — kendi meme görselin (public/memes/ altına koy, src ile ver)
// reveal=false: kaydırma animasyonu dışında kalan yerler (hero) için
export default function Meme({ meme, className = '', reveal = true }) {
  if (!meme) return null
  const cls = `meme sv-box${reveal ? ' reveal-scale' : ''} ${className}`

  switch (meme.kind) {
    case 'levelup':
      return (
        <aside className={`${cls} meme-levelup`}>
          <p className="sv-title">{meme.title}</p>
          <div className="meme-levelup-row">
            <span className="sv-icon" aria-hidden="true">{meme.icon}</span>
            <div>
              <p className="sv-heading">{meme.skill}</p>
              <p className="sv-text">{meme.text}</p>
            </div>
          </div>
          <p className="sv-note">{meme.note}</p>
        </aside>
      )

    case 'item':
      return (
        <aside className={`${cls} meme-item`}>
          <div className="meme-item-head">
            <span className="sv-icon" aria-hidden="true">{meme.icon}</span>
            <div>
              <p className="sv-heading">{meme.name}</p>
              <p className="sv-sub">{meme.category}</p>
            </div>
          </div>
          <p className="sv-text">{meme.text}</p>
          <ul className="meme-item-buffs">
            {meme.buffs.map(b => <li key={b}>{b}</li>)}
          </ul>
          <p className="sv-quality" aria-label={meme.quality}>★ {meme.quality}</p>
        </aside>
      )

    case 'energy':
      return (
        <aside className={`${cls} meme-energy`}>
          <div className="meme-energy-bar" role="img" aria-label={`${meme.label}: ${meme.value}%`}>
            <span className="meme-energy-letter">E</span>
            <div className="meme-energy-track">
              <span style={{ height: `${meme.value}%` }} />
            </div>
          </div>
          <div>
            <p className="sv-title">{meme.time}</p>
            <p className="sv-text">{meme.text}</p>
            <p className="sv-note">{meme.note}</p>
          </div>
        </aside>
      )

    case 'calendar':
      return (
        <aside className={`${cls} meme-calendar`}>
          <p className="sv-title">{meme.title}</p>
          <ul>
            {meme.entries.map(e => (
              <li key={e.day}>
                <span className="meme-calendar-day">{e.day}</span>
                <span className="sv-text">{e.text}</span>
              </li>
            ))}
          </ul>
        </aside>
      )

    case 'npc':
      return (
        <aside className={`${cls} meme-npc`}>
          <p className="sv-text meme-npc-text">{meme.text}</p>
          <figure className="meme-npc-portrait">
            <img src={semaPhoto} alt="" loading="lazy" />
            <figcaption className="sv-nameplate">{meme.speaker}</figcaption>
          </figure>
          <span className="meme-next" aria-hidden="true">▼</span>
        </aside>
      )

    case 'hud':
      return <Hud meme={meme} cls={cls} />

    case 'toast':
      return (
        <aside className={`${cls} meme-toast`}>
          <span className="sv-icon" aria-hidden="true">{meme.icon}</span>
          <div>
            <p className="sv-title">{meme.title}</p>
            <p className="sv-heading">{meme.name}</p>
            <p className="sv-note">{meme.note}</p>
          </div>
        </aside>
      )

    case 'bundle':
      return (
        <aside className={`${cls} meme-bundle`}>
          <p className="sv-title">{meme.title}</p>
          <p className="sv-heading">{meme.name}</p>
          <ul className="meme-bundle-slots">
            {meme.items.map(it => (
              <li key={it.label}>
                <span className="meme-slot" aria-hidden="true">{it.icon}<i>✓</i></span>
                <span className="sv-sub">{it.label}</span>
              </li>
            ))}
          </ul>
          <p className="sv-note">{meme.reward}</p>
        </aside>
      )

    case 'catch':
      return (
        <aside className={`${cls} meme-catch`}>
          <p className="sv-title">{meme.title}</p>
          <div className="meme-levelup-row">
            <span className="sv-icon" aria-hidden="true">{meme.icon}</span>
            <div>
              <p className="sv-heading">{meme.name}</p>
              <p className="sv-quality">{meme.rarity}</p>
              <p className="sv-sub">{meme.size}</p>
            </div>
          </div>
          <p className="sv-note">{meme.note}</p>
        </aside>
      )

    case 'mail':
      return (
        <aside className={`${cls} meme-mail`}>
          <p className="sv-text">{meme.greeting}</p>
          <p className="sv-text">{meme.text}</p>
          <p className="sv-text meme-mail-sign">{meme.sign}</p>
          <p className="sv-note">📎 {meme.attachment}</p>
        </aside>
      )

    case 'shipping':
      return (
        <aside className={`${cls} meme-shipping`}>
          <p className="sv-title">{meme.title}</p>
          <ul>
            {meme.rows.map(r => (
              <li key={r.item}><span className="sv-text">{r.icon} {r.item}</span><span className="sv-text">{r.price}</span></li>
            ))}
          </ul>
          <p className="meme-shipping-total"><span>{meme.totalLabel}</span><span>{meme.total}</span></p>
        </aside>
      )

    case 'image':
      return (
        <figure className={`${cls} meme-image`}>
          <img src={meme.src} alt={meme.alt} loading="lazy" />
          {meme.caption && <figcaption className="sv-note">{meme.caption}</figcaption>}
        </figure>
      )

    default:
      return null
  }
}

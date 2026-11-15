import { useCallback, useEffect, useRef, useState } from 'react'
import Game from './game/Game'
import Panels from './game/Panels'
import { Hud, TopBar, Hotbar, CLASSIC_URL } from './game/Hud'
import { SEASONS } from './game/art'
import { useLang } from './i18n'
import { createMusic } from './game/music'

// Gerçek aya göre mevsim: Mar–May ilkbahar, Haz–Ağu yaz, Eyl–Kas sonbahar, Ara–Şub kış
const realSeason = () => [3, 3, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3][new Date().getMonth()]

function savedLook() {
  try { return localStorage.getItem('farm-look') === 'player' ? 'player' : 'playerGirl' } catch { return 'playerGirl' }
}

// Ev ipucu yalnızca siteyi ilk kez gezen kişiye, eve ilk yaklaştığında gösterilir
function houseTipSeen() {
  try { return localStorage.getItem('farm-house-tip') === '1' } catch { return false }
}

function musicWanted() {
  try { return localStorage.getItem('farm-music') !== '0' } catch { return true }
}

function introSeen() {
  try { return localStorage.getItem('farm-intro') === '1' } catch { return false }
}

export default function App() {
  const { c, lang, toggleLang } = useLang()
  const [season, setSeason] = useState(realSeason)
  const [look, setLook] = useState(savedLook)
  const [panel, setPanel] = useState(() => (introSeen() ? null : { kind: 'sign' }))
  const [houseTip, setHouseTip] = useState(false)
  const [entering, setEntering] = useState(false)
  const [music, setMusic] = useState(musicWanted)
  const player = useRef(null)

  // Müzik: açıksa ilk tıklama ya da tuşla başlar, klasik siteye geçerken susar
  useEffect(() => {
    const m = (player.current ??= createMusic())
    if (!music || entering) { m.stop(); return }
    const begin = () => m.start()
    window.addEventListener('pointerdown', begin)
    window.addEventListener('keydown', begin)
    return () => {
      window.removeEventListener('pointerdown', begin)
      window.removeEventListener('keydown', begin)
    }
  }, [music, entering])
  useEffect(() => () => player.current?.dispose(), [])
  const toggleMusic = useCallback(() => {
    setMusic(on => {
      try { localStorage.setItem('farm-music', on ? '0' : '1') } catch { /* gizli sekme */ }
      return !on
    })
  }, [])

  useEffect(() => {
    document.title = `${c.game.title} · ${c.personal.name}`
  }, [c])

  const close = useCallback(() => {
    try { localStorage.setItem('farm-intro', '1') } catch { /* gizli sekme */ }
    setPanel(null)
  }, [])
  const chooseLook = useCallback((next) => {
    try { localStorage.setItem('farm-look', next) } catch { /* gizli sekme */ }
    setLook(next)
  }, [])
  // Evin kapısından girmek klasik siteye götürür: kısa bir kararma, sonra yönlendirme
  const open = useCallback((target) => {
    if (target.kind !== 'classic') return setPanel(target)
    setHouseTip(false)
    setEntering(true)
    setTimeout(() => { window.location.href = CLASSIC_URL }, 650)
  }, [])
  const onNear = useCallback((target) => {
    if (target?.kind !== 'classic') return setHouseTip(false)
    if (houseTipSeen()) return
    try { localStorage.setItem('farm-house-tip', '1') } catch { /* gizli sekme */ }
    setHouseTip(true)
  }, [])
  // Tarayıcının geri tuşuyla dönülürse kararmış ekranda kalma
  useEffect(() => {
    const back = (e) => { if (e.persisted) setEntering(false) }
    window.addEventListener('pageshow', back)
    return () => window.removeEventListener('pageshow', back)
  }, [])
  const pick = useCallback((kind) => setPanel(p => (p?.kind === kind ? null : { kind })), [])
  const labelFor = (t) => (t.kind === 'project' ? c.projects[t.index].title : c.game.places[t.kind])

  return (
    <div className="farm">
      <h1 className="sr-only">{c.personal.name} · {c.personal.roleLead} {c.personal.roleHighlight}</h1>
      <Game
        season={SEASONS[season]}
        look={look}
        paused={!!panel || entering}
        onInteract={open}
        onNear={onNear}
        labelFor={labelFor}
        keyHint={c.game.keyHint}
        tapHint={c.game.tapHint}
      />
      <Hud c={c} season={season} onSeason={() => setSeason(s => (s + 1) % 4)} />
      <TopBar c={c} lang={lang} onLang={toggleLang} onHelp={() => setPanel({ kind: 'sign' })} music={music} onMusic={toggleMusic} />
      <Hotbar c={c} active={panel?.kind === 'project' ? 'projects' : panel?.kind} onPick={pick} />
      {houseTip && !panel && (
        <div className="house-tip ui-box" role="status">
          <p><b>{c.game.houseTip[0]}</b></p>
          <p>{c.game.houseTip[1]}</p>
        </div>
      )}
      {entering && <div className="entering" role="status"><p>{c.game.entering}</p></div>}
      {panel && <Panels key={panel.kind} c={c} panel={panel} onClose={close} onOpen={open} look={look} onLook={chooseLook} />}
    </div>
  )
}

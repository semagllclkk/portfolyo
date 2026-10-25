import { useCallback, useEffect, useState } from 'react'
import Game from './game/Game'
import Panels from './game/Panels'
import { Hud, TopBar, Hotbar } from './game/Hud'
import { SEASONS } from './game/art'
import { useLang } from './i18n'

// Gerçek aya göre mevsim: Mar–May ilkbahar, Haz–Ağu yaz, Eyl–Kas sonbahar, Ara–Şub kış
const realSeason = () => [3, 3, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3][new Date().getMonth()]

function introSeen() {
  try { return localStorage.getItem('farm-intro') === '1' } catch { return false }
}

export default function App() {
  const { c, lang, toggleLang } = useLang()
  const [season, setSeason] = useState(realSeason)
  const [panel, setPanel] = useState(() => (introSeen() ? null : { kind: 'sign' }))

  useEffect(() => {
    document.title = `${c.game.title} · ${c.personal.name}`
  }, [c])

  const close = useCallback(() => {
    try { localStorage.setItem('farm-intro', '1') } catch { /* gizli sekme */ }
    setPanel(null)
  }, [])
  const open = useCallback((target) => setPanel(target), [])
  const pick = useCallback((kind) => setPanel(p => (p?.kind === kind ? null : { kind })), [])
  const labelFor = (t) => (t.kind === 'project' ? c.projects[t.index].title : c.game.places[t.kind])

  return (
    <div className="farm">
      <h1 className="sr-only">{c.personal.name} · {c.personal.roleLead} {c.personal.roleHighlight}</h1>
      <Game
        season={SEASONS[season]}
        paused={!!panel}
        onInteract={open}
        labelFor={labelFor}
        keyHint={c.game.keyHint}
        tapHint={c.game.tapHint}
      />
      <Hud c={c} season={season} onSeason={() => setSeason(s => (s + 1) % 4)} />
      <TopBar c={c} lang={lang} onLang={toggleLang} onHelp={() => setPanel({ kind: 'sign' })} />
      <Hotbar c={c} active={panel?.kind === 'project' ? 'projects' : panel?.kind} onPick={pick} />
      {panel && <Panels key={panel.kind} c={c} panel={panel} onClose={close} onOpen={open} />}
    </div>
  )
}

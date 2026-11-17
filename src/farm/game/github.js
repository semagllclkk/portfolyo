// ── GITHUB İSTATİSTİKLERİ ───────────────────────────────────────────────────
// Satış kutusu ve HUD'daki sayılar GitHub'ın herkese açık arama API'sinden
// gelir (son 12 ay, yalnızca açık depolar). Anahtar gerekmez; oturumsuz arama
// dakikada 10 istekle sınırlı olduğu için sonuç 30 dk sekme hafızasında tutulur.
import { useEffect, useState } from 'react'

const USER = 'semagllclkk'
const API = 'https://api.github.com/search'
const CACHE_KEY = 'gh-stats-v1'
const TTL = 30 * 60 * 1000

// Gece yarısı ile sabah 5 arası yazılmış commit "uykusuz gece" sayılır.
// Saat, commit'in kendi saat dilimindeki yerel saattir (tarih metninden okunur).
const isNight = (iso) => {
  const h = Number(iso?.slice(11, 13))
  return h >= 0 && h < 5
}

async function get(url) {
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
  if (!res.ok) throw new Error(`GitHub ${res.status}`)
  return res.json()
}

export async function fetchStats(now = new Date()) {
  const since = new Date(now.getTime() - 365 * 864e5).toISOString().slice(0, 10)
  const [commits, prs, issues] = await Promise.all([
    get(`${API}/commits?q=author:${USER}+author-date:>=${since}&sort=author-date&order=desc&per_page=100`),
    get(`${API}/issues?q=author:${USER}+type:pr+is:merged+merged:>=${since}&per_page=1`),
    get(`${API}/issues?q=author:${USER}+type:issue+is:closed+closed:>=${since}&per_page=1`),
  ])
  // Gece commit'leri yalnızca son 100 commit içinden sayılabilir; daha fazlası varsa oranla tahmin edilir
  const sample = commits.items ?? []
  const nightInSample = sample.filter(it => isNight(it.commit?.author?.date)).length
  const nights = sample.length && commits.total_count > sample.length
    ? Math.round(nightInSample * commits.total_count / sample.length)
    : nightInSample
  return { commits: commits.total_count, prs: prs.total_count, issues: issues.total_count, nights, at: Date.now() }
}

function readCache() {
  try {
    const v = JSON.parse(sessionStorage.getItem(CACHE_KEY))
    return v && Date.now() - v.at < TTL ? v : null
  } catch { return null }
}

// { status: 'loading' | 'ready' | 'error', stats }
export function useGithubStats() {
  const [state, setState] = useState(() => {
    const cached = readCache()
    return cached ? { status: 'ready', stats: cached } : { status: 'loading', stats: null }
  })
  useEffect(() => {
    if (state.status === 'ready') return
    let alive = true
    fetchStats()
      .then(stats => {
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(stats)) } catch { /* gizli sekme */ }
        if (alive) setState({ status: 'ready', stats })
      })
      .catch(() => alive && setState({ status: 'error', stats: null }))
    return () => { alive = false }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return state
}

// Stardew fiyatları: her kalemin tanesi kaç altın
export const PRICES = { commits: 10, prs: 120, issues: 60, nights: 25 }

import { createContext, useContext, useEffect, useState } from 'react'
import { content } from './data'

// Kayıtlı tercih yoksa tarayıcı dili Türkçe değilse İngilizce açılır
function initialLang() {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'tr' || saved === 'en') return saved
  } catch { /* gizli sekme */ }
  return navigator.language?.toLowerCase().startsWith('tr') ? 'tr' : 'en'
}

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const toggleLang = () => {
    setLang(l => {
      const next = l === 'tr' ? 'en' : 'tr'
      try { localStorage.setItem('lang', next) } catch { /* gizli sekme */ }
      return next
    })
  }

  return (
    <LangContext.Provider value={{ lang, toggleLang, c: content[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

// eslint-disable-next-line react/only-export-components
export function useLang() {
  return useContext(LangContext)
}

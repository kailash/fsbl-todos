import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const s = localStorage.getItem('fsbl-theme')
    return s === 'dark' || (!s && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('fsbl-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return { isDark, toggleDark: () => setIsDark((d) => !d) }
}

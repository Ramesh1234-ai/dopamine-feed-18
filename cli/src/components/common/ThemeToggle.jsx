/**
 * ThemeToggle - Dark/Light mode switcher
 */
import { useState, useEffect, useCallback } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark

    setIsDark(isDarkMode)
    applyTheme(isDarkMode)
  }, [])

  const applyTheme = useCallback((dark) => {
    const htmlElement = document.documentElement
    if (dark) {
      htmlElement.classList.add('dark')
      htmlElement.style.colorScheme = 'dark'
    } else {
      htmlElement.classList.remove('dark')
      htmlElement.style.colorScheme = 'light'
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newDark = !prev
      localStorage.setItem('theme', newDark ? 'dark' : 'light')
      applyTheme(newDark)
      return newDark
    })
  }, [applyTheme])

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

export default ThemeToggle

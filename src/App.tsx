import React, { useEffect, useState } from 'react'
import { BoardProvider } from './context/BoardContext'
import Board from './components/Board'
import './index.css'

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('flowboard_theme')
    return (saved === 'light' ? 'light' : 'dark')
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('flowboard_theme', theme)
  }, [theme])

  return (
    <BoardProvider>
      <div className="app">
        <Topbar theme={theme} setTheme={setTheme} />
        <Board />
      </div>
    </BoardProvider>
  )
}

function Topbar({ theme, setTheme }: { theme: string; setTheme: (t: 'dark'|'light') => void }) {
  return (
    <header className="topbar">
      <h1>FlowBoard</h1>
      <div className="top-actions">
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-pressed={theme === 'dark'}>
          {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </header>
  )
}

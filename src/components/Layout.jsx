import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Logo } from './Logo'

export function Layout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="shell">
      <header className="mobile-bar">
        <button className="burger" onClick={() => setOpen(o => !o)} aria-label="Меню">
          {open ? '✕' : '☰'}
        </button>
        <Logo size={24} />
        <span>React Guide</span>
      </header>
      <Sidebar open={open} onNavigate={() => setOpen(false)} />
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

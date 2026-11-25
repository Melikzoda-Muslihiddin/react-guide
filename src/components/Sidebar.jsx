import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { sections, topics } from '../data/topics'
import { useProgress } from '../hooks/useProgress'
import { Logo } from './Logo'

export function Sidebar({ open, onNavigate }) {
  const [q, setQ] = useState('')
  const { done } = useProgress()
  const query = q.trim().toLowerCase()

  const match = t =>
    !query ||
    t.title.toLowerCase().includes(query) ||
    t.desc.toLowerCase().includes(query) ||
    t.tags.some(tag => tag.toLowerCase().includes(query))

  const numbered = Object.fromEntries(topics.map(t => [t.slug, t.num]))
  const anyFound = topics.some(match)

  return (
    <aside className={'sidebar' + (open ? ' open' : '')}>
      <Link to="/" className="brand" onClick={onNavigate}>
        <Logo />
        <span>React Guide</span>
      </Link>

      <div className="search">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Поиск темы…"
          aria-label="Поиск темы"
        />
      </div>

      <nav className="side-nav">
        {sections.map(s => {
          const list = s.topics.filter(match)
          if (!list.length) return null
          return (
            <div key={s.id} className="side-group">
              <div className="side-title">{s.title}</div>
              {list.map(t => (
                <NavLink key={t.slug} to={'/topics/' + t.slug} className="side-link" onClick={onNavigate}>
                  <span className="side-num">{numbered[t.slug]}</span>
                  <span className="side-name">{t.title}</span>
                  {done.has(t.slug) && <span className="side-done" title="Изучено">✓</span>}
                </NavLink>
              ))}
            </div>
          )
        })}
        {!anyFound && <p className="side-empty">Ничего не найдено</p>}
      </nav>

      <div className="side-foot">
        <span>React 19 · Vite</span>
        <span>{done.size} / {topics.length} изучено</span>
      </div>
    </aside>
  )
}

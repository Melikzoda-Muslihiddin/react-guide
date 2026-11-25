import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getTopic, topics, total, pad } from '../data/topics'
import { Tags } from '../components/Tag'
import { CodeBlock } from '../components/CodeBlock'
import { useProgress } from '../hooks/useProgress'
import NotFound from './NotFound'

export default function Topic() {
  const { slug } = useParams()
  const topic = getTopic(slug)
  const navigate = useNavigate()
  const { done, toggle } = useProgress()

  const prev = topic ? topics[topic.index - 1] : null
  const next = topic ? topics[topic.index + 1] : null

  // Стрелки ← → переключают темы
  useEffect(() => {
    function onKey(e) {
      if (e.target.closest?.('input, textarea') || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'ArrowLeft' && prev) navigate('/topics/' + prev.slug)
      if (e.key === 'ArrowRight' && next) navigate('/topics/' + next.slug)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, navigate])

  if (!topic) return <NotFound />

  const isDone = done.has(topic.slug)

  return (
    <article className="topic" key={topic.slug}>
      <title>{topic.title + ' — React Guide'}</title>

      <div className="topic-meta">
        <span className="topic-count">{topic.num} / {pad(total)}</span>
        <Tags tags={topic.tags} />
      </div>
      <h1 className="topic-title">{topic.title}</h1>
      <p className="topic-desc">{topic.desc}</p>

      <section className="box analogy">
        <div className="box-label"><span aria-hidden="true">💡</span> Аналогия</div>
        <p>{topic.analogy}</p>
      </section>

      <section className="compare">
        <div className="compare-col left">
          <div className="compare-label">{topic.compare.left.label}</div>
          <p>{topic.compare.left.text}</p>
        </div>
        <div className="compare-col right">
          <div className="compare-label">{topic.compare.right.label}</div>
          <p>{topic.compare.right.text}</p>
        </div>
      </section>

      <h2 className="block-label">Код</h2>
      <CodeBlock code={topic.code} />

      <section className="box notes">
        <div className="box-label"><span aria-hidden="true">📓</span> В тетрадь / Obsidian</div>
        <ol>
          {topic.notes.map((n, i) => (
            <li key={i}><span className="note-num">{pad(i + 1)}</span>{n}</li>
          ))}
        </ol>
      </section>

      <button
        className={'done-btn' + (isDone ? ' is-done' : '')}
        onClick={() => toggle(topic.slug)}
      >
        {isDone ? '✓ Изучено' : 'Отметить как изученное'}
      </button>

      <nav className="pager">
        {prev ? (
          <Link to={'/topics/' + prev.slug} className="pager-btn">
            <span className="pager-arrow">←</span> {prev.title}
          </Link>
        ) : (
          <Link to="/" className="pager-btn"><span className="pager-arrow">←</span> Все темы</Link>
        )}
        {next ? (
          <Link to={'/topics/' + next.slug} className="pager-btn pager-next">
            {next.title} <span className="pager-arrow">→</span>
          </Link>
        ) : (
          <Link to="/" className="pager-btn pager-next">
            Все темы <span className="pager-arrow">→</span>
          </Link>
        )}
      </nav>
      <p className="kbd-hint">Подсказка: листай темы стрелками ← → на клавиатуре</p>
    </article>
  )
}

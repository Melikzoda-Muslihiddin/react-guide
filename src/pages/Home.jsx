import { Link } from 'react-router-dom'
import { sections, topics, total } from '../data/topics'
import { Tags } from '../components/Tag'
import { useProgress } from '../hooks/useProgress'

export default function Home() {
  const { done, reset } = useProgress()
  const next = topics.find(t => !done.has(t.slug)) ?? topics[0]
  const started = done.size > 0
  const percent = Math.round((done.size / total) * 100)
  const numOf = Object.fromEntries(topics.map(t => [t.slug, t.num]))

  return (
    <div className="home-wrap">
    <div className="home">
      <title>React Guide — Интерактивный справочник</title>

      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <span className="eyebrow"><i />{total} темы · Интерактивный справочник</span>
        <h1 className="hero-title">
          <span className="gradient-text">React</span>
          <br />
          <span>с нуля</span>
        </h1>
        <p className="hero-sub">
          Сам React, хуки и вся экосистема: роутинг, стейт-менеджеры, формы, стили, тесты и деплой.
          Каждая тема — с аналогией, сравнением, примером кода и конспектом для тетради. Шли ссылку друзьям.
        </p>
        <div className="hero-actions">
          <Link to={'/topics/' + next.slug} className="btn-primary">
            {started ? 'Продолжить: ' + next.title : 'Начать изучение'}
            <span>→</span>
          </Link>
        </div>

        {started && (
          <div className="progress-card">
            <div className="progress-head">
              <span>Прогресс</span>
              <span>{done.size} / {total} · {percent}%</span>
            </div>
            <div className="progress-track"><div style={{ width: percent + '%' }} /></div>
            <button className="link-btn" onClick={reset}>Сбросить прогресс</button>
          </div>
        )}
      </section>

      {sections.map(s => (
        <section key={s.id} className="grid-section">
          <h2 className="section-label">{s.title}</h2>
          <div className="grid">
            {s.topics.map(t => (
              <Link
                key={t.slug}
                to={'/topics/' + t.slug}
                className={'card' + (done.has(t.slug) ? ' card-done' : '')}
              >
                <div className="card-top">
                  <span className="card-num">{numOf[t.slug]}</span>
                  <span className="card-arrow">{done.has(t.slug) ? '✓' : '→'}</span>
                </div>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
                <Tags tags={t.tags} />
              </Link>
            ))}
          </div>
        </section>
      ))}

      <footer className="footer">
        Собрано с <span className="heart">♥</span> для изучения React · Vite · v19
      </footer>
    </div>
    </div>
  )
}

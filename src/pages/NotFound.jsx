import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found">
      <title>404 — React Guide</title>
      <span className="nf-code gradient-text">404</span>
      <p>Такой темы нет. Возможно, её ещё не написали.</p>
      <Link to="/" className="btn-primary">На главную <span>→</span></Link>
    </div>
  )
}

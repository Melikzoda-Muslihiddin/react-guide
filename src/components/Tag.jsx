import { tagTone } from '../data/topics'

export function Tags({ tags }) {
  return (
    <span className="tags">
      {tags.map((t, i) => (
        <span key={t} className={'chip chip-' + tagTone(t, i)}>{t}</span>
      ))}
    </span>
  )
}

import { basics } from './basics'
import { hooks } from './hooks'
import { advanced } from './advanced'
import { ecosystem } from './ecosystem'
import { tooling } from './tooling'

export const sections = [
  { id: 'basics', title: 'Основы', topics: basics },
  { id: 'hooks', title: 'Хуки', topics: hooks },
  { id: 'advanced', title: 'Архитектура', topics: advanced },
  { id: 'ecosystem', title: 'Экосистема', topics: ecosystem },
  { id: 'tooling', title: 'Инструменты', topics: tooling },
]

// Плоский нумерованный список: 01, 02, …
export const topics = sections.flatMap(s =>
  s.topics.map(t => ({ ...t, section: s.title }))
).map((t, i) => ({ ...t, index: i, num: String(i + 1).padStart(2, '0') }))

export const total = topics.length
export const pad = n => String(n).padStart(2, '0')

export function getTopic(slug) {
  return topics.find(t => t.slug === slug)
}

// Цвет второго тега
const warm = new Set(['Критично', 'Сложно', 'Важно', 'Новое', 'React 19', 'Дальше'])
export function tagTone(tag, i) {
  if (i === 0) return 'violet'
  return warm.has(tag) ? 'amber' : 'teal'
}

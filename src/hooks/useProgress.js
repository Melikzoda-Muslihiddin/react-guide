import { useSyncExternalStore, useCallback } from 'react'

const KEY = 'react-guide:done'
const listeners = new Set()

function read() {
  try {
    return localStorage.getItem(KEY) ?? '[]'
  } catch {
    return '[]'
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    /* приватный режим — прогресс просто не сохранится */
  }
  listeners.forEach(l => l())
}

function subscribe(cb) {
  listeners.add(cb)
  const onStorage = e => e.key === KEY && cb()
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', onStorage)
  }
}

let cacheRaw = null
let cacheSet = new Set()
function snapshot() {
  const raw = read()
  if (raw !== cacheRaw) {
    cacheRaw = raw
    try {
      cacheSet = new Set(JSON.parse(raw))
    } catch {
      cacheSet = new Set()
    }
  }
  return cacheSet
}

export function useProgress() {
  const done = useSyncExternalStore(subscribe, snapshot, () => cacheSet)

  const toggle = useCallback(slug => {
    const next = new Set(snapshot())
    next.has(slug) ? next.delete(slug) : next.add(slug)
    write([...next])
  }, [])

  const reset = useCallback(() => write([]), [])

  return { done, toggle, reset }
}

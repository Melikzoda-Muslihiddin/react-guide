export const advanced = [
  {
    slug: 'performance',
    title: 'Performance',
    desc: 'memo, lazy, React Compiler',
    tags: ['Перформанс', 'Сложно'],
    analogy:
      'Ререндер — как перекраска квартиры. Если в одной комнате поменялась лампочка, глупо перекрашивать весь дом. Оптимизация — объяснить React, какие комнаты не трогать (memo), а какие вообще не строить, пока туда не зашли (lazy).',
    compare: {
      left: { label: 'Наивно', text: 'Весь код в одном бандле, любое изменение стейта наверху перерисовывает всё дерево, списки на 10 000 строк в DOM.' },
      right: { label: 'Оптимально', text: 'Code splitting через lazy, стейт ближе к месту использования, виртуализация списков, React Compiler для авто-мемоизации.' },
    },
    code: {
      file: 'App.jsx',
      lang: 'jsx',
      src: `import { lazy, Suspense, memo, useState, useTransition } from 'react'

// 1. Code splitting — грузим тяжёлую страницу только когда нужна
const Dashboard = lazy(() => import('./pages/Dashboard'))

// 2. memo — пропускает ререндер, если props не изменились
const Chart = memo(function Chart({ data }) {
  return <canvas>{/* дорогая отрисовка */}</canvas>
})

export default function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  function handleChange(e) {
    setQuery(e.target.value)            // срочно: инпут не лагает
    startTransition(() => {
      setResults(heavyFilter(e.target.value)) // не срочно: можно прервать
    })
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Обновляем…</span>}
      <Suspense fallback={<p>Загрузка дашборда…</p>}>
        <Dashboard results={results} />
      </Suspense>
    </>
  )
}

// 3. React Compiler — авто-мемоизация на этапе сборки
// npm i -D babel-plugin-react-compiler
// vite.config: react({ babel: { plugins: ['babel-plugin-react-compiler'] } })`,
    },
    notes: [
      'Сначала измеряй: React DevTools → Profiler, только потом оптимизируй',
      'lazy() + <Suspense> — разбивает бандл, страницы грузятся по требованию',
      'useTransition / useDeferredValue — помечают тяжёлые апдейты как не срочные',
      'Длинные списки — виртуализация (TanStack Virtual), стейт держи как можно ниже',
    ],
  },
  {
    slug: 'suspense-error-boundaries',
    title: 'Suspense & Error Boundaries',
    desc: 'Красивая загрузка и обработка ошибок',
    tags: ['UX', 'Надёжность'],
    analogy:
      'Suspense — табличка «Готовим ваш заказ» в ресторане, пока блюдо не готово. Error Boundary — менеджер зала: если на кухне что-то сгорело, он не закрывает весь ресторан, а приносит извинения за конкретный столик.',
    compare: {
      left: { label: 'Без них', text: 'isLoading-флаги в каждом компоненте. Одна ошибка в рендере — белый экран всего приложения.' },
      right: { label: 'С ними', text: 'Suspense показывает fallback, пока ждём данные/код. Error Boundary ловит ошибки поддерева и рисует запасной UI.' },
    },
    code: {
      file: 'Page.jsx',
      lang: 'jsx',
      src: `import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary' // npm i react-error-boundary

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Что-то пошло не так: {error.message}</p>
      <button onClick={resetErrorBoundary}>Попробовать снова</button>
    </div>
  )
}

export default function Page() {
  return (
    <main>
      <Header />

      {/* Ошибка в ленте не уронит всю страницу */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<FeedSkeleton />}>
          <Feed />          {/* use(promise) / useSuspenseQuery внутри */}
        </Suspense>
      </ErrorBoundary>

      {/* Вложенные границы — независимая загрузка блоков */}
      <Suspense fallback={<p>Загрузка рекомендаций…</p>}>
        <Recommendations />
      </Suspense>
    </main>
  )
}

// Error Boundary «вручную» — только классовый компонент:
// class Boundary extends React.Component {
//   state = { error: null }
//   static getDerivedStateFromError(error) { return { error } }
//   componentDidCatch(error, info) { logToSentry(error, info) }
//   render() { return this.state.error ? <Fallback /> : this.props.children }
// }`,
    },
    notes: [
      '<Suspense fallback={...}> — показывает fallback, пока дети «подвешены» (lazy, use, query)',
      'Error Boundary ловит ошибки рендера в поддереве. В функциях — через react-error-boundary',
      'Не ловит ошибки в обработчиках событий и async-коде — там обычный try/catch',
      'Расставляй границы по смысловым блокам, а не одну на всё приложение',
    ],
  },
  {
    slug: 'portals',
    title: 'Portals',
    desc: 'Модалки и тултипы вне дерева DOM',
    tags: ['UI', 'DOM'],
    analogy:
      'Портал — телепорт. Компонент логически остаётся в своей семье (получает props, контекст, события всплывают к родителю), но физически появляется в другой комнате — в конце <body>, где ему не мешают overflow: hidden и z-index.',
    compare: {
      left: { label: 'Без портала', text: 'Модалка внутри карточки с overflow: hidden обрезается, z-index воюет с соседями.' },
      right: { label: 'createPortal', text: 'Рендерит детей в любой DOM-узел, сохраняя связь с React-деревом: контекст и события работают.' },
    },
    code: {
      file: 'Modal.jsx',
      lang: 'jsx',
      src: `import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden' // блок скролла
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  // Рендерим в document.body, а не в родителя
  return createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true"
           onClick={e => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>✕</button>
      </div>
    </div>,
    document.body
  )
}

// Использование:
// const [open, setOpen] = useState(false)
// <button onClick={() => setOpen(true)}>Открыть</button>
// <Modal open={open} onClose={() => setOpen(false)}>Привет!</Modal>
//
// 💡 Альтернатива: нативный <dialog> + ref.current.showModal()`,
    },
    notes: [
      'createPortal(jsx, domNode) — рендер в другое место DOM',
      'Контекст, state и всплытие событий работают по React-дереву, а не по DOM',
      'Типичные кейсы: модалки, тултипы, дропдауны, тосты',
      'Готовые доступные примитивы: Radix UI, Headless UI, нативный <dialog>',
    ],
  },
  {
    slug: 'typescript',
    title: 'TypeScript + React',
    desc: 'Типизация компонентов и хуков',
    tags: ['TypeScript', 'Важно'],
    analogy:
      'TypeScript — как разметка на розетках: вилка не того типа просто не влезет. Ошибка видна ещё в редакторе, а не у пользователя в продакшене. Плюс автодополнение подсказывает, какие props есть у компонента.',
    compare: {
      left: { label: 'JavaScript', text: 'Передал строку вместо числа или опечатался в prop — узнаешь только в рантайме. Нет подсказок.' },
      right: { label: 'TypeScript', text: 'Типы props, state и событий. Ошибки подсвечиваются сразу, рефакторинг безопасен, автокомплит везде.' },
    },
    code: {
      file: 'UserCard.tsx',
      lang: 'tsx',
      src: `import { useState, type ReactNode, type ComponentProps } from 'react'

// 1. Типизация props через type
type User = { id: number; name: string; role: 'admin' | 'user' }

type UserCardProps = {
  user: User
  onSelect?: (id: number) => void   // необязательный prop
  children?: ReactNode              // любой JSX
}

export function UserCard({ user, onSelect, children }: UserCardProps) {
  return (
    <div onClick={() => onSelect?.(user.id)}>
      {user.name} {user.role === 'admin' && '👑'}
      {children}
    </div>
  )
}

// 2. useState — тип выводится или задаётся явно
const [count, setCount] = useState(0)                // number
const [user, setUser] = useState<User | null>(null)  // User | null

// 3. События
function Search() {
  const [q, setQ] = useState('')
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault()
  return <form onSubmit={onSubmit}><input value={q} onChange={onChange} /></form>
}

// 4. Расширяем нативные props кнопки
type ButtonProps = ComponentProps<'button'> & { variant?: 'primary' | 'ghost' }
function Button({ variant = 'primary', ...rest }: ButtonProps) {
  return <button className={variant} {...rest} />
}`,
    },
    notes: [
      'Шаблон Vite react-ts — TS настроен из коробки, файлы .tsx',
      'Props описывай через type/interface; children: ReactNode',
      'useState<T | null>(null) — когда начальное значение не говорит о типе',
      'ComponentProps<"button"> — все нативные атрибуты элемента для своих обёрток',
    ],
  },
]

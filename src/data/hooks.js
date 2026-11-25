export const hooks = [
  {
    slug: 'use-effect',
    title: 'useEffect',
    desc: 'Синхронизация с внешним миром',
    tags: ['Хуки', 'Сложно'],
    analogy:
      'useEffect — как договор с охранником: «После того как я зайду в комнату (рендер), включи свет (эффект). Когда буду уходить — выключи (cleanup)». Массив зависимостей говорит, когда переподписывать договор.',
    compare: {
      left: { label: 'JS · Vanilla', text: 'Подписки, таймеры и запросы разбросаны по коду. Отписываться легко забыть — утечки памяти.' },
      right: { label: '⚛ React', text: 'Эффект живёт рядом с компонентом: запускается после рендера, cleanup — при размонтировании или смене зависимостей.' },
    },
    code: {
      file: 'ChatRoom.jsx',
      lang: 'jsx',
      src: `import { useState, useEffect } from 'react'

export default function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([])
  const [width, setWidth] = useState(window.innerWidth)

  // 1. Зависимость [roomId] — переподключаемся при смене комнаты
  useEffect(() => {
    const conn = createConnection(roomId)
    conn.on('message', m => setMessages(prev => [...prev, m]))
    conn.connect()

    return () => conn.disconnect() // cleanup: отключиться от старой
  }, [roomId])

  // 2. Пустой массив [] — один раз при монтировании
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // 3. Без массива — после КАЖДОГО рендера (почти никогда не нужно)

  // ❌ Не нужен эффект для вычислений из props/state:
  // useEffect(() => setFull(first + ' ' + last), [first, last])
  // ✅ Просто посчитай во время рендера:
  // const full = first + ' ' + last

  return <p>{messages.length} сообщений · экран {width}px</p>
}`,
    },
    notes: [
      'useEffect — для синхронизации с внешним: API, подписки, таймеры, DOM-библиотеки',
      '[deps] — перезапуск при изменении; [] — один раз; без массива — каждый рендер',
      'Возвращаемая функция = cleanup. Всегда отписывайся от того, на что подписался',
      'Вычисляемые значения считай прямо в рендере, данные грузи через TanStack Query',
    ],
  },
  {
    slug: 'use-ref',
    title: 'useRef',
    desc: 'Доступ к DOM и значения без ререндера',
    tags: ['Хуки', 'DOM'],
    analogy:
      'useRef — карман в куртке компонента. Можно положить туда что угодно (таймер, DOM-элемент, прошлое значение), и оно сохранится между рендерами. Но если поменять содержимое кармана, никто этого не заметит — перерисовки не будет.',
    compare: {
      left: { label: 'useState', text: 'Изменение вызывает ререндер. Для данных, которые видно на экране.' },
      right: { label: 'useRef', text: 'Изменение ref.current НЕ вызывает ререндер. Для DOM-узлов, id таймеров, служебных значений.' },
    },
    code: {
      file: 'SearchInput.jsx',
      lang: 'jsx',
      src: `import { useRef, useState } from 'react'

export default function Stopwatch() {
  const inputRef = useRef(null)      // ссылка на DOM-элемент
  const intervalRef = useRef(null)   // id таймера — не нужен в UI
  const [time, setTime] = useState(0)

  function start() {
    if (intervalRef.current) return
    intervalRef.current = setInterval(() => setTime(t => t + 1), 1000)
  }

  function stop() {
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  return (
    <div>
      {/* React положит DOM-узел в inputRef.current */}
      <input ref={inputRef} placeholder="Заметка" />
      <button onClick={() => inputRef.current.focus()}>Фокус</button>

      <p>⏱ {time} сек</p>
      <button onClick={start}>Старт</button>
      <button onClick={stop}>Стоп</button>
    </div>
  )
}

// React 19: ref — обычный prop, forwardRef больше не нужен
function MyInput({ ref, ...props }) {
  return <input ref={ref} {...props} />
}`,
    },
    notes: [
      'const ref = useRef(initial) → объект { current }, живущий между рендерами',
      'ref={ref} на JSX-элементе — React запишет туда DOM-узел',
      'Изменение ref.current не вызывает ререндер. Не читай/пиши ref во время рендера',
      'В React 19 ref передаётся как обычный prop — forwardRef устарел',
    ],
  },
  {
    slug: 'use-context',
    title: 'useContext',
    desc: 'Данные без prop drilling',
    tags: ['Хуки', 'Состояние'],
    analogy:
      'Prop drilling — передавать записку через весь класс по цепочке, хотя она нужна только последней парте. Context — это школьное радио: объявили один раз, и услышит каждый, кто включил приёмник (useContext).',
    compare: {
      left: { label: 'Prop drilling', text: 'Пробрасываешь theme через 5 компонентов, которым он не нужен — только чтобы донести до кнопки.' },
      right: { label: 'Context', text: 'Provider сверху — любой потомок читает значение через useContext / use, минуя промежуточные слои.' },
    },
    code: {
      file: 'ThemeContext.jsx',
      lang: 'jsx',
      src: `import { createContext, useContext, useState } from 'react'

// 1. Создаём контекст
const ThemeContext = createContext(null)

// 2. Провайдер со state внутри
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  // React 19: можно писать <ThemeContext value={...}> без .Provider
  return (
    <ThemeContext value={{ theme, toggle }}>
      {children}
    </ThemeContext>
  )
}

// 3. Свой хук — удобно и с проверкой
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme вне ThemeProvider')
  return ctx
}

// 4. Использование где угодно в дереве
function ThemeButton() {
  const { theme, toggle } = useTheme()
  return <button onClick={toggle}>{theme === 'dark' ? '🌙' : '☀️'}</button>
}

export default function App() {
  return (
    <ThemeProvider>
      <Header /> {/* внутри где-то глубоко — <ThemeButton /> */}
    </ThemeProvider>
  )
}`,
    },
    notes: [
      'createContext → <Context value={...}> → useContext(Context) в любом потомке',
      'Подходит для редко меняющихся данных: тема, язык, текущий пользователь',
      'Все потребители перерисовываются при смене value — для частых апдейтов бери Zustand',
      'Оборачивай в свой хук useTheme() с проверкой на null',
    ],
  },
  {
    slug: 'use-reducer',
    title: 'useReducer',
    desc: 'Сложное состояние по правилам',
    tags: ['Хуки', 'Состояние'],
    analogy:
      'useReducer — как банковский кассир. Ты не лезешь в сейф сам, а подаёшь заявку: «Положить 100₽» (action). Кассир по строгим правилам (reducer) меняет баланс. Все операции предсказуемы и их легко проверить.',
    compare: {
      left: { label: 'useState', text: 'Отлично для простых значений. Но 5 связанных useState и логика в обработчиках быстро превращаются в кашу.' },
      right: { label: 'useReducer', text: 'Вся логика изменений в одной чистой функции. Компонент только отправляет dispatch({ type }).' },
    },
    code: {
      file: 'Cart.jsx',
      lang: 'jsx',
      src: `import { useReducer } from 'react'

const initialState = { items: [], promo: null }

// Reducer — чистая функция: (state, action) => newState
function cartReducer(state, action) {
  switch (action.type) {
    case 'added': {
      const exists = state.items.find(i => i.id === action.item.id)
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] }
    }
    case 'removed':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'promo_applied':
      return { ...state, promo: action.code }
    default:
      throw new Error('Неизвестный action: ' + action.type)
  }
}

export default function Cart() {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const total = state.items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <>
      <button onClick={() => dispatch({ type: 'added', item: { id: 1, price: 990 } })}>
        В корзину
      </button>
      <p>Итого: {total} ₽</p>
    </>
  )
}`,
    },
    notes: [
      'const [state, dispatch] = useReducer(reducer, initialState)',
      'Reducer — чистая функция без побочных эффектов, возвращает НОВЫЙ state',
      'Action — объект с type и данными: dispatch({ type: "added", item })',
      'Тот же паттерн лежит в основе Redux — выучишь useReducer, поймёшь Redux',
    ],
  },
  {
    slug: 'use-memo-use-callback',
    title: 'useMemo & useCallback',
    desc: 'Мемоизация вычислений и функций',
    tags: ['Хуки', 'Перформанс'],
    analogy:
      'useMemo — как шпаргалка с ответом на сложную задачу. Пока условия задачи не изменились, не решаешь заново, а подсматриваешь ответ. useCallback — то же самое, но для функции: отдаёшь ту же самую функцию, а не новую копию.',
    compare: {
      left: { label: 'Без мемоизации', text: 'Каждый рендер пересчитывает тяжёлые вычисления и создаёт новые функции — memo-дети ререндерятся зря.' },
      right: { label: 'useMemo / useCallback', text: 'Кэшируют результат/функцию до изменения зависимостей. С React Compiler часто не нужны вручную.' },
    },
    code: {
      file: 'ProductList.jsx',
      lang: 'jsx',
      src: `import { useMemo, useCallback, useState, memo } from 'react'

export default function ProductList({ products }) {
  const [query, setQuery] = useState('')
  const [dark, setDark] = useState(false)

  // useMemo — кэширует РЕЗУЛЬТАТ вычисления
  const filtered = useMemo(() => {
    console.log('Фильтруем…') // не вызовется при переключении темы
    return products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    )
  }, [products, query])

  // useCallback — кэширует саму ФУНКЦИЮ (стабильная ссылка)
  const handleBuy = useCallback(id => {
    console.log('Купить', id)
  }, [])

  return (
    <div className={dark ? 'dark' : ''}>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={() => setDark(d => !d)}>Тема</button>
      {filtered.map(p => (
        <Row key={p.id} product={p} onBuy={handleBuy} />
      ))}
    </div>
  )
}

// memo — не ререндерить, если props не изменились
const Row = memo(function Row({ product, onBuy }) {
  return <li onClick={() => onBuy(product.id)}>{product.name}</li>
})`,
    },
    notes: [
      'useMemo(() => calc(a, b), [a, b]) — запоминает результат вычисления',
      'useCallback(fn, deps) — запоминает функцию; = useMemo(() => fn, deps)',
      'Имеет смысл в паре с memo() у дочерних компонентов или для тяжёлых расчётов',
      'React Compiler мемоизирует автоматически — сначала измеряй, потом оптимизируй',
    ],
  },
  {
    slug: 'custom-hooks',
    title: 'Custom Hooks',
    desc: 'Свои хуки — переиспользуемая логика',
    tags: ['Хуки', 'Паттерны'],
    analogy:
      'Кастомный хук — как рецепт, который ты записал после того, как готовил одно и то же блюдо в трёх местах. Теперь любой компонент берёт рецепт useLocalStorage и получает готовый результат, не зная деталей.',
    compare: {
      left: { label: 'Copy-paste', text: 'Одинаковые useState + useEffect копируются по компонентам. Баг исправляешь в одном месте — остаётся в трёх других.' },
      right: { label: 'Custom Hook', text: 'Функция useЧтоТо, внутри которой другие хуки. Логика отделена от UI и переиспользуется.' },
    },
    code: {
      file: 'hooks.js',
      lang: 'jsx',
      src: `import { useState, useEffect } from 'react'

// Хук = функция, имя начинается с use, внутри — другие хуки
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key)
    return saved !== null ? JSON.parse(saved) : initial
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}

// Использование:
// const [name, setName] = useLocalStorage('name', '')
// const search = useDebounce(query, 300)`,
    },
    notes: [
      'Кастомный хук — обычная функция, чьё имя начинается с use',
      'Хуки делят ЛОГИКУ, а не состояние: каждый вызов получает свой собственный state',
      'Правила хуков: вызывать только на верхнем уровне компонента/хука, не в if и циклах',
      'Готовые коллекции хуков: usehooks-ts, @uidotdev/usehooks, ahooks',
    ],
  },
  {
    slug: 'react-19',
    title: 'React 19 Features',
    desc: 'Actions, use(), useOptimistic, useActionState',
    tags: ['Новое', 'React 19'],
    analogy:
      'Раньше для отправки формы нужно было вручную вести журнал: «отправляю… ошибка… готово». React 19 даёт личного секретаря (Actions): он сам отслеживает статус, ошибки и даже заранее показывает «отправлено» (optimistic UI), пока сервер думает.',
    compare: {
      left: { label: 'React 18', text: 'useState для isPending, error, data + try/catch + e.preventDefault() в каждой форме. forwardRef, Context.Provider.' },
      right: { label: 'React 19', text: '<form action={fn}>, useActionState, useFormStatus, useOptimistic, use(promise), ref как prop, метаданные в JSX.' },
    },
    code: {
      file: 'CommentForm.jsx',
      lang: 'jsx',
      src: `import { use, useActionState, useOptimistic, Suspense } from 'react'
import { useFormStatus } from 'react-dom'

// useActionState: статус, ошибка и результат действия «из коробки»
function CommentForm({ comments, addComment }) {
  const [optimistic, addOptimistic] = useOptimistic(
    comments,
    (state, text) => [...state, { id: 'tmp', text, sending: true }]
  )

  const [error, submitAction] = useActionState(async (prev, formData) => {
    const text = formData.get('text')
    addOptimistic(text)               // показываем сразу
    try {
      await addComment(text)          // запрос к серверу
      return null
    } catch {
      return 'Не удалось отправить'
    }
  }, null)

  return (
    <>
      {optimistic.map(c => (
        <p key={c.id} style={{ opacity: c.sending ? 0.5 : 1 }}>{c.text}</p>
      ))}
      <form action={submitAction}>  {/* без onSubmit и preventDefault */}
        <input name="text" />
        <SubmitButton />
        {error && <p className="error">{error}</p>}
      </form>
    </>
  )
}

// useFormStatus — статус родительской формы
function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Отправка…' : 'Отправить'}</button>
}

// use() — читает промис (с Suspense) или контекст, можно внутри if
function Profile({ userPromise }) {
  const user = use(userPromise)
  return (
    <>
      <title>{user.name}</title>  {/* метаданные прямо в компоненте */}
      <h1>{user.name}</h1>
    </>
  )
}`,
    },
    notes: [
      '<form action={fn}> — функция получает FormData, форма сама сбрасывается',
      'useActionState(fn, init) → [state, action, isPending]; useFormStatus — pending формы',
      'useOptimistic — мгновенно показывает результат, откатывает при ошибке',
      'use(promise|context), ref как prop, <title>/<meta> в JSX, <Context value> без .Provider',
    ],
  },
]

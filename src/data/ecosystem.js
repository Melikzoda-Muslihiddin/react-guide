export const ecosystem = [
  {
    slug: 'react-router',
    title: 'React Router',
    desc: 'Маршрутизация в SPA',
    tags: ['Роутинг', 'Навигация'],
    analogy:
      'SPA — это одно здание, а React Router — табличка на двери, которая мгновенно меняет вывеску: «Кабинет», «Профиль», «Настройки». Ты не выходишь на улицу (не перезагружаешь страницу), просто открываешь другую дверь внутри.',
    compare: {
      left: { label: '⚛ Чистый React', text: 'Нет роутинга. Пришлось бы вручную слушать history API и решать, какой компонент показать.' },
      right: { label: '🧭 React Router v7', text: 'Маршруты, вложенные layout-ы, параметры URL, loader-ы для данных, ленивые страницы, 404.' },
    },
    code: {
      file: 'main.jsx',
      lang: 'jsx',
      src: `// npm i react-router
import { createBrowserRouter, Link, NavLink, Outlet,
         useParams, useNavigate, useLoaderData } from 'react-router'
import { RouterProvider } from 'react-router/dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,          // общий каркас
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'users/:id',        // динамический параметр
        loader: ({ params }) => fetch('/api/users/' + params.id),
        element: <User />,
      },
      { path: 'settings', lazy: () => import('./Settings') },
    ],
  },
])

function Layout() {
  return (
    <>
      <nav>
        <NavLink to="/">Главная</NavLink>  {/* класс active автоматически */}
        <Link to="/users/42">Профиль</Link>
      </nav>
      <Outlet />  {/* сюда рендерится дочерний маршрут */}
    </>
  )
}

function User() {
  const { id } = useParams()
  const user = useLoaderData()     // данные из loader
  const navigate = useNavigate()
  return <button onClick={() => navigate('/')}>{user.name} #{id} ← назад</button>
}

createRoot(document.getElementById('root')).render(<RouterProvider router={router} />)`,
    },
    notes: [
      '<Link to> вместо <a href> — переход без перезагрузки страницы',
      '<Outlet /> — место для дочерних маршрутов во вложенных layout-ах',
      'useParams — параметры URL, useNavigate — программный переход, useSearchParams — ?query',
      'v7 = бывший Remix: умеет framework mode с SSR. Альтернатива — TanStack Router',
    ],
  },
  {
    slug: 'tanstack-query',
    title: 'TanStack Query',
    desc: 'Серверное состояние без боли',
    tags: ['Data', 'Async'],
    analogy:
      'TanStack Query — личный ассистент по данным. Попросил список задач — он принёс, запомнил (кэш), сам обновит, когда вернёшься на вкладку, а если ты что-то изменил — сбегает за свежей версией. Тебе не нужно помнить про loading, error и повторы.',
    compare: {
      left: { label: '⚛ useEffect + fetch', text: 'Свои isLoading/error, гонки запросов, нет кэша, дубли запросов, ручной рефетч после мутаций.' },
      right: { label: '🌸 TanStack Query', text: 'Кэш по ключам, дедупликация, фоновое обновление, ретраи, пагинация, инвалидация после мутаций.' },
    },
    code: {
      file: 'Todos.jsx',
      lang: 'jsx',
      src: `// npm i @tanstack/react-query
import { QueryClient, QueryClientProvider,
         useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}

function Todos() {
  const qc = useQueryClient()

  // Чтение: ключ + функция загрузки
  const { data, isPending, error } = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/api/todos').then(r => r.json()),
    staleTime: 60_000, // минуту данные считаются свежими
  })

  // Запись: после успеха помечаем кэш устаревшим → авто-рефетч
  const addTodo = useMutation({
    mutationFn: text =>
      fetch('/api/todos', { method: 'POST', body: JSON.stringify({ text }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['todos'] }),
  })

  if (isPending) return <p>Загрузка…</p>
  if (error) return <p>Ошибка: {error.message}</p>

  return (
    <>
      {data.map(t => <p key={t.id}>{t.text}</p>)}
      <button disabled={addTodo.isPending} onClick={() => addTodo.mutate('Новая')}>
        Добавить
      </button>
    </>
  )
}

// Зависимые данные: queryKey: ['user', id] — свой кэш на каждый id`,
    },
    notes: [
      'useQuery({ queryKey, queryFn }) — загрузка + кэш; ключ = массив, описывающий данные',
      'useMutation + invalidateQueries — изменить данные и обновить связанные запросы',
      'Серверный стейт (данные API) ≠ клиентский (UI). Первый — Query, второй — useState/Zustand',
      'Поставь @tanstack/react-query-devtools — видно весь кэш в реальном времени',
    ],
  },
  {
    slug: 'redux-toolkit',
    title: 'Redux Toolkit',
    desc: 'Предсказуемый глобальный стор',
    tags: ['Состояние', 'Сложно'],
    analogy:
      'Redux — центральный банк приложения. Деньги (состояние) лежат в одном хранилище. Изменить их можно только официальной заявкой (action), которую обрабатывает строгий регламент (reducer). Зато каждую операцию можно отследить и отмотать назад.',
    compare: {
      left: { label: 'Старый Redux', text: 'Горы бойлерплейта: константы, action creators, switch, ручная иммутабельность, отдельные middleware.' },
      right: { label: '🟣 Redux Toolkit', text: 'createSlice генерирует actions сам, Immer позволяет «мутировать», RTK Query — кэширование API.' },
    },
    code: {
      file: 'store.js',
      lang: 'jsx',
      src: `// npm i @reduxjs/toolkit react-redux
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { Provider, useSelector, useDispatch } from 'react-redux'

// 1. Slice = кусок состояния + редьюсеры + actions
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    added(state, action) {
      state.items.push(action.payload) // можно! Immer сделает копию
    },
    removed(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
  },
})

export const { added, removed } = cartSlice.actions

// 2. Store
export const store = configureStore({
  reducer: { cart: cartSlice.reducer },
})

// 3. Подключаем
// <Provider store={store}><App /></Provider>

// 4. Используем в компонентах
function CartButton({ product }) {
  const count = useSelector(state => state.cart.items.length)
  const dispatch = useDispatch()
  return (
    <button onClick={() => dispatch(added(product))}>
      🛒 {count}
    </button>
  )
}`,
    },
    notes: [
      'createSlice — name + initialState + reducers, actions генерируются автоматически',
      'Внутри редьюсеров RTK можно «мутировать» state — Immer под капотом делает иммутабельно',
      'useSelector — читать, useDispatch — отправлять actions',
      'Для больших команд и сложной логики. RTK Query — встроенная альтернатива TanStack Query',
    ],
  },
  {
    slug: 'zustand',
    title: 'Zustand',
    desc: 'Минималистичный глобальный стор',
    tags: ['Состояние', 'Просто'],
    analogy:
      'Если Redux — центральный банк с регламентами, то Zustand — общий кошелёк на холодильнике. Любой член семьи берёт или кладёт деньги одной строкой. Никаких заявок и провайдеров, но всё работает.',
    compare: {
      left: { label: 'Context / Redux', text: 'Context перерисовывает всех потребителей, Redux требует store, Provider, slices и экшены.' },
      right: { label: '🐻 Zustand', text: 'Один вызов create — и хук готов. Без провайдера. Компонент перерисуется только при изменении выбранного поля.' },
    },
    code: {
      file: 'useCartStore.js',
      lang: 'jsx',
      src: `// npm i zustand
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Стор = хук. State и actions в одном месте
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      add: item => set(state => ({ items: [...state.items, item] })),
      remove: id => set(state => ({
        items: state.items.filter(i => i.id !== id),
      })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((s, i) => s + i.price, 0),
    }),
    { name: 'cart' } // сохраняется в localStorage
  )
)

// Использование — без Provider!
function CartIcon() {
  // Селектор: ререндер только когда меняется длина
  const count = useCartStore(s => s.items.length)
  return <span>🛒 {count}</span>
}

function AddButton({ product }) {
  const add = useCartStore(s => s.add)
  return <button onClick={() => add(product)}>В корзину</button>
}

// Вне React тоже можно:
// useCartStore.getState().clear()`,
    },
    notes: [
      'create((set, get) => ({ ...state, ...actions })) — возвращает готовый хук',
      'Провайдер не нужен — импортируй хук и используй в любом компоненте',
      'Всегда выбирай селектором: useStore(s => s.field) — меньше лишних ререндеров',
      'persist — сохранение в localStorage, devtools — подключение к Redux DevTools',
    ],
  },
  {
    slug: 'react-hook-form-zod',
    title: 'React Hook Form + Zod',
    desc: 'Формы и валидация',
    tags: ['Формы', 'Валидация'],
    analogy:
      'Zod — охранник на входе со списком правил: «email должен быть email, пароль ≥ 8 символов». React Hook Form — администратор, который следит за всеми полями формы, не дёргая всех гостей (не вызывая ререндер) при каждой нажатой клавише.',
    compare: {
      left: { label: '⚛ useState-формы', text: 'useState на каждое поле, ререндер на каждый символ, валидация и сообщения об ошибках вручную.' },
      right: { label: '📋 RHF + Zod', text: 'register() подключает поле, схема Zod описывает правила и типы, ошибки и isSubmitting из коробки.' },
    },
    code: {
      file: 'SignupForm.jsx',
      lang: 'jsx',
      src: `// npm i react-hook-form zod @hookform/resolvers
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// 1. Схема — единый источник правил (и типов в TS)
const schema = z.object({
  email: z.email('Некорректный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Пароли не совпадают',
  path: ['confirm'],
})

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  async function onSubmit(data) {
    await fetch('/api/signup', { method: 'POST', body: JSON.stringify(data) })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}

      <input type="password" {...register('confirm')} />
      {errors.confirm && <p>{errors.confirm.message}</p>}

      <button disabled={isSubmitting}>
        {isSubmitting ? 'Отправка…' : 'Создать аккаунт'}
      </button>
    </form>
  )
}

// TS: type FormData = z.infer<typeof schema>`,
    },
    notes: [
      '{...register("name")} — подключает инпут к форме (name, onChange, onBlur, ref)',
      'handleSubmit(onSubmit) — вызовет onSubmit только если валидация прошла',
      'Zod-схему можно переиспользовать на бэкенде; z.infer даёт TS-тип бесплатно',
      'Поля неконтролируемые — нет ререндера на каждый символ, формы летают',
    ],
  },
  {
    slug: 'tailwind-css',
    title: 'Tailwind CSS',
    desc: 'Утилитарные стили прямо в разметке',
    tags: ['Стили', 'UI'],
    analogy:
      'Обычный CSS — как шить одежду с нуля: придумай имя классу, открой другой файл, опиши стили. Tailwind — набор готовых деталей-кубиков: p-4, rounded-xl, bg-blue-500. Собираешь вид прямо там, где пишешь разметку.',
    compare: {
      left: { label: 'CSS / CSS Modules', text: 'Придумываешь имена классов, прыгаешь между файлами, мёртвый CSS копится годами.' },
      right: { label: '🌊 Tailwind v4', text: 'Классы-утилиты в JSX, адаптив и состояния префиксами (md:, hover:, dark:), в бандл попадает только используемое.' },
    },
    code: {
      file: 'ProductCard.jsx',
      lang: 'jsx',
      src: `// npm i tailwindcss @tailwindcss/vite
// vite.config.js:  plugins: [react(), tailwindcss()]
// index.css:       @import "tailwindcss";

export function ProductCard({ product, featured }) {
  return (
    <div
      className={[
        'rounded-2xl border p-6 transition',
        'hover:-translate-y-1 hover:shadow-xl',     // состояния
        'dark:border-zinc-800 dark:bg-zinc-900',    // тёмная тема
        featured ? 'border-sky-400' : 'border-zinc-200',
      ].join(' ')}
    >
      {/* Адаптив: mobile-first, md: = от 768px */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <img src={product.image} className="size-24 rounded-xl object-cover" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-zinc-500 line-clamp-2">{product.desc}</p>
        </div>
        <button className="rounded-lg bg-sky-500 px-4 py-2 font-medium text-white
                           hover:bg-sky-600 active:scale-95 disabled:opacity-50">
          {product.price} ₽
        </button>
      </div>
    </div>
  )
}

// Свои токены в CSS (v4):
// @theme { --color-brand: #61dafb; }  →  bg-brand, text-brand`,
    },
    notes: [
      'v4: плагин @tailwindcss/vite + @import "tailwindcss" — без tailwind.config.js',
      'Mobile-first: базовые классы для мобилки, sm: md: lg: — для экранов шире',
      'Состояния префиксами: hover:, focus:, disabled:, dark:, group-hover:',
      'Условные классы — clsx / cn(), конфликты классов решает tailwind-merge',
    ],
  },
  {
    slug: 'shadcn-ui',
    title: 'shadcn/ui',
    desc: 'Готовые компоненты в твоём коде',
    tags: ['UI', 'Компоненты'],
    analogy:
      'Обычная UI-библиотека — мебель из магазина: красиво, но переделать сложно. shadcn/ui — чертежи мебели и готовые детали, которые тебе привозят домой. Это теперь твоя мебель: пили, перекрашивай, меняй как хочешь.',
    compare: {
      left: { label: 'MUI / Ant Design', text: 'npm-пакет — код в node_modules. Кастомизация через темы и переопределения, тяжело выйти за рамки.' },
      right: { label: '🧩 shadcn/ui', text: 'CLI копирует исходники компонента в проект. Radix (доступность) + Tailwind (стили). Код полностью твой.' },
    },
    code: {
      file: 'DeleteDialog.jsx',
      lang: 'jsx',
      src: `// npx shadcn@latest init           — настройка (Tailwind, алиасы, cn)
// npx shadcn@latest add button dialog input
// → файлы появятся в src/components/ui/

import { Button } from '@/components/ui/button'
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'

export function DeleteDialog({ onConfirm }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Удалить проект</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Точно удалить?</DialogTitle>
          <DialogDescription>
            Действие необратимо. Все данные проекта будут потеряны.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Отмена</Button>
          <Button variant="destructive" onClick={onConfirm}>Удалить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Фокус-ловушка, Esc, aria-атрибуты — уже внутри (Radix UI).
// Хочешь другой вид кнопки — открой components/ui/button и поменяй.`,
    },
    notes: [
      'Не npm-зависимость, а коллекция компонентов, которые CLI копирует в твой проект',
      'Под капотом: Radix UI (доступность, поведение) + Tailwind (внешний вид)',
      'Варианты компонентов описаны через cva (class-variance-authority)',
      'Темы — через CSS-переменные; ui.shadcn.com — каталог и генератор тем',
    ],
  },
  {
    slug: 'motion',
    title: 'Motion',
    desc: 'Анимации (бывший Framer Motion)',
    tags: ['Анимации', 'UI'],
    analogy:
      'CSS-анимации — как мультфильм, который рисуешь кадр за кадром через keyframes. Motion — режиссёр: ты говоришь «появись снизу», «уходи вправо», «плавно перестройся», и он сам рассчитывает всё движение с физикой пружин.',
    compare: {
      left: { label: 'CSS transitions', text: 'Нельзя анимировать удаление из DOM, сложно анимировать смену layout, жесты пишутся вручную.' },
      right: { label: '🎬 Motion', text: 'animate/initial/exit, AnimatePresence для размонтирования, layout-анимации, жесты, пружинная физика.' },
    },
    code: {
      file: 'Toasts.jsx',
      lang: 'jsx',
      src: `// npm i motion
import { motion, AnimatePresence } from 'motion/react'

export function Toasts({ toasts, onClose }) {
  return (
    <ul className="toasts">
      {/* AnimatePresence — анимирует УДАЛЕНИЕ из DOM */}
      <AnimatePresence>
        {toasts.map(t => (
          <motion.li
            key={t.id}
            layout                                 // плавная перестройка
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={() => onClose(t.id)}
          >
            {t.text}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}

// Жесты и появление при скролле
export function Card() {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    />
  )
}`,
    },
    notes: [
      'motion.div, motion.li… — обычные теги с пропсами initial / animate / exit',
      'AnimatePresence — нужен, чтобы сработала exit-анимация при удалении элемента',
      'layout — автоматически анимирует изменения размера и позиции',
      'Анимируй transform и opacity; уважай prefers-reduced-motion (useReducedMotion)',
    ],
  },
]

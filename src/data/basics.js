export const basics = [
  {
    slug: 'vite-setup',
    title: 'Vite & Project Setup',
    desc: 'Создаём React-проект за минуту',
    tags: ['Основы', 'Старт'],
    analogy:
      'Раньше, чтобы испечь торт, нужно было самому собрать духовку (Webpack, Babel, конфиги). Vite — это готовая кухня: заходишь, включаешь плиту и сразу готовишь. Изменил рецепт — результат виден мгновенно.',
    compare: {
      left: { label: 'Create React App', text: 'Устарел и официально deprecated. Медленный старт, долгие пересборки, тяжёлый Webpack-конфиг внутри.' },
      right: { label: 'Vite', text: 'Стандарт де-факто. Старт за доли секунды, мгновенный HMR, сборка в оптимизированный бандл для продакшена.' },
    },
    code: {
      file: 'terminal + структура',
      lang: 'bash',
      src: `# Создать проект (шаблон react или react-ts)
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev        # → http://localhost:5173

my-app/
├── index.html          # точка входа, тут <div id="root">
├── package.json        # зависимости и скрипты
├── vite.config.ts      # конфиг Vite (плагины, алиасы)
├── public/             # статика как есть (favicon, robots.txt)
└── src/
    ├── main.tsx        # монтирует <App /> в #root
    ├── App.tsx         # корневой компонент
    ├── components/     # переиспользуемые компоненты
    └── assets/         # картинки, импортируемые в код`,
    },
    notes: [
      'npm create vite@latest — стандартный способ начать React-проект без фреймворка',
      'main.tsx вызывает createRoot(document.getElementById("root")).render(<App />)',
      'npm run dev — дев-сервер с HMR, npm run build — продакшен-сборка в папку dist/',
      'Нужен SSR, SEO или роутинг на файлах — бери фреймворк (Next.js, React Router v7)',
    ],
  },
  {
    slug: 'jsx',
    title: 'JSX',
    desc: 'HTML внутри JavaScript',
    tags: ['Основы', 'Синтаксис'],
    analogy:
      'JSX — как шаблон письма, где можно вставлять переменные: «Привет, {имя}!». Выглядит как HTML, но на самом деле это JavaScript, который превращается в вызовы функций.',
    compare: {
      left: { label: 'JS · Vanilla', text: 'document.createElement, appendChild, innerHTML — DOM строится вручную, шаг за шагом.' },
      right: { label: '⚛ React', text: 'Описываешь, КАК должен выглядеть UI. JSX компилируется в React-элементы, React сам обновляет DOM.' },
    },
    code: {
      file: 'Greeting.jsx',
      lang: 'jsx',
      src: `function Greeting({ user }) {
  const isAdmin = user.role === 'admin'

  return (
    // Один корневой элемент или фрагмент <>...</>
    <>
      {/* Выражения JS — в фигурных скобках */}
      <h1>Привет, {user.name}!</h1>

      {/* class → className, for → htmlFor */}
      <p className="subtitle">Тебе {user.age} лет</p>

      {/* Стили — объект, свойства в camelCase */}
      <span style={{ color: 'tomato', fontWeight: 700 }}>
        {isAdmin ? 'Админ' : 'Пользователь'}
      </span>

      {/* Все теги закрываются: <img />, <br />, <input /> */}
      <img src={user.avatar} alt="Аватар" />
    </>
  )
}`,
    },
    notes: [
      'JSX = JavaScript. Внутри {} — любое выражение (но не if/for — только тернарник и &&)',
      'Компонент возвращает один корень — оборачивай в <div> или фрагмент <>...</>',
      'className вместо class, htmlFor вместо for, onClick вместо onclick',
      'style принимает объект: style={{ marginTop: 8 }}, а не строку',
    ],
  },
  {
    slug: 'components-and-props',
    title: 'Components & Props',
    desc: 'Кирпичики интерфейса',
    tags: ['Основы', 'Критично'],
    analogy:
      'Компоненты — как LEGO-детали. Одну деталь «Кнопка» можно использовать сто раз. Props — это параметры детали: цвет, размер, надпись. Деталь не меняет свои параметры сама — их задаёт тот, кто её ставит.',
    compare: {
      left: { label: 'JS · Vanilla', text: 'Копируешь одинаковый HTML-кусок по всем страницам. Поменял дизайн кнопки — ищешь и правишь везде.' },
      right: { label: '⚛ React', text: 'Компонент — функция, возвращающая JSX. Пишешь один раз, переиспользуешь везде, передаёшь данные через props.' },
    },
    code: {
      file: 'Card.jsx',
      lang: 'jsx',
      src: `// Компонент = функция с большой буквы, принимает props
function Button({ variant = 'primary', onClick, children }) {
  return (
    <button className={'btn btn-' + variant} onClick={onClick}>
      {children}
    </button>
  )
}

// children — всё, что передали между тегами
function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </div>
  )
}

export default function App() {
  return (
    <Card title="Подписка">
      <p>Получай новые уроки первым</p>
      <Button onClick={() => alert('Готово!')}>Подписаться</Button>
      <Button variant="ghost">Позже</Button>
    </Card>
  )
}`,
    },
    notes: [
      'Имя компонента всегда с большой буквы: <Button />, а не <button />',
      'Props только для чтения — компонент никогда не меняет свои props',
      'children — специальный prop: содержимое между открывающим и закрывающим тегом',
      'Данные текут сверху вниз: родитель → ребёнок (one-way data flow)',
    ],
  },
  {
    slug: 'state',
    title: 'State & useState',
    desc: 'Память компонента',
    tags: ['Хуки', 'Критично'],
    analogy:
      'State — это блокнот компонента. Обычная переменная — запись мелом на доске, её стирают при каждой перерисовке. useState — запись в блокноте: React хранит её между рендерами и перерисовывает UI, когда запись меняется.',
    compare: {
      left: { label: 'JS · Vanilla', text: 'Меняешь переменную и вручную обновляешь DOM: el.textContent = count. Легко забыть и рассинхронизировать.' },
      right: { label: '⚛ React', text: 'Вызываешь setState — React сам перерисует компонент. UI = функция от состояния.' },
    },
    code: {
      file: 'Counter.jsx',
      lang: 'jsx',
      src: `import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState({ name: 'Аня', likes: 0 })
  const [todos, setTodos] = useState([])

  function addThree() {
    // ❌ setCount(count + 1) три раза даст +1 (count «заморожен» в рендере)
    // ✅ функциональное обновление — берёт актуальное значение
    setCount(c => c + 1)
    setCount(c => c + 1)
    setCount(c => c + 1)
  }

  // Объекты и массивы — НЕ мутируем, создаём новые
  const like = () => setUser({ ...user, likes: user.likes + 1 })
  const addTodo = text => setTodos([...todos, { id: Date.now(), text }])

  return (
    <div>
      <p>Счёт: {count}</p>
      <button onClick={addThree}>+3</button>
      <button onClick={like}>❤ {user.likes}</button>
      <button onClick={() => addTodo('Выучить React')}>
        Задач: {todos.length}
      </button>
    </div>
  )
}`,
    },
    notes: [
      'const [value, setValue] = useState(initial) — значение + функция обновления',
      'setState не меняет значение сразу — новое значение будет в следующем рендере',
      'Обновление на основе старого: setCount(c => c + 1)',
      'Объекты/массивы — иммутабельно: {...obj}, [...arr], map, filter. Никаких push!',
    ],
  },
  {
    slug: 'events',
    title: 'Events',
    desc: 'Реакция на действия пользователя',
    tags: ['Основы', 'UI'],
    analogy:
      'Обработчик события — дверной звонок. Ты не стоишь у двери и не проверяешь каждую секунду, пришёл ли гость. Ты вешаешь звонок (onClick), и когда гость нажимает — срабатывает твоя функция.',
    compare: {
      left: { label: 'JS · Vanilla', text: 'el.addEventListener("click", fn) и не забыть removeEventListener. Логика отдельно от разметки.' },
      right: { label: '⚛ React', text: 'onClick={fn} прямо в JSX. React сам подписывается и отписывается, события кроссбраузерные.' },
    },
    code: {
      file: 'Events.jsx',
      lang: 'jsx',
      src: `export default function Events() {
  function handleClick(e) {
    console.log('Клик по', e.currentTarget)
  }

  function handleDelete(id) {
    console.log('Удаляем', id)
  }

  function handleSubmit(e) {
    e.preventDefault() // не перезагружать страницу
    const data = new FormData(e.currentTarget)
    console.log(data.get('email'))
  }

  return (
    <>
      {/* ✅ передаём ссылку на функцию */}
      <button onClick={handleClick}>Клик</button>

      {/* ❌ onClick={handleDelete(5)} — вызовется сразу при рендере! */}
      {/* ✅ нужен аргумент — оборачиваем в стрелку */}
      <button onClick={() => handleDelete(5)}>Удалить #5</button>

      <form onSubmit={handleSubmit}>
        <input name="email" onChange={e => console.log(e.target.value)} />
        <button type="submit">Отправить</button>
      </form>

      <div onClick={() => console.log('родитель')}>
        <button onClick={e => e.stopPropagation()}>Не всплывать</button>
      </div>
    </>
  )
}`,
    },
    notes: [
      'События в camelCase: onClick, onChange, onSubmit, onKeyDown, onMouseEnter',
      'Передавай функцию, а не результат вызова: onClick={fn}, а не onClick={fn()}',
      'Нужен аргумент — стрелка: onClick={() => remove(id)}',
      'e.preventDefault() — отменить действие браузера, e.stopPropagation() — всплытие',
    ],
  },
  {
    slug: 'conditional-rendering',
    title: 'Conditional Rendering',
    desc: 'Показать или скрыть',
    tags: ['Основы', 'UI'],
    analogy:
      'Как светофор: в зависимости от состояния показывается красный, жёлтый или зелёный. Компонент смотрит на данные и решает, что нарисовать — загрузку, ошибку или контент.',
    compare: {
      left: { label: 'JS · Vanilla', text: 'el.style.display = "none" или el.classList.toggle. Нужно помнить, какие элементы скрыть, а какие показать.' },
      right: { label: '⚛ React', text: 'Обычные условия JS: if, тернарник, &&. Элемента просто нет в разметке, если условие ложно.' },
    },
    code: {
      file: 'Profile.jsx',
      lang: 'jsx',
      src: `function Profile({ status, user, notifications }) {
  // 1. Ранний return — для целых состояний
  if (status === 'loading') return <Spinner />
  if (status === 'error') return <p>Ошибка загрузки 😢</p>

  return (
    <div>
      {/* 2. Тернарник — одно из двух */}
      {user.isPro ? <ProBadge /> : <a href="/pricing">Купить Pro</a>}

      {/* 3. && — показать или ничего */}
      {notifications.length > 0 && (
        <span className="badge">{notifications.length}</span>
      )}

      {/* ⚠️ Ловушка: {0 && <X />} отрисует «0»! */}
      {/* ✅ Сравнивай явно: length > 0 или !!length */}

      {/* 4. Объект-словарь вместо длинных if/else */}
      {{
        admin: <AdminPanel />,
        editor: <EditorPanel />,
      }[user.role] ?? <ViewerPanel />}
    </div>
  )
}`,
    },
    notes: [
      'Ранний return — для состояний loading / error / empty',
      'cond ? <A /> : <B /> — выбор из двух; cond && <A /> — показать или ничего',
      'Ловушка: число 0 слева от && рендерится. Пиши list.length > 0 && ...',
      'return null — компонент ничего не рисует',
    ],
  },
  {
    slug: 'lists-and-keys',
    title: 'Lists & Keys',
    desc: 'Рендер массивов',
    tags: ['Основы', 'Важно'],
    analogy:
      'key — как номер места в театре. Если зрители пересядут, билетёр по номерам поймёт, кто куда ушёл. Без номеров (или с номерами «по порядку») он перепутает людей и выдаст не те вещи из гардероба.',
    compare: {
      left: { label: 'JS · Vanilla', text: 'for-цикл + createElement + appendChild. При изменении массива — перерисовываешь список целиком.' },
      right: { label: '⚛ React', text: 'array.map() возвращает массив JSX. По key React понимает, что добавилось, удалилось или переместилось.' },
    },
    code: {
      file: 'TodoList.jsx',
      lang: 'jsx',
      src: `const todos = [
  { id: 'a1', text: 'Выучить JSX', done: true },
  { id: 'b2', text: 'Разобраться с хуками', done: false },
  { id: 'c3', text: 'Сделать пет-проект', done: false },
]

export default function TodoList({ filter }) {
  const visible = todos
    .filter(t => (filter === 'active' ? !t.done : true))
    .sort((a, b) => a.text.localeCompare(b.text))

  if (visible.length === 0) return <p>Пусто 🎉</p>

  return (
    <ul>
      {visible.map(todo => (
        // ✅ key — стабильный уникальный id из данных
        <li key={todo.id} className={todo.done ? 'done' : ''}>
          {todo.text}
        </li>
      ))}
    </ul>
  )
}

// ❌ key={index} — баги при сортировке/удалении (стейт «переезжает»)
// ❌ key={Math.random()} — пересоздаёт элементы на каждом рендере`,
    },
    notes: [
      'Списки рендерим через .map(), фильтруем через .filter() прямо перед рендером',
      'key обязателен у корневого элемента в map и должен быть уникален среди соседей',
      'Лучший key — id из базы. Индекс — только если список статичен и не меняется',
      'key не передаётся в компонент как prop — это служебный атрибут React',
    ],
  },
  {
    slug: 'forms',
    title: 'Forms',
    desc: 'Контролируемые и неконтролируемые инпуты',
    tags: ['Формы', 'UI'],
    analogy:
      'Контролируемый инпут — как диктант: каждую букву ты проговариваешь вслух (state), и ученик пишет только то, что услышал. Неконтролируемый — ученик пишет сам, а ты заглядываешь в тетрадь в конце.',
    compare: {
      left: { label: 'JS · Vanilla', text: 'Читаешь input.value при отправке. Валидацию и подсветку ошибок пишешь вручную через DOM.' },
      right: { label: '⚛ React', text: 'value + onChange = state всегда синхронен с полем. Или FormData + action в React 19 для простых форм.' },
    },
    code: {
      file: 'SignupForm.jsx',
      lang: 'jsx',
      src: `import { useState } from 'react'

export default function SignupForm() {
  // Контролируемая форма: один объект на все поля
  const [form, setForm] = useState({ email: '', plan: 'free', agree: false })
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.email.includes('@')) return setError('Некорректный email')
    setError('')
    console.log('Отправляем', form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={form.email} onChange={handleChange} />

      <select name="plan" value={form.plan} onChange={handleChange}>
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </select>

      <label>
        <input type="checkbox" name="agree"
               checked={form.agree} onChange={handleChange} />
        Согласен с условиями
      </label>

      {error && <p className="error">{error}</p>}
      <button disabled={!form.agree}>Зарегистрироваться</button>
    </form>
  )
}`,
    },
    notes: [
      'Контролируемый инпут: value={state} + onChange={e => setState(e.target.value)}',
      'Для чекбоксов — checked вместо value, для select — value на самом <select>',
      'Неконтролируемый: defaultValue + чтение через FormData или ref при отправке',
      'Большие формы с валидацией — React Hook Form + Zod (см. тему 24)',
    ],
  },
]

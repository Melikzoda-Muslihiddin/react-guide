export const tooling = [
  {
    slug: 'testing',
    title: 'Testing',
    desc: 'Vitest + React Testing Library',
    tags: ['Тесты', 'Качество'],
    analogy:
      'Тесты — как автоматический контролёр на конвейере. Каждый раз, когда ты что-то меняешь, он прогоняет продукт по чек-листу: «кнопка нажимается? счётчик растёт? ошибка показывается?». Сломал — узнаешь за секунды, а не от пользователя.',
    compare: {
      left: { label: 'Ручная проверка', text: 'После каждого изменения прокликиваешь всё приложение. Рано или поздно что-то пропускаешь.' },
      right: { label: '🧪 Vitest + RTL', text: 'Тесты проверяют поведение глазами пользователя: найди кнопку по тексту, кликни, проверь результат.' },
    },
    code: {
      file: 'Counter.test.jsx',
      lang: 'jsx',
      src: `// npm i -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
// vite.config.js:  test: { environment: 'jsdom', globals: true, setupFiles: './src/setup.js' }
// src/setup.js:    import '@testing-library/jest-dom/vitest'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Counter from './Counter'
import LoginForm from './LoginForm'

describe('Counter', () => {
  it('увеличивает счёт по клику', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    // Ищем как пользователь — по роли и тексту, а не по классам
    await user.click(screen.getByRole('button', { name: /\\+1/ }))

    expect(screen.getByText('Счёт: 1')).toBeInTheDocument()
  })
})

describe('LoginForm', () => {
  it('отправляет email', async () => {
    const onSubmit = vi.fn()          // мок-функция
    const user = userEvent.setup()
    render(<LoginForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Email'), 'a@b.ru')
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.ru' })
  })
})

// npx vitest           — watch-режим
// npx vitest --coverage — покрытие кода`,
    },
    notes: [
      'Vitest — тест-раннер на базе Vite (API как у Jest), RTL — рендер и поиск элементов',
      'Ищи по getByRole / getByLabelText / getByText — так же, как видит пользователь',
      'userEvent реалистичнее fireEvent: печать, клики, фокус как в браузере',
      'E2E-тесты всего приложения в реальном браузере — Playwright',
    ],
  },
  {
    slug: 'eslint-prettier',
    title: 'ESLint & Prettier',
    desc: 'Чистый код автоматически',
    tags: ['Качество', 'DX'],
    analogy:
      'ESLint — строгий редактор, который подчёркивает смысловые ошибки: «тут хук внутри if», «забыл зависимость». Prettier — верстальщик, который выравнивает отступы, кавычки и переносы, чтобы весь код команды выглядел одинаково.',
    compare: {
      left: { label: 'ESLint', text: 'Находит баги и плохие паттерны: правила хуков, неиспользуемые переменные, опасный код.' },
      right: { label: 'Prettier', text: 'Только форматирование: отступы, кавычки, точки с запятой, длина строк. Споров о стиле больше нет.' },
    },
    code: {
      file: 'eslint.config.js',
      lang: 'jsx',
      src: `// Шаблон Vite уже содержит ESLint. Flat config (ESLint 9+):
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'

export default [
  { ignores: ['dist'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',  // хуки только наверху
      'react-hooks/exhaustive-deps': 'warn',  // зависимости эффектов
      'react-refresh/only-export-components': 'warn',
    },
  },
  prettier, // отключает правила, конфликтующие с Prettier
]

// .prettierrc
// { "semi": false, "singleQuote": true, "printWidth": 90 }

// package.json → scripts
// "lint": "eslint .",  "format": "prettier --write ."`,
    },
    notes: [
      'ESLint ищет ошибки, Prettier форматирует — используются вместе',
      'eslint-plugin-react-hooks обязателен: ловит нарушения правил хуков и deps',
      'eslint-config-prettier выключает конфликтующие стилистические правила ESLint',
      'В VS Code: «Format on Save» + расширения ESLint и Prettier. Альтернатива всему — Biome',
    ],
  },
  {
    slug: 'react-devtools',
    title: 'React DevTools',
    desc: 'Отладка компонентов и производительности',
    tags: ['DX', 'Отладка'],
    analogy:
      'Обычные DevTools показывают «кирпичи» (DOM). React DevTools — рентген, который показывает «скелет» приложения: какие компоненты, с какими props и state, кто и почему перерисовался.',
    compare: {
      left: { label: 'Elements (браузер)', text: 'Видно только итоговый DOM — div в div. Непонятно, какой компонент что отрендерил и с какими данными.' },
      right: { label: '⚛ React DevTools', text: 'Дерево компонентов, props/state/хуки в реальном времени, Profiler с причинами ререндеров.' },
    },
    code: {
      file: 'debugging.jsx',
      lang: 'jsx',
      src: `// 1. Установи расширение «React Developer Tools» (Chrome / Firefox / Edge)
//    Вкладки: ⚛ Components и ⚛ Profiler

// 2. Components: выбери компонент → справа props, state, хуки.
//    Значения можно менять прямо там и смотреть, как меняется UI.

// 3. Подписи для кастомных хуков в DevTools
import { useDebugValue, useState, useEffect } from 'react'

function useOnlineStatus() {
  const [online, setOnline] = useState(true)
  useDebugValue(online ? 'Online' : 'Offline') // видно в панели
  return online
}

// 4. Profiler: ● Record → действие в UI → Stop
//    Flamegraph покажет, кто рендерился и сколько мс.
//    Settings → «Record why each component rendered» — причина ререндера.
//    Settings → «Highlight updates» — подсветка перерисовок на странице.

// 5. StrictMode — ловит баги в разработке
import { StrictMode } from 'react'
createRoot(root).render(
  <StrictMode>   {/* двойной вызов рендера и эффектов в dev */}
    <App />
  </StrictMode>
)

// 6. displayName — понятные имена в дереве
const Ctx = createContext(null)
Ctx.displayName = 'AuthContext'`,
    },
    notes: [
      'Components — дерево компонентов с props, state и хуками (можно редактировать)',
      'Profiler — запись сессии, flamegraph, причины каждого ререндера',
      'StrictMode в dev дважды вызывает рендер и эффекты — так всплывают нечистые функции',
      'useDebugValue — подпись значения кастомного хука в DevTools',
    ],
  },
  {
    slug: 'deploying',
    title: 'Deploying',
    desc: 'Деплой React-приложения',
    tags: ['DevOps', 'Прод'],
    analogy:
      'Сборка (build) — как упаковка посылки: всё лишнее выкинуто, код сжат и разложен по коробкам. Деплой — отправка на склад (CDN), откуда посылку мгновенно получит любой посетитель в любой точке мира.',
    compare: {
      left: { label: 'Dev', text: 'npm run dev — несжатый код, HMR, подробные ошибки и предупреждения React. Только для разработки.' },
      right: { label: 'Prod', text: 'npm run build — минифицированный бандл в dist/. Статика, которая хостится на любом CDN.' },
    },
    code: {
      file: 'deploy.sh',
      lang: 'bash',
      src: `# 1. Сборка
npm run build        # → dist/
npm run preview      # проверить прод-сборку локально

# 2. Переменные окружения — только с префиксом VITE_
# .env.production
VITE_API_URL=https://api.example.com
# в коде: import.meta.env.VITE_API_URL
# ⚠️ всё с VITE_ попадает в бандл — никаких секретов!

# 3. Vercel (проще всего)
npm i -g vercel
vercel               # превью
vercel --prod        # продакшен
# или: подключи GitHub-репозиторий на vercel.com → деплой на каждый push

# 4. SPA-роутинг: все пути → index.html, иначе 404 при обновлении
# vercel.json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
# Netlify: файл public/_redirects →  /*  /index.html  200

# Другие варианты: Netlify, Cloudflare Pages, GitHub Pages (base в vite.config)`,
    },
    notes: [
      'npm run build → папка dist/ со статикой; npm run preview — проверка локально',
      'Env-переменные: префикс VITE_, читаются через import.meta.env. Секреты — только на бэкенде',
      'Для SPA с роутером обязательно настрой rewrite всех путей на index.html',
      'Vercel / Netlify / Cloudflare Pages: подключи репозиторий — деплой на каждый push',
    ],
  },
  {
    slug: 'nextjs',
    title: 'Next.js',
    desc: 'Следующий шаг — React-фреймворк',
    tags: ['Фреймворк', 'Дальше'],
    analogy:
      'React — двигатель. Мощный, но чтобы поехать, нужно собрать машину: роутинг, загрузку данных, SEO, сервер. Next.js — готовый автомобиль с этим двигателем: сел и поехал, а все детали уже подобраны и настроены.',
    compare: {
      left: { label: '⚛ React + Vite', text: 'SPA: рендер в браузере, роутер и данные подключаешь сам. Идеально для дашбордов и приложений за логином.' },
      right: { label: '▲ Next.js', text: 'Файловый роутинг, Server Components, SSR/SSG, Server Actions, оптимизация картинок и шрифтов, API-роуты.' },
    },
    code: {
      file: 'app/products/[id]/page.tsx',
      lang: 'tsx',
      src: `// npx create-next-app@latest my-app
//
// app/
// ├── layout.tsx              ← общий layout
// ├── page.tsx                ← маршрут /
// └── products/[id]/page.tsx  ← маршрут /products/42

// Server Component (по умолчанию): код выполняется на сервере,
// можно сразу ходить в БД, в браузер JS не отправляется
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await db.product.findUnique({ where: { id } })

  return (
    <main>
      <h1>{product.name}</h1>
      <AddToCart id={product.id} />  {/* интерактив — Client Component */}
    </main>
  )
}

// components/AddToCart.tsx
// 'use client'
// export function AddToCart({ id }) {
//   const [added, setAdded] = useState(false)
//   return <button onClick={() => setAdded(true)}>...</button>
// }

// Всё, что ты выучил в этом гайде, работает в Next.js без изменений.`,
    },
    notes: [
      'Next.js — React + роутинг на файлах + серверный рендеринг + оптимизации',
      'Server Components по умолчанию; "use client" — для state, эффектов и событий',
      'Нужен SEO и быстрый первый экран (лендинг, блог, магазин) — Next.js',
      'Альтернативы: React Router v7 (framework mode), TanStack Start, Astro для контентных сайтов',
    ],
  },
]

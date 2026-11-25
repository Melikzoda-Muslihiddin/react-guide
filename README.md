# React Guide — React с нуля

Интерактивный справочник по React и его экосистеме на русском языке.
32 темы: основы, хуки, архитектура, экосистема (React Router, TanStack Query, Redux Toolkit,
Zustand, React Hook Form + Zod, Tailwind, shadcn/ui, Motion) и инструменты (тесты, линтеры,
DevTools, деплой).

Каждая тема — с аналогией, сравнением, примером кода и конспектом для тетради.

## Запуск

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # продакшен-сборка в dist/
```

## Добавить тему

Контент лежит в `src/data/` (`basics.js`, `hooks.js`, `advanced.js`, `ecosystem.js`, `tooling.js`).
Добавь объект с полями `slug`, `title`, `desc`, `tags`, `analogy`, `compare`, `code`, `notes` —
тема появится на главной, в сайдбаре и в навигации автоматически.

Стек: React 19 · Vite · React Router · prism-react-renderer.

import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import Topic from './pages/Topic'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<Layout />}>
        <Route path="/topics/:slug" element={<Topic />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

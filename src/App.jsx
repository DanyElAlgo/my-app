import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { supabase } from './services/auth-service'
import Login from './pages/login'
import Register from './pages/register'
import Account from './pages/account'
import Todo from './pages/todo'
import Categories from './pages/categories'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <BrowserRouter>
      <div className="container" style={{ padding: '50px 0 100px 0' }}>
        <Routes>
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!session ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={session ? <Account key={session.user.id} session={session} /> : <Navigate to="/login" />} />
          <Route path="/todo" element={session ? <Todo key={session.user.id} session={session} /> : <Navigate to="/login" />} />
          <Route path="/categories" element={session ? <Categories key={session.user.id} session={session} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
import React from 'react'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Loans from './pages/Loans.jsx'

function useAuth() {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  return { token, user: user ? JSON.parse(user) : null }
}

function Protected({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

function NavBar() {
  const { user } = useAuth()
  const nav = useNavigate()
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    nav('/login')
  }
  return (
    <nav style={{display:'flex', gap:12, padding:12, borderBottom:'1px solid #ddd'}}>
      <Link to="/">Loans</Link>
      <div style={{ marginLeft:'auto' }}>
        {user ? (
          <>
            <span style={{marginRight:8}}>Signed in as <b>{user.username}</b></span>
            <button onClick={logout}>Logout</button>
          </>
        ) : <Link to="/login">Login</Link>}
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <div>
      <NavBar />
      <div style={{padding:16}}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Protected><Loans /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

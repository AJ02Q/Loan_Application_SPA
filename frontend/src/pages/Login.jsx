import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api.js'

export default function Login() {
  const [username, setUsername] = useState('manager@branch.local')
  const [password, setPassword] = useState('Passw0rd!')
  const [error, setError] = useState(null)
  const nav = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const data = await login(username, password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      nav('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{maxWidth:420, margin:'48px auto'}}>
      <h2>Branch Manager Login</h2>
      <form onSubmit={onSubmit} style={{display:'grid', gap:12}}>
        <label> Username
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" />
        </label>
        <label> Password
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="password" />
        </label>
        {error && <div style={{color:'crimson'}}>{error}</div>}
        <button type="submit">Login</button>
      </form>
      <p style={{marginTop:12, color:'#555'}}>Use the pre-seeded test user above.</p>
    </div>
  )
}

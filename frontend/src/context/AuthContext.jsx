import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../api/client.js'

const AuthContext = createContext(null)

const readSession = () => {
  try {
    const token = localStorage.getItem('divyaSwasthToken')
    return token && token !== 'undefined' && token !== 'null'
      ? JSON.parse(localStorage.getItem('divyaSwasthUser'))
      : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)
  const [loading, setLoading] = useState(() => Boolean(readSession()))

  const saveSession = (data) => {
    localStorage.setItem('divyaSwasthToken', data.token)
    localStorage.setItem('divyaSwasthUser', JSON.stringify(data.user))
    setUser(data.user)
    setLoading(false)
  }

  const login = async (credentials) => {
    const data = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
    saveSession(data)
    return data.user
  }

  const register = async (payload) => {
    const data = await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
    saveSession(data)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('divyaSwasthToken')
    localStorage.removeItem('divyaSwasthUser')
    setUser(null)
    setLoading(false)
  }

  useEffect(() => {
    let active = true
    const syncSession = event => {
      if (!event || event.key === null || ['divyaSwasthToken', 'divyaSwasthUser'].includes(event.key)) setUser(readSession())
    }
    const syncOnFocus = () => syncSession()

    // Refresh user profile from backend if token exists
    const token = localStorage.getItem('divyaSwasthToken')
    if (token && token !== 'null' && token !== 'undefined') {
      apiRequest('/auth/profile')
        .then(res => {
          if (active && localStorage.getItem('divyaSwasthToken') === token && res?.user) {
            localStorage.setItem('divyaSwasthUser', JSON.stringify(res.user))
            setUser(res.user)
          }
        })
        .catch(() => {})
        .finally(() => { if (active) setLoading(false) })
    }

    window.addEventListener('divya-auth-expired', logout)
    window.addEventListener('storage', syncSession)
    window.addEventListener('focus', syncOnFocus)
    return () => {
      active = false
      window.removeEventListener('divya-auth-expired', logout)
      window.removeEventListener('storage', syncSession)
      window.removeEventListener('focus', syncOnFocus)
    }
  }, [])

  const value = { user, loading, login, register, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

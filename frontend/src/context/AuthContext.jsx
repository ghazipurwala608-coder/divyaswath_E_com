import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('divyaSwasthUser'))
    } catch {
      return null
    }
  })

  const saveSession = (data) => {
    localStorage.setItem('divyaSwasthToken', data.token)
    localStorage.setItem('divyaSwasthUser', JSON.stringify(data.user))
    setUser(data.user)
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
  }

  useEffect(() => {
    window.addEventListener('divya-auth-expired', logout)
    return () => window.removeEventListener('divya-auth-expired', logout)
  }, [])

  const value = { user, login, register, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

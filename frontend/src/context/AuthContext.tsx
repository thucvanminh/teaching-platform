import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import api from '../lib/api'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (identifier: string, password: string) => Promise<void>
  signUp: (email: string, username: string, password: string, fullName: string, role: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    setLoading(false)
  }, [])

  async function signIn(identifier: string, password: string) {
    const { data } = await api.post('/api/auth/login', { identifier, password })
    const userData = {
      id: data.user.id,
      email: data.user.email,
      username: data.user.username,
      fullName: data.user.fullName,
      role: data.user.role
    }
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('access_token', data.accessToken)
    setUser(userData)
  }

  async function signUp(email: string, username: string, password: string, fullName: string, role: string) {
    await api.post('/api/auth/register', { email, username, password, fullName, role })
  }

  function signOut() {
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider')
  return context
}

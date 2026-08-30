import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (identifier: string, password: string) => Promise<void>
  signUp: (email: string, username: string, password: string, fullName: string, role: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function createUserFromSession(sessionUser: any): User {
  const meta = sessionUser.user_metadata || {}
  return {
    id: sessionUser.id,
    email: sessionUser.email || '',
    username: meta.username || '',
    fullName: meta.full_name || meta.fullName || sessionUser.email || '',
    role: meta.role || 'student',
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(sessionUser: any) {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .maybeSingle()

      if (profile) {
        setUser({
          id: sessionUser.id,
          email: sessionUser.email || '',
          username: profile.username || sessionUser.user_metadata?.username || '',
          fullName: profile.full_name || sessionUser.user_metadata?.full_name || sessionUser.email || '',
          role: profile.role || sessionUser.user_metadata?.role || 'student',
        })
      }
    } catch (err) {
      console.error('Error loading profile:', err)
    }
  }

  useEffect(() => {
    let isMounted = true

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user && isMounted) {
          const initialUser = createUserFromSession(session.user)
          setUser(initialUser)
          await loadProfile(session.user)
        }
      } catch (err) {
        console.error('Error initializing auth session:', err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const initialUser = createUserFromSession(session.user)
        setUser(initialUser)
        await loadProfile(session.user)
        if (isMounted) setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setUser(null)
          setLoading(false)
        }
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signIn(identifier: string, password: string) {
    let email = identifier.trim()

    if (!email.includes('@')) {
      email = `${email.toLowerCase()}@teachflow.test`
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    if (data.user) {
      const initialUser = createUserFromSession(data.user)
      setUser(initialUser)
      await loadProfile(data.user)
    }
  }

  async function signUp(email: string, username: string, password: string, fullName: string, role: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, full_name: fullName, role },
      },
    })
    if (error) throw error

    if (data.user) {
      await supabase.from('user_profiles').insert({
        id: data.user.id,
        username: username.toLowerCase(),
        full_name: fullName,
        role,
      })
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
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

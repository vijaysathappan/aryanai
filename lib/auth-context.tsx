'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  plan: 'free' | 'pro' | 'enterprise'
  tokensUsed: number
  tokenLimit: number
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
  updatePlan: (plan: 'free' | 'pro' | 'enterprise') => void
  addTokens: (count: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// In-memory user store (would be a database in production)
const userStore = new Map<string, { user: User; password: string }>()

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const signIn = useCallback(async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 800))
    const stored = userStore.get(email)
    if (!stored) {
      return { success: false, error: 'No account found with this email' }
    }
    if (stored.password !== password) {
      return { success: false, error: 'Incorrect password' }
    }
    setUser(stored.user)
    return { success: true }
  }, [])

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    await new Promise(r => setTimeout(r, 800))
    if (userStore.has(email)) {
      return { success: false, error: 'An account with this email already exists' }
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      plan: 'free',
      tokensUsed: 0,
      tokenLimit: 10000,
      createdAt: new Date().toISOString(),
    }
    userStore.set(email, { user: newUser, password })
    setUser(newUser)
    return { success: true }
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
  }, [])

  const updatePlan = useCallback((plan: 'free' | 'pro' | 'enterprise') => {
    setUser(prev => {
      if (!prev) return prev
      const limits = { free: 10000, pro: 100000, enterprise: 1000000 }
      const updated = { ...prev, plan, tokenLimit: limits[plan] }
      const stored = userStore.get(prev.email)
      if (stored) {
        userStore.set(prev.email, { ...stored, user: updated })
      }
      return updated
    })
  }, [])

  const addTokens = useCallback((count: number) => {
    setUser(prev => {
      if (!prev) return prev
      const updated = { ...prev, tokensUsed: prev.tokensUsed + count }
      const stored = userStore.get(prev.email)
      if (stored) {
        userStore.set(prev.email, { ...stored, user: updated })
      }
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signUp, signOut, updatePlan, addTokens }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

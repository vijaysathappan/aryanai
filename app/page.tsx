'use client'

import { useState, useCallback } from 'react'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import { LoadingScreen } from '@/components/loading-screen'
import { AuthPage } from '@/components/auth-page'
import { ChatApp } from '@/components/chat-app'

function AppContent() {
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()

  const handleLoadingComplete = useCallback(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  if (!isAuthenticated) {
    return <AuthPage />
  }

  return <ChatApp />
}

export default function Page() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

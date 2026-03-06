'use client'

import { useState } from 'react'
import { AriyanLogo } from './ariyan-logo'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signin') {
        const result = await signIn(email, password)
        if (!result.success) setError(result.error || 'Sign in failed')
      } else {
        if (!name.trim()) {
          setError('Please enter your name')
          setLoading(false)
          return
        }
        const result = await signUp(name, email, password)
        if (!result.success) setError(result.error || 'Sign up failed')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    setError('')
    setName('')
    setEmail('')
    setPassword('')
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-background" />
        <div className="relative z-10 flex flex-col items-center gap-8 px-12">
          <AriyanLogo size={160} animated showText={false} />
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              Ariyan AI
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
              Experience the next generation of AI-powered intelligence. Think faster, create better.
            </p>
          </div>
          <div className="flex gap-8 mt-4">
            {[
              { label: 'Models', value: '10+' },
              { label: 'Users', value: '50K+' },
              { label: 'Uptime', value: '99.9%' },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl font-semibold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center gap-4 mb-10">
            <AriyanLogo size={72} animated showText={false} />
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Ariyan AI</h1>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-semibold text-foreground">
                {mode === 'signin' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'signin'
                  ? 'Sign in to continue to Ariyan AI'
                  : 'Get started with Ariyan AI for free'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === 'signup' && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-foreground/20 focus-visible:border-foreground/30"
                    required
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-foreground/20 focus-visible:border-foreground/30"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground pr-10 focus-visible:ring-foreground/20 focus-visible:border-foreground/30"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive animate-fade-up">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-11 bg-foreground text-background hover:bg-foreground/90 font-medium mt-1"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    {mode === 'signin' ? 'Sign in' : 'Create account'}
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-3 text-muted-foreground">
                  {mode === 'signin' ? 'New to Ariyan AI?' : 'Already have an account?'}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={switchMode}
              className="h-11 border-border text-foreground hover:bg-secondary"
            >
              {mode === 'signin' ? 'Create an account' : 'Sign in instead'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

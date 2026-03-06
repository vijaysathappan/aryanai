'use client'

import { useEffect, useState } from 'react'
import { AriyanLogo } from './ariyan-logo'

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setFadeOut(true)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 150)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-8">
        <AriyanLogo size={120} animated showText={false} />

        <div className="flex flex-col items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-wide text-foreground font-sans">
            Ariyan AI
          </h1>
          <p className="text-sm text-muted-foreground tracking-wider uppercase">
            Advanced Intelligence
          </p>
        </div>

        <div className="w-48 flex flex-col items-center gap-2">
          <div className="w-full h-0.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-foreground/60 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-mono tabular-nums">
            {Math.min(Math.round(progress), 100)}%
          </span>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'

interface AriyanLogoProps {
  size?: number
  animated?: boolean
  showText?: boolean
  className?: string
}

export function AriyanLogo({ size = 48, animated = true, showText = false, className = '' }: AriyanLogoProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const nodes = [
    // Left hemisphere nodes
    { cx: 18, cy: 22, r: 2.2 },
    { cx: 12, cy: 30, r: 1.8 },
    { cx: 22, cy: 14, r: 2 },
    { cx: 10, cy: 40, r: 1.6 },
    { cx: 16, cy: 48, r: 2.2 },
    { cx: 24, cy: 38, r: 1.8 },
    { cx: 20, cy: 56, r: 2 },
    { cx: 8, cy: 52, r: 1.6 },
    { cx: 28, cy: 28, r: 2 },
    { cx: 14, cy: 16, r: 1.6 },
    { cx: 26, cy: 48, r: 1.8 },
    { cx: 6, cy: 36, r: 1.4 },
    // Right hemisphere nodes
    { cx: 62, cy: 22, r: 2.2 },
    { cx: 68, cy: 30, r: 1.8 },
    { cx: 58, cy: 14, r: 2 },
    { cx: 70, cy: 40, r: 1.6 },
    { cx: 64, cy: 48, r: 2.2 },
    { cx: 56, cy: 38, r: 1.8 },
    { cx: 60, cy: 56, r: 2 },
    { cx: 72, cy: 52, r: 1.6 },
    { cx: 52, cy: 28, r: 2 },
    { cx: 66, cy: 16, r: 1.6 },
    { cx: 54, cy: 48, r: 1.8 },
    { cx: 74, cy: 36, r: 1.4 },
    // Central spine
    { cx: 40, cy: 10, r: 2.4 },
    { cx: 40, cy: 24, r: 2 },
    { cx: 40, cy: 38, r: 2.2 },
    { cx: 40, cy: 52, r: 2 },
    { cx: 40, cy: 64, r: 1.8 },
  ]

  const connections = [
    // Left hemisphere connections
    [0, 2], [0, 8], [1, 0], [1, 3], [1, 5],
    [2, 9], [3, 7], [3, 4], [4, 5], [4, 6],
    [5, 8], [5, 10], [6, 7], [6, 10], [9, 11],
    [1, 11], [3, 11],
    // Right hemisphere connections
    [12, 14], [12, 20], [13, 12], [13, 15], [13, 17],
    [14, 21], [15, 19], [15, 16], [16, 17], [16, 18],
    [17, 20], [17, 22], [18, 19], [18, 22], [21, 23],
    [13, 23], [15, 23],
    // Cross connections (through central spine)
    [0, 25], [2, 24], [8, 25], [5, 26],
    [4, 27], [6, 27], [10, 26],
    [12, 25], [14, 24], [20, 25], [17, 26],
    [16, 27], [18, 27], [22, 26],
    // Central spine connections
    [24, 25], [25, 26], [26, 27], [27, 28],
  ]

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={animated && mounted ? 'animate-float' : ''}
      >
        {/* Glow filter */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="nodeGrad" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#a0a0a0" />
          </radialGradient>
        </defs>

        {/* Connections */}
        {connections.map(([from, to], i) => (
          <line
            key={`conn-${i}`}
            x1={nodes[from].cx}
            y1={nodes[from].cy}
            x2={nodes[to].cx}
            y2={nodes[to].cy}
            stroke="url(#nodeGrad)"
            strokeWidth="0.5"
            opacity={mounted && animated ? 0.35 : 0.25}
            className={animated && mounted ? 'animate-neural-draw' : ''}
            style={animated ? { animationDelay: `${i * 30}ms` } : {}}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            <circle
              cx={node.cx}
              cy={node.cy}
              r={node.r * 1.8}
              fill="white"
              opacity={0.05}
              className={animated && mounted ? 'animate-pulse-glow' : ''}
              style={animated ? { animationDelay: `${i * 100}ms` } : {}}
            />
            <circle
              cx={node.cx}
              cy={node.cy}
              r={node.r}
              fill="url(#nodeGrad)"
              filter="url(#glow)"
              opacity={mounted ? 0.9 : 0.5}
            />
          </g>
        ))}

        {/* Central line accent */}
        <line
          x1="40" y1="8" x2="40" y2="66"
          stroke="url(#nodeGrad)"
          strokeWidth="0.8"
          opacity="0.2"
        />
      </svg>

      {showText && (
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-foreground font-sans font-semibold tracking-wide" style={{ fontSize: size * 0.3 }}>
            Ariyan AI
          </span>
        </div>
      )}
    </div>
  )
}

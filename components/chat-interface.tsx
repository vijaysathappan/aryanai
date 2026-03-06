'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { AriyanLogo } from './ariyan-logo'
import { useAuth } from '@/lib/auth-context'
import { useChat } from '../hooks/useChat'
import { ChatMessage } from '../types/chat'
import { Button } from '@/components/ui/button'
import {
  Menu
} from 'lucide-react'

// Import our newly created scalable components
import { ChatInput } from './chat-input'
import { MessageBubble } from './message-bubble'

interface AIModel {
  id: string
  label: string
  provider: string
}

interface ChatInterfaceProps {
  onToggleSidebar: () => void
  models: AIModel[]
  selectedModel: AIModel
  onModelChange: (model: AIModel) => void
}

const ARIYAN_NAMES = [
  { text: 'Ariyan', lang: 'English' },
  { text: '\u0B85\u0BB0\u0BBF\u0BAF\u0BA9\u0BCD', lang: 'Tamil' },
  { text: '\u0906\u0930\u093F\u092F\u0928', lang: 'Hindi' },
]

function TypewriterName() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing')

  useEffect(() => {
    const current = ARIYAN_NAMES[currentIndex]

    if (phase === 'typing') {
      if (displayText.length < current.text.length) {
        const timeout = setTimeout(() => {
          setDisplayText(current.text.slice(0, displayText.length + 1))
        }, 100)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => setPhase('pausing'), 1800)
        return () => clearTimeout(timeout)
      }
    }

    if (phase === 'pausing') {
      const timeout = setTimeout(() => setPhase('deleting'), 200)
      return () => clearTimeout(timeout)
    }

    if (phase === 'deleting') {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 60)
        return () => clearTimeout(timeout)
      } else {
        setCurrentIndex((prev) => (prev + 1) % ARIYAN_NAMES.length)
        setPhase('typing')
      }
    }
  }, [displayText, phase, currentIndex])

  return (
    <span className="inline-flex items-baseline">
      <style>{`
        @keyframes flag-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-flag {
          background-size: 200% auto;
          animation: flag-gradient 4s ease infinite;
        }
      `}</style>
      <span className="bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] animate-flag bg-clip-text text-transparent drop-shadow-sm">
        {displayText}
      </span>
      <span className="inline-block w-[2px] h-[1.1em] bg-foreground/70 animate-pulse ml-0.5" />
    </span>
  )
}



function StreamingIndicator() {
  return (
    <div className="flex gap-4 group animate-fade-in-up w-full mt-2">
      <div className="size-8 rounded-full bg-background border border-border flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
        <AriyanLogo size={20} animated={true} />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex gap-1 items-center h-4">
          <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}

export function ChatInterface({
  onToggleSidebar,
  models,
  selectedModel,
  onModelChange,
}: ChatInterfaceProps) {
  const { messages, sendMessage, isStreaming } = useChat()
  const { user } = useAuth()

  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isStreaming, scrollToBottom])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return
    sendMessage(input.trim())
    setInput('')
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full w-full bg-background/95 relative">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-14 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
        <Button variant="ghost" size="icon-sm" onClick={onToggleSidebar} className="text-muted-foreground hover:text-foreground">
          <Menu className="size-[18px]" />
        </Button>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto relative scroll-smooth flex flex-col">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center flex-1 w-full px-4 sm:px-6 py-8 md:py-12 max-w-4xl mx-auto overflow-x-hidden animate-fade-in-up">
            <div className="w-full text-center sm:text-left mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-3 text-foreground/90">
                Welcome, <span className="font-semibold text-foreground">{user?.name || 'Commander'}</span>.<br className="hidden sm:block" />
                <span className="text-muted-foreground/70 text-2xl sm:text-4xl mt-3 block font-medium">I am <TypewriterName /></span>
              </h2>
              <p className="text-sm sm:text-[17px] text-muted-foreground max-w-2xl sm:mr-auto mx-auto sm:ml-0 mt-5 leading-relaxed">
                The multi-agent orchestration engine is online. Enter a prompt below to deploy your agents and begin analysis.
              </p>
            </div>

            <div className="w-full mb-4">
              <ChatInput
                input={input}
                setInput={setInput}
                onSubmit={handleSubmit}
                isStreaming={isStreaming}
                sendMessage={sendMessage}
                models={models}
                selectedModel={selectedModel}
                onModelChange={onModelChange}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-3xl w-full mx-auto px-4 py-8 flex flex-col gap-8 pb-8">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isStreaming && <StreamingIndicator />}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Footer Input Area (Only visible when chat has started) */}
      {!isEmpty && (
        <div className="shrink-0 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-2">
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            isStreaming={isStreaming}
            sendMessage={sendMessage}
            models={models}
            selectedModel={selectedModel}
            onModelChange={onModelChange}
          />
        </div>
      )}
    </div>
  )
}
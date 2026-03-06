// 'use client'

// import { useState, useCallback } from 'react'
// import { useChat } from '@ai-sdk/react'
// import { DefaultChatTransport } from 'ai'
// import { useAuth } from '@/lib/auth-context'
// import { ChatSidebar } from './chat-sidebar'
// import { ChatInterface } from './chat-interface'
// import { SettingsPanel } from './settings-panel'

// interface ChatHistoryItem {
//   id: string
//   title: string
//   date: string
// }

// function getTextFromParts(parts: Array<{ type: string; text?: string }>): string {
//   return parts
//     .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
//     .map(p => p.text)
//     .join('')
// }

// const AI_MODELS = [
//   { id: 'openai/gpt-5-mini', label: 'GPT-5 Mini', provider: 'OpenAI' },
//   { id: 'openai/gpt-5', label: 'GPT-5', provider: 'OpenAI' },
//   { id: 'anthropic/claude-opus-4.6', label: 'Claude Opus 4.6', provider: 'Anthropic' },
// ]

// export function ChatApp() {
//   const { addTokens } = useAuth()
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [settingsOpen, setSettingsOpen] = useState(false)
//   const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([])
//   const [activeChatId, setActiveChatId] = useState<string | null>(null)
//   const [input, setInput] = useState('')
//   const [selectedModel, setSelectedModel] = useState(AI_MODELS[0])

//   const { messages, sendMessage, status, setMessages } = useChat({
//     transport: new DefaultChatTransport({
//       api: '/api/chat',
//       prepareSendMessagesRequest: ({ id, messages }) => ({
//         body: { messages, id, model: selectedModel.id },
//       }),
//     }),
//     onFinish: () => {
//       const tokenCount = Math.floor(Math.random() * 500) + 100
//       addTokens(tokenCount)
//     },
//   })

//   const isStreaming = status === 'streaming' || status === 'submitted'

//   const handleSendMessage = useCallback(
//     (text: string) => {
//       sendMessage({ text })
//       setInput('')

//       // Update chat history
//       if (!activeChatId) {
//         const newId = crypto.randomUUID()
//         const title = text.length > 40 ? text.slice(0, 40) + '...' : text
//         setChatHistory(prev => [
//           { id: newId, title, date: new Date().toISOString() },
//           ...prev,
//         ])
//         setActiveChatId(newId)
//       }
//     },
//     [sendMessage, activeChatId, addTokens],
//   )

//   const handleNewChat = useCallback(() => {
//     setMessages([])
//     setActiveChatId(null)
//     setSidebarOpen(false)
//   }, [setMessages])

//   const handleSelectChat = useCallback(
//     (id: string) => {
//       setActiveChatId(id)
//       setSidebarOpen(false)
//     },
//     [],
//   )

//   const handleDeleteChat = useCallback(
//     (id: string) => {
//       setChatHistory(prev => prev.filter(c => c.id !== id))
//       if (activeChatId === id) {
//         setMessages([])
//         setActiveChatId(null)
//       }
//     },
//     [activeChatId, setMessages],
//   )

//   // Convert AI SDK messages to our interface format
//   const formattedMessages = messages.map(msg => ({
//     id: msg.id,
//     role: msg.role as 'user' | 'assistant',
//     content: getTextFromParts(msg.parts as Array<{ type: string; text?: string }>),
//     timestamp: new Date(),
//   }))

//   return (
//     <div className="h-screen w-full flex bg-background overflow-hidden">
//       <ChatSidebar
//         isOpen={sidebarOpen}
//         onToggle={() => setSidebarOpen(!sidebarOpen)}
//         onNewChat={handleNewChat}
//         onOpenSettings={() => {
//           setSettingsOpen(true)
//           setSidebarOpen(false)
//         }}
//         chatHistory={chatHistory}
//         activeChatId={activeChatId}
//         onSelectChat={handleSelectChat}
//         onDeleteChat={handleDeleteChat}
//       />

//       <main
//       className={`flex-1 flex flex-col transition-all duration-300 ${
//         sidebarOpen ? 'lg:ml-72' : 'lg:ml-0'
//       }`}
//       >
//         <ChatInterface
//           messages={formattedMessages}
//           onSendMessage={handleSendMessage}
//           isStreaming={isStreaming}
//           onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
//           models={AI_MODELS}
//           selectedModel={selectedModel}
//           onModelChange={setSelectedModel}
//         />
//       </main>

//       <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
//     </div>
//   )
// }

'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useAuth } from '@/lib/auth-context'
import { ChatSidebar } from './chat-sidebar'
import { ChatInterface } from './chat-interface'
import { SettingsPanel } from './settings-panel'
import { PanelLeft } from 'lucide-react'

interface ChatHistoryItem {
  id: string
  title: string
  date: string
}

function getTextFromParts(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map(p => p.text)
    .join('')
}

const AI_MODELS = [
  { id: 'openai/gpt-4o', label: 'GPT-4o', provider: 'OpenAI' },
  { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini', provider: 'OpenAI' },
  { id: 'openai/gpt-5-mini', label: 'GPT-5 Mini', provider: 'OpenAI' },
  { id: 'openai/gpt-5', label: 'GPT-5', provider: 'OpenAI' },
  { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'anthropic/claude-opus-4.6', label: 'Claude Opus 4.6', provider: 'Anthropic' },
  { id: 'google/gemini-1.5-pro', label: 'Gemini 1.5 Pro', provider: 'Google' },
  { id: 'google/gemini-1.5-flash', label: 'Gemini 1.5 Flash', provider: 'Google' },
  { id: 'meta/llama-3-70b', label: 'Llama 3 70B', provider: 'Meta' },
]

export function ChatApp() {
  const { addTokens } = useAuth()

  const [collapsed, setCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(288)
  const isResizing = useRef(false)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0])

  // Auto collapse mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Resize logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return
      setSidebarWidth(Math.min(Math.max(e.clientX, 220), 420))
    }

    const handleMouseUp = () => {
      isResizing.current = false
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: { messages, id, model: selectedModel.id },
      }),
    }),
    onFinish: () => {
      const tokenCount = Math.floor(Math.random() * 500) + 100
      addTokens(tokenCount)
    },
  })

  const isStreaming = status === 'streaming' || status === 'submitted'

  const handleSendMessage = useCallback(
    (text: string) => {
      sendMessage({ text })
      setInput('')

      if (!activeChatId) {
        const newId = crypto.randomUUID()
        const title = text.length > 40 ? text.slice(0, 40) + '...' : text
        setChatHistory(prev => [
          { id: newId, title, date: new Date().toISOString() },
          ...prev,
        ])
        setActiveChatId(newId)
      }
    },
    [sendMessage, activeChatId],
  )

  const formattedMessages = messages.map(msg => ({
    id: msg.id,
    role: msg.role as 'user' | 'assistant',
    content: getTextFromParts(msg.parts as Array<{ type: string; text?: string }>),
    timestamp: new Date(),
  }))

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">

      {/* -------- Sidebar (Flex-based, NOT margin-based) -------- */}
      <aside
        style={{ width: collapsed ? 0 : sidebarWidth }}
        className={`relative transition-all duration-300 ease-in-out
        ${collapsed ? 'opacity-0' : 'opacity-100'}
        border-r border-border bg-card shadow-xl shrink-0`}
      >
        {!collapsed && (
          <ChatSidebar
            isOpen
            onToggle={() => setCollapsed(true)}
            onNewChat={() => {
              setMessages([])
              setActiveChatId(null)
            }}
            onOpenSettings={() => setSettingsOpen(true)}
            chatHistory={chatHistory}
            activeChatId={activeChatId}
            onSelectChat={setActiveChatId}
            onDeleteChat={(id) => {
              setChatHistory(prev => prev.filter(c => c.id !== id))
            }}
          />
        )}

        {!collapsed && (
          <div
            onMouseDown={() => (isResizing.current = true)}
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-foreground/20"
          />
        )}
      </aside>

      {/* -------- Main Chat -------- */}
      <main className="flex-1 min-w-0 flex flex-col relative">

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-md hover:bg-accent transition"
        >
          <PanelLeft className="size-4" />
        </button>

        <ChatInterface
          messages={formattedMessages}
          onSendMessage={handleSendMessage}
          isStreaming={isStreaming}
          onToggleSidebar={() => setCollapsed(!collapsed)}
          models={AI_MODELS}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </main>

      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

    </div>
  )
}
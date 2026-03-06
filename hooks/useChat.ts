// 'use client'

// import { useState, useCallback } from 'react'
// import { ChatMessage } from '../types/chat'

// function generateId() {
//   return crypto.randomUUID()
// }

// export function useChat() {
//   const [messages, setMessages] = useState<ChatMessage[]>([])
//   const [isStreaming, setIsStreaming] = useState(false)

//   const addMessage = useCallback((message: ChatMessage) => {
//     setMessages(prev => [...prev, message])
//   }, [])

//   const updateMessage = useCallback((id: string, content: string) => {
//     setMessages(prev =>
//       prev.map(msg =>
//         msg.id === id ? { ...msg, content } : msg
//       )
//     )
//   }, [])

//   const sendMessage = async (input: string) => {
//     const userMessage: ChatMessage = {
//       id: generateId(),
//       role: 'user',
//       content: input,
//       type: 'text',
//       createdAt: new Date(),
//     }

//     addMessage(userMessage)

//     const assistantId = generateId()

//     const assistantMessage: ChatMessage = {
//       id: assistantId,
//       role: 'assistant',
//       content: '',
//       type: 'stream',
//       createdAt: new Date(),
//     }

//     addMessage(assistantMessage)
//     setIsStreaming(true)

//     // Simulated streaming (replace later with SSE / API call)
//     const fakeResponse = "This is a streaming AI response..."
//     let current = ''

//     for (const char of fakeResponse) {
//       await new Promise(res => setTimeout(res, 15))
//       current += char
//       updateMessage(assistantId, current)
//     }

//     setIsStreaming(false)
//   }

//   return {
//     messages,
//     isStreaming,
//     sendMessage,
//   }
// }

'use client'

import { useState, useCallback } from 'react'
import { ChatMessage } from '../types/chat'

function generateId() {
  return crypto.randomUUID()
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message])
  }, [])

  const updateMessage = useCallback((id: string, updates: Partial<ChatMessage>) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id ? { ...msg, ...updates } : msg
      )
    )
  }, [])

  const sendMessage = async (input: string) => {
    // 1️⃣ Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: input,
      type: 'text',
      createdAt: new Date(),
    }

    addMessage(userMessage)

    // 2️⃣ Simulate Tool Call (example)
    const toolId = generateId()

    const toolMessage: ChatMessage = {
      id: toolId,
      role: 'assistant',
      content: '',
      type: 'tool',
      createdAt: new Date(),
      metadata: {
        toolName: 'web_search',
        status: 'running',
      },
    }

    addMessage(toolMessage)

    // Simulate tool delay
    await new Promise(res => setTimeout(res, 1500))

    updateMessage(toolId, {
      metadata: {
        toolName: 'web_search',
        status: 'completed',
      },
    })

    // 3️⃣ Add assistant streaming message
    const assistantId = generateId()

    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      type: 'stream',
      createdAt: new Date(),
    }

    addMessage(assistantMessage)
    setIsStreaming(true)

    const fakeResponse = "This is a streaming AI response after tool execution."

    let current = ''

    for (const char of fakeResponse) {
      await new Promise(res => setTimeout(res, 20))
      current += char
      updateMessage(assistantId, { content: current })
    }

    setIsStreaming(false)
  }

  return {
    messages,
    isStreaming,
    sendMessage,
  }
}
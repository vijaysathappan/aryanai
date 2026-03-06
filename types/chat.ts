// export type MessageRole = 'user' | 'assistant' | 'system'

// export type MessageType =
//   | 'text'
//   | 'tool'
//   | 'system'
//   | 'file'
//   | 'error'
//   | 'stream'

// export interface ChatMessage {
//   id: string
//   role: MessageRole
//   content: string
//   type: MessageType
//   createdAt: Date
//   metadata?: {
//     toolName?: string
//     fileName?: string
//     status?: 'pending' | 'running' | 'completed'
//   }
// }

export type MessageRole = 'user' | 'assistant' | 'system'

export type MessageType =
  | 'text'
  | 'tool'
  | 'system'
  | 'file'
  | 'error'
  | 'stream'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  type: MessageType
  createdAt: Date
  metadata?: {
    toolName?: string
    fileName?: string
    status?: 'pending' | 'running' | 'completed'
  }
}
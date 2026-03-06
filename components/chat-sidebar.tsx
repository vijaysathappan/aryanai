'use client'

import { useState } from 'react'
import { AriyanLogo } from './ariyan-logo'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import {
  Plus,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  Search,
  Trash2,
} from 'lucide-react'

interface ChatHistory {
  id: string
  title: string
  date: string
}

interface ChatSidebarProps {
  isOpen: boolean
  onToggle: () => void
  onNewChat: () => void
  onOpenSettings: () => void
  chatHistory: ChatHistory[]
  activeChatId: string | null
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
}

export function ChatSidebar({
  isOpen,
  onToggle,
  onNewChat,
  onOpenSettings,
  chatHistory,
  activeChatId,
  onSelectChat,
  onDeleteChat,
}: ChatSidebarProps) {
  const { user, signOut } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredChat, setHoveredChat] = useState<string | null>(null)

  const filteredHistory = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const grouped = filteredHistory.reduce(
    (acc, chat) => {
      const chatDate = new Date(chat.date)
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - chatDate.getTime()) / (1000 * 60 * 60 * 24))

      let group = 'Older'
      if (diffDays === 0) group = 'Today'
      else if (diffDays === 1) group = 'Yesterday'
      else if (diffDays <= 7) group = 'This Week'
      else if (diffDays <= 30) group = 'This Month'

      if (!acc[group]) acc[group] = []
      acc[group].push(chat)
      return acc
    },
    {} as Record<string, ChatHistory[]>,
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-full w-72 min-w-[280px] shrink-0 flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0">
          <AriyanLogo size={26} animated={false} />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground tracking-wide mr-1">Ariyan AI</span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggle}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close sidebar"
            >
              <ChevronLeft className="size-4" />
            </Button>
          </div>
        </div>

        {/* New chat button */}
        <div className="px-3 pt-3 shrink-0">
          <Button
            onClick={onNewChat}
            className="w-full h-9 bg-secondary hover:bg-accent text-secondary-foreground border border-border gap-2 text-sm font-medium"
            variant="outline"
          >
            <Plus className="size-4" />
            New Chat
          </Button>
        </div>

        {/* Search */}
        <div className="px-3 pt-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/20 transition-colors"
            />
          </div>
        </div>

        {/* Chat history */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {Object.entries(grouped).map(([group, chats]) => (
            <div key={group} className="mb-4">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-2 mb-1.5">
                {group}
              </p>
              {chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  onMouseEnter={() => setHoveredChat(chat.id)}
                  onMouseLeave={() => setHoveredChat(null)}
                  className={`w-full flex items-center gap-2 px-2 py-2 rounded-md text-left text-sm transition-colors group ${activeChatId === chat.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                >
                  <MessageSquare className="size-3.5 shrink-0 opacity-50" />
                  <span className="truncate flex-1 text-xs">{chat.title}</span>
                  {hoveredChat === chat.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteChat(chat.id)
                      }}
                      className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label={`Delete chat: ${chat.title}`}
                    >
                      <Trash2 className="size-3" />
                    </button>
                  )}
                </button>
              ))}
            </div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <MessageSquare className="size-8 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">
                {searchQuery ? 'No chats found' : 'No conversations yet'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-3 py-3 shrink-0 flex flex-col gap-1.5">
          <Button
            variant="ghost"
            onClick={onOpenSettings}
            className="w-full justify-start gap-2 text-xs h-8 text-muted-foreground hover:text-foreground"
          >
            <Settings className="size-3.5" />
            Settings
          </Button>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="size-7 rounded-full bg-accent flex items-center justify-center text-xs font-medium text-accent-foreground">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={signOut}
              className="text-muted-foreground hover:text-foreground shrink-0"
              aria-label="Sign out"
            >
              <LogOut className="size-3.5" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

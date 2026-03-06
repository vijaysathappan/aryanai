'use client'

import React, { useState } from 'react'
import { AriyanLogo } from './ariyan-logo'
import { ChatMessage } from '../types/chat'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check, RotateCcw, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function MessageBubble({ message }: { message: ChatMessage }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  if (message.type === 'tool') {
    return (
      <div className="flex gap-4 group animate-fade-in-up">
        {/* Agent Avatar */}
        <div className="size-8 rounded-full bg-muted flex items-center justify-center border border-border shrink-0 mt-1 shadow-sm">
          <Wrench className="size-4 text-muted-foreground" />
        </div>

        <div className="flex-1 bg-muted/40 border border-border/50 rounded-2xl rounded-tl-sm p-4 w-fit max-w-[85%] transition-all">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-foreground/80 tracking-wide uppercase">
              Agent Tool Call
            </span>
            <span className="text-xs text-muted-foreground bg-background border px-2 py-0.5 rounded-full">
              {message.metadata?.toolName || 'Unknown Tool'}
            </span>
          </div>

          <div className="text-sm font-mono text-muted-foreground bg-background/50 rounded-md p-2 border border-border/30 overflow-x-auto">
            Status: {message.metadata?.status || 'Running...'}
          </div>
        </div>
      </div>
    )
  }

  if (message.role === 'user') {
    return (
      <div className="flex justify-end group animate-fade-in-up">
        <div className="bg-foreground text-background rounded-[24px] rounded-br-[8px] px-5 py-3 max-w-[75%] sm:max-w-[70%] shadow-sm">
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4 group animate-fade-in-up w-full">
      <div className="size-8 rounded-full bg-background border border-border flex items-center justify-center shrink-0 mt-1 shadow-sm overflow-hidden">
        <AriyanLogo size={20} animated={false} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold mb-1 text-foreground/80">Ariyan AI</div>
        
        <div className="prose prose-slate dark:prose-invert max-w-none text-[15px] leading-relaxed break-words
          prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent prose-pre:m-0">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '')
                const codeString = String(children).replace(/\n$/, '')

                if (!inline && match) {
                  return (
                    <div className="relative group/code mt-4 mb-4 rounded-xl overflow-hidden border border-border/50 bg-[#1e1e1e] shadow-sm">
                      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/50">
                        <span className="text-xs font-mono text-muted-foreground lowercase">{match[1]}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(codeString)}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Copy className="size-3" />
                          <span>Copy code</span>
                        </button>
                      </div>
                      <div className="p-4 overflow-x-auto text-[13px]">
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
                          {...props}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  )
                }

                return (
                  <code className="bg-muted px-1.5 py-0.5 rounded-md text-[13px] font-mono border border-border/50 text-foreground" {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        
        <div className="flex gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="size-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground" onClick={copyToClipboard}>
            {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="size-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

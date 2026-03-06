'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Paperclip, Send, Square, ChevronDown, Check, Sparkles, Globe, Database, Terminal, LayoutPanelTop, Shield, Bug, Server, Search, Briefcase, PenTool, Cpu, Code, Mic, FileText, Image, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadFile } from '@/lib/upload-handler'

const SYSTEM_MODULES = [
  { id: 'research', icon: Globe, label: 'Web Researcher', status: 'Online', color: 'text-blue-400', bg: 'bg-blue-400/10', category: 'Research & Data' },
  { id: 'data', icon: Database, label: 'Data Analyst', status: 'Standby', color: 'text-purple-400', bg: 'bg-purple-400/10', category: 'Research & Data' },
  { id: 'code', icon: Code, label: 'Code Architect', status: 'Active', color: 'text-[#138808]', bg: 'bg-[#138808]/10', category: 'Engineering' },
  { id: 'exec', icon: Terminal, label: 'Local Executor', status: 'Ready', color: 'text-[#FF9933]', bg: 'bg-[#FF9933]/10', category: 'Engineering' },
  { id: 'ml', icon: Cpu, label: 'ML Engineer', status: 'Ready', color: 'text-emerald-400', bg: 'bg-emerald-400/10', category: 'Engineering' },
  { id: 'ui', icon: LayoutPanelTop, label: 'UI Designer', status: 'Online', color: 'text-pink-400', bg: 'bg-pink-400/10', category: 'Design & Product' },
  { id: 'pm', icon: Briefcase, label: 'Project Manager', status: 'Online', color: 'text-violet-400', bg: 'bg-violet-400/10', category: 'Design & Product' },
  { id: 'copy', icon: PenTool, label: 'Copywriter', status: 'Standby', color: 'text-orange-400', bg: 'bg-orange-400/10', category: 'Design & Product' },
  { id: 'sec', icon: Shield, label: 'Security Auditor', status: 'Active', color: 'text-red-400', bg: 'bg-red-400/10', category: 'Ops & QA' },
  { id: 'qa', icon: Bug, label: 'QA Tester', status: 'Standby', color: 'text-yellow-400', bg: 'bg-yellow-400/10', category: 'Ops & QA' },
  { id: 'ops', icon: Server, label: 'DevOps Engineer', status: 'Online', color: 'text-cyan-400', bg: 'bg-cyan-400/10', category: 'Ops & QA' },
  { id: 'seo', icon: Search, label: 'SEO Optimizer', status: 'Active', color: 'text-indigo-400', bg: 'bg-indigo-400/10', category: 'Ops & QA' },
]

export interface AIModel {
  id: string
  label: string
  provider: string
}

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isStreaming: boolean
  sendMessage: (message: string) => void
  models: AIModel[]
  selectedModel: AIModel
  onModelChange: (model: AIModel) => void
}

export function ChatInput({ input, setInput, onSubmit, isStreaming, sendMessage, models, selectedModel, onModelChange }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showModels, setShowModels] = useState(false)
  const [showSubAgents, setShowSubAgents] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<string>('auto')
  const [isRecording, setIsRecording] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])

  const categories = Array.from(new Set(SYSTEM_MODULES.map(m => m.category)))

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  // Real Voice Recording (Speech-to-Text) functionality
  useEffect(() => {
    let recognition: any;

    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (isRecording && SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      let baseInput = input.trim() ? input + ' ' : '';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInput(baseInput + currentTranscript);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      try {
        recognition.start();
      } catch (e) {
        console.error("Speech recognition error:", e);
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    }
  }, [isRecording]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() || attachedFiles.length > 0) {
      onSubmit(e)
      setAttachedFiles([])
      setIsRecording(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleFormSubmit(e as unknown as React.FormEvent)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const newFiles = Array.from(e.target.files)
    setAttachedFiles(prev => [...prev, ...newFiles])

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-0 relative mb-4">
      {/* Sub-Agents Full-Screen Modal */}
      {showSubAgents && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-300">
          {/* Blurred Backdrop */}
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-xl"
            onClick={() => setShowSubAgents(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-card border border-border/50 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <Sparkles className="size-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground/90">Agent Orchestration Hub</h2>
                  <p className="text-sm text-muted-foreground mt-1">Select a specialized sub-agent to handle your next objective</p>
                </div>
              </div>
              <button
                onClick={() => setShowSubAgents(false)}
                className="p-2.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>

            {/* Content area */}
            <div className="p-6 sm:p-8 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              <div className="flex flex-col gap-10">
                {/* Auto Orchestrator Option */}
                <div className="flex flex-col gap-4">
                  <h4 className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary/80">
                    Auto-Routing
                    <div className="h-px flex-1 bg-primary/20" />
                  </h4>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedAgent('auto')
                      setShowSubAgents(false)
                    }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left hover:bg-card hover:shadow-lg hover:-translate-y-0.5 ${selectedAgent === 'auto'
                      ? 'bg-primary/5 border-primary/40 shadow-md ring-1 ring-primary/40'
                      : 'bg-card/40 border-border/40 hover:border-border/80'
                      }`}
                  >
                    <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                      <Sparkles className="size-6" />
                    </div>
                    <div className="flex flex-col overflow-hidden justify-center h-full gap-0.5">
                      <span className={`text-[15px] font-semibold ${selectedAgent === 'auto' ? 'text-primary' : 'text-foreground'}`}>Auto (Orchestrator)</span>
                      <span className="text-[12px] text-muted-foreground">Classify intent and automatically route to the best sub-agent.</span>
                    </div>
                  </button>
                </div>

                {categories.map(cat => (
                  <div key={cat} className="flex flex-col gap-4">
                    <h4 className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {cat}
                      <div className="h-px flex-1 bg-border/40" />
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {SYSTEM_MODULES.filter(m => m.category === cat).map(mod => (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            setSelectedAgent(mod.id)
                            setShowSubAgents(false)
                          }}
                          className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 text-left hover:bg-card hover:shadow-lg hover:-translate-y-0.5 ${selectedAgent === mod.id ? 'bg-card border-primary/30 shadow-md ring-1 ring-primary/30' : 'bg-card/40 border-border/40 hover:border-border/80'}`}
                        >
                          <div className={`p-3 rounded-xl ${mod.bg} ${mod.color} shrink-0`}>
                            <mod.icon className="size-5" />
                          </div>
                          <div className="flex flex-col overflow-hidden justify-center h-full gap-1">
                            <span className={`text-[14px] font-semibold truncate ${selectedAgent === mod.id ? 'text-foreground' : 'text-foreground/90'}`}>{mod.label}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <div className={`size-1.5 rounded-full ${mod.status === 'Online' || mod.status === 'Active'
                                ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                                : mod.status === 'Standby'
                                  ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]'
                                  : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                                }`} />
                              <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{mod.status}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleFormSubmit}
        className="relative flex flex-col w-full bg-card hover:bg-card/80 transition-colors rounded-[24px] border border-border/20 shadow-sm focus-within:shadow-md focus-within:ring-1 focus-within:ring-border/40 focus-within:bg-card"
      >
        {/* Attached Files List */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2.5 px-5 pt-4 pb-0">
            {attachedFiles.map((file, idx) => {
              const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
              const isImage = file.type.startsWith('image/');
              return (
                <div key={idx} className="flex items-center gap-3 bg-secondary/70 hover:bg-secondary rounded-xl p-2 pr-3 shadow-sm border border-border/50 group transition-colors">
                  <div className={`rounded-lg p-1.5 flex flex-col items-center justify-center shrink-0 w-10 h-10 ${isImage ? 'bg-blue-500/20 text-blue-500' : 'bg-red-500/20 text-red-500'}`}>
                    {isImage ? <Image className="size-5" /> : <FileText className="size-5" />}
                  </div>
                  <div className="flex flex-col w-[90px] overflow-hidden">
                    <span className="text-sm font-semibold text-foreground truncate">{file.name}</span>
                    <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">{ext}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="text-muted-foreground hover:text-foreground shrink-0 rounded-full hover:bg-background/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? "Listening..." : "Ask Ariyan AI..."}
          className="w-full max-h-[40vh] resize-none border-0 bg-transparent px-5 pt-4 pb-2 text-[15px] focus:ring-0 outline-none disabled:opacity-50 placeholder:text-muted-foreground/70"
          rows={1}
          disabled={isStreaming}
        />

        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          <div className="flex items-center gap-1">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept=".pdf,.xls,.xlsx,.ppt,.pptx,image/*"
              onChange={handleFileChange}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload file"
            >
              <Paperclip className="size-[18px]" />
            </Button>

            {/* Sub-Agents Modal Trigger */}
            <button
              type="button"
              onClick={() => setShowSubAgents(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors font-medium text-[13px] ${selectedAgent !== 'auto'
                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              aria-label="Open Sub-Agents Hub"
            >
              <Sparkles className={`size-3.5 ${selectedAgent !== 'auto' ? 'text-primary' : 'text-blue-400'}`} />
              <span>
                {selectedAgent === 'auto'
                  ? 'Sub-Agents'
                  : SYSTEM_MODULES.find(m => m.id === selectedAgent)?.label || 'Sub-Agents'
                }
              </span>
            </button>

            {/* Models Dropdown */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => setShowModels(!showModels)}
                onBlur={() => setTimeout(() => setShowModels(false), 200)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-muted text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>{selectedModel?.label || 'Select Model'}</span>
                <ChevronDown className="size-3.5" />
              </button>

              {showModels && (
                <div className="absolute bottom-full left-0 mb-2 w-52 max-h-64 overflow-y-auto bg-popover border border-border/50 rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                  <div className="p-1 flex flex-col gap-0.5">
                    {models?.map(model => (
                      <button
                        key={model.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          onModelChange(model)
                          setShowModels(false)
                        }}
                        className={`flex items-center justify-between px-3 py-2 text-[13px] rounded-lg text-left transition-colors ${selectedModel?.id === model.id ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/80 hover:bg-muted hover:text-foreground'}`}
                      >
                        {model.label}
                        {selectedModel?.id === model.id && <Check className="size-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 pr-1">

            {isStreaming ? (
              <Button
                type="button"
                size="icon"
                className="size-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                onClick={() => { /* implement stop logic if possible */ }}
              >
                <Square className="size-4 fill-current" />
              </Button>
            ) : input.trim() || attachedFiles.length > 0 ? (
              <Button
                type="submit"
                size="icon"
                className="size-10 rounded-full bg-foreground hover:bg-foreground/90 text-background transition-colors"
              >
                <Send className="size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                size="icon"
                onClick={() => setIsRecording(!isRecording)}
                className={`size-10 rounded-full transition-all duration-300 ${isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                  : 'bg-foreground text-background hover:bg-foreground/90 shadow-sm'
                  }`}
                aria-label={isRecording ? "Stop recording" : "Start voice recording"}
              >
                {isRecording ? (
                  <div className="relative flex items-center justify-center">
                    <span className="absolute inline-flex h-6 w-6 rounded-full bg-red-400 opacity-60 animate-ping" />
                    <Mic className="size-[18px] relative z-10 animate-pulse text-white" />
                  </div>
                ) : (
                  <Mic className="size-[18px]" />
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
      <div className="absolute -bottom-6 left-0 right-0 text-center text-[11px] text-muted-foreground/60 transition-opacity hidden md:block">
        Ariyan AI can make mistakes. Consider verifying important information.
      </div>
    </div>
  )
}

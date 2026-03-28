'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { ResumeUpload } from '@/components/resume-upload'
import { ChatMessage } from '@/components/chat-message'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Menu, X, MessageSquarePlus, MessageSquare } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface SessionItem {
  id: string
  title: string
  has_resume: boolean
  created_at: string
}

export default function AnalyzerPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<SessionItem[]>([])
  
  const initialMessages: Message[] = [
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Career Coach. You can upload a resume to get ATS scores, or just ask me general career questions directly!',
      timestamp: new Date(),
    },
  ]
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      if (res.ok) {
        const data = await res.json()
        setSessions(data.sessions || [])
      }
    } catch(err) {
      console.error("Failed to fetch sessions")
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const handleNewChat = () => {
    setSessionId(null);
    setResumeFile(null);
    setMessages(initialMessages);
    setInputValue('');
  }

  const handleLoadSession = async (id: string) => {
    setSessionId(id)
    setResumeFile(null) // We don't have the File object anymore, but it's on the backend
    setIsLoading(true)
    try {
      const res = await fetch(`/api/sessions/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      if (res.ok) {
        const data = await res.json()
        const formattedMessages = data.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
        setMessages(formattedMessages)
        if (window.innerWidth < 768) setSidebarOpen(false); // Mobile auto close
      }
    } catch(err) {
      toast({ title: 'Error', description: 'Failed to load chat history.', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (file: File) => {
    handleNewChat()
    setResumeFile(file)
    setIsLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to intialize resume session')

      const data = await response.json()
      setSessionId(data.session_id)

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.analysis,
        timestamp: new Date(),
      }

      setMessages([assistantMessage])
      fetchSessions() // Refresh sidebar
      toast({ title: 'Success', description: 'Resume uploaded successfully.' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to upload resume.', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const formData = new FormData()
      if (sessionId) {
        formData.append('session_id', sessionId)
      }
      formData.append('message', inputValue)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to analyze query')

      const data = await response.json()
      
      // If a new session was created implicitly, update state and refresh sidebar
      if (!sessionId) {
        setSessionId(data.session_id)
        fetchSessions()
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.analysis || 'Analysis complete.',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to get analysis.', variant: 'destructive' })
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error communicating with the ATS analyzer.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'w-full md:w-80' : 'w-0'
          } border-r border-border bg-card transition-all duration-300 overflow-hidden flex flex-col shrink-0`}
        >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Chats</h2>
            </div>
            <Button onClick={handleNewChat} variant="ghost" size="icon" title="New Chat">
               <MessageSquarePlus className="w-5 h-5 text-primary" />
            </Button>
          </div>

          <div className="p-4 space-y-4">
            <ResumeUpload
              onFileSelect={handleFileSelect}
              disabled={isLoading || sessionId !== null}
            />
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-1 py-4">
            <h3 className="text-xs font-semibold text-muted-foreground px-2 pb-2">CHAT HISTORY</h3>
            {sessions.map((s) => (
               <button 
                key={s.id} 
                onClick={() => handleLoadSession(s.id)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-3 transition-colors ${sessionId === s.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
               >
                 <MessageSquare className="w-4 h-4 shrink-0 opacity-70" />
                 <span className="truncate">{s.title}</span>
               </button>
            ))}
            {sessions.length === 0 && (
                <p className="text-xs text-muted-foreground px-3 italic">No past sessions</p>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-background min-w-0">
          {/* Header with menu toggle */}
          <div className="border-b border-border px-4 py-3 flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <h1 className="font-semibold">{sessionId ? 'Active Session' : 'New Career Chat'}</h1>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ))}

            {isLoading && (
              <ChatMessage
                role="assistant"
                content=""
                isLoading
              />
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-card p-4 md:p-6 shrink-0">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-2 bg-background p-1 pr-2 rounded-xl border border-border focus-within:ring-1 focus-within:ring-primary">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Enter a Job Description or ask for career advice..."
                  className="min-h-[44px] max-h-48 resize-none shadow-none border-0 focus-visible:ring-0 text-base py-3 px-4"
                  disabled={isLoading}
                  rows={1}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="gap-2 shrink-0 rounded-full h-10 w-10 mb-1"
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Press Enter to send, Shift+Enter for new line.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

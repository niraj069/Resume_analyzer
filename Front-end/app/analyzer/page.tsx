'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { ResumeUpload } from '@/components/resume-upload'
import { ChatMessage } from '@/components/chat-message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, LogOut, Menu, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AnalyzerPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Resume Analyzer. Please upload your resume and tell me about the job role or description you\'re interested in. I\'ll analyze how well your resume matches the position and provide actionable insights.',
      timestamp: new Date(),
    },
  ])
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

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !resumeFile) {
      toast({
        title: 'Error',
        description: 'Please upload your resume and enter a job description.',
        variant: 'destructive',
      })
      return
    }

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
      formData.append('resume', resumeFile)
      formData.append('jobDescription', inputValue)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze resume')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.analysis || 'Analysis complete. Please try another job description.',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Failed to analyze resume. Please try again.',
        variant: 'destructive',
      })

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error analyzing your resume. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Resume Upload */}
        <div
          className={`${
            sidebarOpen ? 'w-full md:w-80' : 'w-0'
          } border-r border-border bg-card transition-all duration-300 overflow-hidden flex flex-col`}
        >
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold">Resume</h2>
            <p className="text-sm text-muted-foreground">Upload your resume to begin</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <ResumeUpload
              onFileSelect={setResumeFile}
              disabled={isLoading}
            />

            {resumeFile && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-xs font-semibold text-primary mb-1">Resume Status</p>
                <p className="text-sm text-foreground">Ready for analysis</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-border space-y-2">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-2"
              size="sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-background">
          {/* Header with menu toggle */}
          <div className="md:hidden border-b border-border px-4 py-3 flex items-center gap-2">
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
            <h1 className="font-semibold">Resume Analyzer</h1>
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
          <div className="border-t border-border bg-card p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Describe the job role or paste the job description..."
                  className="bg-background border-border focus-visible:ring-primary"
                  disabled={isLoading || !resumeFile}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !resumeFile || !inputValue.trim()}
                  className="gap-2"
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send or click the send button
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isLoading?: boolean
}

export function ChatMessage({ role, content, isLoading }: ChatMessageProps) {
  const [displayedContent, setDisplayedContent] = useState('')

  useEffect(() => {
    // Only animate if it's the assistant and not loading
    if (role === 'assistant' && !isLoading && content) {
      let i = 0
      setDisplayedContent('')
      const interval = setInterval(() => {
        i += 3 // Type 3 characters at a time for snappiness
        setDisplayedContent(content.slice(0, i))
        if (i >= content.length) {
          clearInterval(interval)
        }
      }, 10)
      return () => clearInterval(interval)
    } else {
      setDisplayedContent(content)
    }
  }, [content, role, isLoading])

  return (
    <div
      className={cn(
        'flex gap-3 animate-in fade-in slide-in-from-bottom-2',
        role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-xs lg:max-w-[70%] xl:max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed',
          role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-foreground'
        )}
      >
        {isLoading ? (
          <div className="flex gap-2 py-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words">{displayedContent}</p>
        )}
      </div>
    </div>
  )
}

'use client'

import { cn } from '@/lib/utils'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isLoading?: boolean
}

export function ChatMessage({ role, content, isLoading }: ChatMessageProps) {
  return (
    <div
      className={cn(
        'flex gap-3 animate-in fade-in slide-in-from-bottom-2',
        role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-xs lg:max-w-md xl:max-w-lg rounded-lg px-4 py-2 text-sm',
          role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-foreground'
        )}
      >
        {isLoading ? (
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words">{content}</p>
        )}
      </div>
    </div>
  )
}

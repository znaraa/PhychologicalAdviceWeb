'use client'

import { useState, useRef, KeyboardEvent } from 'react'

interface InputAreaProps {
  onSend: (message: string) => void
  isLoading: boolean
}

export default function InputArea({ onSend, isLoading }: InputAreaProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input)
      setInput('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    const max = Math.floor(window.innerHeight * 0.25)
    e.target.style.height = `${Math.min(e.target.scrollHeight, max)}px`
  }

  return (
    <div className="border-t" style={{ borderColor: 'transparent', background: 'var(--input-bg)', height: '25vh' }}>
      <div className="max-w-4xl mx-auto h-full flex items-center">
        <div className="relative flex items-end gap-2 rounded-lg h-full w-full soft-rounded" style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.03)', padding: 12 }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Message Gemini-gpt..."
            className="flex-1 bg-transparent resize-none py-4 px-4 outline-none placeholder-muted overflow-y-auto"
            style={{ color: 'var(--foreground)', maxHeight: 'calc(25vh - 4rem)' }}
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 mb-2 mr-2 rounded-lg transition-colors"
            style={{ background: 'var(--pink-300)', color: 'white' }}
            aria-label="Send message"
          >
            <span style={{ fontSize: 16 }}>➤</span>
          </button>
        </div>
        <p className="text-xs text-center mt-2" style={{ color: 'var(--muted)' }}>
          Gemini-gpt can make mistakes. Check important info.
        </p>
      </div>
    </div>
  )
}


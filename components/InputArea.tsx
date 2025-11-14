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
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <p className="text-xs text-center mt-2" style={{ color: 'var(--muted)' }}>
          Gemini-gpt can make mistakes. Check important info.
        </p>
      </div>
    </div>
  )
}


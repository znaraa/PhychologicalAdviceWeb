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
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
  }

  return (
  <div className="border-t" style={{ borderColor: 'rgba(0,0,0,0.08)', background: 'var(--input-bg)' }}>
      <div className="max-w-3xl mx-auto">
  <div className="relative flex items-end gap-2 rounded-lg border transition-colors" style={{ background: 'transparent', borderColor: 'rgba(0,0,0,0.08)' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Message Gemini-gpt..."
            className="flex-1 bg-transparent resize-none py-3 px-4 outline-none text-white placeholder-gray-400 max-h-[200px] overflow-y-auto"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 mb-2 mr-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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


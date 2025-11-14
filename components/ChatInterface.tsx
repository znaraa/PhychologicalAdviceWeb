'use client'

import { useState, useRef, useEffect } from 'react'
import { Conversation, Message } from '@/app/page'
import MessageBubble from './MessageBubble'
import InputArea from './InputArea'

interface ChatInterfaceProps {
  conversation: Conversation
  onUpdate: (messages: Message[]) => void
}

export default function ChatInterface({
  conversation,
  onUpdate
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(conversation.messages)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages(conversation.messages)
  }, [conversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      })

      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        tokenUsage: undefined
      }

      let done = false
      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        
        if (value) {
          const chunk = decoder.decode(value)
          const lines = chunk.split('\n').filter(line => line.trim() !== '')
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                done = true
                break
              }
              try {
                const parsed = JSON.parse(data)
                if (parsed.choices?.[0]?.delta?.content) {
                  assistantMessage.content += parsed.choices[0].delta.content
                  setMessages([...newMessages, assistantMessage])
                }
                // Token usage мэдээллийг авах
                if (parsed.tokenUsage) {
                  assistantMessage.tokenUsage = parsed.tokenUsage
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }

      const finalMessages = [...newMessages, assistantMessage]
      setMessages(finalMessages)
      onUpdate(finalMessages)
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }
      const finalMessages = [...newMessages, errorMessage]
      setMessages(finalMessages)
      onUpdate(finalMessages)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 px-4 pb-4 flex flex-col">
        <div className="mx-auto w-full max-w-4xl soft-rounded" style={{ border: '1px solid rgba(0,0,0,0.06)', background: 'transparent', padding: 12 }}>
          <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 25vh - 6rem)', paddingRight: 8 }}>
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-2xl">
                  <h1 className="text-4xl font-bold mb-4">Gemini-gpt</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="p-4 border border-gray-200 rounded-lg transition-colors cursor-pointer">
                      <div className="font-semibold mb-2">💡 Examples</div>
                      <div className="text-sm text-gray-500">
                        "Explain quantum computing in simple terms"
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg transition-colors cursor-pointer">
                      <div className="font-semibold mb-2">🎯 Capabilities</div>
                      <div className="text-sm text-gray-500">
                        Remembers what user said earlier in the conversation
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg transition-colors cursor-pointer">
                      <div className="font-semibold mb-2">⚡ Limitations</div>
                      <div className="text-sm text-gray-500">
                        May occasionally generate incorrect information
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg transition-colors cursor-pointer">
                      <div className="font-semibold mb-2">🔧 Updates</div>
                      <div className="text-sm text-gray-500">
                        Trained on data up to April 2024
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}

                {isLoading && (
                  <div className="flex items-start gap-4 p-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--assistant-avatar)' }}>
                      <span style={{ fontSize: 16, color: 'white' }}>🤖</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-1 pt-1">
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '0ms', background: 'var(--muted)' }} />
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '150ms', background: 'var(--muted)' }} />
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '300ms', background: 'var(--muted)' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>
      <InputArea onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  )
}


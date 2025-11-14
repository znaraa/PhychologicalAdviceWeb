'use client'

import { useState, useRef, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import ChatInterface from '@/components/ChatInterface'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  tokenUsage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: []
    }
    setCurrentConversation(newConv)
    setConversations(prev => [newConv, ...prev])
  }

  const selectConversation = (id: string) => {
    const conv = conversations.find(c => c.id === id)
    if (conv) {
      setCurrentConversation(conv)
    }
  }

  const updateConversation = (messages: Message[]) => {
    if (!currentConversation) return
    
    const updated: Conversation = {
      ...currentConversation,
      messages,
      title: messages.length > 0 && messages[0].content 
        ? messages[0].content.slice(0, 50) 
        : 'New Chat'
    }
    
    setCurrentConversation(updated)
    setConversations(prev => 
      prev.map(c => c.id === updated.id ? updated : c)
    )
  }

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id))
    if (currentConversation?.id === id) {
      setCurrentConversation(null)
    }
  }

  useEffect(() => {
    if (conversations.length === 0) {
      createNewConversation()
    }
  }, [])

  return (
    <div className="flex h-screen bg-[#343541] text-white">
      <Sidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onNewChat={createNewConversation}
        onSelectConversation={selectConversation}
        onDeleteConversation={deleteConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <ChatInterface
            conversation={currentConversation}
            onUpdate={updateConversation}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Gemini-gpt</h1>
              <p className="text-gray-400">Start a new conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { Conversation } from '@/app/page'

interface SidebarProps {
  conversations: Conversation[]
  currentConversation: Conversation | null
  onNewChat: () => void
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({
  conversations,
  currentConversation: _currentConversation,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  isOpen,
  onToggle
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="relative">
      {isOpen && (
        <aside className="w-64 flex flex-col h-full" style={{ background: 'var(--sidebar)' }}>
          <div className="p-3">
            <button
              onClick={onNewChat}
              className="w-full p-3 rounded-lg transition-colors flex items-center gap-2"
              style={{ border: '1px solid rgba(0,0,0,0.06)' }}
            >
              <span style={{ fontSize: 14 }}>✚</span>
              <span>New chat</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2">
            <div className="text-xs" style={{ color: 'var(--muted)', padding: '0.5rem' }}>Today</div>

            {conversations.map(conv => (
              <div
                key={conv.id}
                className="group cursor-pointer rounded-lg mb-1"
                onMouseEnter={() => setHoveredId(conv.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className="px-3 py-2 rounded-lg hover:opacity-95" style={{ background: 'transparent' }}>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 14 }}>🗒️</span>
                    <span className="flex-1 truncate text-sm" style={{ color: 'var(--foreground)' }}>{conv.title}</span>

                    {hoveredId === conv.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteConversation(conv.id)
                        }}
                        className="text-sm"
                        style={{ color: 'var(--muted)' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <button className="w-full p-3 rounded-lg transition-colors flex items-center gap-2 text-sm" style={{ background: 'transparent' }}>
              <span style={{ fontSize: 14 }}>⬆️</span>
              <span style={{ color: 'var(--foreground)' }}>Upgrade to Plus</span>
            </button>
          </div>
        </aside>
      )}

      <button
        onClick={onToggle}
        className="absolute top-4 left-4 z-10 p-2 rounded-lg transition-colors"
        style={{ background: 'transparent' }}
        aria-label="Toggle sidebar"
      >
        <span style={{ fontSize: 16 }}>☰</span>
      </button>
    </div>
  )
}


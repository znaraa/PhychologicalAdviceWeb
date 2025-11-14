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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z" fill="currentColor"/>
              </svg>
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
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4Zm2 1v6h10V5H3Zm2 1h6v1H5V6Zm0 2h4v1H5V8Z" fill="currentColor"/>
                    </svg>
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 1a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2H9v4a1 1 0 1 1-2 0V8H3a1 1 0 0 1 0-2h4V2a1 1 0 0 1 1-1Z" fill="currentColor"/>
              </svg>
              <span style={{ color: 'var(--foreground)' }}>Upgrade to Plus</span>
            </button>
          </div>
        </aside>
      )}

      <button
        onClick={onToggle}
        className="absolute top-4 left-4 z-10 p-2 rounded-lg transition-colors"
        style={{ background: 'transparent' }}
      >
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2h12M2 8h12M2 14h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}


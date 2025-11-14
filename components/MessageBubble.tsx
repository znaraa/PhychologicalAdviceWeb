'use client'

import { Message } from '@/app/page'
import ReactMarkdown from 'react-markdown'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-start gap-4 p-4 relative`} style={{ background: isUser ? 'var(--user-bubble)' : 'var(--assistant-bubble)', borderRadius: 12 }}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`} style={{ background: isUser ? 'var(--user-avatar)' : 'var(--assistant-avatar)' }}>
        {isUser ? (
          // simple user emoji avatar
          <span style={{ fontSize: 14, color: 'white' }}>🙂</span>
        ) : (
          // simple assistant emoji avatar
          <span style={{ fontSize: 14, color: 'white' }}>🤖</span>
        )}
      </div>
  <div className="flex-1 pt-1 max-w-none" style={{ color: 'var(--foreground)', fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            code: ({ inline, children }: any) => 
              inline ? (
                <code className="bg-gray-700 px-1 py-0.5 rounded text-sm">{children}</code>
              ) : (
                <code className="block bg-gray-800 p-4 rounded-lg overflow-x-auto">{children}</code>
              ),
            pre: ({ children }) => <pre className="mb-2">{children}</pre>,
            ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            h1: ({ children }) => <h1 className="text-2xl font-bold mb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-bold mb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
          }}
        >
          {message.content}
        </ReactMarkdown>
        
        {/* Token usage display for assistant messages */}
        {!isUser && message.tokenUsage && (
          <div className="mt-3 pt-3 border-t border-gray-600 flex flex-wrap gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <span style={{ width: 12, height: 12, display: 'inline-block', borderRadius: 2, background: 'transparent' }} aria-hidden />
              <span>Input: <strong className="text-gray-300">{message.tokenUsage.promptTokens}</strong> tokens</span>
            </div>
            <div className="flex items-center gap-1">
              <span style={{ width: 12, height: 12, display: 'inline-block', borderRadius: 2, background: 'transparent' }} aria-hidden />
              <span>Output: <strong className="text-gray-300">{message.tokenUsage.completionTokens}</strong> tokens</span>
            </div>
            <div className="flex items-center gap-1">
              <span style={{ width: 12, height: 12, display: 'inline-block', borderRadius: 2, background: 'transparent' }} aria-hidden />
              <span className="font-semibold text-blue-400">Total: {message.tokenUsage.totalTokens} tokens</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


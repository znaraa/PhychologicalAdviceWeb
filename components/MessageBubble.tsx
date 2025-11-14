'use client'

import { Message } from '@/app/page'
import ReactMarkdown from 'react-markdown'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-start gap-4 p-4 relative ${isUser ? 'bg-[#343541]' : 'bg-[#444654]'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-[#5436da]' : 'bg-[#19c37d]'
      }`}>
        {isUser ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" fill="white"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0Z" fill="white"/>
          </svg>
        )}
      </div>
      <div className="flex-1 pt-1 prose prose-invert max-w-none">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            code: ({ inline, children }) => 
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
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM4.5 7.5a.5.5 0 0 1 0-1h5.793L8.146 4.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 7.5H4.5Z"/>
              </svg>
              <span>Input: <strong className="text-gray-300">{message.tokenUsage.promptTokens}</strong> tokens</span>
            </div>
            <div className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM4.5 7.5a.5.5 0 0 1 0-1h5.793L8.146 4.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 7.5H4.5Z"/>
              </svg>
              <span>Output: <strong className="text-gray-300">{message.tokenUsage.completionTokens}</strong> tokens</span>
            </div>
            <div className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h6zM5 0a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H5z"/>
                <path d="M2 9h12v2H2z"/>
                <path d="M8 11v4h2v-4H8z"/>
              </svg>
              <span className="font-semibold text-blue-400">Total: {message.tokenUsage.totalTokens} tokens</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


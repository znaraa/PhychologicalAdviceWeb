'use client'

import { useEffect, useState } from 'react'

export default function ScreenProtection() {
  const [userInfo, setUserInfo] = useState('')

  useEffect(() => {
    // Хэрэглэгчийн мэдээлэл авах (IP, timestamp)
    const timestamp = new Date().toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    setUserInfo(`Session: ${timestamp}`)

    // Right-click хориглох
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Keyboard shortcut-уудыг хориглох (PrintScreen, Ctrl+Shift+S, гм)
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        alert('⚠️ Screen capture is disabled on this page')
        return false
      }
      
      // Windows Snipping Tool (Win + Shift + S)
      if (e.key === 's' && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        alert('⚠️ Screen capture is disabled on this page')
        return false
      }

      // Mac screenshot (Cmd + Shift + 3, 4, 5)
      if (e.shiftKey && e.metaKey && ['3', '4', '5'].includes(e.key)) {
        e.preventDefault()
        alert('⚠️ Screen capture is disabled on this page')
        return false
      }

      // Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        alert('⚠️ Printing is disabled on this page')
        return false
      }
    }

    // DevTools нээхийг хориглох (F12, Ctrl+Shift+I)
    const handleDevTools = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault()
        return false
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keydown', handleDevTools)

    // Хуудас идэвхгүй болоход анхааруулга
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('⚠️ User switched away - possible screen recording')
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keydown', handleDevTools)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <>
      {/* Watermark оверлэй - бүх хуудсанд харагдана */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 select-none"
        style={{
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 200px,
            rgba(255, 255, 255, 0.02) 200px,
            rgba(255, 255, 255, 0.02) 400px
          )`
        }}
      >
        {/* Давхардсан watermark-ууд */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-gray-600/10 font-mono text-xs transform -rotate-45 whitespace-nowrap"
            style={{
              top: `${(i * 20) + 10}%`,
              left: `${(i * 15) % 80}%`,
              fontSize: '11px',
            }}
          >
            🔒 CONFIDENTIAL • {userInfo}
          </div>
        ))}
      </div>

      {/* Доод талд тогтмол watermark */}
      <div className="fixed bottom-2 right-2 text-[10px] text-gray-600/30 font-mono pointer-events-none z-50 select-none">
        🔒 Protected Content • {userInfo}
      </div>

      {/* CSS-ээр контентыг бага зэрэг бүдгэрүүлэх (screen record үед илүү бүдэг харагдана) */}
      <style jsx global>{`
        @media screen {
          body {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        }

        /* Print хийхийг хориглох */
        @media print {
          body {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}

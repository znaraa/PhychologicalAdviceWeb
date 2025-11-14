'use client'

import { useEffect, useState } from 'react'

export default function RecordingDetector() {
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    let detectionInterval: NodeJS.Timeout

    // Screen recording илрүүлэх (MediaRecorder API ашиглаж байвал)
    const detectRecording = async () => {
      try {
        // Screen capture илрүүлэх - chrome://media-internals/ шалгах
        const checkMediaDevices = async () => {
          if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            // Display capture API идэвхтэй эсэхийг шалгах
            const stream = await navigator.mediaDevices.getDisplayMedia({ 
              video: true 
            }).catch(() => null)
            
            if (stream) {
              setIsRecording(true)
              stream.getTracks().forEach(track => track.stop())
            }
          }
        }

        // Window size өөрчлөлтийг хянах (OBS/recording software-ийг илрүүлэх)
        const originalSize = { width: window.innerWidth, height: window.innerHeight }
        
        detectionInterval = setInterval(() => {
          // Хэрэв window size хэт их өөрчлөгдсөн бол recording software ажиллаж байж болзошгүй
          const sizeDiff = Math.abs(window.innerWidth - originalSize.width) + 
                          Math.abs(window.innerHeight - originalSize.height)
          
          if (sizeDiff > 100) {
            console.warn('⚠️ Suspicious window resize detected')
          }
        }, 2000)

      } catch (error) {
        console.log('Recording detection:', error)
      }
    }

    detectRecording()

    return () => {
      if (detectionInterval) clearInterval(detectionInterval)
    }
  }, [])

  // Хэрэв recording илэрвэл анхааруулга харуулах
  if (isRecording) {
    return (
      <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center">
        <div className="bg-red-600 p-8 rounded-lg text-center max-w-md">
          <div className="text-4xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold mb-4">Screen Recording Detected</h2>
          <p className="text-white/90 mb-4">
            Screen recording is not allowed on this page. 
            Please stop recording to continue.
          </p>
          <button 
            onClick={() => setIsRecording(false)}
            className="bg-white text-red-600 px-6 py-2 rounded font-semibold hover:bg-gray-100"
          >
            I've Stopped Recording
          </button>
        </div>
      </div>
    )
  }

  return null
}

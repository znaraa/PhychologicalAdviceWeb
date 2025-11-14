import type { Metadata } from 'next'
import './globals.css'
import ScreenProtection from '@/components/ScreenProtection'
import RecordingDetector from '@/components/RecordingDetector'

export const metadata: Metadata = {
  title: 'Gemini-gpt Clone',
  description: 'Gemini-gpt Clone with OpenAI API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ScreenProtection />
        <RecordingDetector />
        {children}
      </body>
    </html>
  )
}

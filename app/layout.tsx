import type { Metadata } from 'next'
import './globals.css'
import ScreenProtection from '@/components/ScreenProtection'
import RecordingDetector from '@/components/RecordingDetector'

export const metadata: Metadata = {
  title: 'Phychological Advice AI',
  description: 'An AI assistant that provides phychological advice in Mongolian language.',
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

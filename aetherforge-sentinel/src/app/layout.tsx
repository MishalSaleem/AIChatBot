import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AetherForge Sentinel - Your Guardian in the Digital Aether',
  description: 'A groundbreaking AI companion that forges intelligent responses from the aether, acting as a sentinel for user queries. Experience the future of AI interaction.',
  keywords: 'AI, chatbot, artificial intelligence, personal assistant, futuristic UI, 3D animations, cosmic design',
  authors: [{ name: 'AetherForge Developer' }],
  creator: 'AetherForge Sentinel',
  openGraph: {
    title: 'AetherForge Sentinel - AI Companion Reimagined',
    description: 'Step into the future with an AI that responds to your emotions and creates a living, breathing digital experience.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AetherForge Sentinel',
    description: 'The most advanced AI companion ever created',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0A0A0A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-aether-black text-aether-cyan overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}

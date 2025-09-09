
import type { Metadata, Viewport } from 'next' // <-- Imported Viewport
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// This object is now correct and will not produce warnings.
export const metadata: Metadata = {
  // FIX: Added metadataBase to resolve URL paths correctly.
  metadataBase: new URL('http://localhost:3000'), // Change to your real domain in production
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
  // The 'viewport' and 'themeColor' keys have been removed from here.
}

// FIX: This new export handles viewport and theme color settings.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
        {/* You do not need to manually add font links here in Next.js 13+ */}
        {/* The 'inter' font object from next/font/google handles it automatically. */}
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-aether-black text-aether-cyan overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}
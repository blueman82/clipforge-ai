import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { Analytics } from '@/components/analytics'
import { SessionProvider } from '@/components/session-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://clipforge-ai.vercel.app'),
  title: 'ClipForge AI - Create Viral Videos in Minutes',
  description:
    'AI-powered faceless video generation platform. Transform your ideas into engaging videos with automated scripts, voiceovers, and editing.',
  keywords:
    'AI video generation, faceless videos, automated content creation, TikTok videos, YouTube Shorts',
  authors: [{ name: 'ClipForge AI' }],
  openGraph: {
    title: 'ClipForge AI - Create Viral Videos in Minutes',
    description: 'Transform your ideas into engaging faceless videos with AI',
    url: 'https://clipforge.ai',
    siteName: 'ClipForge AI',
    images: [
      {
        url: 'https://clipforge.ai/og.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClipForge AI - Create Viral Videos in Minutes',
    description: 'Transform your ideas into engaging faceless videos with AI',
    images: ['https://clipforge.ai/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

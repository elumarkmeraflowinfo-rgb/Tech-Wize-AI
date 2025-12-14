import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Tech-Wize | AI-Powered Digital Production Platform',
  description: 'Professional video marketing created with AI. Fast, affordable, and optimized for social media. From 500 KES.',
  keywords: 'AI video production, digital marketing, Kenya, video marketing, social media content',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}

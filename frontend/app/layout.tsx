import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-jakarta',
})


export const metadata: Metadata = {
  title: 'BookEase - Instant Booking Websites for Events & Cafés',
  description: 'Create a personalized booking website in 10 minutes. Select a template, add your details, and start receiving bookings instantly at yourbusiness.bookease.com',
  generator: 'v0.app',
  openGraph: {
    title: 'BookEase - Instant Booking Websites',
    description: 'Create a personalized booking website in 10 minutes',
    url: 'https://bookease.com',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0F' },
  ],
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable}`}>
      <body className="antialiased bg-[#0A0A0F]" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

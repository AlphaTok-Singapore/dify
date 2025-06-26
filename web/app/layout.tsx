import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dify - AI Application Platform',
  description: 'Build and operate AI applications with Dify',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


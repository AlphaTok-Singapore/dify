import './globals.css'
import type { Metadata } from 'next'
import ClientI18nProvider from './ClientI18nProvider'

export const metadata: Metadata = {
  title: 'Dify - AI Application Platform',
  description: 'Build and operate AI applications with Dify',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ClientI18nProvider>
          {children}
        </ClientI18nProvider>
      </body>
    </html>
  )
}

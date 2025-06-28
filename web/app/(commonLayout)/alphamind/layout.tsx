'use client'

import React from 'react'
import { AlphaMindProvider } from '@/context/alphamind/AlphaMindContext'

type AlphaMindLayoutProps = {
  children: React.ReactNode
}

export default function AlphaMindLayout({ children }: AlphaMindLayoutProps) {
  return (
    <AlphaMindProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen">
          {children}
        </div>
      </div>
    </AlphaMindProvider>
  )
}

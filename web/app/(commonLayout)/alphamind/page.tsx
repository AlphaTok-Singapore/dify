'use client'

import React from 'react'
import { AlphaMindProvider } from '@/context/alphamind/AlphaMindContext'
import AlphaMindLayout from './components/AlphaMindLayout'
import Dashboard from './components/Dashboard'

export default function AlphaMindPage() {
  return (
    <AlphaMindProvider>
      <AlphaMindLayout>
        <Dashboard />
      </AlphaMindLayout>
    </AlphaMindProvider>
  )
}

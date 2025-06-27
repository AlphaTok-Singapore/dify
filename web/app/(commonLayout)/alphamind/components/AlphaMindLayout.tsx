'use client'

import React from 'react'
import { Navigation } from './Navigation'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useAlphaMindContext } from '../../../context/alphamind/AlphaMindContext'
import { cn } from '../utils'

type AlphaMindLayoutProps = {
  children: React.ReactNode
}

export function AlphaMindLayout({ children }: AlphaMindLayoutProps) {
  const { sidebarOpen, setSidebarOpen, currentModule } = useAlphaMindContext()

  return (
    <div className="alphamind-layout min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        currentModule={currentModule}
      />

      {/* Layout Body */}
      <div className="layout-body flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className={cn(
          'main-content flex-1 transition-all duration-300',
          sidebarOpen ? 'ml-64' : 'ml-16',
        )}>
          {/* Navigation Breadcrumb */}
          <Navigation />

          {/* Page Content */}
          <div className="page-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

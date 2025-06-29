'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  MessageSquare, 
  Bot, 
  Database, 
  Settings, 
  Workflow,
  BarChart3 
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/alphamind', icon: Home },
  { name: 'Chat', href: '/alphamind/chat', icon: MessageSquare },
  { name: 'Agents', href: '/alphamind/agents', icon: Bot },
  { name: 'Data', href: '/alphamind/data', icon: Database },
  { name: 'Workflows', href: '/alphamind/workflows', icon: Workflow },
  { name: 'Analytics', href: '/alphamind/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/alphamind/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-white w-64 shadow-sm border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AM</span>
          </div>
          <span className="font-semibold text-gray-900">AlphaMind</span>
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}


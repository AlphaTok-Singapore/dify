'use client'

import React from 'react'
import Link from 'next/link'
import { Plus, MessageSquare, Bot, Database } from 'lucide-react'

export default function QuickActions() {
  const actions = [
    {
      name: 'Start New Chat',
      description: 'Begin a conversation with an AI agent',
      href: '/alphamind/chat',
      icon: MessageSquare,
      color: 'bg-blue-500'
    },
    {
      name: 'Create Agent',
      description: 'Set up a new AI assistant',
      href: '/alphamind/agents',
      icon: Bot,
      color: 'bg-green-500'
    },
    {
      name: 'Upload Data',
      description: 'Add new training data or documents',
      href: '/alphamind/data',
      icon: Database,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`p-2 rounded-lg ${action.color} mr-3`}>
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{action.name}</h4>
              <p className="text-sm text-gray-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


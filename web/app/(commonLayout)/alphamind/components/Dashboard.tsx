'use client'

import React from 'react'
import QuickActions from './QuickActions'
import RecentActivity from './RecentActivity'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">Welcome to AlphaMind - Your AI Management Platform</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Active Agents</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Conversations</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">127</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Messages Today</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">1,234</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Response Time</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">0.8s</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
        <RecentActivity />
      </div>
    </div>
  )
}


'use client'

import React from 'react'

export default function StatusIndicator() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-sm text-gray-600">System Online</span>
    </div>
  )
}


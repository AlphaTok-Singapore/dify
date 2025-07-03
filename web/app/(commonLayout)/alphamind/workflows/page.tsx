'use client'

import React from 'react'

export default function WorkflowsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Workflows</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Workflow management functionality will be implemented here.
        </p>
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Available Features:</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Create new workflows</li>
            <li>Edit existing workflows</li>
            <li>Monitor workflow execution</li>
            <li>Integration with n8n</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

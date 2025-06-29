'use client'

import React, { useState } from 'react'
import { Play, Save, Plus, Trash2, Settings, GitBranch } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Form, FormField, FormLabel, FormInput, FormSelect } from '../ui/Form'

interface WorkflowNode {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'output'
  name: string
  config: Record<string, any>
  position: { x: number; y: number }
}

interface WorkflowConnection {
  id: string
  from: string
  to: string
}

interface Workflow {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  status: 'draft' | 'active' | 'paused'
}

interface WorkflowEditorProps {
  workflow?: Workflow
  onSave?: (workflow: Workflow) => void
  onExecute?: (workflow: Workflow) => void
  className?: string
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({
  workflow,
  onSave,
  onExecute,
  className
}) => {
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>(
    workflow || {
      id: Date.now().toString(),
      name: 'New Workflow',
      description: '',
      nodes: [
        {
          id: '1',
          type: 'trigger',
          name: 'HTTP Trigger',
          config: { method: 'POST', path: '/webhook' },
          position: { x: 100, y: 100 }
        },
        {
          id: '2',
          type: 'action',
          name: 'Process Data',
          config: { operation: 'transform' },
          position: { x: 300, y: 100 }
        },
        {
          id: '3',
          type: 'output',
          name: 'Send Response',
          config: { format: 'json' },
          position: { x: 500, y: 100 }
        }
      ],
      connections: [
        { id: 'c1', from: '1', to: '2' },
        { id: 'c2', from: '2', to: '3' }
      ],
      status: 'draft'
    }
  )

  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)

  const nodeTypes = [
    { value: 'trigger', label: 'Trigger', icon: '🚀' },
    { value: 'action', label: 'Action', icon: '⚡' },
    { value: 'condition', label: 'Condition', icon: '🔀' },
    { value: 'output', label: 'Output', icon: '📤' }
  ]

  const addNode = (type: WorkflowNode['type']) => {
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type,
      name: `New ${type}`,
      config: {},
      position: { x: 200, y: 200 }
    }

    setCurrentWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }))
  }

  const deleteNode = (nodeId: string) => {
    setCurrentWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      connections: prev.connections.filter(c => c.from !== nodeId && c.to !== nodeId)
    }))
    setSelectedNode(null)
  }

  const updateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    setCurrentWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => 
        n.id === nodeId ? { ...n, ...updates } : n
      )
    }))
  }

  const handleSave = () => {
    onSave?.(currentWorkflow)
  }

  const handleExecute = () => {
    onExecute?.(currentWorkflow)
  }

  const getNodeColor = (type: WorkflowNode['type']) => {
    switch (type) {
      case 'trigger': return 'bg-green-100 border-green-300'
      case 'action': return 'bg-blue-100 border-blue-300'
      case 'condition': return 'bg-yellow-100 border-yellow-300'
      case 'output': return 'bg-purple-100 border-purple-300'
      default: return 'bg-gray-100 border-gray-300'
    }
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      {/* Workflow Canvas */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                {currentWorkflow.name}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleExecute}>
                  <Play className="h-4 w-4 mr-2" />
                  Execute
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Canvas Area */}
            <div className="relative bg-gray-50 rounded-lg p-4 min-h-96 border-2 border-dashed border-gray-300">
              {/* Nodes */}
              {currentWorkflow.nodes.map((node) => (
                <div
                  key={node.id}
                  className={`absolute p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    getNodeColor(node.type)
                  } ${selectedNode?.id === node.id ? 'ring-2 ring-blue-500' : ''}`}
                  style={{
                    left: node.position.x,
                    top: node.position.y
                  }}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {nodeTypes.find(t => t.value === node.type)?.icon}
                    </span>
                    <div>
                      <div className="font-medium text-sm">{node.name}</div>
                      <div className="text-xs text-gray-600 capitalize">{node.type}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Connections */}
              <svg className="absolute inset-0 pointer-events-none">
                {currentWorkflow.connections.map((connection) => {
                  const fromNode = currentWorkflow.nodes.find(n => n.id === connection.from)
                  const toNode = currentWorkflow.nodes.find(n => n.id === connection.to)
                  
                  if (!fromNode || !toNode) return null

                  return (
                    <line
                      key={connection.id}
                      x1={fromNode.position.x + 80}
                      y1={fromNode.position.y + 25}
                      x2={toNode.position.x}
                      y2={toNode.position.y + 25}
                      stroke="#6B7280"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  )
                })}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#6B7280"
                    />
                  </marker>
                </defs>
              </svg>
            </div>

            {/* Add Node Buttons */}
            <div className="flex gap-2 mt-4">
              {nodeTypes.map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  size="sm"
                  onClick={() => addNode(type.value as WorkflowNode['type'])}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {type.icon} {type.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties Panel */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <Form className="space-y-4">
                <FormField>
                  <FormLabel>Node Name</FormLabel>
                  <FormInput
                    value={selectedNode.name}
                    onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                  />
                </FormField>

                <FormField>
                  <FormLabel>Node Type</FormLabel>
                  <FormSelect
                    value={selectedNode.type}
                    onChange={(e) => updateNode(selectedNode.id, { type: e.target.value as WorkflowNode['type'] })}
                  >
                    {nodeTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </FormSelect>
                </FormField>

                {/* Node-specific configuration */}
                {selectedNode.type === 'trigger' && (
                  <FormField>
                    <FormLabel>Trigger Method</FormLabel>
                    <FormSelect
                      value={selectedNode.config.method || 'POST'}
                      onChange={(e) => updateNode(selectedNode.id, {
                        config: { ...selectedNode.config, method: e.target.value }
                      })}
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </FormSelect>
                  </FormField>
                )}

                <div className="pt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteNode(selectedNode.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Node
                  </Button>
                </div>
              </Form>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a node to edit its properties</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { WorkflowEditor, type WorkflowEditorProps, type Workflow, type WorkflowNode }


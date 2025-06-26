// AlphaMind TypeScript 类型定义

export interface Agent {
  id: number
  name: string
  description: string
  type: 'assistant' | 'analyst' | 'creator' | 'workflow'
  status: 'active' | 'inactive' | 'training'
  model: string
  conversations: number
  successRate: number
  lastUsed: string
  createdAt: string
  config?: AgentConfig
}

export interface AgentConfig {
  temperature: number
  maxTokens: number
  systemPrompt?: string
  tools?: string[]
  workflows?: string[]
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  agentId?: number
  conversationId?: string
}

export interface Conversation {
  id: string
  title: string
  agentId: number
  userId: string
  status: 'active' | 'archived'
  createdAt: string
  updatedAt: string
  messages?: Message[]
}

export interface Dataset {
  id: number
  name: string
  description: string
  type: 'text' | 'image' | 'audio' | 'video' | 'mixed'
  status: 'uploading' | 'processing' | 'completed' | 'error'
  fileCount: number
  size: string
  createdAt: string
  lastModified: string
}

export interface UserSettings {
  profile: {
    name: string
    email: string
    avatar?: string
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: 'zh' | 'en'
    defaultModel: string
  }
  notifications: {
    email: boolean
    browser: boolean
    workflowCompletion: boolean
    agentErrors: boolean
    systemUpdates: boolean
  }
  apiKeys: {
    openai: string
    anthropic: string
    google: string
  }
  security: {
    twoFactorEnabled: boolean
    sessionTimeout: number
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface SystemStatus {
  status: 'healthy' | 'degraded' | 'down'
  services: Record<string, boolean>
  uptime: string
  version: string
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  status: 'running' | 'success' | 'error' | 'cancelled'
  startedAt: string
  finishedAt?: string
  inputData: Record<string, any>
  outputData?: Record<string, any>
  errorMessage?: string
}

export interface MCPTool {
  id: number
  name: string
  description: string
  category: string
  version: string
  status: 'installed' | 'available' | 'updating' | 'error'
  config: Record<string, any>
}


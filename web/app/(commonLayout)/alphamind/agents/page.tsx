'use client'

import React, { useEffect, useState } from 'react'
import {
  Bot,
  Edit,
  Grid,
  List,
  MoreVertical,
  Pause,
  Play,
  Plus,
  Search,
  Trash2,
  TrendingUp,
} from 'lucide-react'

type Agent = {
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
}

type AgentStats = {
  total: number
  active: number
  inactive: number
  training: number
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [stats, setStats] = useState<AgentStats>({ total: 0, active: 0, inactive: 0, training: 0 })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // 模拟数据加载
  useEffect(() => {
    const loadAgents = async () => {
      setLoading(true)
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))

        const mockAgents: Agent[] = [
          {
            id: 1,
            name: '通用助手',
            description: '帮助用户处理各种日常任务和问题',
            type: 'assistant',
            status: 'active',
            model: 'gpt-3.5-turbo',
            conversations: 156,
            successRate: 94.5,
            lastUsed: '2小时前',
            createdAt: '2024-01-15',
          },
          {
            id: 2,
            name: '数据分析师',
            description: '专业的数据分析和可视化智能体',
            type: 'analyst',
            status: 'active',
            model: 'gpt-4',
            conversations: 89,
            successRate: 97.2,
            lastUsed: '30分钟前',
            createdAt: '2024-01-10',
          },
          {
            id: 3,
            name: '内容创作者',
            description: '创意写作和内容生成专家',
            type: 'creator',
            status: 'inactive',
            model: 'gpt-3.5-turbo',
            conversations: 234,
            successRate: 91.8,
            lastUsed: '1天前',
            createdAt: '2024-01-08',
          },
          {
            id: 4,
            name: '工作流执行器',
            description: '自动化任务执行和流程管理',
            type: 'workflow',
            status: 'training',
            model: 'gpt-4',
            conversations: 45,
            successRate: 88.9,
            lastUsed: '5小时前',
            createdAt: '2024-01-20',
          },
        ]

        setAgents(mockAgents)

        // 计算统计数据
        const newStats = {
          total: mockAgents.length,
          active: mockAgents.filter(a => a.status === 'active').length,
          inactive: mockAgents.filter(a => a.status === 'inactive').length,
          training: mockAgents.filter(a => a.status === 'training').length,
        }
        setStats(newStats)
      }
 catch (error) {
        console.error('Failed to load agents:', error)
      }
 finally {
        setLoading(false)
      }
    }

    loadAgents()
  }, [])

  // 过滤智能体
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase())
                         || agent.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || agent.type === filterType
    const matchesStatus = filterStatus === 'all' || agent.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeLabel = (type: string) => {
    const labels = {
      assistant: '通用助手',
      analyst: '数据分析师',
      creator: '内容创作者',
      workflow: '工作流执行器',
    }
    return labels[type as keyof typeof labels] || type
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      training: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    }
    return colors[status as keyof typeof colors] || colors.inactive
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      active: '运行中',
      inactive: '已停止',
      training: '训练中',
    }
    return labels[status as keyof typeof labels] || status
  }

  const toggleAgentStatus = (agentId: number) => {
    setAgents(prev => prev.map(agent =>
      agent.id === agentId
        ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' as any }
        : agent,
    ))
  }

  const deleteAgent = (agentId: number) => {
    if (confirm('确定要删除这个智能体吗？此操作不可撤销。'))
      setAgents(prev => prev.filter(agent => agent.id !== agentId))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部 */}
      <div className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">智能体管理</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                创建、配置和管理您的AI智能体
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="mr-2 h-5 w-5" />
              创建智能体
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 统计卡片 */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="shrink-0">
                <Bot className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">总数</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="shrink-0">
                <Play className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">运行中</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="shrink-0">
                <Pause className="h-8 w-8 text-gray-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">已停止</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.inactive}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="shrink-0">
                <TrendingUp className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">训练中</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.training}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索和过滤 */}
        <div className="mb-6 rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索智能体..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">所有类型</option>
                  <option value="assistant">通用助手</option>
                  <option value="analyst">数据分析师</option>
                  <option value="creator">内容创作者</option>
                  <option value="workflow">工作流执行器</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">所有状态</option>
                  <option value="active">运行中</option>
                  <option value="inactive">已停止</option>
                  <option value="training">训练中</option>
                </select>

                <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 智能体列表 */}
        {loading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">加载中...</p>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="py-12 text-center">
            <Bot className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all' ? '没有找到匹配的智能体' : '还没有智能体'}
            </h3>
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                ? '尝试调整搜索条件或过滤器'
                : '创建您的第一个智能体开始使用'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Plus className="mr-2 h-5 w-5" />
              创建智能体
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
            : 'space-y-4'
          }>
            {filteredAgents.map(agent => (
              <div
                key={agent.id}
                className={`rounded-lg bg-white shadow transition-shadow hover:shadow-md dark:bg-gray-800 ${
                  viewMode === 'list' ? 'p-6' : 'p-6'
                }`}
              >
                {viewMode === 'grid' ? (
                  // 网格视图
                  <div>
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                          agent.status === 'active' ? 'bg-green-100 dark:bg-green-900'
                          : agent.status === 'training' ? 'bg-yellow-100 dark:bg-yellow-900'
                          : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <Bot className={`h-6 w-6 ${
                            agent.status === 'active' ? 'text-green-600 dark:text-green-400'
                            : agent.status === 'training' ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-gray-400'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {agent.name}
                          </h3>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(agent.status)}`}>
                            {getStatusLabel(agent.status)}
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                      {agent.description}
                    </p>

                    <div className="mb-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">类型</span>
                        <span className="text-gray-900 dark:text-white">{getTypeLabel(agent.type)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">模型</span>
                        <span className="text-gray-900 dark:text-white">{agent.model}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">对话数</span>
                        <span className="text-gray-900 dark:text-white">{agent.conversations}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">成功率</span>
                        <span className="text-gray-900 dark:text-white">{agent.successRate}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        最后使用: {agent.lastUsed}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleAgentStatus(agent.id)}
                          className={`rounded-lg p-2 ${
                            agent.status === 'active'
                              ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                              : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                          }`}
                          title={agent.status === 'active' ? '停止' : '启动'}
                        >
                          {agent.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </button>
                        <button className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteAgent(agent.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // 列表视图
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                        agent.status === 'active' ? 'bg-green-100 dark:bg-green-900'
                        : agent.status === 'training' ? 'bg-yellow-100 dark:bg-yellow-900'
                        : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <Bot className={`h-6 w-6 ${
                          agent.status === 'active' ? 'text-green-600 dark:text-green-400'
                          : agent.status === 'training' ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {agent.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {agent.description}
                        </p>
                        <div className="mt-1 flex items-center space-x-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(agent.status)}`}>
                            {getStatusLabel(agent.status)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {getTypeLabel(agent.type)} • {agent.model}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {agent.conversations} 对话
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          成功率 {agent.successRate}%
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleAgentStatus(agent.id)}
                          className={`rounded-lg p-2 ${
                            agent.status === 'active'
                              ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                              : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                          }`}
                        >
                          {agent.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </button>
                        <button className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteAgent(agent.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 创建智能体模态框 */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              创建新智能体
            </h3>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
              此功能正在开发中，敬请期待！
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

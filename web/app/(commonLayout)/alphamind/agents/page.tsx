'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Bot,
  MessageSquare,
  TrendingUp,
  Settings,
  Grid,
  List
} from 'lucide-react'

interface Agent {
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

interface AgentStats {
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
            createdAt: '2024-01-15'
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
            createdAt: '2024-01-10'
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
            createdAt: '2024-01-08'
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
            createdAt: '2024-01-20'
          }
        ]
        
        setAgents(mockAgents)
        
        // 计算统计数据
        const newStats = {
          total: mockAgents.length,
          active: mockAgents.filter(a => a.status === 'active').length,
          inactive: mockAgents.filter(a => a.status === 'inactive').length,
          training: mockAgents.filter(a => a.status === 'training').length
        }
        setStats(newStats)
      } catch (error) {
        console.error('Failed to load agents:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAgents()
  }, [])

  // 过滤智能体
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || agent.type === filterType
    const matchesStatus = filterStatus === 'all' || agent.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeLabel = (type: string) => {
    const labels = {
      assistant: '通用助手',
      analyst: '数据分析师',
      creator: '内容创作者',
      workflow: '工作流执行器'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      training: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }
    return colors[status as keyof typeof colors] || colors.inactive
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      active: '运行中',
      inactive: '已停止',
      training: '训练中'
    }
    return labels[status as keyof typeof labels] || status
  }

  const toggleAgentStatus = (agentId: number) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' as any }
        : agent
    ))
  }

  const deleteAgent = (agentId: number) => {
    if (confirm('确定要删除这个智能体吗？此操作不可撤销。')) {
      setAgents(prev => prev.filter(agent => agent.id !== agentId))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">智能体管理</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                创建、配置和管理您的AI智能体
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              创建智能体
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Bot className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">总数</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Play className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">运行中</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Pause className="h-8 w-8 text-gray-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">已停止</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.inactive}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索智能体..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">所有类型</option>
                  <option value="assistant">通用助手</option>
                  <option value="analyst">数据分析师</option>
                  <option value="creator">内容创作者</option>
                  <option value="workflow">工作流执行器</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">所有状态</option>
                  <option value="active">运行中</option>
                  <option value="inactive">已停止</option>
                  <option value="training">训练中</option>
                </select>

                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
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
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">加载中...</p>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all' ? '没有找到匹配的智能体' : '还没有智能体'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
                ? '尝试调整搜索条件或过滤器' 
                : '创建您的第一个智能体开始使用'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              创建智能体
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'p-6' : 'p-6'
                }`}
              >
                {viewMode === 'grid' ? (
                  // 网格视图
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          agent.status === 'active' ? 'bg-green-100 dark:bg-green-900' : 
                          agent.status === 'training' ? 'bg-yellow-100 dark:bg-yellow-900' :
                          'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <Bot className={`h-6 w-6 ${
                            agent.status === 'active' ? 'text-green-600 dark:text-green-400' :
                            agent.status === 'training' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-gray-400'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {agent.name}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                            {getStatusLabel(agent.status)}
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {agent.description}
                    </p>

                    <div className="space-y-2 mb-4">
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

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        最后使用: {agent.lastUsed}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleAgentStatus(agent.id)}
                          className={`p-2 rounded-lg ${
                            agent.status === 'active' 
                              ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' 
                              : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                          }`}
                          title={agent.status === 'active' ? '停止' : '启动'}
                        >
                          {agent.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteAgent(agent.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
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
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        agent.status === 'active' ? 'bg-green-100 dark:bg-green-900' : 
                        agent.status === 'training' ? 'bg-yellow-100 dark:bg-yellow-900' :
                        'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <Bot className={`h-6 w-6 ${
                          agent.status === 'active' ? 'text-green-600 dark:text-green-400' :
                          agent.status === 'training' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {agent.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {agent.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
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
                          className={`p-2 rounded-lg ${
                            agent.status === 'active' 
                              ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' 
                              : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                          }`}
                        >
                          {agent.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteAgent(agent.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              创建新智能体
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              此功能正在开发中，敬请期待！
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
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


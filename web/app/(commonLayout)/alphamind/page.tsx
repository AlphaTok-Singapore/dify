'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Bot, 
  MessageSquare, 
  Database, 
  Settings, 
  Workflow,
  TrendingUp,
  Users,
  Activity,
  Clock
} from 'lucide-react'

interface DashboardStats {
  totalAgents: number
  activeConversations: number
  workflowExecutions: number
  dataProcessed: string
}

export default function AlphaMindPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalAgents: 0,
    activeConversations: 0,
    workflowExecutions: 0,
    dataProcessed: '0 MB'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟加载统计数据
    const loadStats = async () => {
      try {
        // 这里应该调用实际的API
        await new Promise(resolve => setTimeout(resolve, 1000))
        setStats({
          totalAgents: 12,
          activeConversations: 45,
          workflowExecutions: 128,
          dataProcessed: '2.4 GB'
        })
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const quickActions = [
    {
      title: '智能体管理',
      description: '创建和管理AI智能体',
      icon: Bot,
      href: '/alphamind/agents',
      color: 'bg-blue-500'
    },
    {
      title: '开始对话',
      description: '与智能体进行对话',
      icon: MessageSquare,
      href: '/alphamind/chat',
      color: 'bg-green-500'
    },
    {
      title: '数据管理',
      description: '管理数据集和知识库',
      icon: Database,
      href: '/alphamind/data',
      color: 'bg-purple-500'
    },
    {
      title: '系统设置',
      description: '配置系统参数',
      icon: Settings,
      href: '/alphamind/settings',
      color: 'bg-orange-500'
    }
  ]

  const recentActivities = [
    { id: 1, type: 'agent', message: '创建了新智能体 "数据分析师"', time: '2分钟前' },
    { id: 2, type: 'chat', message: '与智能体 "助手" 开始了新对话', time: '5分钟前' },
    { id: 3, type: 'workflow', message: '工作流 "数据处理" 执行完成', time: '10分钟前' },
    { id: 4, type: 'data', message: '上传了新数据集 "客户反馈"', time: '15分钟前' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                AlphaMind 控制台
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                智能体管理和工作流自动化平台
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">系统正常</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Bot className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">智能体总数</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {loading ? '...' : stats.totalAgents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageSquare className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">活跃对话</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {loading ? '...' : stats.activeConversations}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Workflow className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">工作流执行</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {loading ? '...' : stats.workflowExecutions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Database className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">数据处理量</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {loading ? '...' : stats.dataProcessed}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 快速操作 */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">快速操作</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action) => (
                    <Link
                      key={action.title}
                      href={action.href}
                      className="group relative rounded-lg p-6 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 p-3 rounded-lg ${action.color}`}>
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 最近活动 */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">最近活动</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link
                    href="/alphamind/activity"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                  >
                    查看所有活动 →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 系统状态 */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">系统状态</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-3">
                    <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">API 服务</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">正常运行</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-3">
                    <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">数据库</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">连接正常</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-3">
                    <Workflow className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">n8n 工作流</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">服务可用</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


'use client'

import React, { useEffect, useState } from 'react'
import { Activity, AreaChart, Database, LineChart, PieChart, Plus, Users } from 'lucide-react'

type AnalyticsCategory = {
  id: number
  name: string
  description: string
  icon: React.ReactNode
}

export default function AnalyticsPage() {
  const [categories, setCategories] = useState<AnalyticsCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<AnalyticsCategory | null>(null)

  // 模拟分析类别数据
  useEffect(() => {
    const mockCategories: AnalyticsCategory[] = [
      {
        id: 1,
        name: '用户分析',
        description: '用户活动和行为分析',
        icon: <Users className="h-5 w-5" />,
      },
      {
        id: 2,
        name: 'API使用情况',
        description: '接口调用和性能分析',
        icon: <Activity className="h-5 w-5" />,
      },
      {
        id: 3,
        name: '系统资源',
        description: '服务器和资源利用率',
        icon: <Database className="h-5 w-5" />,
      },
      {
        id: 4,
        name: '智能体性能',
        description: 'AI助手性能和响应时间',
        icon: <AreaChart className="h-5 w-5" />,
      },
    ]
    setCategories(mockCategories)
    setSelectedCategory(mockCategories[0])
  }, [])

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* 侧边栏 - 分析类别 */}
      <div className="flex w-80 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">分析类别</h2>
            <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className={`w-full rounded-lg p-3 text-left transition-colors ${
                selectedCategory?.id === category.id
                  ? 'border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {category.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {category.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 主分析内容区域 */}
      <div className="flex flex-1 flex-col">
        {/* 分析数据 */}
        <div className="p-6">
          <h1 className="mb-4 text-2xl font-bold">数据分析</h1>
          {selectedCategory ? (
            <div>
              <div className="mb-6 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                    {selectedCategory.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedCategory.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedCategory.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300">总用户数</h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">5,248</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                    <h3 className="font-semibold text-green-800 dark:text-green-300">活跃工作流</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">124</p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-300">API调用</h3>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">89,632</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">每日活跃用户</h3>
                    <LineChart className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-gray-500 dark:text-gray-400">图表将在这里显示</p>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">资源分布</h3>
                    <PieChart className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-gray-500 dark:text-gray-400">图表将在这里显示</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <p className="text-gray-600 dark:text-gray-400">
                请选择一个分析类别来查看相关数据。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

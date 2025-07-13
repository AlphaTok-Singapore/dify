'use client'

import React, { useEffect, useState } from 'react'
import {
  Database,
  Download,
  Eye,
  FileText,
  FileUp,
  Image,
  Music,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Video,
} from 'lucide-react'

type Dataset = {
  id: number
  name: string
  description: string
  type: 'text' | 'image' | 'audio' | 'video' | 'mixed'
  status: 'uploading' | 'processing' | 'completed' | 'error'
  recordCount: number
  size: string
  createdAt: string
  lastModified: string
}

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    const loadDatasets = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        const mockDatasets: Dataset[] = [
          {
            id: 1,
            name: '客户反馈数据集',
            description: '收集的客户反馈和评价数据，用于训练客服智能体',
            type: 'text',
            status: 'completed',
            recordCount: 5243,
            size: '24.5 MB',
            createdAt: '2025-06-15',
            lastModified: '2025-06-28',
          },
          {
            id: 2,
            name: '销售数据集',
            description: '历史销售记录和客户行为数据',
            type: 'mixed',
            status: 'completed',
            recordCount: 18654,
            size: '78.2 MB',
            createdAt: '2025-05-20',
            lastModified: '2025-06-25',
          },
          {
            id: 3,
            name: '产品反馈集',
            description: '用户产品使用反馈和功能建议',
            type: 'text',
            status: 'processing',
            recordCount: 3210,
            size: '15.7 MB',
            createdAt: '2025-06-25',
            lastModified: '2025-07-01',
          },
        ]

        setDatasets(mockDatasets)
      }
 catch (error) {
        console.error('Failed to load datasets:', error)
      }
 finally {
        setLoading(false)
      }
    }

    loadDatasets()
  }, [])

  const filteredDatasets = datasets.filter((dataset) => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase())
                         || dataset.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || dataset.type === filterType

    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: string) => {
    const icons = {
      text: FileText,
      image: Image,
      audio: Music,
      video: Video,
      mixed: Database,
    }
    return icons[type as keyof typeof icons] || Database
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">数据集</h1>
        <p className="text-gray-600 dark:text-gray-400">
          管理用于训练和改进智能体的结构化数据集
        </p>
      </div>

      {/* 搜索和过滤 */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="搜索数据集..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex space-x-2">
          <select
            className="block rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
          >
            <option value="all">所有类型</option>
            <option value="text">文本</option>
            <option value="image">图片</option>
            <option value="audio">音频</option>
            <option value="video">视频</option>
            <option value="mixed">混合</option>
          </select>

          <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            高级过滤
          </button>

          <button className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Plus className="mr-2 h-4 w-4" />
            新建数据集
          </button>
        </div>
      </div>

      {/* 数据集列表 */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDatasets.map(dataset => (
            <div key={dataset.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="p-6">
                <div className="mb-4 flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    {React.createElement(getTypeIcon(dataset.type), { className: 'h-6 w-6 text-blue-600 dark:text-blue-400' })}
                  </div>
                  <div>
                    <h3 className="truncate text-lg font-medium text-gray-900 dark:text-white" title={dataset.name}>
                      {dataset.name}
                    </h3>
                    <div className="mt-1 flex items-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        dataset.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : dataset.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {dataset.status === 'completed' ? '已完成' : dataset.status === 'processing' ? '处理中' : '上传中'}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400" title={dataset.description}>
                  {dataset.description}
                </p>

                <div className="flex flex-wrap gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="mr-4 flex items-center">
                    <Database className="mr-1 h-4 w-4" />
                    <span>{dataset.recordCount.toLocaleString()} 条记录</span>
                  </div>
                  <div className="mr-4 flex items-center">
                    <FileUp className="mr-1 h-4 w-4" />
                    <span>{dataset.createdAt}</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="mr-1 h-4 w-4" />
                    <span>{dataset.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-600 dark:bg-gray-700">
                <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  <Eye className="h-5 w-5" />
                </button>
                <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  <Download className="h-5 w-5" />
                </button>
                <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredDatasets.length === 0 && !loading && (
        <div className="py-12 text-center">
          <Database className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">无数据集</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            还没有创建任何数据集或没有与搜索匹配的数据集。
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="mr-2 h-5 w-5" />
              创建新数据集
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

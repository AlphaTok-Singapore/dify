'use client'

import React, { useEffect, useState } from 'react'
import {
  Database,
  Download,
  Eye,
  FileText,
  Image,
  MoreVertical,
  Music,
  Search,
  Trash2,
  Upload,
  Video,
} from 'lucide-react'

type Dataset = {
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

export default function DataPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showUploadModal, setShowUploadModal] = useState(false)

  useEffect(() => {
    const loadDatasets = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        const mockDatasets: Dataset[] = [
          {
            id: 1,
            name: '客户反馈数据',
            description: '收集的客户反馈和评价数据',
            type: 'text',
            status: 'completed',
            fileCount: 1250,
            size: '45.2 MB',
            createdAt: '2024-01-15',
            lastModified: '2024-01-20',
          },
          {
            id: 2,
            name: '产品图片库',
            description: '产品展示图片和宣传素材',
            type: 'image',
            status: 'completed',
            fileCount: 890,
            size: '2.1 GB',
            createdAt: '2024-01-10',
            lastModified: '2024-01-18',
          },
          {
            id: 3,
            name: '培训视频',
            description: '员工培训和教学视频资料',
            type: 'video',
            status: 'processing',
            fileCount: 45,
            size: '8.7 GB',
            createdAt: '2024-01-22',
            lastModified: '2024-01-22',
          },
          {
            id: 4,
            name: '会议录音',
            description: '重要会议的录音文件',
            type: 'audio',
            status: 'completed',
            fileCount: 156,
            size: '1.2 GB',
            createdAt: '2024-01-08',
            lastModified: '2024-01-16',
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
    const matchesStatus = filterStatus === 'all' || dataset.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
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

  const getTypeLabel = (type: string) => {
    const labels = {
      text: '文本',
      image: '图片',
      audio: '音频',
      video: '视频',
      mixed: '混合',
    }
    return labels[type as keyof typeof labels] || type
  }

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      processing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      uploading: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    }
    return colors[status as keyof typeof colors] || colors.completed
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      completed: '已完成',
      processing: '处理中',
      uploading: '上传中',
      error: '错误',
    }
    return labels[status as keyof typeof labels] || status
  }

  const deleteDataset = (datasetId: number) => {
    if (confirm('确定要删除这个数据集吗？此操作不可撤销。'))
      setDatasets(prev => prev.filter(dataset => dataset.id !== datasetId))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部 */}
      <div className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">数据管理</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                管理数据集和知识库，为智能体提供数据支持
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Upload className="mr-2 h-5 w-5" />
              上传数据
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
                <Database className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">数据集总数</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{datasets.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="shrink-0">
                <FileText className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">文件总数</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {datasets.reduce((sum, dataset) => sum + dataset.fileCount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="shrink-0">
                <Upload className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">存储使用</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">12.0 GB</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="shrink-0">
                <Eye className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">处理中</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {datasets.filter(d => d.status === 'processing').length}
                </p>
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
                    placeholder="搜索数据集..."
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
                  <option value="text">文本</option>
                  <option value="image">图片</option>
                  <option value="audio">音频</option>
                  <option value="video">视频</option>
                  <option value="mixed">混合</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">所有状态</option>
                  <option value="completed">已完成</option>
                  <option value="processing">处理中</option>
                  <option value="uploading">上传中</option>
                  <option value="error">错误</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 数据集列表 */}
        {loading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">加载中...</p>
          </div>
        ) : filteredDatasets.length === 0 ? (
          <div className="py-12 text-center">
            <Database className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all' ? '没有找到匹配的数据集' : '还没有数据集'}
            </h3>
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                ? '尝试调整搜索条件或过滤器'
                : '上传您的第一个数据集开始使用'}
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Upload className="mr-2 h-5 w-5" />
              上传数据
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDatasets.map((dataset) => {
              const TypeIcon = getTypeIcon(dataset.type)
              return (
                <div
                  key={dataset.id}
                  className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md dark:bg-gray-800"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                        <TypeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {dataset.name}
                        </h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(dataset.status)}`}>
                          {getStatusLabel(dataset.status)}
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
                    {dataset.description}
                  </p>

                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">类型</span>
                      <span className="text-gray-900 dark:text-white">{getTypeLabel(dataset.type)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">文件数</span>
                      <span className="text-gray-900 dark:text-white">{dataset.fileCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">大小</span>
                      <span className="text-gray-900 dark:text-white">{dataset.size}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">创建时间</span>
                      <span className="text-gray-900 dark:text-white">{dataset.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      最后修改: {dataset.lastModified}
                    </span>
                    <div className="flex space-x-2">
                      <button className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteDataset(dataset.id)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 上传模态框 */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              上传数据集
            </h3>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
              此功能正在开发中，敬请期待！
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUploadModal(false)}
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

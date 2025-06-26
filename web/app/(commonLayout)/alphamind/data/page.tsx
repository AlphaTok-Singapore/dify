'use client'

import React, { useState, useEffect } from 'react'
import { 
  Upload, 
  Database, 
  FileText, 
  Image, 
  Music, 
  Video,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Plus,
  MoreVertical
} from 'lucide-react'

interface Dataset {
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
            lastModified: '2024-01-20'
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
            lastModified: '2024-01-18'
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
            lastModified: '2024-01-22'
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
            lastModified: '2024-01-16'
          }
        ]
        
        setDatasets(mockDatasets)
      } catch (error) {
        console.error('Failed to load datasets:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDatasets()
  }, [])

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase())
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
      mixed: Database
    }
    return icons[type as keyof typeof icons] || Database
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      text: '文本',
      image: '图片',
      audio: '音频',
      video: '视频',
      mixed: '混合'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      processing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      uploading: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[status as keyof typeof colors] || colors.completed
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      completed: '已完成',
      processing: '处理中',
      uploading: '上传中',
      error: '错误'
    }
    return labels[status as keyof typeof labels] || status
  }

  const deleteDataset = (datasetId: number) => {
    if (confirm('确定要删除这个数据集吗？此操作不可撤销。')) {
      setDatasets(prev => prev.filter(dataset => dataset.id !== datasetId))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">数据管理</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                管理数据集和知识库，为智能体提供数据支持
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Upload className="h-5 w-5 mr-2" />
              上传数据
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
                <Database className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">数据集总数</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{datasets.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
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

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Upload className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">存储使用</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">12.0 GB</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索数据集..."
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
                  <option value="text">文本</option>
                  <option value="image">图片</option>
                  <option value="audio">音频</option>
                  <option value="video">视频</option>
                  <option value="mixed">混合</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">加载中...</p>
          </div>
        ) : filteredDatasets.length === 0 ? (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all' ? '没有找到匹配的数据集' : '还没有数据集'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
                ? '尝试调整搜索条件或过滤器' 
                : '上传您的第一个数据集开始使用'}
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload className="h-5 w-5 mr-2" />
              上传数据
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDatasets.map((dataset) => {
              const TypeIcon = getTypeIcon(dataset.type)
              return (
                <div
                  key={dataset.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <TypeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {dataset.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(dataset.status)}`}>
                          {getStatusLabel(dataset.status)}
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
                    {dataset.description}
                  </p>

                  <div className="space-y-2 mb-4">
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

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      最后修改: {dataset.lastModified}
                    </span>
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg">
                        <Download className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteDataset(dataset.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              上传数据集
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              此功能正在开发中，敬请期待！
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUploadModal(false)}
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


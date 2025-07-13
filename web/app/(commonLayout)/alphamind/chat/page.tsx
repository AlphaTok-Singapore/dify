'use client'

import React, { useRef, useState } from 'react'
import AlphaMindDashboardLayout from '../components/AlphaMindDashboardLayout'
import { Image as ImageIcon, Send } from 'lucide-react'

const PROVIDER_OPTIONS = [
  'Ollama',
  'OpenAI',
  'Deepseek',
]
const MODEL_OPTIONS = [
  'Qwen3 8b',
  'Qwen2.5vl:7b',
  'Gemma3:4b',
  'Deepseek-r1:8b',
  'Phi4:latest',
]
const COLLECTION_OPTIONS = [
  'Select a collection',
  'KnowledgeBase1',
  'KnowledgeBase2',
]

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  type?: 'text' | 'image' | 'article'
  fileUrl?: string
  timestamp: Date
}

export default function ChatPage() {
  const [provider, setProvider] = useState('Ollama')
  const [model, setModel] = useState('Qwen3 8b')
  const [collection, setCollection] = useState('Select a collection')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const sendMessage = async () => {
    if (!inputMessage.trim() && !file) return
    setIsLoading(true)
    const newMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      type: file ? (file.type.startsWith('image') ? 'image' : 'article') : 'text',
      fileUrl: file ? URL.createObjectURL(file) : undefined,
      timestamp: new Date(),
    }
    setMessages((prev: Message[]) => [...prev, newMsg])
    setInputMessage('')
    setFile(null)
    // 模拟回复
    setTimeout(() => {
      setMessages((prev: Message[]) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a mock response.',
        timestamp: new Date(),
      }])
      setIsLoading(false)
    }, 1200)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0])
      setFile(e.target.files[0])
  }

  return (
    <AlphaMindDashboardLayout>
      <div className="mx-auto mt-8 w-full max-w-4xl rounded-lg bg-white p-8 shadow">
        {/* 顶部下拉框区 */}
        <div className="mb-6 flex flex-wrap gap-6">
          <div className="flex min-w-[180px] flex-1 flex-col">
            <label className="mb-1 font-semibold text-gray-700" htmlFor="collection-select">Select collection</label>
            <select
              id="collection-select"
              aria-label="Select collection"
              className="rounded border bg-white px-3 py-2 text-gray-900"
              value={collection}
              onChange={e => setCollection(e.target.value)}
            >
              {COLLECTION_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="flex min-w-[140px] flex-1 flex-col">
            <label className="mb-1 font-semibold text-gray-700" htmlFor="provider-select">Provider</label>
            <select
              id="provider-select"
              aria-label="Provider"
              className="rounded border bg-white px-3 py-2 text-gray-900"
              value={provider}
              onChange={e => setProvider(e.target.value)}
            >
              {PROVIDER_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="flex min-w-[140px] flex-1 flex-col">
            <label className="mb-1 font-semibold text-gray-700" htmlFor="model-select">Model</label>
            <select
              id="model-select"
              aria-label="Model"
              className="rounded border bg-white px-3 py-2 text-gray-900"
              value={model}
              onChange={e => setModel(e.target.value)}
            >
              {MODEL_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
        {/* 聊天消息区 */}
        <div className="mb-4 max-h-[480px] min-h-[320px] overflow-y-auto rounded-lg border bg-white p-6">
          {messages.length === 0 ? (
            <div className="py-12 text-center text-gray-400">Welcome! Select collection and ask questions about your documents.</div>
          ) : (
            messages.map((msg: Message) => (
              <div key={msg.id} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-lg px-4 py-2 ${msg.role === 'user' ? 'bg-green-100 text-right' : 'bg-gray-100 text-left'}`}>
                  {/* 拆分嵌套三元表达式为独立 if/else 语句 */}
                  {(() => {
                    if (msg.type === 'image' && msg.fileUrl)
                      return <img src={msg.fileUrl} alt="uploaded" className="mb-2 max-w-xs rounded" />
                     else if (msg.type === 'article' && msg.fileUrl)
                      return <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="mb-2 block text-blue-600 underline">[Uploaded Article]</a>

                    return null
                  })()}
                  <span className="whitespace-pre-wrap break-words">{msg.content}</span>
                  <div className="mt-1 text-xs text-gray-400">{msg.timestamp?.toLocaleTimeString()}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* 输入区 */}
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
        >
          <label className="flex cursor-pointer items-center" title="Upload Image or Article">
            <input
              type="file"
              accept="image/*,.txt,.md,.pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
              aria-label="Upload Image or Article"
            />
            <ImageIcon className="mr-2 h-6 w-6 text-gray-400 hover:text-blue-500" aria-label="Upload Image or Article" />
          </label>
          <input
            type="text"
            className="flex-1 rounded border bg-white px-3 py-2 text-gray-900"
            placeholder="Type your message here..."
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            disabled={isLoading}
            aria-label="Message input"
          />
          <button
            type="submit"
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-gray-300"
            disabled={isLoading || (!inputMessage.trim() && !file)}
            aria-label="Send message"
            title="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </AlphaMindDashboardLayout>
  )
}

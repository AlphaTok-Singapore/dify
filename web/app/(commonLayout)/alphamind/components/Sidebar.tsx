import React from 'react'

type SidebarProps = {
  isOpen?: boolean
  onClose?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => (
  <aside className={`alphamind-sidebar fixed left-0 top-0 h-full w-64 bg-white shadow-lg transition-transform dark:bg-gray-900 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
    <div className="flex h-16 items-center justify-between border-b px-4 dark:border-gray-700">
      <span className="font-bold">菜单</span>
      <button onClick={onClose} className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
        <span className="material-icons">close</span>
      </button>
    </div>
    <nav className="p-4">
      <ul>
        <li className="mb-2"><a href="#" className="hover:underline">首页</a></li>
        <li className="mb-2"><a href="#" className="hover:underline">智能体</a></li>
        <li className="mb-2"><a href="#" className="hover:underline">数据集</a></li>
      </ul>
    </nav>
  </aside>
)

import React from 'react'

type HeaderProps = {
  onMenuClick?: () => void
  currentModule?: string
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, currentModule }) => (
  <header className="alphamind-header flex h-16 items-center bg-white px-4 shadow dark:bg-gray-800">
    <button onClick={onMenuClick} className="mr-4 rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
      <span className="material-icons">menu</span>
    </button>
    <h1 className="text-lg font-bold">{currentModule || 'AlphaMind'}</h1>
  </header>
)

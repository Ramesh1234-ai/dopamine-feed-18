import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useSavedArtworks } from '../../context/SavedArtworksContext'

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()
  const { saved } = useSavedArtworks()

  const navItems = [
    { icon: '🎨', label: 'Gallery', path: '/gallery', color: 'from-purple-400 to-pink-400' },
    { icon: '❤️', label: 'Saved Artworks', path: '/preferences', color: 'from-red-400 to-pink-400' },
    { icon: '⚙️', label: 'Preferences', path: '/preferences', color: 'from-blue-400 to-cyan-400' },
  ]

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`fixed top-5 ${isCollapsed ? 'left-3' : 'left-64'} z-[1001] w-9 h-9 bg-white/95 backdrop-blur-md border border-white/10 rounded-lg text-black flex items-center justify-center transition-all duration-300 hover:bg-white hover:border-white/20 hover:scale-105 active:scale-95 shadow-lg`}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={isCollapsed ? 'Expand' : 'Collapse'}
      >
        {isCollapsed ? '→' : '←'}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl border-r border-purple-500/10 p-6 flex flex-col transition-transform duration-300 z-[1000] shadow-2xl overflow-y-auto ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-purple-500/20">
          <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30 flex-shrink-0">
            🎨
          </div>
          <div className="flex-1">
            <h2 className="text-white font-bold text-lg">AI Gallery</h2>
            <p className="text-purple-300/60 text-xs">Explore & Create</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm relative w-full text-left group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border border-purple-500/30'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white border border-transparent hover:border-purple-500/20'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-r" />
                )}
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {isActive && <span className="text-purple-400 text-xl">→</span>}
              </button>
            )
          })}

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-transparent my-4" />

          {/* Stats Section */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-400 mb-2">Your Collection</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300">Saved Items</span>
                <span className="text-purple-300 font-semibold">{saved.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-300">Categories</span>
                <span className="text-pink-300 font-semibold">{new Set(saved.map(s => s.category || 'Other')).size}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-300">Tags</span>
                <span className="text-blue-300 font-semibold">{new Set(saved.flatMap(s => s.tags || [])).size}</span>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <button
            onClick={() => navigate('/help')}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm text-gray-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-purple-500/20 w-full text-left group"
          >
            <span className="text-lg">❓</span>
            <span>Help & Support</span>
          </button>
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto pt-4 border-t border-purple-500/20">
          {user && (
            <>
              <div className="flex items-center gap-3 mb-4 px-3 py-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <img
                  src={user?.imageUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt={user?.firstName || 'User'}
                  className="w-10 h-10 rounded-full flex-shrink-0 border border-purple-400/30"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-semibold truncate">
                    {user?.firstName || 'User'}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {user?.emailAddresses?.[0]?.emailAddress || 'user@example.com'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border border-purple-500/30 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 hover:from-purple-500/30 hover:to-pink-500/30 hover:text-purple-100 hover:border-purple-500/50 hover:-translate-y-0.5 active:translate-y-0"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar

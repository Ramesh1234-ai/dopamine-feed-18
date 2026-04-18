import { useNavigate } from 'react-router-dom'
import { useAuth, UserButton } from '@clerk/clerk-react'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const navigate = useNavigate()
  const { isSignedIn, user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Gallery', path: '/gallery', icon: '🖼️' },
    { label: 'Upload', path: '/upload', icon: '📤' },
    { label: 'Preferences', path: '/preferences', icon: '⚙️' },
    { label: 'Creation', path: '/Creation', icon: '✨' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('/gallery')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all">
              🎨
            </div>
            <span className="font-bold text-lg text-white hidden sm:inline">
              AI Gallery
            </span>
          </button>

          {/* Navigation Links - Hidden on Mobile */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, path, icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="px-3 py-2 text-sm font-500 text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
              >
                <span className="mr-1">{icon}</span>
                {label}
              </button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Section */}
            {isSignedIn && (
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-400 hidden sm:block">
                  Welcome, <span className="text-indigo-400">{user?.firstName || 'User'}</span>
                </div>
                <div className="border-l border-slate-700"></div>
                <UserButton afterSignOutUrl="/login" />
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-slate-700/50">
            {navLinks.map(({ label, path, icon }) => (
              <button
                key={path}
                onClick={() => {
                  navigate(path)
                  setMobileMenuOpen(false)
                }}
                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-slate-800/50 hover:text-white transition-all"
              >
                <span className="mr-2">{icon}</span>
                {label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

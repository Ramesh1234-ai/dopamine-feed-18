import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { preferencesManager, defaultPreferences } from '../../utils/preferencesManager'
import '../../styles/settings-panel.css'

export default function SettingsPanel() {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState(defaultPreferences)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user?.id) {
      const prefs = preferencesManager.getPreferences(user?.id)
      setPreferences(prefs)
    }
  }, [user?.id])

  const handlePreferenceChange = (key, value) => {
    const updatedPreferences = { ...preferences, [key]: value }
    setPreferences(updatedPreferences)
    setSaved(false)
  }

  const handleSavePreferences = () => {
    if (user?.id) {
      preferencesManager.setPreferences(user?.id, preferences)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleResetPreferences = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      if (user?.id) {
        preferencesManager.resetPreferences(user?.id)
        setPreferences(defaultPreferences)
        setSaved(true)
      }
    }
  }

  return (
    <div className="settings-panel">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="settings-section">
          <h3 className="text-lg font-semibold text-white mb-6">Profile Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={preferences.displayName}
                onChange={(e) => handlePreferenceChange('displayName', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your display name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={preferences.bio}
                onChange={(e) => handlePreferenceChange('bio', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows="4"
                placeholder="Tell us about yourself"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="private"
                checked={preferences.privateProfile}
                onChange={(e) => handlePreferenceChange('privateProfile', e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="private" className="text-gray-300 cursor-pointer">
                Make profile private
              </label>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="settings-section">
          <h3 className="text-lg font-semibold text-white mb-6">Display Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Theme
              </label>
              <select
                value={preferences.theme}
                onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Items Per Page
              </label>
              <select
                value={preferences.itemsPerPage}
                onChange={(e) => handlePreferenceChange('itemsPerPage', parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Grid Columns
              </label>
              <select
                value={preferences.gridColumns}
                onChange={(e) => handlePreferenceChange('gridColumns', parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="3">3 Columns</option>
                <option value="4">4 Columns</option>
                <option value="5">5 Columns</option>
                <option value="6">6 Columns</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="settings-section">
          <h3 className="text-lg font-semibold text-white mb-6">Notifications</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="notifications"
                checked={preferences.notificationsEnabled}
                onChange={(e) => handlePreferenceChange('notificationsEnabled', e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="notifications" className="text-gray-300 cursor-pointer">
                Enable notifications
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="email"
                checked={preferences.emailNotifications}
                onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="email" className="text-gray-300 cursor-pointer">
                Email notifications
              </label>
            </div>
          </div>
        </div>

        {/* Sort & Filter Settings */}
        <div className="settings-section">
          <h3 className="text-lg font-semibold text-white mb-6">Default Preferences</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Default Sort Order
              </label>
              <select
                value={preferences.sortBy}
                onChange={(e) => handlePreferenceChange('sortBy', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Default Category
              </label>
              <select
                value={preferences.filterCategory}
                onChange={(e) => handlePreferenceChange('filterCategory', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">All</option>
                <option value="abstract">Abstract</option>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
                <option value="digital">Digital</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4 justify-end">
        <button
          onClick={handleResetPreferences}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 border border-slate-600 rounded-lg transition-all font-medium"
        >
          Reset to Defaults
        </button>
        <button
          onClick={handleSavePreferences}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all font-medium shadow-lg shadow-indigo-500/30"
        >
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}

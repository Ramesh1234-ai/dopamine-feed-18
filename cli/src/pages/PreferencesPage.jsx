import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import Header from '../components/common/header'
import PreferencesTabs from '../components/preferences/PreferencesTabs'
import SavedArtworks from '../components/preferences/SavedArtworks'
import RoastReport from '../components/preferences/RoastReport'
import SettingsPanel from '../components/preferences/SettingsPanel'
import '../styles/preferences.css'

export default function PreferencesPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('saved')

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            My Preferences
          </h1>
          <p className="text-gray-400">Manage your settings and saved artworks</p>
        </div>

        {/* Tab Navigation */}
        <PreferencesTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'saved' && <SavedArtworks />}
          {activeTab === 'roast' && <RoastReport />}
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </div>
    </div>
  )
}

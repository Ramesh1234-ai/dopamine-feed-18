import '../../styles/preferences-tabs.css'

export default function PreferencesTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'saved', label: 'Saved Artworks', icon: '⭐' },
    { id: 'roast', label: 'Your Roast', icon: '🔥' },
  ]

  return (
    <div className="preferences-tabs">
      <div className="flex border-b border-slate-700/50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-medium transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

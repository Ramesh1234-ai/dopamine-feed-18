import { useState, useCallback } from 'react'

/**
 * SmartSearchBar - Advanced search with filters and smart suggestions
 */
export default function SmartSearchBar({ 
  search, 
  onSearchChange, 
  sortBy, 
  onSortChange,
  filterCategory,
  onFilterChange,
  filterTag,
  onFilterTagChange,
  availableTags = []
}) {
  const [showFilters, setShowFilters] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSearchChange = useCallback((value) => {
    onSearchChange(value)
    
    // Generate smart suggestions based on search
    if (value.length > 1) {
      const lowerValue = value.toLowerCase()
      const tagMatches = availableTags
        .filter(tag => tag.toLowerCase().includes(lowerValue))
        .map(tag => `#${tag}`)
      
      const suggestions = [
        ...tagMatches.slice(0, 3)
      ]
      
      setSuggestions(suggestions)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [onSearchChange, availableTags])

  const applySuggestion = (suggestion) => {
    onSearchChange(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name, artist, or tags (e.g., #abstract)..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => search && setSuggestions && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            
            {/* Search Icon */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </div>

            {/* Smart Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-10">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => applySuggestion(suggestion)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
              showFilters || filterCategory !== 'all' || filterTag !== 'all'
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <span>⚙️</span>
            Filters
          </button>
        </div>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="p-4 bg-slate-800/50 border border-slate-600 rounded-lg space-y-4 animate-slideIn">
          {/* Sort */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block font-medium">Sort By</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: 'newest', label: '🆕 Newest' },
                { value: 'oldest', label: '📅 Oldest' },
                { value: 'popular', label: '⭐ Popular' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === option.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block font-medium">Category</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['all', 'digital', 'abstract', 'landscape', 'portrait', 'other'].map(cat => (
                <button
                  key={cat}
                  onClick={() => onFilterChange(cat)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {cat === 'all' ? '📁 All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          {availableTags.length > 0 && (
            <div>
              <label className="text-sm text-gray-300 mb-2 block font-medium">Tags</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onFilterTagChange('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filterTag === 'all'
                      ? 'bg-pink-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  All Tags
                </button>
                {availableTags.slice(0, 10).map(tag => (
                  <button
                    key={tag}
                    onClick={() => onFilterTagChange(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      filterTag === tag
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

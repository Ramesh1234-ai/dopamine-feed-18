import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useSavedArtworks } from '../../context/SavedArtworksContext'
import GalleryCard from '../gallery/GalleryCard'
import SearchBar from '../gallery/SearchBar'

export default function SavedArtworks() {
  const { isLoaded, isSignedIn } = useAuth()
  const { saved, removeSaved, isSaved, loading: contextLoading, initializeForUser } = useSavedArtworks()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterTag, setFilterTag] = useState('all')

  // Fetch saved artworks when component loads
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      console.log('SavedArtworks mounted - fetching saved artworks')
      initializeForUser()
    }
  }, [isLoaded, isSignedIn, initializeForUser])

  // Debug logging
  useEffect(() => {
    console.log('SavedArtworks - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn, 'saved count:', saved.length, 'contextLoading:', contextLoading)
  }, [saved, contextLoading, isLoaded, isSignedIn])

  // Collect all unique tags from saved artworks
  const allTags = useMemo(() => {
    const tags = new Set()
    saved.forEach(artwork => {
      if (artwork.tags && Array.isArray(artwork.tags)) {
        artwork.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  }, [saved])

  // Filter and sort saved artworks
  const filteredAndSorted = useMemo(() => {
    let filtered = saved.filter(artwork => {
      const matchesSearch = !search || 
        artwork.name?.toLowerCase().includes(search.toLowerCase()) ||
        artwork.artist?.toLowerCase().includes(search.toLowerCase()) ||
        (artwork.tags && artwork.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
      
      const matchesCategory = filterCategory === 'all' || 
        (artwork.category?.toLowerCase() === filterCategory)
      
      const matchesTag = filterTag === 'all' || 
        (artwork.tags && artwork.tags.includes(filterTag))
      
      return matchesSearch && matchesCategory && matchesTag
    })

    // Apply sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    } else if (sortBy === 'artist') {
      filtered.sort((a, b) => (a.artist || '').localeCompare(b.artist || ''))
    }

    return filtered
  }, [saved, search, sortBy, filterCategory, filterTag])

  // Show loading state
  if (!isLoaded || contextLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-400">Loading your preferences...</p>
      </div>
    )
  }

  // Show error if not authenticated
  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-4xl mb-4">🔒</div>
        <p className="text-gray-400">Please log in to view saved artworks</p>
      </div>
    )
  }

  const handleRemoveSaved = (artwork) => {
    removeSaved(artwork._id)
  }

  const handleClearFilters = () => {
    setSearch('')
    setSortBy('newest')
    setFilterCategory('all')
    setFilterTag('all')
  }

  return (
    <div className="saved-artworks-container">
      {saved.length > 0 ? (
        <>
          <div className="mb-6">
            <p className="text-gray-400">
              You have <span className="font-bold text-indigo-400">{saved.length}</span> saved artworks
              {filteredAndSorted.length !== saved.length && (
                <span className="ml-2">({filteredAndSorted.length} matching filters)</span>
              )}
            </p>
          </div>

          {/* Filter & Sort Controls */}
          <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="space-y-4">
              {/* Search */}
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Search</label>
                <input
                  type="text"
                  placeholder="Search by name, artist, or tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Sort Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="artist">Artist (A-Z)</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="digital">Digital</option>
                    <option value="abstract">Abstract</option>
                    <option value="landscape">Landscape</option>
                    <option value="portrait">Portrait</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Tag Filter */}
                {allTags.length > 0 && (
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Tags</label>
                    <select
                      value={filterTag}
                      onChange={(e) => setFilterTag(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="all">All Tags</option>
                      {allTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Clear Filters Button */}
              {(search || sortBy !== 'newest' || filterCategory !== 'all' || filterTag !== 'all') && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-sm transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          {filteredAndSorted.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSorted.map(artwork => (
                <div key={artwork._id} className="relative">
                  <GalleryCard
                    profile={artwork}
                    isLiked={false}
                    onLike={() => {}}
                    onSave={() => handleRemoveSaved(artwork)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No matching artworks
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No saved artworks yet
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            Start exploring the gallery and save your favorite artworks to view them here later.
          </p>
        </div>
      )}
    </div>
  )
}

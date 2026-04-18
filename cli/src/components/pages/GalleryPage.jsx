import { useEffect, useState, useCallback, useMemo } from 'react'
import { useToast } from '../../context/ToastContext'
import Header from '../common/header'
import Sidebar from '../common/sidebar'
import GalleryGrid from '../gallery/GalleryGrid'
import SmartSearchBar from '../gallery/SmartSearchBar'
import { SkeletonGrid, EmptyState } from '../common/Loaders'
import Pagination from '../common/Pagination'

const ITEMS_PER_PAGE = 12

export default function GalleryPage() {
  const { showToast } = useToast()
  const [profiles, setProfiles] = useState([])
  const [allProfiles, setAllProfiles] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterTag, setFilterTag] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Get all available tags from profiles
  const availableTags = useMemo(() => {
    const tags = new Set()
    allProfiles.forEach(profile => {
      if (profile.tags && Array.isArray(profile.tags)) {
        profile.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  }, [allProfiles])

  // Fetch gallery data with retry logic
  const fetchData = useCallback(async (attempt = 0) => {
    try {
      setLoading(true)
      setError(null)

      const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
      
      // Add timeout to detect connection issues faster
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch(`${apiURL}/data`, { 
        signal: controller.signal,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies/auth if available
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setAllProfiles(data || [])
      setProfiles(data || [])
      setCurrentPage(1)
      showToast('Gallery loaded successfully!', 'success')
    } catch (err) {
      console.error('Error fetching gallery data:', err)
      
      if (err.name === 'AbortError') {
        setError('Connection timeout. The server may not be running.')
      } else if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('Cannot connect to the server. Make sure the backend server is running on port 5000.')
      } else {
        setError(err.message)
      }

      // Retry logic - up to 3 attempts
      if (attempt < 2) {
        showToast(`Retrying... (${attempt + 1}/3)`, 'info', 2000)
        setTimeout(() => fetchData(attempt + 1), 2000)
      } else {
        showToast('Failed to load gallery. Please refresh the page or start the server.', 'error', 5000)
        setProfiles([])
      }
    } finally {
      setLoading(false)
    }
  }, [showToast])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Filter and sort profiles with smart search
  useEffect(() => {
    let filtered = allProfiles.filter(profile => {
      // Basic validation
      const hasValidImage = profile.img && profile.img.startsWith('http')
      const hasName = profile.name
      
      if (!hasValidImage || !hasName) return false

      // Smart search - search in name, artist, description, and tags
      const searchLower = search.toLowerCase()
      const matchesSearch = !search || 
        profile.name.toLowerCase().includes(searchLower) ||
        profile.artist?.toLowerCase().includes(searchLower) ||
        profile.description?.toLowerCase().includes(searchLower) ||
        (profile.tags && profile.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      
      // Category filter
      const matchesCategory = filterCategory === 'all' || 
        (profile.category?.toLowerCase() === filterCategory)
      
      // Tag filter
      const matchesTag = filterTag === 'all' || 
        (profile.tags && profile.tags.includes(filterTag))
      
      return matchesSearch && matchesCategory && matchesTag
    })

    // Apply sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    }

    setProfiles(filtered)
    setCurrentPage(1)
  }, [search, sortBy, filterCategory, filterTag, allProfiles])

  // Pagination calculation
  const totalPages = Math.ceil(profiles.length / ITEMS_PER_PAGE)
  const paginatedProfiles = profiles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleRetry = () => {
    fetchData()
  }

  const handleClearFilters = () => {
    setSearch('')
    setSortBy('newest')
    setFilterCategory('all')
    setFilterTag('all')
    setCurrentPage(1)
    showToast('Filters cleared', 'info')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            AI Image Gallery
          </h1>
          <p className="text-gray-400">Discover amazing AI-generated artworks ({profiles.length} items)</p>
        </div>

        {/* Smart Search and Filter */}
        <div className="mb-8">
          <SmartSearchBar
            search={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filterCategory={filterCategory}
            onFilterChange={setFilterCategory}
            filterTag={filterTag}
            onFilterTagChange={setFilterTag}
            availableTags={availableTags}
          />
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-700/50 rounded-lg flex items-start gap-3" role="alert">
            <div className="flex-shrink-0 text-red-400 text-xl">⚠️</div>
            <div className="flex-1">
              <h3 className="font-bold text-red-300 mb-1">Failed to Load Gallery</h3>
              <p className="text-red-200 text-sm mb-3">{error}</p>
              {error.includes('server') && (
                <p className="text-red-200 text-sm mb-3">
                  💡 <strong>Tip:</strong> Run <code className="bg-red-900/50 px-2 py-1 rounded">npm run start</code> in the server folder to start the backend server.
                </p>
              )}
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Retry Loading
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && <SkeletonGrid count={ITEMS_PER_PAGE} />}

        {/* Empty State */}
        {!loading && !error && profiles.length === 0 && (
          <EmptyState onClear={handleClearFilters} />
        )}

        {/* Gallery Grid */}
        {!loading && !error && profiles.length > 0 && (
          <>
            <GalleryGrid profiles={paginatedProfiles} loading={loading} />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

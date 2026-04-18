import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'

/**
 * SavedArtworksContext - Global state for saved artworks
 * Syncs with backend API instead of localStorage
 */
const SavedArtworksContext = createContext()

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function SavedArtworksProvider({ children }) {
  const { user, isLoaded } = useAuth()
  const [saved, setSaved] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Get authorization headers with user info
   */
  const getHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'x-user-id': user?.id || '',
    'x-user-email': user?.emailAddresses?.[0]?.emailAddress || '',
    'x-user-name': user?.firstName || 'User',
  }), [user])

  /**
   * Fetch saved artworks from database
   */
  const fetchSavedArtworks = useCallback(async () => {
    if (!user?.id || !isLoaded) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `${API_URL}/api/preferences/saved-artworks`,
        {
          headers: getHeaders(),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch saved artworks')
      }

      const data = await response.json()
      setSaved(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching saved artworks:', err)
      setError(err.message)
      // Fallback to empty array on error
      setSaved([])
    } finally {
      setLoading(false)
    }
  }, [user?.id, isLoaded, getHeaders])

  /**
   * Add artwork to saved collection
   */
  const addSaved = useCallback(
    async (artwork) => {
      if (!user?.id) return

      try {
        const response = await fetch(
          `${API_URL}/api/preferences/saved-artworks/${artwork._id}`,
          {
            method: 'POST',
            headers: getHeaders(),
          }
        )

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to save artwork')
        }

        const result = await response.json()
        
        // Optimistically update local state
        setSaved((prev) => {
          const alreadyExists = prev.some((item) => item._id === artwork._id)
          if (alreadyExists) return prev
          return [...prev, artwork]
        })

        return true
      } catch (err) {
        console.error('Error saving artwork:', err)
        throw err
      }
    },
    [user?.id, getHeaders]
  )

  /**
   * Remove artwork from saved collection
   */
  const removeSaved = useCallback(
    async (artworkId) => {
      if (!user?.id) return

      try {
        const response = await fetch(
          `${API_URL}/api/preferences/saved-artworks/${artworkId}`,
          {
            method: 'DELETE',
            headers: getHeaders(),
          }
        )

        if (!response.ok) {
          throw new Error('Failed to remove artwork')
        }

        // Optimistically update local state
        setSaved((prev) =>
          prev.filter((item) => item._id !== artworkId && item.name !== artworkId)
        )

        return true
      } catch (err) {
        console.error('Error removing artwork:', err)
        throw err
      }
    },
    [user?.id, getHeaders]
  )

  /**
   * Check if artwork is saved
   */
  const isSaved = useCallback(
    (artworkId) => {
      return saved.some(
        (item) => (item._id && item._id === artworkId) || item.name === artworkId
      )
    },
    [saved]
  )

  /**
   * Get full saved list
   */
  const getSavedList = useCallback(() => {
    return saved
  }, [saved])

  /**
   * Sync with backend when user loads
   */
  useEffect(() => {
    if (user?.id && isLoaded) {
      fetchSavedArtworks()
    }
  }, [user?.id, isLoaded, fetchSavedArtworks])

  const value = {
    saved,
    addSaved,
    removeSaved,
    isSaved,
    getSavedList,
    initializeForUser: fetchSavedArtworks,
    loading,
    error,
  }

  return (
    <SavedArtworksContext.Provider value={value}>
      {children}
    </SavedArtworksContext.Provider>
  )
}

/**
 * Hook to use SavedArtworksContext
 */
export function useSavedArtworks() {
  const context = useContext(SavedArtworksContext)
  if (!context) {
    throw new Error(
      'useSavedArtworks must be used within SavedArtworksProvider'
    )
  }
  return context
}

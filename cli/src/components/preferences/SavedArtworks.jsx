import { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { preferencesManager } from '../../utils/preferencesManager'
import GalleryCard from '../gallery/GalleryCard'
import '../../styles/saved-artworks.css'

export default function SavedArtworks() {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const [savedArtworks, setSavedArtworks] = useState([])

  console.log('SavedArtworks: isLoaded =', isLoaded, ', isSignedIn =', isSignedIn, ', user?.id =', user?.id)

  // Reload when user data is available
  useEffect(() => {
    console.log('Effect running: isLoaded =', isLoaded, ', user?.id =', user?.id)
    
    if (!isLoaded) {
      console.log('Clerk not loaded yet')
      return
    }

    if (!user?.id) {
      console.log('No user ID available')
      return
    }

    console.log('Loading saved artworks for user:', user.id)
    const prefs = preferencesManager.getPreferences(user.id)
    console.log('Loaded preferences:', prefs.savedArtworks?.length || 0, 'artworks')
    setSavedArtworks(prefs.savedArtworks || [])
  }, [isLoaded, user?.id])

  // Listen for updates from gallery
  useEffect(() => {
    if (!isLoaded || !user?.id) return

    const refreshSavedArtworks = () => {
      console.log('Refreshing saved artworks...')
      const prefs = preferencesManager.getPreferences(user.id)
      console.log('Current saved artworks count:', prefs.savedArtworks?.length || 0)
      setSavedArtworks(prefs.savedArtworks || [])
    }

    // Listen for custom event
    window.addEventListener('savedArtworksUpdated', refreshSavedArtworks)

    // Polling every 1 second
    const pollInterval = setInterval(refreshSavedArtworks, 1000)

    return () => {
      window.removeEventListener('savedArtworksUpdated', refreshSavedArtworks)
      clearInterval(pollInterval)
    }
  }, [isLoaded, user?.id])

  // Show loading state
  if (!isLoaded || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-400">Loading your preferences...</p>
      </div>
    )
  }

  // Show error if not authenticated
  if (!user?.id) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-4xl mb-4">🔒</div>
        <p className="text-gray-400">Please log in to view saved artworks</p>
      </div>
    )
  }

  const handleRemoveSaved = (artwork) => {
    if (user?.id) {
      preferencesManager.removeSavedArtwork(user.id, artwork._id)
      setSavedArtworks(prevArtworks =>
        prevArtworks.filter(item => item._id !== artwork._id)
      )
      window.dispatchEvent(new Event('savedArtworksUpdated'))
    }
  }

  return (
    <div className="saved-artworks-container">
      {savedArtworks.length > 0 ? (
        <>
          <div className="mb-6">
            <p className="text-gray-400">
              You have <span className="font-bold text-indigo-400">{savedArtworks.length}</span> saved artworks
            </p>
          </div>

          <div className="gallery-grid">
            {savedArtworks.map(artwork => (
              <div key={artwork._id} className="relative">
                <GalleryCard
                  profile={artwork}
                  isLiked={false}
                  isSaved={true}
                  onLike={() => {}}
                  onSave={() => handleRemoveSaved(artwork)}
                />
              </div>
            ))}
          </div>
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

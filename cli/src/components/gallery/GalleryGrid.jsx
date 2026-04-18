import { useState, useMemo, useCallback } from 'react'
import GalleryCard from './GalleryCard'

/**
 * GalleryGrid - Displays gallery cards in a responsive grid
 * Handles likes and maintains sorted/filtered state
 */
export default function GalleryGrid({ profiles, loading = false }) {
  const [likedItems, setLikedItems] = useState({})

  const handleLike = useCallback((profileId) => {
    setLikedItems(prev => ({
      ...prev,
      [profileId]: !prev[profileId]
    }))
  }, [])

  // Memoize grid to prevent re-renders from parent
  const memoizedGrid = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {profiles.map(profile => (
        <GalleryCard
          key={profile._id}
          profile={profile}
          isLiked={likedItems[profile._id] || false}
          onLike={handleLike}
        />
      ))}
    </div>
  ), [profiles, likedItems, handleLike])

  return <div className="w-full">{memoizedGrid}</div>
}

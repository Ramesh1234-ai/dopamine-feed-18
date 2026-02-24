import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { preferencesManager } from '../../utils/preferencesManager'
import GalleryCard from './GalleryCard'

export default function GalleryGrid({ profiles }) {
  const { user } = useUser()
  const [likedItems, setLikedItems] = useState({})
  const [savedItems, setSavedItems] = useState({})

  console.log('GalleryGrid: user?.id =', user?.id)

  const handleLike = (profileId) => {
    setLikedItems(prev => ({
      ...prev,
      [profileId]: !prev[profileId]
    }))
  }

  const handleSave = (profile) => {
    console.log('handleSave called with profile:', profile.name, 'user?.id:', user?.id)
    
    if (!user?.id) {
      console.log('No user ID, cannot save')
      return
    }

    try {
      const isCurrentlySaved = preferencesManager.isArtworkSaved(user.id, profile._id)
      console.log('isCurrentlySaved:', isCurrentlySaved)
      
      if (isCurrentlySaved) {
        console.log('Removing saved artwork:', profile._id)
        preferencesManager.removeSavedArtwork(user.id, profile._id)
      } else {
        console.log('Adding saved artwork:', profile._id)
        preferencesManager.addSavedArtwork(user.id, profile)
      }

      setSavedItems(prev => ({
        ...prev,
        [profile._id]: !prev[profile._id]
      }))
      
      // Verify it was saved
      const prefs = preferencesManager.getPreferences(user.id)
      console.log('After save, total saved artworks:', prefs.savedArtworks?.length || 0)
      
      // Trigger SavedArtworks component to refresh
      window.dispatchEvent(new Event('savedArtworksUpdated'))
    } catch (error) {
      console.error('Error saving artwork:', error)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '24px'
      }}>
        {profiles.map(profile => (
          <GalleryCard
            key={profile._id}
            profile={profile}
            isLiked={likedItems[profile._id]}
            isSaved={savedItems[profile._id]}
            onLike={handleLike}
            onSave={handleSave}
          />
        ))}
      </div>
    </div>
  )
}

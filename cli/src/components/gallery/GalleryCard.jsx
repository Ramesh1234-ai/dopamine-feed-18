import { useState, memo, useCallback } from 'react'
import { useSavedArtworks } from '../../context/SavedArtworksContext'
import { useToast } from '../../context/ToastContext'
import ImageModal from './ImageModal'

/**
 * GalleryCard - Individual artwork display card
 * Memoized to prevent unnecessary re-renders
 */
const GalleryCard = memo(function GalleryCard({ profile, isLiked, onLike }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { saved, addSaved, removeSaved, isSaved } = useSavedArtworks()
  const { showToast } = useToast()

  const profileSaved = isSaved(profile._id)

  const handleSave = useCallback(async (e) => {
    e.stopPropagation()
    setIsSaving(true)
    
    try {
      if (profileSaved) {
        await removeSaved(profile._id)
        showToast(`Removed "${profile.name}"`, 'info')
      } else {
        await addSaved(profile)
        showToast(`Saved "${profile.name}"!`, 'success')
      }
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error')
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }, [profileSaved, profile, addSaved, removeSaved, showToast])

  const handleLike = useCallback((e) => {
    e.stopPropagation()
    onLike?.(profile._id)
    showToast(isLiked ? 'Unliked' : 'Liked!', 'success')
  }, [isLiked, profile._id, onLike, showToast])

  return (
    <>
      <div className="group bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl overflow-hidden hover:border-indigo-500 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 flex flex-col h-full">
        
        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden bg-slate-900 cursor-pointer" onClick={() => setShowModal(true)}>
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-shimmer" />
          )}
          <img
            src={profile.img}
            alt={profile.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23334155" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="48" fill="%23cbd5e1" text-anchor="middle" dy=".3em"%3EImage Error%3C/text%3E%3C/svg%3E'
            }}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 justify-between">
          {/* Title & Description */}
          <div>
            <h3 className="text-sm font-bold text-white truncate mb-1 group-hover:text-indigo-400 transition-colors">
              {profile.name}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              {profile.artist || 'AI Generated'}
            </p>

            {/* Tags */}
            {profile.tags && profile.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {profile.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2 py-0.5 bg-indigo-500/30 border border-indigo-400/50 rounded text-xs text-indigo-300"
                  >
                    #{tag}
                  </span>
                ))}
                {profile.tags.length > 3 && (
                  <span className="inline-block px-2 py-0.5 text-xs text-slate-400">
                    +{profile.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleLike}
              aria-label={isLiked ? 'Unlike artwork' : 'Like artwork'}
              className={`flex-1 px-3 py-2 rounded-lg font-medium text-xs transition-all duration-200 flex items-center justify-center gap-1 ${
                isLiked
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:border-indigo-500 border border-slate-600'
              }`}
            >
              <span>{isLiked ? '❤️' : '🤍'}</span>
              Like
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              aria-label={profileSaved ? 'Remove from saved' : 'Save artwork'}
              className={`flex-1 px-3 py-2 rounded-lg font-medium text-xs transition-all duration-200 flex items-center justify-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed ${
                profileSaved
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:border-purple-500 border border-slate-600'
              }`}
            >
              <span>{isSaving ? '⚡' : profileSaved ? '⭐' : '☆'}</span>
              {isSaving ? 'Saving...' : 'Save'}
            </button>

            <button
              onClick={() => setShowModal(true)}
              aria-label="View full image"
              className="flex-1 px-3 py-2 rounded-lg font-medium text-xs bg-slate-700 text-gray-300 hover:bg-slate-600 hover:border-cyan-500 border border-slate-600 transition-all duration-200 flex items-center justify-center gap-1"
            >
              <span>👁️</span>
              View
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal 
        image={profile} 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
      />
    </>
  )
})

export default GalleryCard

import { useState, useEffect } from 'react'

/**
 * ImageModal - Full-screen image viewer with interactions
 * Features: zoom, keyboard navigation, next/prev buttons, touch friendly
 */
export default function ImageModal({
  image,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}) {
  const [zoom, setZoom] = useState(1)
  const MAX_ZOOM = 3
  const MIN_ZOOM = 1

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasPrevious) onPrevious()
      if (e.key === 'ArrowRight' && hasNext) onNext()
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + 0.2, MAX_ZOOM))
      if (e.key === '-') setZoom((z) => Math.max(z - 0.2, MIN_ZOOM))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onPrevious, onNext, hasPrevious, hasNext])

  // Handle mouse wheel zoom
  const handleWheel = (e) => {
    if (!isOpen) return
    e.preventDefault()
    const direction = e.deltaY > 0 ? -1 : 1
    setZoom((z) => Math.min(Math.max(z + direction * 0.1, MIN_ZOOM), MAX_ZOOM))
  }

  if (!isOpen || !image) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
      onWheel={handleWheel}
    >
      <div
        className="relative w-full h-full flex flex-col items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Image Container */}
        <div className="flex-1 flex items-center justify-center max-h-full overflow-hidden">
          <img
            src={image.img || image.image}
            alt={image.name || 'Artwork'}
            className="transition-transform duration-200 cursor-zoom-in select-none"
            style={{ transform: `scale(${zoom})`, maxHeight: '100%', maxWidth: '100%' }}
          />
        </div>

        {/* Info Panel */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 md:p-6">
          <div className="max-w-2xl mx-auto text-white">
            <h3 className="text-lg md:text-xl font-bold mb-1">{image.name || 'Untitled'}</h3>
            <p className="text-sm text-gray-300 mb-3">{image.artist || 'Unknown Artist'}</p>
            <div className="flex items-center justify-between text-xs md:text-sm text-gray-400">
              <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
              <span className="hidden sm:inline">Use arrow keys to navigate, ESC to close</span>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        {hasPrevious && (
          <button
            onClick={onPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors"
            aria-label="Previous image"
          >
            ←
          </button>
        )}

        {hasNext && (
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors"
            aria-label="Next image"
          >
            →
          </button>
        )}

        {/* Keyboard Hints */}
        <div className="absolute top-4 left-4 text-xs text-gray-400 hidden md:block space-y-1">
          <div>Scroll to zoom</div>
          <div>← → to navigate</div>
        </div>
      </div>
    </div>
  )
}

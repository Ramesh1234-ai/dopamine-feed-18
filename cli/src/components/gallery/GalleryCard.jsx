import { useState } from 'react'

export default function GalleryCard({
  profile,
  isLiked,
  isSaved,
  onLike,
  onSave,
}) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      border: '1px solid #334155',
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)'
      e.currentTarget.style.borderColor = '#6366f1'
      e.currentTarget.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.15)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.borderColor = '#334155'
      e.currentTarget.style.boxShadow = 'none'
    }}
    >
      {/* Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '100%',
        overflow: 'hidden',
        background: '#0f172a'
      }}>
        {!imageLoaded && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: '#475569',
            animation: 'pulse 2s infinite'
          }}></div>
        )}
        <img
          src={profile.img}
          alt={profile.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.parentElement.style.display = 'none'
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
        />
      </div>

      {/* Card Content */}
      <div style={{
        padding: '16px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}>
        <h3 style={{
          fontWeight: '600',
          color: '#ffffff',
          fontSize: '15px',
          marginBottom: '4px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {profile.name}
        </h3>
        <p style={{
          color: '#a0aec0',
          fontSize: '14px',
          marginBottom: '12px'
        }}>
          {profile.artist || 'AI Generated'}
        </p>
        
        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onLike && onLike(profile._id)
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              background: isLiked ? '#6366f1' : '#334155',
              border: isLiked ? '1px solid #6366f1' : '1px solid #475569',
              color: '#ffffff',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
            onMouseEnter={(e) => {
              if (!isLiked) {
                e.currentTarget.style.background = '#475569'
                e.currentTarget.style.borderColor = '#6366f1'
              }
            }}
            onMouseLeave={(e) => {
              if (!isLiked) {
                e.currentTarget.style.background = '#334155'
                e.currentTarget.style.borderColor = '#475569'
              }
            }}
          >
            {isLiked ? '❤️' : '🤍'} Like
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              alert(`Artwork "${profile.name}" ${isSaved ? 'removed from' : 'saved to'} favorites!`)
              if (onSave) {
                onSave(profile)
              }
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              background: isSaved ? '#9333ea' : '#334155',
              border: isSaved ? '1px solid #9333ea' : '1px solid #475569',
              color: '#ffffff',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              pointerEvents: 'auto',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              if (!isSaved) {
                e.currentTarget.style.background = '#475569'
                e.currentTarget.style.borderColor = '#9333ea'
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaved) {
                e.currentTarget.style.background = '#334155'
                e.currentTarget.style.borderColor = '#475569'
              }
            }}
          >
            {isSaved ? '⭐' : '☆'} Save
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

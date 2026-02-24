import { useNavigate } from 'react-router-dom'
import { useAuth, UserButton } from '@clerk/clerk-react'
import { useState } from 'react'

export default function Header() {
  const navigate = useNavigate()
  const { isSignedIn, user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(51, 65, 85, 0.5)'
    }}>
      <div style={{
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}>
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/gallery')}
          >
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(to bottom right, #6366f1, #9333ea)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🎨
            </div>
            <span style={{
              fontWeight: 'bold',
              fontSize: '18px',
              color: '#ffffff'
            }}>
              AI Gallery
            </span>
          </div>

          {/* Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}>
            <button
              onClick={() => navigate('/gallery')}
              style={{
                color: '#d1d5db',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#d1d5db'}
            >
              Gallery
            </button>
            <button
              onClick={() => navigate('/preferences')}
              style={{
                color: '#d1d5db',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#d1d5db'}
            >
              Preferences
            </button>
            <button
              onClick={() => navigate('/upload')}
              style={{
                color: '#d1d5db',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#d1d5db'}
            >
              Upload
            </button>
            <button
              onClick={() => navigate('/Creation')}
              style={{
                color: '#d1d5db',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#d1d5db'}
            >
              Creation
            </button>
          </nav>

          {/* Right Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isSignedIn && (
              <>
                <div style={{
                  fontSize: '14px',
                  color: '#9ca3af'
                }}>
                  Welcome, {user?.firstName || 'User'}
                </div>
                <UserButton afterSignOutUrl="/login" />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

import { SignIn } from '@clerk/clerk-react'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function LoginPage() {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSignedIn) {
      navigate('/gallery')
    }
  }, [isSignedIn, navigate])

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f7ff 100%)'
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '28px',
            boxShadow: '0 8px 16px rgba(124, 58, 237, 0.2)'
          }}>
            🎨
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>
            AI Gallery
          </h1>
          <p style={{ 
            color: '#666666',
            fontSize: '15px',
            fontWeight: '500'
          }}>
            Discover incredible AI-generated art
          </p>
        </div>

        {/* Clerk SignIn Component */}
        <div style={{
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <SignIn 
            appearance={{
              baseTheme: 'light',
              elements: {
                rootBox: {
                  width: '100%'
                },
                card: {
                  background: '#ffffff',
                  boxShadow: 'none',
                  border: 'none'
                },
                formButtonPrimary: {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                  fontSize: '15px',
                  fontWeight: '600',
                  padding: '10px 16px',
                  borderRadius: '8px'
                }
              }
            }}
            redirectUrl="/gallery"
          />
        </div>

        {/* Footer */}
        <p style={{ 
          textAlign: 'center',
          color: '#999999',
          fontSize: '12px',
          marginTop: '24px',
          fontWeight: '500'
        }}>
          Secure login powered by Clerk
        </p>
      </div>
    </div>
  )
};

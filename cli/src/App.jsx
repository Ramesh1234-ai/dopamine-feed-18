import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useSavedArtworks } from './context/SavedArtworksContext'
import { useEffect } from 'react'
import LoginPage from './components/auth/login'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import GalleryPage from './components/pages/GalleryPage'
import PreferencesPage from './components/pages/PreferencesPage'
import UploadPage from './components/pages/UploadPage'

export default function App() {
  const { isLoaded, isSignedIn, user } = useAuth()
  const { initializeForUser } = useSavedArtworks()

  // Initialize saved artworks context when user loads
  useEffect(() => {
    if (isLoaded && user?.id) {
      initializeForUser(user.id)
    }
  }, [isLoaded, user?.id, initializeForUser])

  if (!isLoaded) {
    return (
      <div className="w-full h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <GalleryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preferences"
          element={
            <ProtectedRoute>
              <PreferencesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={isSignedIn ? "/gallery" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={isSignedIn ? "/gallery" : "/login"} replace />} />
      </Routes>
    </div>
  )
}
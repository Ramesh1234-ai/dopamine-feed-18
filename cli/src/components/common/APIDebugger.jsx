import { useAuth } from '@clerk/clerk-react'
/**
 * Debug component to test API connectivity
 */
export default function APIDebugger() {
  const { user, isLoaded } = useAuth()

  const testAPI = async () => {
    if (!user?.id) {
      console.log('❌ No user logged in')
      return
    }

    const headers = {
      'Content-Type': 'application/json',
      'x-user-id': user.id,
      'x-user-email': user.emailAddresses?.[0]?.emailAddress || '',
      'x-user-name': user.firstName || 'User',
    }

    console.log('🔍 Testing API with headers:', headers)

    // Test 1: Get preferences
    try {
      const res = await fetch('http://localhost:3000/api/preferences', {
        headers,
      })
      const data = await res.json()
      console.log('✅ GET /api/preferences:', data)
    } catch (err) {
      console.error('❌ GET /api/preferences failed:', err)
    }

    // Test 2: Get saved artworks
    try {
      const res = await fetch('http://localhost:3000/api/preferences/saved-artworks', {
        headers,
      })
      const data = await res.json()
      console.log('✅ GET /api/preferences/saved-artworks:', data)
    } catch (err) {
      console.error('❌ GET /api/preferences/saved-artworks failed:', err)
    }
  }

  if (!isLoaded) return null

  return (
    <button
      onClick={testAPI}
      className="fixed bottom-4 right-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium z-50"
      title="Click to debug API in console"
    >
      🐛 Test API
    </button>
  )
}

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import Header from '../components/common/header'
import GalleryGrid from '../components/gallery/GalleryGrid'
import SearchBar from '../components/gallery/SearchBar'
import '../styles/gallery.css'

export default function GalleryPage() {
  const [profiles, setProfiles] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterCategory, setFilterCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        const response = await axios.get(`${apiURL}/data`)
        setProfiles(response.data || [])
      } catch (error) {
        console.error('Error fetching gallery data:', error)
        setProfiles([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProfiles = profiles.filter(profile =>
    profile.img &&
    profile.name &&
    profile.img.startsWith('http') &&
    profile.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      <Header />
      
      <div style={{
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '32px 16px'
      }}>
        {/* Page Title */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #a78bfa 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            AI Image Gallery
          </h1>
          <p style={{ color: '#a0aec0' }}>Discover amazing AI-generated artworks</p>
        </div>

        {/* Search and Filter Section */}
        <SearchBar 
          search={search} 
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterCategory={filterCategory}
          onFilterChange={setFilterCategory}
        />

        {/* Loading State */}
        {loading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '64px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid #6366f1',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }}></div>
              <p style={{ color: '#a0aec0' }}>Loading gallery...</p>
              <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          </div>
        ) : filteredProfiles.length > 0 ? (
          <GalleryGrid profiles={filteredProfiles} />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '64px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#a0aec0', fontSize: '18px' }}>No artworks found</p>
              <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>Try adjusting your search filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

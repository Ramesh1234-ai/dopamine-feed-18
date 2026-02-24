import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { preferencesManager } from '../../utils/preferencesManager'
import axios from 'axios'

export default function RoastReport() {
  const { user } = useUser()
  const [stats, setStats] = useState(null)
  const [roasts, setRoasts] = useState([])
  const [verdict, setVerdict] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.id) return

    const prefs = preferencesManager.getPreferences(user.id)
    const savedArtworks = prefs.savedArtworks || []

    // Calculate stats
    const totalSaved = savedArtworks.length

    // Analyze categories/patterns in saved artworks
    const categoryCount = {}
    const artistCount = {}

    savedArtworks.forEach(artwork => {
      const category = artwork.category?.toLowerCase() || 'abstract'
      const artist = artwork.artist?.toLowerCase() || 'ai generated'

      categoryCount[category] = (categoryCount[category] || 0) + 1
      artistCount[artist] = (artistCount[artist] || 0) + 1
    })

    const topCategory = Object.keys(categoryCount).length > 0
      ? Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0][0]
      : null

    const topArtist = Object.keys(artistCount).length > 0
      ? Object.entries(artistCount).sort((a, b) => b[1] - a[1])[0][0]
      : null

    const statsData = {
      totalSaved,
      topCategory,
      topArtist,
      varietyScore: Object.keys(categoryCount).length,
    }

    setStats(statsData)

    // Fetch roast from Grok API
    fetchRoastFromGrok(statsData)
  }, [user?.id])

  const fetchRoastFromGrok = async (statsData) => {
    setLoading(true)
    setError(null)

    try {
      const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await axios.post(`${apiURL}/api/roast`, {
        stats: statsData
      })

      console.log('Grok API response:', response.data)
      setRoasts(response.data.roasts || [])
      setVerdict(response.data.verdict || 'Your taste is... interesting.')
    } catch (err) {
      console.error('Error fetching roast:', err)
      setError(err.message)
      // Fallback to generic roasts
      setRoasts([
        `You saved ${statsData.totalSaved} artworks. That's ${statsData.totalSaved === 0 ? 'zero effort' : 'some effort'}.`,
        `Top pick: ${statsData.topCategory || 'everything'}. This tells us nothing.`,
        `Variety score: ${statsData.varietyScore}. You're either cultured or lost.`,
        'Your taste speaks for itself. And it\'s saying... something.'
      ])
      setVerdict('We tried to roast you with AI, but even Grok gave up. 💀')
    } finally {
      setLoading(false)
    }
  }

  if (!stats) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-gray-400">Loading your roast report...</p>
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(124, 58, 237, 0.2)',
      padding: '32px',
      marginTop: '24px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          fontSize: '32px',
          marginBottom: '12px'
        }}>
          🔥 YOUR GROK ROAST REPORT
        </div>
        <p style={{
          color: '#a0aec0',
          fontSize: '14px'
        }}>
          Powered by Grok AI - Your taste analysis:
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '12px',
        marginBottom: '28px'
      }}>
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#a78bfa' }}>
            {stats.totalSaved}
          </div>
          <div style={{ color: '#a0aec0', fontSize: '12px', marginTop: '4px' }}>
            Total Saved
          </div>
        </div>

        <div style={{
          background: 'rgba(236, 72, 153, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(236, 72, 153, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ec4899' }}>
            {stats.varietyScore}
          </div>
          <div style={{ color: '#a0aec0', fontSize: '12px', marginTop: '4px' }}>
            Categories
          </div>
        </div>

        {stats.topCategory && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: '#10b981', marginBottom: '4px' }}>
              Top Pick
            </div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              color: '#10b981',
              textTransform: 'capitalize',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {stats.topCategory}
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '32px',
          color: '#a0aec0'
        }}>
          <div style={{
            fontSize: '32px',
            marginBottom: '12px',
            animation: 'spin 2s linear infinite'
          }}>
            🤔
          </div>
          <p>Grok is thinking about your taste...</p>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          color: '#fca5a5',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          ⚠️ Grok API not available, showing fallback roasts...
        </div>
      )}

      {/* Roasts - Only show if not loading */}
      {!loading && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#e2e8f0',
              marginBottom: '16px'
            }}>
              ✨ The Roast:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {roasts.map((roast, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    color: '#e2e8f0',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    position: 'relative',
                    paddingLeft: '28px',
                    animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
                  }}
                >
                  <style>{`
                    @keyframes slideIn {
                      from {
                        opacity: 0;
                        transform: translateX(-10px);
                      }
                      to {
                        opacity: 1;
                        transform: translateX(0);
                      }
                    }
                  `}</style>
                  <span style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '16px'
                  }}>
                    •
                  </span>
                  {roast}
                </div>
              ))}
            </div>
          </div>

          {/* Final Verdict */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            marginTop: '20px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#a0aec0', fontSize: '12px', marginBottom: '8px' }}>
              GROK'S FINAL VERDICT
            </div>
            <div style={{
              color: '#a78bfa',
              fontSize: '15px',
              fontWeight: '600',
              lineHeight: '1.6'
            }}>
              {verdict || 'Your taste is unique. That\'s code for confused.'}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            textAlign: 'center',
            marginTop: '24px',
            color: '#64748b',
            fontSize: '13px'
          }}>
            💁 Save more artworks to update your roast!
          </div>
        </>
      )}
    </div>
  )
}

export default function SearchBar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  filterCategory,
  onFilterChange,
}) {
  return (
    <div style={{ marginBottom: '32px', width: '100%' }}>
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(51, 65, 85, 0.5)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          {/* Search Input */}
          <div style={{ gridColumn: window.innerWidth < 768 ? 'span 1' : 'span 2' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#d1d5db',
              marginBottom: '8px'
            }}>
              Search Artworks
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  background: '#475569',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#d1d5db',
              marginBottom: '8px'
            }}>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 16px',
                background: '#475569',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '16px',
                outline: 'none'
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>

        {/* Filter Category */}
        <div style={{ marginTop: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#d1d5db',
            marginBottom: '8px'
          }}>
            Category
          </label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
             {['all', 'American', 'Arabian', 'Russia', 'Anime'].map(
              (category) => (
                <button
                  key={category}
                  onClick={() => onFilterChange(category)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    background: filterCategory === category ? '#6366f1' : '#475569',
                    color: filterCategory === category ? '#ffffff' : '#d1d5db',
                    transition: 'all 0.2s'
                  }}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
};

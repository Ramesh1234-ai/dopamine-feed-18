export default function SearchBar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  filterCategory,
  onFilterChange,
}) {
  return (
    <div className="mb-8 w-full">
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg hover:shadow-indigo-500/10 transition-shadow">
        {/* Search and Sort Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Search Input - Full Width on Mobile */}
          <div className="md:col-span-2 lg:col-span-2">
            <label className="block text-sm font-500 text-gray-300 mb-2">
              🔍 Search Artworks
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-4 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div>
            <label className="block text-sm font-500 text-gray-300 mb-2">
              📊 Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>

        {/* Filter Category */}
        <div>
          <label className="block text-sm font-500 text-gray-300 mb-3">
            🏷️ Category
          </label>
          <div className="flex flex-wrap gap-2">
            {['all', 'American', 'Arabian', 'Russia', 'Anime'].map((category) => (
              <button
                key={category}
                onClick={() => onFilterChange(category)}
                className={`px-4 py-2 rounded-lg font-500 transition-all transform hover:scale-105 ${
                  filterCategory === category
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
};

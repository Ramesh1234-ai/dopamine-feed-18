/**
 * Loaders - Loading state components
 * SkeletonCard: Animated placeholder for images
 * SkeletonGrid: Grid of skeleton cards
 * EmptyState: User-friendly empty gallery message
 */

/**
 * SkeletonCard - Animated placeholder mimicking card structure
 */
export function SkeletonCard() {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl overflow-hidden flex flex-col h-full">
      {/* Image Skeleton */}
      <div className="w-full aspect-square bg-slate-700 animate-shimmer overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 animate-shimmer"></div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        {/* Title */}
        <div className="mb-3">
          <div className="h-4 bg-slate-700 rounded animate-pulse mb-2"></div>
          <div className="h-3 bg-slate-700 rounded w-3/4 animate-pulse"></div>
        </div>

        {/* Artist */}
        <div className="h-3 bg-slate-700 rounded w-1/2 animate-pulse mb-4"></div>

        {/* Buttons */}
        <div className="flex gap-2">
          <div className="flex-1 h-8 bg-slate-700 rounded animate-pulse"></div>
          <div className="flex-1 h-8 bg-slate-700 rounded animate-pulse"></div>
          <div className="flex-1 h-8 bg-slate-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

/**
 * SkeletonGrid - Renders multiple skeleton cards
 */
export function SkeletonGrid({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ animationDelay: `${i * 0.05}s` }}>
          <SkeletonCard />
        </div>
      ))}
    </div>
  )
}

/**
 * EmptyState - Friendly message when no artworks found
 */
export function EmptyState({ onClear }) {
  return (
    <div className="min-h-96 flex items-center justify-center">
      <div className="text-center max-w-md">
        {/* Empty Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">📭</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-2">No Artworks Found</h3>

        {/* Description */}
        <p className="text-gray-400 mb-6">
          We couldn't find any artworks matching your search. Try adjusting your filters or categories.
        </p>

        {/* Action Button */}
        <button
          onClick={onClear}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/30"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}

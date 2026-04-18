import { useEffect, useRef, useState } from 'react'

/**
 * LazyImage - Optimized image loading with Intersection Observer
 * Only loads images when they're visible in the viewport
 */
export function LazyImage({ src, alt, className = '' }) {
  const imgRef = useRef(null)
  const [imageSrc, setImageSrc] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && src) {
          setImageSrc(src)
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '50px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [src])

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={className}
      onLoad={() => setIsLoading(false)}
      onError={(e) => {
        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23334155" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="48" fill="%23cbd5e1" text-anchor="middle" dy=".3em"%3EImage Error%3C/text%3E%3C/svg%3E'
      }}
    />
  )
}

export default LazyImage

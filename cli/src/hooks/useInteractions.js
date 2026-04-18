import { useEffect } from 'react';

/**
 * useKeyboardNavigation - Add keyboard navigation support
 * Supports arrow keys, Enter, Escape
 */
export function useKeyboardNavigation(handlers = {}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && handlers.onEscape) {
        e.preventDefault();
        handlers.onEscape();
      } else if (e.key === 'Enter' && handlers.onEnter) {
        e.preventDefault();
        handlers.onEnter();
      } else if (e.key === 'ArrowUp' && handlers.onArrowUp) {
        e.preventDefault();
        handlers.onArrowUp();
      } else if (e.key === 'ArrowDown' && handlers.onArrowDown) {
        e.preventDefault();
        handlers.onArrowDown();
      } else if (e.key === 'ArrowLeft' && handlers.onArrowLeft) {
        e.preventDefault();
        handlers.onArrowLeft();
      } else if (e.key === 'ArrowRight' && handlers.onArrowRight) {
        e.preventDefault();
        handlers.onArrowRight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}

/**
 * useSwipe - Detect swipe gestures on touch devices
 */
export function useSwipe(onSwipeLeft, onSwipeRight) {
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const delta = touchStartX - touchEndX;
      if (Math.abs(delta) > 50) {
        if (delta > 0 && onSwipeLeft) {
          onSwipeLeft();
        } else if (delta < 0 && onSwipeRight) {
          onSwipeRight();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight]);
}

export default { useKeyboardNavigation, useSwipe };

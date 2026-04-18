import { createContext, useContext, useState, useCallback } from 'react'

/**
 * ToastContext - Global notification system
 * Provides useToast hook for showing temporary notifications
 */
const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  /**
   * Show a toast notification
   * @param {string} message - Toast message
   * @param {string} type - 'success' | 'error' | 'info' | 'warning'
   * @param {number} duration - Auto-dismiss duration in ms (default: 3000)
   */
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast = { id, message, type, duration }

    setToasts((prev) => [...prev, toast])

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }

    return id
  }, [])

  /**
   * Dismiss a specific toast
   */
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  /**
   * Clear all toasts
   */
  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, clearToasts, toasts }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

/**
 * Toast Container - Renders all active toasts
 */
function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  )
}

/**
 * Individual Toast component
 */
function Toast({ id, message, type, onDismiss }) {
  const bgColors = {
    success: 'bg-green-600 border-green-700',
    error: 'bg-red-600 border-red-700',
    info: 'bg-blue-600 border-blue-700',
    warning: 'bg-yellow-600 border-yellow-700',
  }

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }

  return (
    <div
      className={`animate-slideIn p-4 rounded-lg border ${bgColors[type] || bgColors.info} text-white shadow-lg flex items-center gap-3`}
      role="alert"
    >
      <span className="text-lg font-bold flex-shrink-0">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="text-white hover:opacity-80 transition-opacity flex-shrink-0"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  )
}

/**
 * Hook to use ToastContext
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return {
    showToast: context.showToast,
    dismissToast: context.dismissToast,
    clearToasts: context.clearToasts,
  }
}

export { ToastProvider as default }

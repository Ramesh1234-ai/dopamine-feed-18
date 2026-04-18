import React from 'react'

/**
 * ErrorBoundary - Catches React component errors
 * Prevents entire app from crashing on component errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
          <div className="max-w-lg w-full bg-slate-800 border border-red-600/50 rounded-2xl p-8 shadow-2xl">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center border border-red-600/50">
                <span className="text-3xl">⚠️</span>
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-white text-center mb-3">
              Oops! Something went wrong
            </h1>

            {/* Error Message */}
            <p className="text-gray-400 text-center mb-6">
              We encountered an unexpected error. Don't worry, we've logged it and will look into it.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
                <p className="text-sm font-mono text-red-300 break-words">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2 text-xs text-gray-400">
                    <summary className="cursor-pointer font-semibold">Details</summary>
                    <p className="mt-2 font-mono whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </p>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/gallery')}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
              >
                Go to Gallery
              </button>
            </div>

            {/* Support Text */}
            <p className="text-center text-xs text-gray-500 mt-6">
              If this problem persists, please contact support at{' '}
              <a
                href="mailto:support@aigallery.com"
                className="text-indigo-400 hover:underline"
              >
                support@aigallery.com
              </a>
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

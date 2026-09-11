import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#fdfaf3] px-4 text-center">
          <div className="max-w-md rounded-2xl border border-[#eeddb9] bg-white p-8 shadow-xl">
            <h1 className="text-2xl font-bold text-[#142e1d]">Something went wrong</h1>
            <p className="mt-2 text-sm text-[#5f6d64]">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-xl bg-[#142e1d] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#eeddb9] shadow transition hover:bg-[#1f422b]"
              >
                Reload Page
              </button>
              <a
                href="/"
                className="rounded-xl border border-[#142e1d] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#142e1d] transition hover:bg-[#f2efe6]"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

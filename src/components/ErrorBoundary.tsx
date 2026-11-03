import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: () => void
}

export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error(error)
    this.props.onError?.()
  }

  render() {
    if (!this.state.failed) return this.props.children
    if (this.props.fallback !== undefined) return this.props.fallback
    return (
      <div role="alert" className="mx-auto my-24 max-w-md px-4 text-center">
        <p className="font-display text-2xl text-oxblood">Something went wrong in this part of the page.</p>
        <button type="button" onClick={() => location.reload()} className="btn-primary mt-6">
          Reload the page
        </button>
      </div>
    )
  }
}

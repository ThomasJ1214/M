import { Component, type ReactNode } from 'react'
import { MStripe } from '@/components/ui/MStripe'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 px-8 text-center">
          <h1
            className="font-display font-bold text-white leading-none"
            style={{
              fontSize: 'clamp(60px, 10vw, 120px)',
              textShadow: '4px 0 #C1001F, -4px 0 #1C69D4',
            }}
          >
            ENGINE FAULT
          </h1>
          <MStripe className="w-32" />
          <p className="font-mono text-sm text-white/40 max-w-md tracking-wider">
            Something misfired in the M Division systems. Try refreshing — if it persists, the tech team is investigating.
          </p>
          <a
            href="/"
            className="font-display font-bold text-sm tracking-[0.2em] uppercase bg-[var(--m-blue)] text-white px-10 py-4 hover:bg-[var(--m-blue)]/80 transition-colors"
          >
            Return to Pits →
          </a>
        </div>
      )
    }
    return this.props.children
  }
}

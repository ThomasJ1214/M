import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface ToastProps {
  message: string
  sub?: string
  onDone: () => void
  duration?: number
}

export function Toast({ message, sub, onDone, duration = 2800 }: ToastProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(
      ref.current,
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.4)' }
    )
    const timer = setTimeout(() => {
      gsap.to(ref.current, {
        y: -20, opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.in',
        onComplete: onDone,
      })
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onDone])

  return (
    <div
      ref={ref}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[99998] pointer-events-none"
      style={{ opacity: 0 }}
      role="status"
      aria-live="polite"
    >
      <div
        className="flex flex-col items-center gap-1 px-8 py-4 font-mono text-center"
        style={{
          background: 'rgba(0,0,0,0.92)',
          border: '1px solid rgba(28,105,212,0.5)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 24px rgba(28,105,212,0.3)',
        }}
      >
        <span className="text-white font-bold tracking-[0.3em] uppercase text-sm">{message}</span>
        {sub && <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase">{sub}</span>}
      </div>
    </div>
  )
}

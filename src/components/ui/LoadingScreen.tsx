import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 18 + 4
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setTimeout(() => {
          setDone(true)
          setTimeout(onComplete, 600)
        }, 300)
      }
      setProgress(Math.min(p, 100))
    }, 120)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* M Logo SVG */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <MLogo size={80} />
          </motion.div>

          {/* Progress text */}
          <div className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase mb-6">
            Loading M Division
          </div>

          {/* Progress bar */}
          <div className="w-64 h-[3px] bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0"
              style={{
                background: 'linear-gradient(90deg, #1C69D4, #6B2D8B, #C1001F)',
                backgroundSize: '200% 100%',
              }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
            />
          </div>

          <div className="font-mono text-xs tracking-widest text-white/30 mt-4">
            {Math.round(progress)}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function MLogo({ size = 60, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 0.45}
      viewBox="0 0 200 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="BMW M Division logo"
    >
      {/* Left blue segment */}
      <path d="M0 90 L40 0 L80 90 L60 90 L40 40 L20 90 Z" fill="#1C69D4" />
      {/* Center purple segment */}
      <path d="M60 90 L80 40 L100 90 Z" fill="#6B2D8B" />
      <path d="M100 90 L120 40 L140 90 Z" fill="#6B2D8B" />
      {/* Right red segment */}
      <path d="M120 90 L160 0 L200 90 L180 90 L160 40 L140 90 Z" fill="#C1001F" />
      {/* Center overlap */}
      <path d="M80 90 L100 40 L120 90 Z" fill="#6B2D8B" opacity="0.8" />
    </svg>
  )
}

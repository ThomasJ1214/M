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
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <MLogo size={72} />
          </motion.div>

          <div className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase mb-6">
            Loading M Division
          </div>

          <div className="w-64 h-[3px] bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0"
              style={{ background: 'linear-gradient(90deg, #1C69D4, #6B2D8B, #C1001F)' }}
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

/** Accurate BMW M Division tricolor logo SVG */
export function MLogo({ size = 60, className = '' }: { size?: number; className?: string }) {
  const h = Math.round(size * 0.38)
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 200 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="BMW M Division logo"
      role="img"
    >
      {/* Blue — outer left stroke */}
      <path d="M0,76 L38,0 L64,0 L28,76 Z" fill="#1C69D4" />
      {/* Blue — inner left diagonal */}
      <path d="M28,76 L64,0 L86,38 L58,76 Z" fill="#1C69D4" />
      {/* Purple — center V */}
      <path d="M58,76 L86,38 L100,0 L114,38 L142,76 Z" fill="#6B2D8B" />
      {/* Red — inner right diagonal */}
      <path d="M142,76 L114,38 L136,0 L172,76 Z" fill="#C1001F" />
      {/* Red — outer right stroke */}
      <path d="M172,76 L136,0 L162,0 L200,76 Z" fill="#C1001F" />
    </svg>
  )
}

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
              style={{ background: 'linear-gradient(90deg, #1C69D4, #C1001F)' }}
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

/** BMW M Division logo — renders the real uploaded SVG */
export function MLogo({ size = 60, className = '' }: { size?: number; className?: string }) {
  // Real SVG aspect ratio: 57.977619 / 20.957119 ≈ 2.766
  const height = Math.round(size / 2.766)
  return (
    <img
      src="/images/bmw-m-logo.svg"
      width={size}
      height={height}
      alt="BMW M Division logo"
      className={className}
      draggable={false}
      style={{ display: 'block' }}
    />
  )
}

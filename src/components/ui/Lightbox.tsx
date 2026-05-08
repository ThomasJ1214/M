import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LightboxProps {
  images: string[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
  const handleNext = useCallback(() => {
    onNavigate((currentIndex + 1) % images.length)
  }, [currentIndex, images.length, onNavigate])

  const handlePrev = useCallback(() => {
    onNavigate((currentIndex - 1 + images.length) % images.length)
  }, [currentIndex, images.length, onNavigate])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, handleNext, handlePrev])

  // Touch swipe
  let touchStartX = 0
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX = e.touches[0].clientX }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX
    if (Math.abs(dx) > 50) dx > 0 ? handlePrev() : handleNext()
  }

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="dialog"
        aria-modal="true"
        aria-label="Image lightbox"
      >
        {/* Close button */}
        <button
          className="absolute top-6 right-6 z-10 text-white/60 hover:text-white font-mono text-sm tracking-widest uppercase"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          ESC / Close
        </button>

        {/* Counter */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-xs text-white/40 tracking-widest">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Main image */}
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          className="max-w-[90vw] max-h-[85vh] object-contain z-10 select-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          draggable={false}
        />

        {/* Prev / Next */}
        <button
          className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-4 text-white/50 hover:text-white transition-colors"
          onClick={(e) => { e.stopPropagation(); handlePrev() }}
          aria-label="Previous image"
        >
          <span className="font-display text-4xl">‹</span>
        </button>
        <button
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-4 text-white/50 hover:text-white transition-colors"
          onClick={(e) => { e.stopPropagation(); handleNext() }}
          aria-label="Next image"
        >
          <span className="font-display text-4xl">›</span>
        </button>

        {/* Thumbnails strip */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); onNavigate(i) }}
              className={`w-12 h-8 overflow-hidden transition-all ${
                i === currentIndex ? 'opacity-100 ring-1 ring-[var(--m-blue)]' : 'opacity-40 hover:opacity-70'
              }`}
              aria-label={`Go to image ${i + 1}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

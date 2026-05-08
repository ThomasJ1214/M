import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAppStore } from '@/store'
import { models } from '@/data/models'

export function MobileMenu() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useAppStore()

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-[9998] bg-black flex flex-col"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex justify-between items-center p-6">
            <span className="font-display font-bold text-xl tracking-[0.2em] text-white/60">M DIVISION</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/60 hover:text-white"
              aria-label="Close menu"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* M-stripe divider */}
          <div className="h-[3px] mx-6" style={{ background: 'linear-gradient(90deg, #1C69D4, #6B2D8B, #C1001F)' }} />

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 gap-3">
              {models.map((model, i) => (
                <motion.div
                  key={model.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <Link
                    to={`/models/${model.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-4 border border-white/10 hover:border-[var(--m-blue)] transition-colors"
                  >
                    <div className="font-display font-bold text-2xl text-white">{model.name}</div>
                    <div className="font-mono text-[10px] text-white/40 mt-1 uppercase tracking-widest">
                      {model.generations[model.featuredGenIndex]?.years}
                    </div>
                    <div className="font-mono text-[10px] mt-1" style={{ color: model.accentColor }}>
                      {model.generations[model.featuredGenIndex]?.hp}hp
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

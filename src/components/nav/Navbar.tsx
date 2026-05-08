import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useAppStore } from '@/store'
import { MLogo } from '@/components/ui/LoadingScreen'
import { MobileMenu } from './MobileMenu'
import { models } from '@/data/models'

const NAV_MODELS = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm8', 'x5m']
const MORE_MODELS = ['x6m', 'm-csl', 'im']

export function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const { isMuted, toggleMute, theme, toggleTheme, isNavScrolled, setNavScrolled, setMobileMenuOpen } = useAppStore()
  const [showMore, setShowMore] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const lastScrollY = useRef(0)

  // Scroll-driven height shrink
  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY
      setNavScrolled(sy > 80)
      lastScrollY.current = sy
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setNavScrolled])

  // Logo glitch hover
  const handleLogoHover = () => {
    if (!logoRef.current) return
    gsap.fromTo(logoRef.current,
      { x: 0, filter: 'none' },
      {
        keyframes: [
          { x: -3, filter: 'hue-rotate(90deg)', duration: 0.05 },
          { x: 2, filter: 'hue-rotate(-90deg)', duration: 0.05 },
          { x: -1, filter: 'hue-rotate(45deg)', duration: 0.05 },
          { x: 0, filter: 'none', duration: 0.05 },
        ],
        duration: 0.2,
      }
    )
  }

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  const activeSlug = location.pathname.startsWith('/models/')
    ? location.pathname.split('/models/')[1]
    : null

  return (
    <>
      <nav
        ref={navRef}
        className={`navbar ${isNavScrolled ? 'navbar--scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div ref={logoRef} className="flex-shrink-0 mr-8">
          <button
            onClick={handleLogoClick}
            onMouseEnter={handleLogoHover}
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-blue)]"
            aria-label="BMW M Division — Return to home"
          >
            <MLogo size={40} />
          </button>
        </div>

        {/* Center Nav — desktop */}
        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {NAV_MODELS.map(slug => {
            const model = models.find(m => m.slug === slug)
            if (!model) return null
            const isActive = activeSlug === slug
            return (
              <NavTab key={slug} slug={slug} name={model.name} isActive={isActive} />
            )
          })}

          {/* More dropdown */}
          <div className="relative">
            <button
              className="nav-tab text-white/60 hover:text-white"
              onMouseEnter={() => setShowMore(true)}
              onMouseLeave={() => setShowMore(false)}
              aria-haspopup="true"
              aria-expanded={showMore}
            >
              More ▾
            </button>
            {showMore && (
              <div
                className="absolute top-full left-0 mt-1 bg-black/95 border border-white/10 backdrop-blur-xl py-2 min-w-[160px] z-50"
                onMouseEnter={() => setShowMore(true)}
                onMouseLeave={() => setShowMore(false)}
              >
                {MORE_MODELS.map(slug => {
                  const model = models.find(m => m.slug === slug)
                  if (!model) return null
                  return (
                    <Link
                      key={slug}
                      to={`/models/${slug}`}
                      className="block px-5 py-2 font-display font-bold tracking-[0.1em] text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {model.name}
                    </Link>
                  )
                })}
                <div className="h-px bg-white/10 my-2" />
                <div className="px-5 py-1 font-mono text-[10px] tracking-widest text-white/30 uppercase">M Performance</div>
                {['m135i', 'm235i', 'm340i', 'm440i', 'm550i'].map(s => (
                  <Link
                    key={s}
                    to={`/models/${s}`}
                    className="block px-5 py-1.5 font-display font-bold tracking-[0.1em] text-xs text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
                  >
                    {s.toUpperCase()}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Sound toggle */}
          <button
            onClick={toggleMute}
            className="hidden sm:flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-white/50 hover:text-white transition-colors"
            aria-label={isMuted ? 'Unmute engine sound' : 'Mute engine sound'}
          >
            {isMuted ? (
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
            <span className="hidden md:inline">{isMuted ? 'Sound Off' : 'Sound On'}</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="hidden sm:flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-white/50 hover:text-white transition-colors"
            aria-label={`Switch to ${theme === 'default' ? 'Racing Red' : 'Default'} theme`}
          >
            <div
              className="w-3 h-3 rounded-full border border-white/30"
              style={{ background: theme === 'default' ? '#1C69D4' : '#C1001F' }}
            />
            <span className="hidden md:inline">{theme === 'default' ? 'M Blue' : 'M Red'}</span>
          </button>

          {/* GitHub */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block text-white/30 hover:text-white transition-colors"
            aria-label="View on GitHub"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>

          {/* Hamburger — mobile */}
          <button
            className="lg:hidden text-white/70 hover:text-white"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </nav>

      <MobileMenu />
    </>
  )
}

function NavTab({ slug, name, isActive }: { slug: string; name: string; isActive: boolean }) {
  return (
    <Link
      to={`/models/${slug}`}
      className={`nav-tab relative px-4 py-2 font-display font-bold text-[15px] tracking-[0.15em] uppercase transition-colors ${
        isActive ? 'text-white' : 'text-white/50 hover:text-white'
      }`}
    >
      {name}
      {isActive && (
        <span
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, #1C69D4, #6B2D8B)',
            boxShadow: '0 0 8px rgba(28,105,212,0.6)',
          }}
        />
      )}
    </Link>
  )
}

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { MLogo } from '@/components/ui/LoadingScreen'
import { MStripe } from '@/components/ui/MStripe'

export function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const smokeRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!logoRef.current) return

    // Logo "burnout" — oscillate left-right
    gsap.to(logoRef.current, {
      x: 20,
      duration: 0.1,
      ease: 'none',
      yoyo: true,
      repeat: -1,
    })

    // Smoke particles
    smokeRefs.current.forEach((smoke, i) => {
      if (!smoke) return
      gsap.fromTo(
        smoke,
        {
          y: 0,
          x: (Math.random() - 0.5) * 80,
          scale: 0.5 + Math.random() * 0.5,
          opacity: 0.4 + Math.random() * 0.3,
        },
        {
          y: -(80 + Math.random() * 120),
          x: `+=${(Math.random() - 0.5) * 120}`,
          scale: 2 + Math.random() * 2,
          opacity: 0,
          duration: 1.5 + Math.random() * 1,
          delay: i * 0.2,
          repeat: -1,
          ease: 'power1.out',
        }
      )
    })

    // Skid marks (tire tracks) animate
    const skids = containerRef.current?.querySelectorAll('.skid')
    if (skids) {
      gsap.fromTo(
        skids,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
      )
    }

    return () => {
      gsap.killTweensOf(logoRef.current)
      smokeRefs.current.forEach(s => gsap.killTweensOf(s))
    }
  }, [])

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-8"
      role="main"
    >
      {/* Skid marks */}
      <div className="absolute bottom-32 left-0 right-0 flex flex-col gap-4 items-center opacity-20" aria-hidden="true">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="skid h-1 bg-white/40"
            style={{
              width: `${120 + i * 30}px`,
              marginLeft: `${(i % 2) * 40}px`,
            }}
          />
        ))}
      </div>

      {/* Burnout M logo */}
      <div className="relative mb-12">
        {/* Smoke particles */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              ref={el => { if (el) smokeRefs.current[i] = el }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-white/20"
              style={{
                width: `${20 + i * 4}px`,
                height: `${20 + i * 4}px`,
              }}
              aria-hidden="true"
            />
          ))}
        </div>

        <div ref={logoRef} style={{ display: 'inline-block' }} aria-label="BMW M logo performing a burnout">
          <MLogo size={80} />
        </div>
      </div>

      {/* 404 */}
      <h1
        className="font-display font-bold text-white mb-4 leading-none"
        style={{
          fontSize: 'clamp(120px, 25vw, 300px)',
          textShadow: '4px 0 #C1001F, -4px 0 #1C69D4, 0 0 60px rgba(28,105,212,0.3)',
          letterSpacing: '-0.04em',
        }}
      >
        404
      </h1>

      <MStripe className="w-32 mb-8" />

      <p className="font-display font-bold text-2xl md:text-4xl text-white/60 text-center mb-4 tracking-[0.1em] uppercase">
        Lost on the Nürburgring
      </p>

      <p className="font-mono text-sm text-white/30 text-center mb-12 tracking-wider max-w-md">
        Even an M5 can miss a turn. The page you're looking for isn't here — let's get you back on track.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-3 font-display font-bold text-sm tracking-[0.2em] uppercase bg-[var(--m-blue)] text-white px-10 py-4 hover:bg-[var(--m-blue)]/80 transition-colors"
          aria-label="Return to BMW M Division homepage"
        >
          Return to Pits →
        </Link>
        <Link
          to="/models/m3"
          className="inline-flex items-center justify-center gap-3 font-display font-bold text-sm tracking-[0.2em] uppercase border border-white/20 text-white px-10 py-4 hover:border-white/60 transition-colors"
          aria-label="View the BMW M3"
        >
          View the M3
        </Link>
      </div>

      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />
    </main>
  )
}

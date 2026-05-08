import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Each fragment is one of the 5 BMW M tricolor strokes, split into scatter pieces
const FRAGMENTS = [
  // Blue — outer left
  { d: 'M0,76 L19,38', color: '#1C69D4', x: -520, y: -280, rot: -155 },
  { d: 'M19,38 L38,0 L64,0', color: '#1C69D4', x: -280, y: 380, rot: 110 },
  { d: 'M64,0 L46,38 L28,76', color: '#1C69D4', x: 560, y: -210, rot: -85 },
  // Blue — inner left
  { d: 'M28,76 L64,0', color: '#1C69D4', x: -680, y: 190, rot: 145 },
  { d: 'M64,0 L86,38 L58,76', color: '#1C69D4', x: 420, y: -490, rot: -125 },
  // Purple — center V
  { d: 'M58,76 L86,38', color: '#6B2D8B', x: -190, y: 590, rot: 75 },
  { d: 'M86,38 L100,0 L114,38', color: '#6B2D8B', x: 680, y: 290, rot: -65 },
  { d: 'M114,38 L142,76', color: '#6B2D8B', x: -370, y: -380, rot: 105 },
  // Red — inner right
  { d: 'M142,76 L114,38 L136,0', color: '#C1001F', x: 510, y: 490, rot: 55 },
  { d: 'M136,0 L172,76', color: '#C1001F', x: -590, y: -290, rot: -135 },
  // Red — outer right
  { d: 'M172,76 L136,0 L162,0', color: '#C1001F', x: 290, y: -420, rot: 115 },
  { d: 'M162,0 L200,76', color: '#C1001F', x: -390, y: 340, rot: -95 },
]

export function LogoAssembly() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const fragmentRefs = useRef<(SVGPathElement | null)[]>([])
  const solidLogoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const logoGroupRef = useRef<SVGGElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !stickyRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          pin: stickyRef.current,
        },
      })

      // 0–55%: Fragments fly from scattered positions into place
      fragmentRefs.current.forEach((frag, i) => {
        if (!frag) return
        const f = FRAGMENTS[i]
        tl.fromTo(
          frag,
          {
            x: f.x,
            y: f.y,
            rotation: f.rot,
            opacity: 0,
            scale: 0.2,
            transformOrigin: '50% 50%',
          },
          {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            ease: 'expo.out',
          },
          i * 0.035
        )
      })

      // 50–58%: Fade out strokes, reveal solid filled logo
      if (logoGroupRef.current) {
        tl.to(logoGroupRef.current, { opacity: 0, ease: 'power2.in' }, 0.50)
      }
      if (solidLogoRef.current) {
        tl.fromTo(
          solidLogoRef.current,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, ease: 'power2.out' },
          0.53
        )
      }

      // 60–72%: Logo bloom / glow pulse
      if (solidLogoRef.current) {
        tl.to(
          solidLogoRef.current,
          {
            filter: 'drop-shadow(0 0 24px #1C69D4) drop-shadow(0 0 48px #6B2D8B)',
            scale: 1.04,
            duration: 0.06,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: 1,
          },
          0.62
        )
      }

      // 60–70%: Text character reveal
      if (textRef.current) {
        const chars = textRef.current.querySelectorAll('.char')
        tl.fromTo(
          chars,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, stagger: 0.014, ease: 'power3.out' },
          0.61
        )
      }

      // 80–100%: Logo + text fade out (transition to first chapter)
      if (solidLogoRef.current) {
        tl.to(solidLogoRef.current, { opacity: 0, scale: 0.92, ease: 'power2.inOut' }, 0.82)
      }
      if (subtitleRef.current) {
        tl.to(subtitleRef.current, { opacity: 0, y: -18, ease: 'power2.inOut' }, 0.83)
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const splitText = 'THE M DIVISION'.split('').map((c, i) => (
    <span key={i} className={`char inline-block ${c === ' ' ? 'mr-4' : ''}`}>{c}</span>
  ))

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '300vh' }}
      aria-label="BMW M Division logo reveal"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
      >
        {/* Subtle radial background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 60%, rgba(28,105,212,0.05) 0%, transparent 70%)',
          }}
        />

        {/* Fragment strokes — scatter / assemble animation */}
        <svg
          viewBox="0 0 200 76"
          className="w-full max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] relative z-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g ref={logoGroupRef}>
            {FRAGMENTS.map((f, i) => (
              <path
                key={i}
                d={f.d}
                stroke={f.color}
                strokeWidth="14"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                fill="none"
                ref={el => { fragmentRefs.current[i] = el }}
              />
            ))}
          </g>
        </svg>

        {/* Solid filled logo — initially hidden, revealed after fragments assemble */}
        <div
          ref={solidLogoRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0 }}
        >
          <svg
            viewBox="0 0 200 76"
            className="w-full max-w-[600px] md:max-w-[800px] lg:max-w-[1000px]"
            fill="none"
            style={{ filter: 'drop-shadow(0 0 20px rgba(28,105,212,0.35))' }}
            aria-label="BMW M Division logo"
            role="img"
          >
            {/* Accurate BMW M tricolor — 5-path structure */}
            <path d="M0,76 L38,0 L64,0 L28,76 Z" fill="#1C69D4" />
            <path d="M28,76 L64,0 L86,38 L58,76 Z" fill="#1C69D4" />
            <path d="M58,76 L86,38 L100,0 L114,38 L142,76 Z" fill="#6B2D8B" />
            <path d="M142,76 L114,38 L136,0 L172,76 Z" fill="#C1001F" />
            <path d="M172,76 L136,0 L162,0 L200,76 Z" fill="#C1001F" />
          </svg>
        </div>

        {/* Title text */}
        <div
          ref={subtitleRef}
          className="relative z-10 mt-8 md:mt-12 text-center"
        >
          <div
            ref={textRef}
            className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-[0.4em] text-white/90 uppercase"
            style={{ textShadow: '2px 0 #C1001F, -2px 0 #1C69D4' }}
          >
            {splitText}
          </div>
          <div className="font-mono text-xs tracking-[0.5em] text-white/30 mt-4 uppercase">
            50 Years · Motorsport DNA · Pure Precision
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <div className="font-mono text-[10px] tracking-[0.4em] uppercase">Scroll</div>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  )
}

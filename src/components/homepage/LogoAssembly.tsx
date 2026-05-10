import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * 10 filled fragments matching the real BMW M logo geometry.
 * Blue stripes (left), white/silver peak (center), red stripes (right).
 * Assembled viewBox: 0 0 200 76
 */
const FRAGMENTS = [
  // Blue outer left — top half
  { d: 'M38,0 L64,0 L46,38 L19,38 Z', fill: '#1C69D4', x: -500, y: -400, rot: -145 },
  // Blue outer left — bottom half
  { d: 'M0,76 L19,38 L46,38 L28,76 Z', fill: '#1C69D4', x: -640, y: 250, rot: 100 },
  // Blue inner left — top half
  { d: 'M64,0 L86,38 L46,38 Z', fill: '#1C69D4', x: 360, y: -540, rot: -105 },
  // Blue inner left — bottom half
  { d: 'M28,76 L46,38 L86,38 L58,76 Z', fill: '#1C69D4', x: -260, y: 510, rot: 125 },
  // White/silver center peak — top (matches real BMW M logo silver divider)
  { d: 'M86,38 L100,0 L114,38 Z', fill: '#D8D8D8', x: 10, y: -620, rot: -5 },
  // White/silver center — bottom trapezoid
  { d: 'M58,76 L86,38 L114,38 L142,76 Z', fill: '#C4C4C4', x: 0, y: 620, rot: 5 },
  // Red inner right — top half
  { d: 'M114,38 L136,0 L154,38 Z', fill: '#C1001F', x: 260, y: -510, rot: 105 },
  // Red inner right — bottom half
  { d: 'M142,76 L114,38 L154,38 L172,76 Z', fill: '#C1001F', x: 640, y: 240, rot: -125 },
  // Red outer right — top half
  { d: 'M136,0 L162,0 L181,38 L154,38 Z', fill: '#C1001F', x: 500, y: -400, rot: 140 },
  // Red outer right — bottom half
  { d: 'M172,76 L154,38 L181,38 L200,76 Z', fill: '#C1001F', x: 660, y: -230, rot: -90 },
]

export function LogoAssembly() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const fragmentRefs = useRef<(SVGPathElement | null)[]>([])
  const logoSvgRef = useRef<SVGSVGElement>(null)
  const realLogoRef = useRef<HTMLImageElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !stickyRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          pin: stickyRef.current,
        },
      })

      // 0–60%: All 10 fragments fly from scattered positions into logo positions
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
            scale: 0.15,
            transformOrigin: '100px 38px',
          },
          {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            ease: 'expo.out',
          },
          i * 0.04
        )
      })

      // 58–65%: Assembled logo glows, real logo fades in on top
      if (logoSvgRef.current) {
        tl.to(
          logoSvgRef.current,
          {
            filter: 'drop-shadow(0 0 16px #1C69D4) drop-shadow(0 0 32px rgba(193,0,31,0.6)) drop-shadow(0 0 6px #fff)',
            scale: 1.03,
            transformOrigin: '50% 50%',
            ease: 'power2.inOut',
            yoyo: true,
            repeat: 1,
            duration: 0.06,
          },
          0.59
        )
      }

      // Crossfade to real logo at 60–65%
      if (realLogoRef.current) {
        tl.fromTo(
          realLogoRef.current,
          { opacity: 0 },
          { opacity: 1, ease: 'power2.inOut', duration: 0.05 },
          0.60
        )
      }
      if (logoSvgRef.current) {
        tl.to(logoSvgRef.current, { opacity: 0, duration: 0.04 }, 0.60)
      }

      // 62–72%: "THE M DIVISION" text characters reveal
      if (textRef.current) {
        const chars = textRef.current.querySelectorAll('.char')
        tl.fromTo(
          chars,
          { opacity: 0, y: 24, rotationX: -40 },
          { opacity: 1, y: 0, rotationX: 0, stagger: 0.013, ease: 'power3.out' },
          0.62
        )
      }

      // 80–100%: Logo + subtitle fade out upward
      if (realLogoRef.current) {
        tl.to(realLogoRef.current, { opacity: 0, y: -30, ease: 'power2.inOut' }, 0.82)
      }
      if (subtitleRef.current) {
        tl.to(subtitleRef.current, { opacity: 0, y: -18, ease: 'power2.inOut' }, 0.84)
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
        {/* Background radial gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 55%, rgba(28,105,212,0.06) 0%, transparent 68%)',
          }}
        />

        {/* Fragment animation SVG — replaced by real logo on crossfade */}
        <svg
          ref={logoSvgRef}
          viewBox="0 0 200 76"
          className="w-full max-w-[480px] md:max-w-[700px] lg:max-w-[900px] relative z-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {FRAGMENTS.map((f, i) => (
            <path
              key={i}
              d={f.d}
              fill={f.fill}
              ref={el => { fragmentRefs.current[i] = el }}
            />
          ))}
        </svg>

        {/* Real BMW M logo — fades in after fragments assemble */}
        <img
          ref={realLogoRef}
          src="/images/bmw-m-logo.svg"
          alt="BMW M Division logo"
          className="absolute w-full max-w-[480px] md:max-w-[700px] lg:max-w-[900px] z-10"
          style={{ opacity: 0 }}
          draggable={false}
        />

        {/* Title text — below logo */}
        <div
          ref={subtitleRef}
          className="relative z-10 mt-10 md:mt-14 text-center"
        >
          <div
            ref={textRef}
            className="font-display font-bold text-3xl md:text-5xl lg:text-7xl tracking-[0.4em] text-white/90 uppercase"
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

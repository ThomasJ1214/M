import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// M logo fragment paths — each is a slice of the tricolor M
const FRAGMENTS = [
  // Blue side — left M
  { d: 'M0 90 L20 45', color: '#1C69D4', x: -500, y: -300, rot: -160 },
  { d: 'M20 45 L40 0', color: '#1C69D4', x: -300, y: 400, rot: 120 },
  { d: 'M40 0 L60 45', color: '#1C69D4', x: 600, y: -200, rot: -90 },
  { d: 'M60 45 L80 90', color: '#1C69D4', x: -700, y: 200, rot: 150 },
  // Purple center
  { d: 'M60 90 L80 40 L100 90', color: '#6B2D8B', x: 400, y: -500, rot: -130 },
  { d: 'M100 90 L120 40 L140 90', color: '#6B2D8B', x: -200, y: 600, rot: 80 },
  { d: 'M80 90 L100 40 L120 90', color: '#6B2D8B', x: 700, y: 300, rot: -70 },
  // Red side — right M
  { d: 'M120 90 L140 45', color: '#C1001F', x: 300, y: -400, rot: 110 },
  { d: 'M140 45 L160 0', color: '#C1001F', x: -600, y: -300, rot: -140 },
  { d: 'M160 0 L180 45', color: '#C1001F', x: 500, y: 500, rot: 60 },
  { d: 'M180 45 L200 90', color: '#C1001F', x: -400, y: 350, rot: -100 },
  // Base line
  { d: 'M0 90 L200 90', color: '#4A4A4A', x: 0, y: 800, rot: 0 },
]

export function LogoAssembly() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const fragmentRefs = useRef<(SVGPathElement | null)[]>([])
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

      // 0–60%: Fragments fly into position
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
            scale: 0.3,
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
          i * 0.04
        )
      })

      // 60–75%: Logo blooms / glow pulse
      if (logoGroupRef.current) {
        tl.to(
          logoGroupRef.current,
          {
            filter: 'drop-shadow(0 0 20px #1C69D4) drop-shadow(0 0 40px #6B2D8B)',
            scale: 1.05,
            duration: 0.08,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: 1,
          },
          0.62
        )
      }

      // 60–70%: Text "THE M DIVISION" reveals char by char
      if (textRef.current) {
        const chars = textRef.current.querySelectorAll('.char')
        tl.fromTo(
          chars,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.015, ease: 'power3.out' },
          0.6
        )
      }

      // 75–100%: Logo scales down to nav position
      if (logoGroupRef.current) {
        tl.to(
          logoGroupRef.current,
          { scale: 0.2, x: -380, y: -200, opacity: 0, ease: 'power2.inOut' },
          0.8
        )
      }

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          { opacity: 0, y: -20, ease: 'power2.inOut' },
          0.82
        )
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
        {/* Subtle animated background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 60%, rgba(28,105,212,0.06) 0%, transparent 70%)',
          }}
        />

        {/* M logo SVG with fragments */}
        <svg
          viewBox="0 0 200 90"
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
                strokeWidth="18"
                strokeLinecap="square"
                strokeLinejoin="miter"
                fill="none"
                ref={el => { fragmentRefs.current[i] = el }}
              />
            ))}

            {/* Solid filled M logo paths */}
            {/* Blue left M fill */}
            <path
              d="M0 90 L40 0 L80 90 L60 90 L40 40 L20 90 Z"
              fill="#1C69D4"
              opacity="0"
              ref={el => { /* handled via stroke paths */ }}
            />
          </g>
        </svg>

        {/* Full solid M logo (revealed on assembly) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <FullMLogo logoRef={logoGroupRef} />
        </div>

        {/* Title text */}
        <div
          ref={subtitleRef}
          className="relative z-10 mt-8 md:mt-12 text-center"
        >
          <div
            ref={textRef}
            className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-[0.4em] text-white/90 uppercase"
            style={{
              textShadow: '2px 0 #C1001F, -2px 0 #1C69D4',
            }}
          >
            {splitText}
          </div>
          <div className="font-mono text-xs tracking-[0.5em] text-white/30 mt-4 uppercase char">
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

function FullMLogo({ logoRef }: { logoRef: React.RefObject<SVGGElement> }) {
  return (
    <svg
      viewBox="0 0 200 90"
      className="w-full max-w-[600px] md:max-w-[800px] lg:max-w-[1000px]"
      fill="none"
      style={{ filter: 'drop-shadow(0 0 30px rgba(28,105,212,0.4))' }}
      aria-hidden="true"
    >
      <path d="M0 90 L40 0 L80 90 L60 90 L40 40 L20 90 Z" fill="#1C69D4" />
      <path d="M60 90 L80 40 L100 90 Z" fill="#6B2D8B" />
      <path d="M80 90 L100 40 L120 90 Z" fill="#6B2D8B" />
      <path d="M100 90 L120 40 L140 90 Z" fill="#6B2D8B" />
      <path d="M120 90 L160 0 L200 90 L180 90 L160 40 L140 90 Z" fill="#C1001F" />
    </svg>
  )
}

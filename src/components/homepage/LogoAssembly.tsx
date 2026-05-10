import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Fragments derived from the real BMW M SVG (viewBox 0 0 57.977619 20.957119).
 *
 * The real logo is NOT a pointed mountain M — it is four diagonal parallelogram
 * stripe bands (two blue, one red, one silver) plus the BMW text trapezoid.
 * All stripe edges share slope: dx/dy = (0 - 12.493) / 20.957 = -0.5961
 *
 * Stripe top boundaries (y=0):     12.493 | 21.078 | 29.087 | 37.104 | 38.411 | 57.947
 * Stripe bottom boundaries (y=20.957): 0  |  8.703 | 16.712 | 24.841 | 26.063 | 57.947
 * Midpoint boundaries (y=10.479):  6.245  | 14.830 | 22.839 | 30.848 | 32.163
 */
const FRAGMENTS = [
  // Blue stripe 1, upper half (light blue, outer left)
  { d: 'M21.078,0 L12.493,0 L6.245,10.479 L14.830,10.479 Z', fill: '#619ED5', x: -460, y: -360, rot: -140 },
  // Blue stripe 1, lower half
  { d: 'M14.830,10.479 L6.245,10.479 L0,20.957 L8.703,20.957 Z', fill: '#619ED5', x: -580, y: 280, rot: 118 },
  // Blue stripe 2 (inner, darker)
  { d: 'M29.087,0 L21.078,0 L8.703,20.957 L16.712,20.957 Z', fill: '#1C69D4', x: -200, y: -470, rot: -96 },
  // Red stripe, upper half
  { d: 'M37.104,0 L29.087,0 L22.839,10.479 L30.848,10.479 Z', fill: '#C1001F', x: 280, y: -460, rot: 112 },
  // Red stripe, lower half
  { d: 'M30.848,10.479 L22.839,10.479 L16.712,20.957 L24.841,20.957 Z', fill: '#C1001F', x: 580, y: 240, rot: -122 },
  // Silver divider strip
  { d: 'M38.411,0 L37.104,0 L24.841,20.957 L26.063,20.957 Z', fill: '#DEDEDE', x: 220, y: -200, rot: 76 },
  // BMW text area, upper half (simplified trapezoid; real SVG crossfades in)
  { d: 'M57.947,0 L38.113,0 L31.982,10.479 L57.947,10.479 Z', fill: '#848688', x: 560, y: -270, rot: 28 },
  // BMW text area, lower half
  { d: 'M57.947,10.479 L31.982,10.479 L25.854,20.952 L57.947,20.952 Z', fill: '#929496', x: 660, y: 190, rot: -20 },
]

export function LogoAssembly() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const fragmentRefs = useRef<(SVGPathElement | null)[]>([])
  const logoWrapRef = useRef<HTMLDivElement>(null)
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

      // 0–60%: all 8 fragments fly from scatter into assembled position
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
            scale: 0.25,
            svgOrigin: '28.989 10.479',
          },
          {
            x: 0, y: 0, rotation: 0,
            opacity: 1, scale: 1,
            ease: 'expo.out',
          },
          i * 0.05
        )
      })

      // 58–62%: assembled fragments glow
      if (logoSvgRef.current) {
        tl.to(
          logoSvgRef.current,
          {
            filter: 'drop-shadow(0 0 14px #1C69D4) drop-shadow(0 0 28px rgba(193,0,31,0.5)) drop-shadow(0 0 5px #fff)',
            scale: 1.02,
            svgOrigin: '28.989 10.479',
            ease: 'power2.inOut',
            yoyo: true,
            repeat: 1,
            duration: 0.05,
          },
          0.58
        )
      }

      // 61–65%: crossfade to real gradient logo
      if (realLogoRef.current) {
        tl.fromTo(
          realLogoRef.current,
          { opacity: 0 },
          { opacity: 1, ease: 'power2.inOut', duration: 0.04 },
          0.61
        )
      }
      if (logoSvgRef.current) {
        tl.to(logoSvgRef.current, { opacity: 0, duration: 0.03 }, 0.61)
      }

      // 62–72%: text characters reveal
      if (textRef.current) {
        const chars = textRef.current.querySelectorAll('.char')
        tl.fromTo(
          chars,
          { opacity: 0, y: 24, rotationX: -40 },
          { opacity: 1, y: 0, rotationX: 0, stagger: 0.013, ease: 'power3.out' },
          0.62
        )
      }

      // 80–100%: logo + subtitle fade out upward
      if (logoWrapRef.current) {
        tl.to(logoWrapRef.current, { opacity: 0, y: -30, ease: 'power2.inOut' }, 0.82)
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
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 55%, rgba(28,105,212,0.06) 0%, transparent 68%)',
          }}
        />

        {/* Shared container — fragment SVG and real logo occupy identical bounds */}
        <div
          ref={logoWrapRef}
          className="relative w-full max-w-[480px] md:max-w-[700px] lg:max-w-[900px] z-10"
          style={{ aspectRatio: '57.977619 / 20.957119' }}
        >
          {/* Fragment animation SVG — flat-color diagonal stripes, correct geometry */}
          <svg
            ref={logoSvgRef}
            viewBox="0 0 57.977619 20.957119"
            className="absolute inset-0 w-full h-full"
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

          {/* Real BMW M logo with gradients — fades in after fragments assemble */}
          <img
            ref={realLogoRef}
            src="/images/bmw-m-logo.svg"
            alt="BMW M Division logo"
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0, objectFit: 'fill' }}
            draggable={false}
          />
        </div>

        {/* Subtitle text */}
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

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <div className="font-mono text-[10px] tracking-[0.4em] uppercase">Scroll</div>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  )
}

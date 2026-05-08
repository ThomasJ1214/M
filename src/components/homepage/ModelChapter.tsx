import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { BMWModel } from '@/data/models'
import { HomepageScene } from '@/components/three/HomepageScene'
import { MStripe } from '@/components/ui/MStripe'

gsap.registerPlugin(ScrollTrigger)

interface ModelChapterProps {
  model: BMWModel
  index: number
}

export function ModelChapter({ model, index }: ModelChapterProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const genRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [scrollProgress, setScrollProgress] = useState(0)
  const [scaleProgress, setScaleProgress] = useState(0.6)
  const [opacityProgress, setOpacityProgress] = useState(0)
  const [showNurb, setShowNurb] = useState(false)

  const featuredGen = model.generations[model.featuredGenIndex]

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
          onUpdate: (self) => {
            const p = self.progress
            setScrollProgress(p)

            // 0–30%: model fades in, scales up
            if (p < 0.3) {
              setOpacityProgress(p / 0.3)
              setScaleProgress(0.6 + (p / 0.3) * 0.4)
            } else if (p > 0.7) {
              setOpacityProgress(1 - (p - 0.7) / 0.3)
              setScaleProgress(1)
            } else {
              setOpacityProgress(1)
              setScaleProgress(1)
            }
          },
        },
      })

      // Model name slides in from left at 0–20%
      if (nameRef.current) {
        tl.fromTo(
          nameRef.current,
          { x: -120, opacity: 0 },
          { x: 0, opacity: 1, ease: 'expo.out' },
          0
        )
      }

      // Generation tag fades in at 5–15%
      if (genRef.current) {
        tl.fromTo(
          genRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, ease: 'power3.out' },
          0.05
        )
      }

      // Stats rows stagger in at 15–50%
      if (statsRef.current) {
        const rows = statsRef.current.querySelectorAll('.stat-row')
        tl.fromTo(
          rows,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.04, ease: 'power3.out' },
          0.15
        )

      // Count up numbers — separate non-scrubbed trigger so numbers always go up, never reverse
      if (statsRef.current) {
        const values = statsRef.current.querySelectorAll('[data-count]')
        values.forEach((el) => {
          const target = parseFloat(el.getAttribute('data-count') || '0')
          const suffix = el.getAttribute('data-suffix') || ''
          const decimals = parseInt(el.getAttribute('data-decimals') || '0')
          const triggered = { done: false }
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              if (triggered.done) return
              triggered.done = true
              const obj = { val: 0 }
              gsap.to(obj, {
                val: target,
                duration: 1.0,
                ease: 'power2.out',
                onUpdate: () => {
                  (el as HTMLElement).textContent = obj.val.toFixed(decimals) + suffix
                },
                onComplete: () => {
                  (el as HTMLElement).textContent = target.toFixed(decimals) + suffix
                },
              })
            },
          })
        })
      }
      }

      // Scroll hint fades in then out
      if (scrollRef.current) {
        tl.fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, ease: 'power2.out' },
          0.1
        ).to(scrollRef.current, { opacity: 0 }, 0.7)
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '400vh' }}
      id={`chapter-${model.slug}`}
      aria-label={`${model.fullName} showcase chapter`}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden bg-black flex"
      >
        {/* Chapter transition accent line at top */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] z-20"
          style={{ background: model.accentColor }}
        />

        {/* Left — Stats Panel (40% width) */}
        <div className="relative z-10 w-full lg:w-[40%] flex flex-col justify-center px-8 lg:px-16 pt-24 pb-16">

          {/* Model index tag */}
          <div className="font-mono text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: model.accentColor }}>
            {String(index + 1).padStart(2, '0')} / M DIVISION
          </div>

          {/* Model name */}
          <div
            ref={nameRef}
            className="model-name chromatic mb-2 relative"
            style={{ fontSize: 'clamp(80px, 12vw, 180px)' }}
          >
            {model.name}
          </div>

          {/* Generation / year */}
          <div ref={genRef} className="font-mono text-sm tracking-[0.2em] uppercase mb-8" style={{ color: model.accentColor }}>
            {featuredGen.code} · {featuredGen.years}
          </div>

          {/* M Stripe */}
          <MStripe className="mb-8" />

          {/* Stats Panel */}
          <div ref={statsRef} className="space-y-0">
            <StatRow
              label="Horsepower"
              value={featuredGen.hp}
              suffix=" HP"
              accentColor={model.accentColor}
            />
            <StatRow
              label="0–60 mph"
              value={featuredGen.zeroToSixty}
              suffix=" sec"
              decimals={1}
              accentColor={model.accentColor}
            />
            <StatRow
              label="Top Speed"
              value={featuredGen.topSpeed}
              suffix=" km/h"
              accentColor={model.accentColor}
            />
            <div className="stat-row">
              <span className="stat-label">Engine</span>
              <span className="stat-value text-base">{featuredGen.engine}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Transmission</span>
              <span className="stat-value text-sm">{featuredGen.transmission}</span>
            </div>
            {featuredGen.nurburgringLapTime && (
              <div
                className="stat-row cursor-pointer group"
                onClick={() => setShowNurb(v => !v)}
                title="Long-press to toggle Nürburgring time"
                role="button"
                aria-label={`Nürburgring lap time: ${featuredGen.nurburgringLapTime}`}
              >
                <span className="stat-label">Nürburgring</span>
                <span className="stat-value text-base font-mono group-hover:text-[var(--m-blue)] transition-colors">
                  {showNurb ? featuredGen.nurburgringLapTime : '▶ REVEAL'}
                </span>
              </div>
            )}
          </div>

          {/* Scroll hint */}
          <div
            ref={scrollRef}
            className="mt-8 flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] uppercase text-white/30"
          >
            SCROLL TO EXPLORE
            <span className="animate-blink">▋</span>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <Link
              to={`/models/${model.slug}`}
              className="inline-flex items-center gap-3 font-display font-bold text-sm tracking-[0.2em] uppercase border border-white/20 px-6 py-3 hover:border-current hover:text-white transition-all group"
              style={{ color: model.accentColor }}
            >
              Learn More
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Right — 3D Canvas (60% width) */}
        <div
          ref={canvasRef}
          className="hidden lg:block absolute right-0 top-0 bottom-0 w-[60%]"
        >
          <HomepageScene
            accentColor={model.accentColor}
            scrollProgress={scrollProgress}
            scaleProgress={scaleProgress}
            opacityProgress={opacityProgress}
            modelType={model.bodyType}
          />

          {/* Model watermark — M1 special */}
          {model.slug === 'm1' && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(100px, 20vw, 280px)',
                fontWeight: 900,
                color: 'rgba(255,255,255,0.025)',
                letterSpacing: '-0.05em',
                userSelect: 'none',
              }}
              aria-hidden="true"
            >
              FIRST.<br />ALWAYS.
            </div>
          )}
        </div>

        {/* Mobile canvas (full-width below stats) */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 h-[45vh]">
          <HomepageScene
            accentColor={model.accentColor}
            scrollProgress={scrollProgress}
            scaleProgress={scaleProgress}
            opacityProgress={opacityProgress}
            modelType={model.bodyType}
          />
        </div>
      </div>
    </section>
  )
}

function StatRow({
  label,
  value,
  suffix = '',
  decimals = 0,
  accentColor,
}: {
  label: string
  value: number
  suffix?: string
  decimals?: number
  accentColor: string
}) {
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <span
        className="stat-value"
        data-count={value}
        data-suffix={suffix}
        data-decimals={decimals}
        style={{ color: 'var(--m-white)' }}
      >
        0{suffix}
      </span>
    </div>
  )
}

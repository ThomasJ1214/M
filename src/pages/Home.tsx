import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LogoAssembly } from '@/components/homepage/LogoAssembly'
import { ModelChapter } from '@/components/homepage/ModelChapter'
import { MStripe } from '@/components/ui/MStripe'
import { models, homepageOrder } from '@/data/models'
import { useAppStore } from '@/store'
import { useScrollVelocity } from '@/hooks/useScrollProgress'

gsap.registerPlugin(ScrollTrigger)

export function Home() {
  const { setLaunchControl, isCompetitionMode } = useAppStore()
  const flashRef = useRef<HTMLDivElement>(null)
  const shakeRef = useRef<HTMLDivElement>(null)
  const scrollVelocity = useScrollVelocity()
  const launchCooldown = useRef(false)

  // Launch control effect — only fires on very fast scroll (raised threshold to avoid accidental triggers)
  useEffect(() => {
    if (scrollVelocity > 25 && !launchCooldown.current) {
      launchCooldown.current = true
      setLaunchControl(true)

      if (flashRef.current) {
        gsap.fromTo(
          flashRef.current,
          { opacity: 0, display: 'block' },
          {
            keyframes: [
              { opacity: 0.8, duration: 0.08 },
              { opacity: 0, duration: 0.08 },
              { opacity: 0.4, duration: 0.08 },
              { opacity: 0, duration: 0.16 },
            ],
            onComplete: () => {
              setLaunchControl(false)
              if (flashRef.current) flashRef.current.style.display = 'none'
            },
          }
        )
      }

      // Screen shake — animate a wrapper div, NOT document.body
      if (shakeRef.current) {
        gsap.fromTo(
          shakeRef.current,
          { x: 0 },
          {
            keyframes: [
              { x: -5, duration: 0.05 },
              { x: 5, duration: 0.05 },
              { x: -3, duration: 0.05 },
              { x: 3, duration: 0.05 },
              { x: 0, duration: 0.05 },
            ],
            onComplete: () => {
              // Always clear the transform so content isn't permanently shifted
              gsap.set(shakeRef.current!, { clearProps: 'x' })
            },
          }
        )
      }

      setTimeout(() => { launchCooldown.current = false }, 3000)
    }
  }, [scrollVelocity, setLaunchControl])

  const orderedModels = homepageOrder
    .map(slug => models.find(m => m.slug === slug))
    .filter(Boolean) as typeof models

  return (
    <main
      className="relative bg-black"
      data-competition={isCompetitionMode ? 'true' : undefined}
      id="main-content"
    >
    {/* Shake wrapper — only this div moves during launch control, never body */}
    <div ref={shakeRef}>
      {/* Skip to content link for a11y */}
      <a
        href="#model-chapters"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:bg-[var(--m-blue)] focus:text-white focus:px-4 focus:py-2 focus:font-mono focus:text-sm"
      >
        Skip to models
      </a>

      {/* Logo Assembly — 300vh pinned */}
      <LogoAssembly />

      {/* M Stripe transition */}
      <MStripe />

      {/* Model Chapters — 400vh each */}
      <div id="model-chapters">
        {orderedModels.map((model, i) => (
          <ModelChapter key={model.slug} model={model} index={i} />
        ))}
      </div>

      {/* Footer CTA section */}
      <section className="py-32 px-8 md:px-16 text-center bg-[var(--m-gray-900)] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #1C69D4 0, #1C69D4 1px, transparent 1px, transparent 60px)',
          }}
        />
        <div className="relative z-10">
          <div className="font-mono text-xs tracking-[0.5em] uppercase text-white/30 mb-6">
            M Division · Since 1972
          </div>
          <h2
            className="font-display font-bold text-white mb-6"
            style={{ fontSize: 'clamp(48px, 8vw, 120px)' }}
          >
            DISCOVER YOUR M
          </h2>
          <MStripe className="max-w-xs mx-auto mb-10" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.bmw.com/en/all-models/bmw-m/overview.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 font-display font-bold text-sm tracking-[0.2em] uppercase bg-[var(--m-blue)] text-white px-10 py-4 hover:bg-[var(--m-blue)]/80 transition-colors"
              aria-label="Configure your BMW M on BMW.com (opens in new tab)"
            >
              Configure Your M →
            </a>
            <a
              href="#main-content"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="inline-flex items-center justify-center gap-3 font-display font-bold text-sm tracking-[0.2em] uppercase border border-white/20 text-white px-10 py-4 hover:border-white/60 transition-colors"
            >
              ↑ Back to Top
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 md:px-16 bg-black border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="font-display font-bold text-2xl text-white/80 tracking-[0.2em] mb-2">BMW M</div>
            <div className="font-mono text-[10px] text-white/30 tracking-widest uppercase">
              The M Division Showcase
            </div>
          </div>
          <div className="font-mono text-[10px] text-white/20 tracking-widest">
            <p>Fan project — not affiliated with BMW AG</p>
            <p className="mt-1">All trademarks belong to their respective owners</p>
          </div>
        </div>
      </footer>

      {/* Launch control flash overlay */}
      <div
        ref={flashRef}
        className="launch-flash"
        style={{ background: 'var(--m-red)', display: 'none' }}
        aria-hidden="true"
      />
    </div>{/* end shakeRef */}
    </main>
  )
}

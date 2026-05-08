import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { BMWModel, Generation } from '@/data/models'
import { MStripe } from '@/components/ui/MStripe'

gsap.registerPlugin(ScrollTrigger)

interface DescriptionSectionProps {
  model: BMWModel
  generation: Generation
}

// Editorial copy templates per model
function getEditorialCopy(model: BMWModel, gen: Generation) {
  return {
    para1: `The ${model.fullName} ${gen.code} represents ${gen.years} of BMW M Division's relentless pursuit of the perfect performance automobile. With ${gen.hp} horsepower extracted from a ${gen.engine}, it defines what it means to blend everyday usability with raw motorsport capability.`,
    para2: `Beneath the skin lies engineering that traces a direct lineage from BMW's motorsport program. Every component selected with surgical precision — the suspension geometry, the differential tuning, the steering calibration — all working in concert to deliver a driving experience that remains unmatched in its segment.`,
    para3: `The ${gen.transmission} ensures that the driver is always in full command. From the first revolution to the ${gen.topSpeed} km/h top speed, the power delivery is linear, progressive, and utterly intoxicating. This is not merely transportation. This is a relationship between driver and machine.`,
    verdict: `"In ${gen.code} specification, the ${model.name} achieves what only the rarest of performance cars accomplish: it is equally sublime when pushed to its absolute limit on a closed circuit as it is on a Sunday morning drive through an empty mountain road. A masterwork."`,
    heritage: `The ${model.name} lineage began ${model.generations[0].years}, establishing the template that all subsequent generations would refine. Each evolution brought measurably greater performance while preserving the intangible qualities that have made the ${model.name} a benchmark for the entire automotive industry.`,
  }
}

export function DescriptionSection({ model, generation }: DescriptionSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const copy = getEditorialCopy(model, generation)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const lines = sectionRef.current!.querySelectorAll('.reveal-line')
      lines.forEach((line, i) => {
        gsap.fromTo(
          line,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 88%',
            },
            delay: i * 0.04,
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 px-8 md:px-16 lg:px-24 bg-black"
      aria-label={`${model.fullName} description`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Main editorial — 2 cols */}
          <div className="lg:col-span-2 space-y-8">
            <div className="mb-8">
              <div
                className="font-mono text-xs tracking-[0.4em] uppercase mb-3 reveal-line"
                style={{ color: model.accentColor }}
              >
                Editorial · {generation.code}
              </div>
              <h2
                className="font-display font-bold text-white reveal-line"
                style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
              >
                THE STORY
              </h2>
              <MStripe className="mt-4 max-w-xs" />
            </div>

            {[copy.para1, copy.para2, copy.para3].map((para, i) => (
              <p
                key={i}
                className="text-white/70 text-lg leading-relaxed reveal-line"
              >
                {para}
              </p>
            ))}

            {/* Driver's Verdict pullquote */}
            <div
              className="relative pl-6 py-4 reveal-line"
              style={{ borderLeft: `3px solid transparent`, borderImage: 'linear-gradient(180deg, #1C69D4, #6B2D8B, #C1001F) 1' }}
            >
              <p
                className="text-white text-2xl md:text-3xl italic leading-relaxed font-display"
                style={{ fontStyle: 'italic' }}
              >
                {copy.verdict}
              </p>
              <div className="font-mono text-xs tracking-widest text-white/30 mt-4 uppercase">
                — M Division Drivers' Verdict
              </div>
            </div>
          </div>

          {/* Heritage sidebar — 1 col */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-24 bg-[var(--m-gray-900)] p-6 border border-white/5"
            >
              <div
                className="font-mono text-[10px] tracking-[0.4em] uppercase mb-4 reveal-line"
                style={{ color: model.accentColor }}
              >
                Heritage
              </div>
              <div className="font-display font-bold text-2xl text-white mb-4 reveal-line">
                {model.name} LINEAGE
              </div>
              <MStripe className="mb-6" />
              <p className="text-white/60 text-sm leading-relaxed reveal-line">{copy.heritage}</p>

              <div className="mt-6 space-y-3">
                {model.generations.map(g => (
                  <div key={g.id} className="flex justify-between items-center text-sm reveal-line">
                    <span className="font-mono text-white/40">{g.code}</span>
                    <span className="font-mono text-white/60">{g.years}</span>
                    <span className="font-display font-bold" style={{ color: model.accentColor }}>{g.hp}hp</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

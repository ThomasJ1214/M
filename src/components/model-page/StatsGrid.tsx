import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'
import type { BMWModel, Generation } from '@/data/models'
import { CountUp } from '@/components/ui/CountUp'
import { MStripe } from '@/components/ui/MStripe'

gsap.registerPlugin(ScrollTrigger)

interface StatsGridProps {
  model: BMWModel
  generation: Generation
  previousGeneration?: Generation
}

export function StatsGrid({ model, generation, previousGeneration }: StatsGridProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const cards = sectionRef.current!.querySelectorAll('.stat-card')
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const hpDelta = previousGeneration ? generation.hp - previousGeneration.hp : null

  return (
    <section
      ref={sectionRef}
      className="py-24 px-8 md:px-16 lg:px-24 bg-[var(--m-gray-900)]"
      aria-label="Performance specifications"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="font-mono text-xs tracking-[0.4em] uppercase mb-3" style={{ color: model.accentColor }}>
            Performance Data · {generation.code}
          </div>
          <h2 className="font-display font-bold text-white" style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}>
            THE NUMBERS
          </h2>
          <MStripe className="mt-4 max-w-xs" />
        </div>

        {/* 6-stat grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {[
            {
              label: 'Horsepower',
              value: generation.hp,
              suffix: ' HP',
              decimals: 0,
              showGauge: true,
              maxVal: 800,
            },
            {
              label: '0–60 mph',
              value: generation.zeroToSixty,
              suffix: 'sec',
              decimals: 1,
              showGauge: false,
            },
            {
              label: 'Top Speed',
              value: generation.topSpeed,
              suffix: ' km/h',
              decimals: 0,
              showGauge: false,
            },
            {
              label: 'Torque',
              value: generation.torque,
              suffix: ' Nm',
              decimals: 0,
              showGauge: false,
            },
            {
              label: 'Weight',
              value: generation.weight,
              suffix: ' kg',
              decimals: 0,
              showGauge: false,
            },
            {
              label: 'Displacement',
              value: parseFloat(generation.engine.split('L')[0]) || 0,
              suffix: 'L',
              decimals: 1,
              showGauge: false,
            },
          ].map(({ label, value, suffix, decimals, showGauge, maxVal }) => (
            <div
              key={label}
              className="stat-card bg-[var(--m-gray-700)] p-6 border border-white/5 hover:border-[var(--m-blue)]/30 transition-colors"
            >
              {showGauge && maxVal && (
                <PowerGauge value={value} max={maxVal} color={model.accentColor} />
              )}
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">{label}</div>
              <div className="font-display font-bold text-4xl text-white">
                <CountUp value={value} suffix={suffix} decimals={decimals} />
              </div>
              {label === 'Horsepower' && hpDelta !== null && hpDelta !== 0 && (
                <div
                  className="mt-2 font-mono text-xs tracking-wider"
                  style={{ color: hpDelta > 0 ? '#22C55E' : '#EF4444' }}
                >
                  {hpDelta > 0 ? `+${hpDelta}` : hpDelta}hp vs previous gen
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Engine / Transmission detail */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border-l-2 pl-6" style={{ borderColor: model.accentColor }}>
            <div className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-2">Engine</div>
            <div className="font-display font-bold text-xl text-white">{generation.engine}</div>
          </div>
          <div className="border-l-2 pl-6" style={{ borderColor: model.accentColor }}>
            <div className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-2">Transmission</div>
            <div className="font-display font-bold text-xl text-white">{generation.transmission}</div>
          </div>
          {generation.nurburgringLapTime && (
            <div className="border-l-2 pl-6" style={{ borderColor: '#1C69D4' }}>
              <div className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-2">Nürburgring Lap</div>
              <div className="font-display font-bold text-xl text-white font-mono">{generation.nurburgringLapTime}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function PowerGauge({ value, max, color }: { value: number; max: number; color: string }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const fraction = Math.min(value / max, 1)
  // Show 3/4 of circle (270deg)
  const dashLength = fraction * circumference * 0.75

  return (
    <div className="flex justify-center mb-4">
      <svg width="100" height="70" viewBox="0 0 100 70" aria-hidden="true">
        {/* Track */}
        <circle
          cx="50" cy="60" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="6"
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          strokeDashoffset="0"
          transform="rotate(135 50 60)"
          strokeLinecap="round"
        />
        {/* Fill */}
        <circle
          cx="50" cy="60" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={`${dashLength} ${circumference}`}
          strokeDashoffset="0"
          transform="rotate(135 50 60)"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
    </div>
  )
}

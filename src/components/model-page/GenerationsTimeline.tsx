import { useRef, useState } from 'react'
import type { BMWModel, Generation } from '@/data/models'
import { MStripe } from '@/components/ui/MStripe'

interface GenerationsTimelineProps {
  model: BMWModel
  activeGenId: string
  onSelectGeneration: (gen: Generation) => void
}

export function GenerationsTimeline({ model, activeGenId, onSelectGeneration }: GenerationsTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  return (
    <section
      className="py-24 px-8 md:px-16 lg:px-24 bg-black"
      aria-label={`${model.fullName} generations timeline`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div
            className="font-mono text-xs tracking-[0.4em] uppercase mb-3"
            style={{ color: model.accentColor }}
          >
            Heritage · {model.generations.length} Generations
          </div>
          <h2
            className="font-display font-bold text-white"
            style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
          >
            TIMELINE
          </h2>
          <MStripe className="mt-4 max-w-xs" />
        </div>

        {/* Horizontal scroll track */}
        <div
          ref={trackRef}
          className="timeline-track pb-4"
          role="list"
          aria-label="Model generations"
        >
          {model.generations.map((gen, i) => (
            <div key={gen.id} className="flex items-start gap-0">
              <button
                className={`timeline-node text-left ${activeGenId === gen.id ? 'opacity-100' : 'opacity-50 hover:opacity-80'} transition-opacity`}
                onClick={() => onSelectGeneration(gen)}
                role="listitem"
                aria-label={`${gen.code} ${gen.years} - ${gen.hp}hp`}
                aria-current={activeGenId === gen.id ? 'true' : undefined}
              >
                {/* Gen thumbnail placeholder */}
                <div
                  className="w-[220px] h-[140px] bg-[var(--m-gray-700)] mb-4 relative overflow-hidden flex items-center justify-center"
                  style={{
                    border: activeGenId === gen.id
                      ? `2px solid ${model.accentColor}`
                      : '2px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <img
                    src={`${gen.imagePath}/thumb.webp`}
                    alt={`${gen.code} ${model.name}`}
                    className="w-full h-full object-cover opacity-60"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="font-display font-bold text-5xl"
                      style={{ color: activeGenId === gen.id ? model.accentColor : 'rgba(255,255,255,0.15)' }}
                    >
                      {model.name}
                    </span>
                  </div>
                  {activeGenId === gen.id && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[3px]"
                      style={{ background: model.accentColor }}
                    />
                  )}
                </div>

                <div className="font-display font-bold text-xl text-white mb-1">{gen.code}</div>
                <div className="font-mono text-[10px] tracking-widest text-white/40 mb-2">{gen.years}</div>
                <div
                  className="font-mono text-sm font-bold"
                  style={{ color: model.accentColor }}
                >
                  {gen.hp} HP
                </div>
                <div className="font-mono text-[10px] text-white/30 mt-1 leading-relaxed max-w-[200px]">
                  {gen.keyInnovation.split('.')[0]}.
                </div>
              </button>

              {/* Connector */}
              {i < model.generations.length - 1 && (
                <div className="timeline-connector self-center mt-[-30px] mx-0" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

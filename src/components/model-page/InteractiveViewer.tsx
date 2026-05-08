import { useState, useRef } from 'react'
import type { BMWModel, Generation } from '@/data/models'
import { ModelViewer } from '@/components/three/ModelViewer'
import { MStripe } from '@/components/ui/MStripe'

interface InteractiveViewerProps {
  model: BMWModel
  generation: Generation
}

export function InteractiveViewer({ model, generation }: InteractiveViewerProps) {
  const [selectedColor, setSelectedColor] = useState(model.colors[0])
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={sectionRef}
      className="relative bg-black"
      style={{ height: '80vh' }}
      aria-label={`Interactive 3D viewer — ${model.fullName} ${generation.code}`}
    >
      {/* Sticky 3D canvas */}
      <div className="sticky top-0 w-full h-screen bg-black overflow-hidden">
        <ModelViewer
          modelPath={generation.modelPath}
          paintColor={selectedColor.hex}
          modelType={model.bodyType}
          height="100%"
          interactive={true}
          className="w-full h-full"
        />

        {/* Overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top label */}
          <div className="absolute top-8 left-8 md:left-16">
            <div
              className="font-mono text-[10px] tracking-[0.4em] uppercase mb-1"
              style={{ color: model.accentColor }}
            >
              Interactive Viewer · {generation.code}
            </div>
            <div className="font-display font-bold text-3xl text-white">{model.name}</div>
          </div>

          {/* Color picker — right side */}
          <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto">
            <div className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-2 text-right">
              Paint
            </div>
            {model.colors.map(color => (
              <button
                key={color.hex}
                onClick={() => setSelectedColor(color)}
                className="relative w-8 h-8 rounded-full border-2 transition-all group"
                style={{
                  background: color.hex,
                  borderColor: selectedColor.hex === color.hex ? 'white' : 'transparent',
                  boxShadow: color.metallic ? 'inset 0 0 6px rgba(255,255,255,0.3)' : undefined,
                }}
                aria-label={`Select ${color.name} paint`}
                aria-pressed={selectedColor.hex === color.hex}
                title={color.name}
              >
                {selectedColor.hex === color.hex && (
                  <span className="absolute -right-[90px] top-1/2 -translate-y-1/2 font-mono text-[9px] tracking-widest text-white/60 whitespace-nowrap uppercase">
                    {color.name}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Bottom controls hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <div className="font-mono text-[10px] tracking-widest text-white/30 uppercase">
              Hover to rotate · Click to orbit · Controls appear below
            </div>
          </div>
        </div>

        {/* M stripe top accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, #1C69D4, #6B2D8B, #C1001F)' }} />
      </div>
    </section>
  )
}

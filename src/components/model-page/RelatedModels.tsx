import { useRef, Suspense, useState, useEffect, memo } from 'react'
import { Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import type { BMWModel } from '@/data/models'
import { FallbackGeometry } from '@/components/three/FallbackGeometry'
import { MStripe } from '@/components/ui/MStripe'

interface RelatedModelsProps {
  relatedModels: BMWModel[]
}

export function RelatedModels({ relatedModels }: RelatedModelsProps) {
  if (!relatedModels.length) return null

  return (
    <section
      className="py-24 px-8 md:px-16 lg:px-24 bg-[var(--m-gray-900)]"
      aria-label="Related BMW M models"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="font-mono text-xs tracking-[0.4em] uppercase mb-3 text-[var(--m-blue)]">
            Explore More
          </div>
          <h2 className="font-display font-bold text-white" style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}>
            RELATED MODELS
          </h2>
          <MStripe className="mt-4 max-w-xs" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {relatedModels.slice(0, 3).map(model => (
            <RelatedCard key={model.slug} model={model} />
          ))}
        </div>
      </div>
    </section>
  )
}

const RelatedCard = memo(function RelatedCard({ model }: { model: BMWModel }) {
  const featuredGen = model.generations[model.featuredGenIndex]
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { rootMargin: '300px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Link
      to={`/models/${model.slug}`}
      className="related-card block group hover:opacity-90 transition-opacity"
      aria-label={`View ${model.fullName}`}
    >
      {/* Mini 3D Canvas — lazy mounted */}
      <div
        className="h-[200px] bg-black relative overflow-hidden"
        ref={containerRef}
      >
        {isVisible && (
          <Canvas
            frameloop="always"
            camera={{ position: [0, 1, 4], fov: 50 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
            dpr={[1, 1.5]}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[3, 5, 3]} intensity={2} />
            <directionalLight position={[-2, -1, 2]} intensity={0.6} color="#4488ff" />
            <Environment preset="studio" />
            <Suspense fallback={null}>
              <FallbackGeometry
                accentColor={model.accentColor}
                scrollRotation={0}
                modelType={model.bodyType}
              />
            </Suspense>
          </Canvas>
        )}
        {!isVisible && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-[2px]" style={{ background: model.accentColor }} />
          </div>
        )}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] transition-opacity group-hover:opacity-80"
          style={{ background: model.accentColor }}
        />
      </div>

      {/* Info */}
      <div className="p-5 bg-white/[0.02] group-hover:bg-white/[0.04] transition-colors">
        <div className="font-display font-bold text-3xl text-white mb-1">{model.name}</div>
        <div className="font-mono text-[10px] tracking-widest text-white/40 mb-3 uppercase">
          {featuredGen.code} · {featuredGen.years}
        </div>
        <div className="flex justify-between items-center">
          <span
            className="font-display font-bold text-xl"
            style={{ color: model.accentColor }}
          >
            {featuredGen.hp} HP
          </span>
          <span className="font-mono text-xs text-white/30 tracking-wider">
            {featuredGen.zeroToSixty}s 0–60
          </span>
        </div>
      </div>
    </Link>
  )
})

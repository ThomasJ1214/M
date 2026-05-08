import { useState, useRef, useEffect } from 'react'
import type { BMWModel } from '@/data/models'
import { Lightbox } from '@/components/ui/Lightbox'
import { MStripe } from '@/components/ui/MStripe'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface GalleryProps {
  model: BMWModel
}

// Generate placeholder gallery image paths
function getGalleryImages(slug: string): string[] {
  return [
    `/images/${slug}/gallery-1.jpg`,
    `/images/${slug}/gallery-2.jpg`,
    `/images/${slug}/gallery-3.jpg`,
    `/images/${slug}/gallery-4.jpg`,
    `/images/${slug}/gallery-5.jpg`,
    `/images/${slug}/gallery-6.jpg`,
  ]
}

export function Gallery({ model }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const images = getGalleryImages(model.slug)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const items = sectionRef.current!.querySelectorAll('.masonry-item')
      gsap.fromTo(
        items,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 px-8 md:px-16 lg:px-24 bg-[var(--m-gray-900)]"
      aria-label={`${model.fullName} photo gallery`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="font-mono text-xs tracking-[0.4em] uppercase mb-3" style={{ color: model.accentColor }}>
            Photography
          </div>
          <h2 className="font-display font-bold text-white" style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}>
            GALLERY
          </h2>
          <MStripe className="mt-4 max-w-xs" />
        </div>

        <div className="masonry-grid">
          {images.map((src, i) => (
            <GalleryItem
              key={i}
              src={src}
              index={i}
              modelName={model.fullName}
              onClick={() => setLightboxIndex(i)}
            />
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  )
}

function GalleryItem({
  src,
  index,
  modelName,
  onClick,
}: {
  src: string
  index: number
  modelName: string
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  // IntersectionObserver for lazy loading
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoaded(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  if (error) return null

  return (
    <div
      ref={ref}
      className="masonry-item"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View ${modelName} photo ${index + 1}`}
    >
      {loaded ? (
        <img
          src={src}
          alt={`${modelName} gallery image ${index + 1}`}
          loading="lazy"
          className="w-full block"
          onError={() => setError(true)}
        />
      ) : (
        // Placeholder skeleton
        <div
          className="w-full bg-[var(--m-gray-700)] animate-pulse"
          style={{ height: index % 3 === 0 ? '300px' : index % 3 === 1 ? '200px' : '250px' }}
        />
      )}
    </div>
  )
}

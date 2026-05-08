import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { getModelBySlug, getRelatedModels, type Generation } from '@/data/models'
import { HeroSection } from '@/components/model-page/HeroSection'
import { InteractiveViewer } from '@/components/model-page/InteractiveViewer'
import { StatsGrid } from '@/components/model-page/StatsGrid'
import { DescriptionSection } from '@/components/model-page/DescriptionSection'
import { Gallery } from '@/components/model-page/Gallery'
import { GenerationsTimeline } from '@/components/model-page/GenerationsTimeline'
import { RelatedModels } from '@/components/model-page/RelatedModels'
import { MStripe } from '@/components/ui/MStripe'

export function ModelPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const model = slug ? getModelBySlug(slug) : undefined

  const [activeGen, setActiveGen] = useState<Generation>(
    model?.generations[model.featuredGenIndex] ?? model?.generations[0]!
  )

  useEffect(() => {
    if (!model) {
      navigate('/404', { replace: true })
      return
    }
    setActiveGen(model.generations[model.featuredGenIndex])
    window.scrollTo(0, 0)
  }, [model, navigate])

  if (!model) return null

  const relatedModels = getRelatedModels(model)
  const prevGen = model.generations[model.generations.indexOf(activeGen) - 1]

  return (
    <>
      <Helmet>
        <title>{model.fullName} — BMW M Division Showcase</title>
        <meta name="description" content={model.description.slice(0, 160)} />
        <meta property="og:title" content={`${model.fullName} — BMW M Showcase`} />
        <meta property="og:description" content={model.description.slice(0, 200)} />
        <meta property="og:image" content={`/images/${model.slug}/hero.jpg`} />
        <meta property="og:type" content="article" />
      </Helmet>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        id="main-content"
        role="main"
      >
        {/* Skip link */}
        <a
          href="#stats"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:bg-[var(--m-blue)] focus:text-white focus:px-4 focus:py-2"
        >
          Skip to performance data
        </a>

        {/* 1. Hero */}
        <HeroSection model={model} />

        {/* M Stripe divider */}
        <MStripe />

        {/* 2. Interactive 3D viewer with paint picker */}
        <InteractiveViewer model={model} generation={activeGen} />

        <MStripe />

        {/* 3. Stats Dashboard */}
        <div id="stats">
          <StatsGrid model={model} generation={activeGen} previousGeneration={prevGen} />
        </div>

        <MStripe />

        {/* 4. Editorial description */}
        <DescriptionSection model={model} generation={activeGen} />

        <MStripe />

        {/* 5. Gallery */}
        <Gallery model={model} />

        <MStripe />

        {/* 6. Generations timeline */}
        {model.generations.length > 1 && (
          <>
            <GenerationsTimeline
              model={model}
              activeGenId={activeGen.id}
              onSelectGeneration={setActiveGen}
            />
            <MStripe />
          </>
        )}

        {/* 7. Related models */}
        {relatedModels.length > 0 && <RelatedModels relatedModels={relatedModels} />}

        <MStripe />

        {/* Footer CTA */}
        <section className="py-20 px-8 md:px-16 bg-black text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.bmw.com/en/all-models/bmw-m/overview.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 font-display font-bold text-sm tracking-[0.2em] uppercase border px-10 py-4 transition-colors hover:bg-white/10"
              style={{ borderColor: model.accentColor, color: model.accentColor }}
              aria-label="Configure your BMW M on the official BMW website (opens in new tab)"
            >
              Configure Your {model.name} →
            </a>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-3 font-display font-bold text-sm tracking-[0.2em] uppercase border border-white/20 text-white px-10 py-4 hover:border-white/60 transition-colors"
            >
              ← All Models
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-8 md:px-16 bg-black border-t border-white/5">
          <div className="font-mono text-[10px] text-white/20 tracking-widest text-center">
            Fan project — not affiliated with BMW AG · All trademarks belong to their respective owners
          </div>
        </footer>
      </motion.main>
    </>
  )
}

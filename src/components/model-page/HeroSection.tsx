import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { BMWModel } from '@/data/models'
import { MStripe } from '@/components/ui/MStripe'

interface HeroSectionProps {
  model: BMWModel
}

export function HeroSection({ model }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0.6, 1], [1, 0])

  const featuredGen = model.generations[model.featuredGenIndex]

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black"
      aria-label={`${model.fullName} hero`}
    >
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0 bg-[var(--m-gray-900)]"
        style={{ y }}
      >
        <img
          src={`/images/${model.slug}/hero.webp`}
          alt={`${model.fullName} - ${featuredGen.years}`}
          className="w-full h-full object-cover opacity-40"
          loading="eager"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col justify-end h-full pb-16 px-8 md:px-16 lg:px-24"
        style={{ opacity }}
      >
        {/* M Performance tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-mono text-xs tracking-[0.4em] uppercase mb-4"
          style={{ color: model.accentColor }}
        >
          BMW · M DIVISION · {featuredGen.years}
        </motion.div>

        {/* Model name */}
        <motion.h1
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-display font-bold text-white leading-none mb-3"
          style={{
            fontSize: 'clamp(80px, 15vw, 200px)',
            textShadow: '3px 0 #C1001F, -3px 0 #1C69D4',
          }}
        >
          {model.name}
        </motion.h1>

        {/* Generation badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="font-mono text-sm tracking-[0.25em] uppercase mb-4 text-white/50"
        >
          {featuredGen.code} · {featuredGen.engine}
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="font-display font-bold text-2xl md:text-3xl tracking-[0.1em] uppercase text-white/70 mb-8 max-w-2xl"
        >
          {model.tagline}
        </motion.p>

        <MStripe className="max-w-xs" />

        {/* Key stat quick-hits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex gap-8 mt-6"
        >
          {[
            { label: 'HP', value: featuredGen.hp },
            { label: '0–60', value: `${featuredGen.zeroToSixty}s` },
            { label: 'TOP', value: `${featuredGen.topSpeed}km/h` },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="font-mono text-[10px] tracking-widest text-white/40 uppercase">{label}</div>
              <div className="font-display font-bold text-2xl text-white">{value}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 right-8 flex flex-col items-center gap-2 text-white/30"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </section>
  )
}

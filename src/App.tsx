import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { HelmetProvider } from 'react-helmet-async'
import { Navbar } from '@/components/nav/Navbar'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useAppStore } from '@/store'
import { useKonami } from '@/hooks/useKonami'
import { getLenis } from '@/hooks/useLenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Lazy-load pages for code splitting
const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })))
const ModelPage = lazy(() => import('@/pages/ModelPage').then(m => ({ default: m.ModelPage })))
const NotFound = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })))

function PageSuspense({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="m-spinner" aria-label="Loading..." />
        </div>
      }>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

function AppContent() {
  const location = useLocation()
  const { setCompetitionMode, theme } = useAppStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Kill all ScrollTriggers on route change, scroll to top via Lenis
  useEffect(() => {
    ScrollTrigger.getAll().forEach(st => st.kill())
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

  // Konami Code — Competition Mode 30s
  useKonami(() => {
    setCompetitionMode(true)
    setTimeout(() => setCompetitionMode(false), 30000)
  })

  return (
    <>
      <Navbar />

      {/* mode="sync" — both pages animate simultaneously, no black-screen gap */}
      <AnimatePresence mode="sync">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageSuspense>
                <Home />
              </PageSuspense>
            }
          />
          <Route
            path="/models/:slug"
            element={
              <PageSuspense>
                <ModelPage />
              </PageSuspense>
            }
          />
          <Route
            path="*"
            element={
              <PageSuspense>
                <NotFound />
              </PageSuspense>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export function App() {
  return (
    <HelmetProvider>
      <div className="grain-overlay" aria-hidden="true" />
      <AppContent />
    </HelmetProvider>
  )
}

import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { HelmetProvider } from 'react-helmet-async'
import { Navbar } from '@/components/nav/Navbar'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { useAppStore } from '@/store'
import { useKonami } from '@/hooks/useKonami'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Lazy-load pages for code splitting
const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })))
const ModelPage = lazy(() => import('@/pages/ModelPage').then(m => ({ default: m.ModelPage })))
const NotFound = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })))

function PageSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="m-spinner" aria-label="Loading..." />
      </div>
    }>
      {children}
    </Suspense>
  )
}

function AppContent() {
  const location = useLocation()
  const { setCompetitionMode, theme } = useAppStore()

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Kill all ScrollTriggers on route change (prevents memory leaks)
  useEffect(() => {
    ScrollTrigger.getAll().forEach(st => st.kill())
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Konami Code — Competition Mode
  useKonami(() => {
    setCompetitionMode(true)
    setTimeout(() => setCompetitionMode(false), 30000) // 30s competition mode
  })

  return (
    <>
      <Navbar />

      <AnimatePresence mode="wait">
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
      {/* Grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Custom cursor — hidden on touch devices via CSS */}
      <CustomCursor />

      <AppContent />
    </HelmetProvider>
  )
}

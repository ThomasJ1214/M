import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { useLenis } from '@/hooks/useLenis'
import '@/styles/global.css'

function Root() {
  const [loaded, setLoaded] = useState(false)

  // Initialize Lenis smooth scroll globally
  useLenis()

  return (
    <>
      <LoadingScreen onComplete={() => setLoaded(true)} />
      {loaded && (
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )}
    </>
  )
}

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <Root />
  </StrictMode>
)

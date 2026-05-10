import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null

export function getLenis() {
  return lenisInstance
}

export function useLenis() {
  // Store the exact function reference so cleanup can actually remove it
  const tickerFnRef = useRef<((time: number) => void) | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.12,
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 2.5,
      wheelMultiplier: 1.2,
    })

    lenisInstance = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const tickerFn = (time: number) => lenis.raf(time * 1000)
    tickerFnRef.current = tickerFn
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      lenisInstance = null
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current)
        tickerFnRef.current = null
      }
    }
  }, [])
}

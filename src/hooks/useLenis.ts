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
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.07,
      duration: 1.4,
      smoothWheel: true,
      touchMultiplier: 2,
    })

    lenisInstance = lenis

    // Wire Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      lenisInstance = null
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
      cancelAnimationFrame(rafRef.current)
    }
  }, [])
}

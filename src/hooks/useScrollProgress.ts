import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'

gsap.registerPlugin(ScrollTrigger)

export function useScrollProgress(
  containerRef: React.RefObject<HTMLElement>,
  options?: { start?: string; end?: string }
) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: options?.start ?? 'top top',
      end: options?.end ?? 'bottom bottom',
      onUpdate: (self) => setProgress(self.progress),
    })

    return () => st.kill()
  }, [containerRef, options?.start, options?.end])

  return progress
}

export function useScrollVelocity() {
  const [velocity, setVelocity] = useState(0)
  const lastScrollY = useRef(0)
  const lastTime = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const now = performance.now()
      const dy = window.scrollY - lastScrollY.current
      const dt = now - lastTime.current
      if (dt > 0) setVelocity(Math.abs(dy / dt))
      lastScrollY.current = window.scrollY
      lastTime.current = now
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return velocity
}

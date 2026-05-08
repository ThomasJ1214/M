import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CountUpProps {
  value: number
  duration?: number
  decimals?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function CountUp({
  value,
  duration = 1.2,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const triggeredRef = useRef(false)
  const animRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Reset on value change
    triggeredRef.current = false
    el.textContent = prefix + (0).toFixed(decimals) + suffix

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        if (triggeredRef.current) return
        triggeredRef.current = true
        const obj = { val: 0 }
        animRef.current = gsap.to(obj, {
          val: value,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = prefix + obj.val.toFixed(decimals) + suffix
          },
          onComplete: () => {
            el.textContent = prefix + value.toFixed(decimals) + suffix
          },
        })
      },
    })

    return () => {
      st.kill()
      animRef.current?.kill()
    }
  }, [value, duration, decimals, suffix, prefix])

  return (
    <span ref={ref} className={className}>
      {prefix}{(0).toFixed(decimals)}{suffix}
    </span>
  )
}

import { useEffect, useRef, useState } from 'react'
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
  triggerOnce?: boolean
}

export function CountUp({
  value,
  duration = 0.8,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
  triggerOnce = true,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: triggerOnce,
      onEnter: () => {
        if (triggered && triggerOnce) return
        setTriggered(true)
        const obj = { val: 0 }
        gsap.to(obj, {
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

    return () => st.kill()
  }, [value, duration, decimals, suffix, prefix, triggerOnce, triggered])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}

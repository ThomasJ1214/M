import { gsap } from 'gsap'

export function animateCountUp(
  element: HTMLElement,
  target: number,
  options?: {
    duration?: number
    decimals?: number
    suffix?: string
    prefix?: string
    ease?: string
  }
) {
  const {
    duration = 0.8,
    decimals = 0,
    suffix = '',
    prefix = '',
    ease = 'power2.out',
  } = options ?? {}

  const obj = { val: 0 }
  gsap.to(obj, {
    val: target,
    duration,
    ease,
    onUpdate: () => {
      element.textContent = prefix + obj.val.toFixed(decimals) + suffix
    },
    onComplete: () => {
      element.textContent = prefix + target.toFixed(decimals) + suffix
    },
  })
}

import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const smoothPos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(hover: none)').matches
    if (isTouchDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.dataset.hoverable
      ) {
        cursorRef.current?.classList.add('cursor--hover')
      }
    }

    const handleMouseLeave = () => {
      cursorRef.current?.classList.remove('cursor--hover')
    }

    const handleMouseDown = () => cursorRef.current?.classList.add('cursor--click')
    const handleMouseUp = () => cursorRef.current?.classList.remove('cursor--click')

    const animate = () => {
      smoothPos.current.x += (pos.current.x - smoothPos.current.x) * 0.12
      smoothPos.current.y += (pos.current.y - smoothPos.current.y) * 0.12

      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(calc(${smoothPos.current.x}px - 50%), calc(${smoothPos.current.y}px - 50%))`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseover', handleMouseEnter)
    document.addEventListener('mouseout', handleMouseLeave)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseEnter)
      document.removeEventListener('mouseout', handleMouseLeave)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div ref={cursorRef} className="cursor" role="presentation" aria-hidden="true" />
  )
}

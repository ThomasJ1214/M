import { useEffect, useRef } from 'react'

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

export function useKonami(onActivate: () => void) {
  const bufferRef = useRef<string[]>([])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      bufferRef.current.push(e.key)
      if (bufferRef.current.length > KONAMI.length) {
        bufferRef.current.shift()
      }
      if (bufferRef.current.join(',') === KONAMI.join(',')) {
        bufferRef.current = []
        onActivate()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onActivate])
}

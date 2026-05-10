import { useEffect, useRef } from 'react'

/**
 * Fires `onMatch` when the user types the exact sequence of characters.
 * Matches case-insensitively. Ignores modifier keys.
 */
export function useKeySequence(sequence: string, onMatch: () => void) {
  const bufferRef = useRef<string>('')
  const seq = sequence.toLowerCase()

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key.length !== 1) return

      bufferRef.current = (bufferRef.current + e.key.toLowerCase()).slice(-seq.length)
      if (bufferRef.current === seq) {
        bufferRef.current = ''
        onMatch()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [seq, onMatch])
}

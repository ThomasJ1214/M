import { useEffect, useRef, useCallback } from 'react'

export function useIdleDetection(timeout: number, onIdle: () => void, onActive: () => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const isIdleRef = useRef(false)

  const resetTimer = useCallback(() => {
    if (isIdleRef.current) {
      isIdleRef.current = false
      onActive()
    }
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      isIdleRef.current = true
      onIdle()
    }, timeout)
  }, [timeout, onIdle, onActive])

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click']
    events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }))
    resetTimer()
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer))
      clearTimeout(timerRef.current)
    }
  }, [resetTimer])
}

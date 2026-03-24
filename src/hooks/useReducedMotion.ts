/**
 * Detects whether the user has requested reduced motion via the
 * `prefers-reduced-motion` OS/browser setting.
 *
 * Returns `true` when reduced motion is preferred, `false` otherwise.
 * Reactively updates if the user changes the setting while the page is open.
 */
import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(QUERY).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mql = window.matchMedia(QUERY)

    function handleChange(e: MediaQueryListEvent) {
      setReducedMotion(e.matches)
    }

    mql.addEventListener('change', handleChange)
    return () => {
      mql.removeEventListener('change', handleChange)
    }
  }, [])

  return reducedMotion
}

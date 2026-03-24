import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export interface LoaderProps {
  onComplete: () => void
}

export function Loader({ onComplete }: LoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const completedRef = useRef(false)

  useEffect(() => {
    const overlay = overlayRef.current
    const bar = barRef.current
    const progress = progressRef.current
    if (!overlay || !bar || !progress) return

    // Entrance: fade in overlay
    gsap.set(overlay, { opacity: 1 })
    gsap.set(progress, { opacity: 0 })

    // Animate spinner indefinitely until load completes
    const spinnerTl = gsap.timeline({ repeat: -1 })
    spinnerTl.to(bar, { rotation: 360, duration: 1, ease: 'linear' })

    const complete = () => {
      if (completedRef.current) return
      completedRef.current = true

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      spinnerTl.kill()

      // Exit timeline: fill bar to 100%, then fade out overlay
      const exitTl = gsap.timeline({
        onComplete: onComplete,
      })
      exitTl
        .to(bar, { rotation: 0, duration: 0.2, ease: 'power2.out' })
        .to(progress, { opacity: 0, duration: 0.2 }, '<')
        .to(overlay, { opacity: 0, duration: 0.5, ease: 'power2.inOut' })
        .set(overlay, { display: 'none' })
    }

    // Show progress indicator if load takes longer than 3 seconds
    timeoutRef.current = setTimeout(() => {
      if (!completedRef.current) {
        gsap.to(progress, { opacity: 1, duration: 0.3 })
      }
    }, 3000)

    if (document.readyState === 'complete') {
      // Already loaded — short delay so the loader is visible briefly
      setTimeout(complete, 300)
    } else {
      window.addEventListener('load', complete, { once: true })
    }

    return () => {
      spinnerTl.kill()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      window.removeEventListener('load', complete)
    }
  }, [onComplete])

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-label="Loading"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
      }}
    >
      {/* Spinner */}
      <div
        ref={barRef}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: '4px solid rgba(255,255,255,0.15)',
          borderTopColor: '#ffffff',
        }}
      />

      {/* Progress label — visible only after 3 s */}
      <p
        ref={progressRef}
        style={{
          marginTop: 16,
          fontSize: 14,
          letterSpacing: '0.05em',
          opacity: 0,
        }}
      >
        Loading assets…
      </p>
    </div>
  )
}

export default Loader

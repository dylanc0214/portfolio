import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export const HERO_MAX_TILT = 15

/**
 * Pure function: computes clamped tilt values from normalised cursor offsets.
 * nx and ny are each in [-1, 1] (normalised relative to container centre).
 * Returns tiltX and tiltY in degrees, each clamped to [-maxTilt, maxTilt].
 */
export function computeHeroTilt(
  nx: number,
  ny: number,
  maxTilt = HERO_MAX_TILT,
): { tiltX: number; tiltY: number } {
  const clamp = (v: number) => Math.max(-maxTilt, Math.min(maxTilt, v))
  return {
    tiltX: clamp(-ny * maxTilt),
    tiltY: clamp(nx * maxTilt),
  }
}

/**
 * Applies a smooth GSAP parallax tilt effect to a target element
 * based on cursor position within a container element.
 *
 * @param containerRef - ref to the element that listens for mousemove
 * @param targetRef    - ref to the element that receives the tilt transform
 * @param maxTilt      - maximum tilt in degrees (default 15)
 * @returns current tiltX and tiltY values (clamped to [-maxTilt, maxTilt])
 */
export function useCursorTilt<
  C extends HTMLElement = HTMLElement,
  T extends HTMLElement = HTMLElement,
>(
  containerRef: React.RefObject<C | null>,
  targetRef: React.RefObject<T | null>,
  maxTilt = 15,
) {
  const [tilt, setTilt] = useState({ tiltX: 0, tiltY: 0 })
  const quickToX = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  const quickToY = useRef<ReturnType<typeof gsap.quickTo> | null>(null)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    quickToX.current = gsap.quickTo(target, 'rotateX', { duration: 0.4, ease: 'power2.out' })
    quickToY.current = gsap.quickTo(target, 'rotateY', { duration: 0.4, ease: 'power2.out' })

    return () => {
      gsap.killTweensOf(target)
    }
  }, [targetRef])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function handleMouseMove(e: MouseEvent) {
      const rect = container!.getBoundingClientRect()
      // Normalise cursor to [-1, 1] relative to container centre
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2

      const { tiltX, tiltY } = computeHeroTilt(nx, ny, maxTilt)

      quickToX.current?.(tiltX)
      quickToY.current?.(tiltY)
      setTilt({ tiltX, tiltY })
    }

    function handleMouseLeave() {
      quickToX.current?.(0)
      quickToY.current?.(0)
      setTilt({ tiltX: 0, tiltY: 0 })
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [containerRef, maxTilt])

  return tilt
}

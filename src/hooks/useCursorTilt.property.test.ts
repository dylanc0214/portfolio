// Feature: 3d-portfolio-website, Property 1: Hero tilt values are always clamped within [-maxTilt, maxTilt] for any cursor position

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { computeHeroTilt, HERO_MAX_TILT } from './useCursorTilt'

/**
 * Validates: Requirements 2.3
 *
 * Property 1: Hero tilt values are always clamped within [-maxTilt, maxTilt]
 *
 * For any (x, y) cursor coordinates, the computed tiltX and tiltY must
 * always fall within [-HERO_MAX_TILT, HERO_MAX_TILT] degrees.
 */
describe('Hero parallax tilt clamping (Property 1)', () => {
  it('tiltX and tiltY are always within [-maxTilt, maxTilt] for any cursor position', () => {
    // Cursor coordinates are always finite numbers in practice
    const finiteFloat = fc.float({ noNaN: true, noDefaultInfinity: true })
    fc.assert(
      fc.property(finiteFloat, finiteFloat, (nx, ny) => {
        const { tiltX, tiltY } = computeHeroTilt(nx, ny)
        expect(tiltX).toBeGreaterThanOrEqual(-HERO_MAX_TILT)
        expect(tiltX).toBeLessThanOrEqual(HERO_MAX_TILT)
        expect(tiltY).toBeGreaterThanOrEqual(-HERO_MAX_TILT)
        expect(tiltY).toBeLessThanOrEqual(HERO_MAX_TILT)
      }),
      { numRuns: 100 }
    )
  })

  it('tiltX and tiltY are always within [-maxTilt, maxTilt] for any custom maxTilt', () => {
    const finiteFloat = fc.float({ noNaN: true, noDefaultInfinity: true })
    fc.assert(
      fc.property(
        finiteFloat,
        finiteFloat,
        fc.float({ min: 1, max: 90, noNaN: true }),
        (nx, ny, maxTilt) => {
          const { tiltX, tiltY } = computeHeroTilt(nx, ny, maxTilt)
          expect(tiltX).toBeGreaterThanOrEqual(-maxTilt)
          expect(tiltX).toBeLessThanOrEqual(maxTilt)
          expect(tiltY).toBeGreaterThanOrEqual(-maxTilt)
          expect(tiltY).toBeLessThanOrEqual(maxTilt)
        }
      ),
      { numRuns: 100 }
    )
  })
})

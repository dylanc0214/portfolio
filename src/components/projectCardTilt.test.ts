// Feature: 3d-portfolio-website, Property 6: Project card tilt rotation values are always within [-15°, 15°] for any cursor offset
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { computeTilt, MAX_TILT } from './projectCardTilt'

describe('ProjectCard tilt clamping (Property 6)', () => {
  it('tiltX and tiltY are always within [-MAX_TILT, MAX_TILT] for any cursor offset', () => {
    fc.assert(
      fc.property(fc.float(), fc.float(), (nx, ny) => {
        const { tiltX, tiltY } = computeTilt(nx, ny)
        expect(tiltX).toBeGreaterThanOrEqual(-MAX_TILT)
        expect(tiltX).toBeLessThanOrEqual(MAX_TILT)
        expect(tiltY).toBeGreaterThanOrEqual(-MAX_TILT)
        expect(tiltY).toBeLessThanOrEqual(MAX_TILT)
      }),
      { numRuns: 100 }
    )
  })
})

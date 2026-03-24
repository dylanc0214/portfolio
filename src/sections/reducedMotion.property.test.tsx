// Feature: 3d-portfolio-website, Property 11: Reduced-motion disables all GSAP animations

import { render, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const { gsapSetMock, gsapToMock, gsapTimelineMock, capturedScrollTriggers } =
  vi.hoisted(() => {
    const gsapSetMock = vi.fn()
    const gsapToMock = vi.fn()
    const gsapTimelineMock = vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      play: vi.fn().mockReturnThis(),
      reverse: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    }))
    const capturedScrollTriggers: Array<{ kill?: () => void }> = []

    return { gsapSetMock, gsapToMock, gsapTimelineMock, capturedScrollTriggers }
  })

vi.mock('gsap', () => ({
  gsap: {
    set: gsapSetMock,
    to: gsapToMock,
    killTweensOf: vi.fn(),
    quickTo: vi.fn(() => vi.fn()),
    registerPlugin: vi.fn(),
    timeline: gsapTimelineMock,
  },
  default: {
    set: gsapSetMock,
    to: gsapToMock,
    killTweensOf: vi.fn(),
    quickTo: vi.fn(() => vi.fn()),
    registerPlugin: vi.fn(),
    timeline: gsapTimelineMock,
  },
  ScrollToPlugin: {},
  ScrollTrigger: {},
}))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(() => {
      const trigger = { kill: vi.fn() }
      capturedScrollTriggers.push(trigger)
      return trigger
    }),
    refresh: vi.fn(),
    getAll: vi.fn(() => []),
    killAll: vi.fn(),
  },
}))

vi.mock('gsap/ScrollToPlugin', () => ({ ScrollToPlugin: {} }))

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn((fn: () => void) => {
    try { fn() } catch { /* ignore errors from missing DOM refs */ }
  }),
}))

// ── Section imports (after mocks) ─────────────────────────────────────────────

import { HeroSection } from './HeroSection'
import { AboutSection } from './AboutSection'
import { SkillsSection } from './SkillsSection'
import { ProjectsSection } from './ProjectsSection'
import { ContactSection } from './ContactSection'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Configure window.matchMedia to report prefers-reduced-motion: reduce */
function mockReducedMotion(active: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: active && query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

/**
 * Returns true when a gsap.to call has a non-zero duration.
 * A call with no `duration` key, duration === 0, or duration === undefined
 * is considered "safe" (no motion).
 */
function hasNonZeroDuration(args: unknown[]): boolean {
  // gsap.to(targets, vars) — vars is the second argument
  const vars = args[1]
  if (vars === null || typeof vars !== 'object') return false
  const duration = (vars as Record<string, unknown>).duration
  if (duration === undefined || duration === null) return false
  return Number(duration) > 0
}

// ── Setup / teardown ──────────────────────────────────────────────────────────

beforeEach(() => {
  gsapSetMock.mockClear()
  gsapToMock.mockClear()
  gsapTimelineMock.mockClear()
  capturedScrollTriggers.length = 0
})

afterEach(() => {
  cleanup()
})

// ── Property test ─────────────────────────────────────────────────────────────

describe('Reduced-motion property tests', () => {
  /**
   * Validates: Requirements 9.4
   *
   * Property 11: Reduced-motion disables all GSAP animations
   *
   * When `prefers-reduced-motion` is active, every section component must
   * either skip gsap.to entirely or call it only with duration: 0.
   * No gsap.to call may carry a non-zero duration.
   */
  it('Property 11: no section calls gsap.to with a non-zero duration when prefers-reduced-motion is active', () => {
    fc.assert(
      fc.property(fc.constant(true), (_reducedMotion) => {
        // Activate reduced-motion before each render so the hook picks it up
        mockReducedMotion(true)

        const sections: Array<{ name: string; element: JSX.Element }> = [
          { name: 'HeroSection',     element: <HeroSection loaderDone={true} /> },
          { name: 'AboutSection',    element: <AboutSection /> },
          { name: 'SkillsSection',   element: <SkillsSection /> },
          { name: 'ProjectsSection', element: <ProjectsSection /> },
          { name: 'ContactSection',  element: <ContactSection /> },
        ]

        for (const { name, element } of sections) {
          gsapToMock.mockClear()

          const { unmount } = render(element)

          // Every gsap.to call must have duration 0 (or no duration at all)
          const violatingCalls = gsapToMock.mock.calls.filter(hasNonZeroDuration)

          expect(
            violatingCalls,
            `${name}: gsap.to was called with non-zero duration while prefers-reduced-motion is active. ` +
            `Violating calls: ${JSON.stringify(violatingCalls)}`,
          ).toHaveLength(0)

          unmount()
        }
      }),
      { numRuns: 100 },
    )
  })
})

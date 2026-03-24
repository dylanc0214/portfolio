// Feature: 3d-portfolio-website, Property 2: Active Navbar link matches scrolled section

import { render, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { Navbar, NavLink } from './Navbar'

// ── Hoisted mocks ─────────────────────────────────────────────────────────────
const { gsapToMock, gsapSetMock, makeTimeline, capturedScrollTriggers } = vi.hoisted(() => {
  const gsapToMock = vi.fn()
  const gsapSetMock = vi.fn()
  const capturedScrollTriggers: Array<{
    onEnter?: () => void
    onEnterBack?: () => void
  }> = []

  const makeTimeline = (_opts?: { paused?: boolean }) => ({
    to: vi.fn().mockReturnThis(),
    play: vi.fn().mockReturnThis(),
    reverse: vi.fn().mockReturnThis(),
    kill: vi.fn(),
  })

  return { gsapToMock, gsapSetMock, makeTimeline, capturedScrollTriggers }
})

vi.mock('gsap', () => ({
  gsap: {
    set: gsapSetMock,
    to: gsapToMock,
    timeline: vi.fn((opts?: { paused?: boolean }) => makeTimeline(opts)),
    registerPlugin: vi.fn(),
  },
  default: {
    set: gsapSetMock,
    to: gsapToMock,
    timeline: vi.fn((opts?: { paused?: boolean }) => makeTimeline(opts)),
    registerPlugin: vi.fn(),
  },
  ScrollToPlugin: {},
  ScrollTrigger: {},
}))

vi.mock('gsap/ScrollToPlugin', () => ({ ScrollToPlugin: {} }))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn((config: { onEnter?: () => void; onEnterBack?: () => void }) => {
      capturedScrollTriggers.push({ onEnter: config.onEnter, onEnterBack: config.onEnterBack })
      return { kill: vi.fn() }
    }),
  },
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Hero', targetId: 'hero' },
  { label: 'About', targetId: 'about' },
  { label: 'Skills', targetId: 'skills' },
  { label: 'Projects', targetId: 'projects' },
  { label: 'Contact', targetId: 'contact' },
]

function createSections(links: NavLink[]) {
  links.forEach(({ targetId }) => {
    const el = document.createElement('section')
    el.id = targetId
    document.body.appendChild(el)
  })
}

function removeSections(links: NavLink[]) {
  links.forEach(({ targetId }) => {
    document.getElementById(targetId)?.remove()
  })
}

// ── Setup / teardown ──────────────────────────────────────────────────────────

beforeEach(() => {
  gsapToMock.mockClear()
  gsapSetMock.mockClear()
  capturedScrollTriggers.length = 0
  createSections(DEFAULT_LINKS)
})

afterEach(() => {
  removeSections(DEFAULT_LINKS)
  vi.restoreAllMocks()
})

// ── Property test ─────────────────────────────────────────────────────────────

describe('Navbar property tests', () => {
  /**
   * Validates: Requirements 3.4
   *
   * Property 2: Active Navbar link matches scrolled section
   *
   * For any section index in [0, 4], when the ScrollTrigger onEnter callback
   * fires for that section, exactly one desktop nav link must have the
   * "active" class and it must be the link at that index.
   */
  it('Property 2: exactly one link is active and it matches the scrolled section', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 4 }), (sectionIndex) => {
        // Reset captured triggers for each iteration
        capturedScrollTriggers.length = 0

        const { container, unmount } = render(<Navbar links={DEFAULT_LINKS} />)

        // Simulate the ScrollTrigger onEnter for the generated section index
        act(() => {
          capturedScrollTriggers[sectionIndex]?.onEnter?.()
        })

        // Query all desktop nav links (first <ul> in the nav)
        const desktopList = container.querySelector('.navbar__links')
        const allLinks = desktopList
          ? Array.from(desktopList.querySelectorAll('a.nav-link'))
          : []

        // Exactly one link must be active
        const activeLinks = allLinks.filter((el) => el.classList.contains('active'))
        expect(activeLinks).toHaveLength(1)

        // The active link must be the one at sectionIndex
        expect(allLinks[sectionIndex]).toHaveClass('active')

        // All other links must not be active
        allLinks.forEach((el, i) => {
          if (i !== sectionIndex) {
            expect(el).not.toHaveClass('active')
          }
        })

        unmount()
      }),
      { numRuns: 100 }
    )
  })
})

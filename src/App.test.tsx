import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import App from './App'

// ── Hoisted mocks ─────────────────────────────────────────────────────────────
const { gsapToMock, gsapSetMock, makeTimeline, getCapturedOnComplete } = vi.hoisted(() => {
  let capturedExitOnComplete: (() => void) | null = null

  const gsapToMock = vi.fn()
  const gsapSetMock = vi.fn()

  const makeTimeline = (opts?: { onComplete?: () => void; repeat?: number; paused?: boolean }) => {
    if (opts?.onComplete) {
      capturedExitOnComplete = opts.onComplete
    }
    return {
      to: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      play: vi.fn().mockReturnThis(),
      reverse: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    }
  }

  const getCapturedOnComplete = () => capturedExitOnComplete

  return { gsapToMock, gsapSetMock, makeTimeline, getCapturedOnComplete }
})

vi.mock('gsap', () => ({
  gsap: {
    set: gsapSetMock,
    to: gsapToMock,
    timeline: vi.fn((opts?: { onComplete?: () => void; repeat?: number; paused?: boolean }) =>
      makeTimeline(opts)
    ),
    registerPlugin: vi.fn(),
    killTweensOf: vi.fn(),
    quickTo: vi.fn(() => vi.fn()),
  },
  default: {
    set: gsapSetMock,
    to: gsapToMock,
    timeline: vi.fn((opts?: { onComplete?: () => void; repeat?: number; paused?: boolean }) =>
      makeTimeline(opts)
    ),
    registerPlugin: vi.fn(),
    killTweensOf: vi.fn(),
    quickTo: vi.fn(() => vi.fn()),
  },
  ScrollTrigger: {
    create: vi.fn(() => ({ kill: vi.fn() })),
    getAll: vi.fn(() => []),
    kill: vi.fn(),
  },
  ScrollToPlugin: {},
}))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(() => ({ kill: vi.fn() })),
    getAll: vi.fn(() => []),
    kill: vi.fn(),
  },
}))

vi.mock('gsap/ScrollToPlugin', () => ({
  ScrollToPlugin: {},
}))

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn((fn: () => void) => { fn() }),
}))

// ── Setup / teardown ──────────────────────────────────────────────────────────

beforeEach(() => {
  gsapToMock.mockClear()
  gsapSetMock.mockClear()
  vi.useFakeTimers()
  Object.defineProperty(document, 'readyState', {
    configurable: true,
    get: () => 'loading',
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('App integration', () => {
  // Requirements: 1.1 — all sections mount without errors
  it('renders all sections without errors', () => {
    render(<App />)

    expect(document.getElementById('hero')).toBeInTheDocument()
    expect(document.getElementById('about')).toBeInTheDocument()
    expect(document.getElementById('skills')).toBeInTheDocument()
    expect(document.getElementById('projects')).toBeInTheDocument()
    expect(document.getElementById('contact')).toBeInTheDocument()
  })

  // Requirements: 1.1 — sections have correct aria-labels
  it('renders sections with correct aria-labels', () => {
    render(<App />)

    expect(screen.getByRole('region', { name: /hero/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /skills/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /projects/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /contact/i })).toBeInTheDocument()
  })

  // Requirements: 1.2 — Loader is present on initial render
  it('renders the Loader overlay on initial mount', () => {
    render(<App />)

    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
  })

  // Requirements: 1.2 — Loader calls onComplete which sets loaderDone=true
  it('triggers Hero content visibility after Loader onComplete fires', () => {
    render(<App />)

    // Simulate window load event so Loader begins its exit timeline
    act(() => {
      window.dispatchEvent(new Event('load'))
    })

    // Hero section should be in the DOM
    expect(document.getElementById('hero')).toBeInTheDocument()

    // Fire the GSAP exit timeline's onComplete — this calls handleLoaderComplete
    act(() => {
      getCapturedOnComplete()?.()
    })

    // After loaderDone=true, HeroSection receives loaderDone prop and triggers animation
    expect(document.getElementById('hero')).toBeInTheDocument()
    // gsap.to should have been called (staggered text reveal triggered by loaderDone)
    expect(gsapToMock).toHaveBeenCalled()
  })

  // Requirements: 3.2 — Navbar renders with all 5 navigation links
  it('renders Navbar with all 5 section links', () => {
    render(<App />)

    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    expect(nav).toBeInTheDocument()

    // All five links should be present (desktop list)
    expect(screen.getAllByRole('link', { name: /hero/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: /about/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: /skills/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: /projects/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: /contact/i }).length).toBeGreaterThanOrEqual(1)
  })
})

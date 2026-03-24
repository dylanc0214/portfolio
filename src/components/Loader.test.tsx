import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Loader } from './Loader'

// ── Hoisted mocks (must be declared before vi.mock factory runs) ──────────────
const { gsapToMock, gsapSetMock, makeTimeline, getCapturedOnComplete } = vi.hoisted(() => {
  let capturedExitOnComplete: (() => void) | null = null

  const gsapToMock = vi.fn()
  const gsapSetMock = vi.fn()

  const makeTimeline = (opts?: { onComplete?: () => void; repeat?: number }) => {
    if (opts?.onComplete) {
      capturedExitOnComplete = opts.onComplete
    }
    return {
      to: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    }
  }

  const getCapturedOnComplete = () => capturedExitOnComplete
  const resetCaptured = () => { capturedExitOnComplete = null }

  return { gsapToMock, gsapSetMock, makeTimeline, getCapturedOnComplete, resetCaptured }
})

vi.mock('gsap', () => ({
  gsap: {
    set: gsapSetMock,
    to: gsapToMock,
    timeline: vi.fn((opts?: { onComplete?: () => void; repeat?: number }) =>
      makeTimeline(opts)
    ),
  },
  default: {
    set: gsapSetMock,
    to: gsapToMock,
    timeline: vi.fn((opts?: { onComplete?: () => void; repeat?: number }) =>
      makeTimeline(opts)
    ),
  },
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

describe('Loader', () => {
  // Requirements: 1.2
  it('calls onComplete after the GSAP exit timeline finishes', () => {
    const onComplete = vi.fn()
    render(<Loader onComplete={onComplete} />)

    // Simulate the window load event firing
    act(() => {
      window.dispatchEvent(new Event('load'))
    })

    // onComplete should NOT have been called yet — the exit timeline is still
    // playing. It fires only when the timeline's own onComplete callback runs.
    expect(onComplete).not.toHaveBeenCalled()

    // Simulate GSAP finishing the exit timeline
    act(() => {
      getCapturedOnComplete()?.()
    })

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  // Requirements: 1.2 — guard against double-firing
  it('calls onComplete exactly once even if load event fires multiple times', () => {
    const onComplete = vi.fn()
    render(<Loader onComplete={onComplete} />)

    act(() => {
      window.dispatchEvent(new Event('load'))
      window.dispatchEvent(new Event('load'))
    })

    act(() => {
      getCapturedOnComplete()?.()
    })

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  // Requirements: 1.3 — progress indicator boundary case at exactly 3 s
  it('shows the progress indicator after a 3 s delay when load has not completed', () => {
    render(<Loader onComplete={vi.fn()} />)

    // Before 3 s, gsap.to should NOT have been called with opacity: 1
    act(() => {
      vi.advanceTimersByTime(2999)
    })

    const progressFadeInBefore = gsapToMock.mock.calls.some(
      (args) => args[1] && args[1].opacity === 1
    )
    expect(progressFadeInBefore).toBe(false)

    // Advance to exactly 3 000 ms — the setTimeout fires
    act(() => {
      vi.advanceTimersByTime(1)
    })

    const progressFadeInAfter = gsapToMock.mock.calls.some(
      (args) => args[1] && args[1].opacity === 1
    )
    expect(progressFadeInAfter).toBe(true)
  })

  // Requirements: 1.3 — progress indicator does NOT appear if load completes before 3 s
  it('does not show the progress indicator when load completes before 3 s', () => {
    render(<Loader onComplete={vi.fn()} />)

    // Load completes at 1 s — before the 3 s threshold
    act(() => {
      vi.advanceTimersByTime(1000)
      window.dispatchEvent(new Event('load'))
    })

    // Advance past 3 s — the timeout should have been cleared
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    const progressFadeIn = gsapToMock.mock.calls.some(
      (args) => args[1] && args[1].opacity === 1
    )
    expect(progressFadeIn).toBe(false)
  })

  // Requirements: 1.2 — loader overlay is present in the DOM on mount
  it('renders the loading overlay with the correct accessible role', () => {
    render(<Loader onComplete={vi.fn()} />)
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
  })
})

import { render, screen, act, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Navbar', () => {
  // Requirements: 3.2 — all five section links render
  it('renders all five section links', () => {
    render(<Navbar links={DEFAULT_LINKS} />)

    DEFAULT_LINKS.forEach(({ label }) => {
      const links = screen.getAllByRole('link', { name: label })
      expect(links.length).toBeGreaterThanOrEqual(1)
    })
  })

  // Requirements: 3.2 — link hrefs point to correct section ids
  it('renders links with correct href attributes', () => {
    render(<Navbar links={DEFAULT_LINKS} />)

    DEFAULT_LINKS.forEach(({ label, targetId }) => {
      const links = screen.getAllByRole('link', { name: label })
      links.forEach((link) => {
        expect(link).toHaveAttribute('href', `#${targetId}`)
      })
    })
  })

  // Requirements: 3.4 — active class applied to correct link on scroll
  it('applies active class to the link whose section enters the viewport', () => {
    render(<Navbar links={DEFAULT_LINKS} />)

    act(() => {
      capturedScrollTriggers[1]?.onEnter?.()
    })

    const aboutLinks = screen.getAllByRole('link', { name: 'About' })
    expect(aboutLinks[0]).toHaveClass('active')
  })

  // Requirements: 3.4 — only one link is active at a time
  it('removes active class from previously active link when a new section enters', () => {
    render(<Navbar links={DEFAULT_LINKS} />)

    act(() => {
      capturedScrollTriggers[0]?.onEnter?.()
    })

    act(() => {
      capturedScrollTriggers[2]?.onEnter?.()
    })

    const heroLinks = screen.getAllByRole('link', { name: 'Hero' })
    const skillsLinks = screen.getAllByRole('link', { name: 'Skills' })

    expect(heroLinks[0]).not.toHaveClass('active')
    expect(skillsLinks[0]).toHaveClass('active')
  })

  // Requirements: 3.4 — onEnterBack also sets active class
  it('applies active class when scrolling back into a section (onEnterBack)', () => {
    render(<Navbar links={DEFAULT_LINKS} />)

    act(() => {
      capturedScrollTriggers[3]?.onEnter?.()
    })

    act(() => {
      capturedScrollTriggers[1]?.onEnterBack?.()
    })

    const aboutLinks = screen.getAllByRole('link', { name: 'About' })
    const projectsLinks = screen.getAllByRole('link', { name: 'Projects' })

    expect(aboutLinks[0]).toHaveClass('active')
    expect(projectsLinks[0]).not.toHaveClass('active')
  })

  // Requirements: 3.5 — hamburger button is present in the DOM
  it('renders the hamburger toggle button', () => {
    render(<Navbar links={DEFAULT_LINKS} />)

    const hamburger = screen.getByRole('button', { name: /open navigation menu/i })
    expect(hamburger).toBeInTheDocument()
  })

  // Requirements: 3.5 — hamburger toggles aria-expanded and aria-label
  it('toggles aria-expanded on the hamburger button when clicked', () => {
    render(<Navbar links={DEFAULT_LINKS} />)

    const hamburger = screen.getByRole('button', { name: /open navigation menu/i })
    expect(hamburger).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(hamburger)
    expect(hamburger).toHaveAttribute('aria-expanded', 'true')
    expect(hamburger).toHaveAccessibleName(/close navigation menu/i)

    fireEvent.click(hamburger)
    expect(hamburger).toHaveAttribute('aria-expanded', 'false')
    expect(hamburger).toHaveAccessibleName(/open navigation menu/i)
  })

  // Requirements: 3.5 — mobile drawer is present in the DOM
  it('renders the mobile drawer with all section links', () => {
    render(<Navbar links={DEFAULT_LINKS} />)

    const drawer = document.getElementById('mobile-drawer')
    expect(drawer).toBeInTheDocument()

    // Drawer is aria-hidden when closed, so query its links directly via DOM
    const drawerLinks = drawer!.querySelectorAll('a')
    expect(drawerLinks.length).toBe(DEFAULT_LINKS.length)

    DEFAULT_LINKS.forEach(({ label }, i) => {
      expect(drawerLinks[i]).toHaveTextContent(label)
    })
  })

  // Requirements: 3.5 — drawer links are not keyboard-reachable when closed
  it('sets tabIndex=-1 on drawer links when the menu is closed', () => {
    render(<Navbar links={DEFAULT_LINKS} />)

    const drawer = document.getElementById('mobile-drawer')!
    const drawerLinks = drawer.querySelectorAll('a')

    drawerLinks.forEach((link) => {
      expect(link).toHaveAttribute('tabindex', '-1')
    })
  })

  // Requirements: 3.5 — drawer links become keyboard-reachable when open
  it('sets tabIndex=0 on drawer links when the menu is open', () => {
    render(<Navbar links={DEFAULT_LINKS} />)

    const hamburger = screen.getByRole('button', { name: /open navigation menu/i })
    fireEvent.click(hamburger)

    const drawer = document.getElementById('mobile-drawer')!
    const drawerLinks = drawer.querySelectorAll('a')

    drawerLinks.forEach((link) => {
      expect(link).toHaveAttribute('tabindex', '0')
    })
  })

  // Requirements: 3.3 — smooth-scroll is triggered on link click
  it('calls gsap.to for smooth-scroll when a nav link is clicked', () => {
    render(<Navbar links={DEFAULT_LINKS} />)

    const heroLinks = screen.getAllByRole('link', { name: 'Hero' })
    fireEvent.click(heroLinks[0])

    expect(gsapToMock).toHaveBeenCalledWith(
      window,
      expect.objectContaining({ scrollTo: expect.objectContaining({ y: '#hero' }) })
    )
  })
})

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { AboutSection } from './AboutSection'

// Stub GSAP to avoid animation side-effects in tests
vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    to: vi.fn(),
  },
  default: {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    to: vi.fn(),
  },
}))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(() => ({ kill: vi.fn() })),
  },
}))

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('AboutSection', () => {
  it('renders the student name', () => {
    render(<AboutSection />)
    expect(screen.getByText('Jordan Smith')).toBeInTheDocument()
  })

  it('renders the diploma program', () => {
    render(<AboutSection />)
    expect(screen.getByText('Software Engineering Technology Diploma')).toBeInTheDocument()
  })

  it('renders the institution', () => {
    render(<AboutSection />)
    expect(screen.getByText('Centennial College')).toBeInTheDocument()
  })

  it('renders the expected graduation year', () => {
    render(<AboutSection />)
    expect(screen.getByText('April 2026')).toBeInTheDocument()
  })

  it('CV link has correct href pointing to the PDF', () => {
    render(<AboutSection />)
    const link = screen.getByRole('link', { name: /download cv/i })
    expect(link).toHaveAttribute('href', '/cv.pdf')
  })

  it('CV link has the download attribute', () => {
    render(<AboutSection />)
    const link = screen.getByRole('link', { name: /download cv/i })
    expect(link).toHaveAttribute('download')
  })
})

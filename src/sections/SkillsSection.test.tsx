import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import * as fc from 'fast-check'
import { SkillBadge } from '../components/SkillBadge'

// Stub GSAP to avoid animation side-effects in tests
vi.mock('gsap', () => ({
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

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn((fn: () => void) => fn()),
}))

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

// Feature: 3d-portfolio-website, Property 3: Skills badge count equals skill data count
describe('SkillsSection – Property 3: badge count equals skill data count', () => {
  it('renders exactly as many skill-badge elements as total skills in the dataset', async () => {
    // **Validates: Requirements 5.1**
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1 }),
            category: fc.constantFrom('Languages' as const, 'Frameworks' as const, 'Tools' as const),
            proficiency: fc.float({ min: 0, max: 1, noNaN: true }),
          }),
          { minLength: 0, maxLength: 30 }
        ),
        async (skills) => {
          // Build the skillsData shape expected by SkillsSection
          const mockSkillsData = {
            languages: skills.filter(s => s.category === 'Languages'),
            frameworks: skills.filter(s => s.category === 'Frameworks'),
            tools: skills.filter(s => s.category === 'Tools'),
          }

          vi.doMock('../data', () => ({
            skillsData: mockSkillsData,
          }))

          // Dynamically import so the mock is applied fresh each iteration
          const { SkillsSection } = await import('./SkillsSection')

          const { unmount } = render(<SkillsSection />)
          // Use queryAllByTestId to safely handle empty arrays (returns [] instead of throwing)
          const badgeCount = screen.queryAllByTestId('skill-badge').length

          unmount()
          vi.resetModules()

          return badgeCount === skills.length
        }
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: 3d-portfolio-website, Property 4: Skills badges are grouped by category
describe('SkillsSection – Property 4: badges are grouped by category', () => {
  it('every badge rendered within a category group has a category value matching that group label', async () => {
    // **Validates: Requirements 5.4**
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1 }),
            category: fc.constantFrom('Languages' as const, 'Frameworks' as const, 'Tools' as const),
            proficiency: fc.float({ min: 0, max: 1, noNaN: true }),
          }),
          { minLength: 0, maxLength: 30 }
        ),
        async (skills) => {
          const mockSkillsData = {
            languages: skills.filter(s => s.category === 'Languages'),
            frameworks: skills.filter(s => s.category === 'Frameworks'),
            tools: skills.filter(s => s.category === 'Tools'),
          }

          vi.doMock('../data', () => ({
            skillsData: mockSkillsData,
          }))

          const { SkillsSection } = await import('./SkillsSection')

          const { unmount } = render(<SkillsSection />)

          const categories = ['Languages', 'Frameworks', 'Tools'] as const
          let allGrouped = true

          for (const cat of categories) {
            const groupEl = screen.queryByTestId(`skills-group-${cat.toLowerCase()}`)
            if (!groupEl) {
              // Group element missing — fail only if there are skills for this category
              if (mockSkillsData[cat.toLowerCase() as 'languages' | 'frameworks' | 'tools'].length > 0) {
                allGrouped = false
                break
              }
              continue
            }
            const badgesInGroup = within(groupEl).queryAllByTestId('skill-badge')
            for (const badge of badgesInGroup) {
              if (badge.getAttribute('data-category') !== cat) {
                allGrouped = false
                break
              }
            }
            if (!allGrouped) break
          }

          unmount()
          vi.resetModules()

          return allGrouped
        }
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: 3d-portfolio-website, Property 5: Proficiency indicator is always within valid bounds
describe('SkillBadge – Property 5: proficiency indicator is always within valid bounds', () => {
  it('renders a proficiency label between 0% and 100% for any proficiency value in [0, 1]', () => {
    // **Validates: Requirements 5.5**
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1, noNaN: true }),
        (proficiency) => {
          const { unmount } = render(
            <SkillBadge name="Test Skill" category="Languages" proficiency={proficiency} />
          )

          // The label text is Math.round(clampedProficiency * 100) + '%'
          const labelText = screen.getByText(/^\d+%$/)
          const labelValue = parseInt(labelText.textContent!.replace('%', ''), 10)

          unmount()

          return labelValue >= 0 && labelValue <= 100
        }
      ),
      { numRuns: 100 }
    )
  })

  it('renders 0% label for proficiency = 0 (boundary)', () => {
    render(<SkillBadge name="Zero Skill" category="Frameworks" proficiency={0} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('renders 100% label for proficiency = 1 (boundary)', () => {
    render(<SkillBadge name="Full Skill" category="Tools" proficiency={1} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})

// Feature: 3d-portfolio-website, Property 7: Project card always renders required fields
// Feature: 3d-portfolio-website, Property 8: Demo link is shown if and only if demoUrl is present

import { render, within, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import * as fc from 'fast-check'
import { ProjectCard } from './ProjectCard'

// Stub GSAP to avoid animation side-effects in tests
vi.mock('gsap', () => ({
  default: {
    quickTo: vi.fn(() => vi.fn()),
    set: vi.fn(),
    to: vi.fn(),
    killTweensOf: vi.fn(),
  },
}))

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('ProjectCard property tests', () => {
  /**
   * Validates: Requirements 6.5
   *
   * Property 7: Project card always renders required fields
   *
   * For any project data object, the rendered Project_Card must contain
   * the project title, all technology tags, the description text, and
   * a link to the source code repository.
   */
  it('Property 7: rendered card always contains title, all tags, description, and repo link', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1 }),
          description: fc.string(),
          tags: fc.array(fc.string()),
          repoUrl: fc.webUrl(),
        }),
        ({ title, description, tags, repoUrl }) => {
          const container = document.createElement('div')
          document.body.appendChild(container)

          const { unmount } = render(
            <ProjectCard
              title={title}
              description={description}
              tags={tags}
              repoUrl={repoUrl}
            />,
            { container }
          )

          // Title must be present
          const titleEl = within(container).getByTestId('project-card-title')
          expect(titleEl).toHaveTextContent(title, { normalizeWhitespace: false })

          // All tags must be rendered
          const tagEls = within(container).queryAllByTestId('project-card-tag')
          expect(tagEls).toHaveLength(tags.length)
          tags.forEach((tag, i) => {
            expect(tagEls[i]).toHaveTextContent(tag, { normalizeWhitespace: false })
          })

          // Description must be present
          const descEl = within(container).getByTestId('project-card-description')
          expect(descEl).toHaveTextContent(description, { normalizeWhitespace: false })

          // Repo link must be present with correct href
          const repoLink = within(container).getByTestId('project-card-repo-link')
          expect(repoLink).toBeInTheDocument()
          expect(repoLink).toHaveAttribute('href', repoUrl)

          unmount()
          container.remove()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Validates: Requirements 6.6
   *
   * Property 8: Demo link is shown if and only if demoUrl is present
   *
   * For any project data object, a live demo link is rendered in the
   * Project_Card if and only if the project's `demoUrl` field is non-empty.
   */
  it('Property 8: demo link is rendered if and only if demoUrl is present', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1 }),
          description: fc.string(),
          tags: fc.array(fc.string()),
          repoUrl: fc.webUrl(),
          demoUrl: fc.option(fc.webUrl(), { nil: undefined }),
        }),
        ({ title, description, tags, repoUrl, demoUrl }) => {
          const container = document.createElement('div')
          document.body.appendChild(container)

          const { unmount } = render(
            <ProjectCard
              title={title}
              description={description}
              tags={tags}
              repoUrl={repoUrl}
              demoUrl={demoUrl}
            />,
            { container }
          )

          const demoLink = within(container).queryByTestId('project-card-demo-link')

          if (demoUrl !== undefined) {
            // demoUrl present → link must be rendered with correct href
            expect(demoLink).not.toBeNull()
            expect(demoLink).toHaveAttribute('href', demoUrl)
          } else {
            // demoUrl absent → link must not be rendered
            expect(demoLink).toBeNull()
          }

          unmount()
          container.remove()
        }
      ),
      { numRuns: 100 }
    )
  })
})

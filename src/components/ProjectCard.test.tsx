import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll } from 'vitest'
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

const baseProps = {
  title: 'My Project',
  description: 'A cool project description',
  tags: ['React', 'TypeScript', 'GSAP'],
  repoUrl: 'https://github.com/user/my-project',
}

describe('ProjectCard', () => {
  it('renders the project title', () => {
    render(<ProjectCard {...baseProps} />)
    expect(screen.getByTestId('project-card-title')).toHaveTextContent('My Project')
  })

  it('renders all technology tags', () => {
    render(<ProjectCard {...baseProps} />)
    const tags = screen.getAllByTestId('project-card-tag')
    expect(tags).toHaveLength(3)
    expect(tags[0]).toHaveTextContent('React')
    expect(tags[1]).toHaveTextContent('TypeScript')
    expect(tags[2]).toHaveTextContent('GSAP')
  })

  it('renders the project description', () => {
    render(<ProjectCard {...baseProps} />)
    expect(screen.getByTestId('project-card-description')).toHaveTextContent(
      'A cool project description'
    )
  })

  it('renders the repo link with correct href', () => {
    render(<ProjectCard {...baseProps} />)
    const repoLink = screen.getByTestId('project-card-repo-link')
    expect(repoLink).toBeInTheDocument()
    expect(repoLink).toHaveAttribute('href', 'https://github.com/user/my-project')
  })

  it('renders demo link when demoUrl is provided', () => {
    render(<ProjectCard {...baseProps} demoUrl="https://my-project.vercel.app" />)
    const demoLink = screen.getByTestId('project-card-demo-link')
    expect(demoLink).toBeInTheDocument()
    expect(demoLink).toHaveAttribute('href', 'https://my-project.vercel.app')
  })

  it('does not render demo link when demoUrl is undefined', () => {
    render(<ProjectCard {...baseProps} />)
    expect(screen.queryByTestId('project-card-demo-link')).not.toBeInTheDocument()
  })

  it('does not render demo link when demoUrl is explicitly undefined', () => {
    render(<ProjectCard {...baseProps} demoUrl={undefined} />)
    expect(screen.queryByTestId('project-card-demo-link')).not.toBeInTheDocument()
  })
})

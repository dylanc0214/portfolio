import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { computeTilt, MAX_TILT as _MAX_TILT } from './projectCardTilt'

export interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  repoUrl: string
  demoUrl?: string
  imageUrl?: string
}

export function ProjectCard({
  title,
  description,
  tags,
  repoUrl,
  demoUrl,
  imageUrl,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const quickToX = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  const quickToY = useRef<ReturnType<typeof gsap.quickTo> | null>(null)

  // Set up quickTo for smooth tilt and initialise overlay state
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    quickToX.current = gsap.quickTo(card, 'rotateX', { duration: 0.4, ease: 'power2.out' })
    quickToY.current = gsap.quickTo(card, 'rotateY', { duration: 0.4, ease: 'power2.out' })

    // Ensure overlay starts hidden via GSAP (overrides any CSS state)
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { opacity: 0, y: 20 })
    }

    return () => {
      gsap.killTweensOf(card)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2

    const { tiltX, tiltY } = computeTilt(nx, ny)

    quickToX.current?.(tiltX)
    quickToY.current?.(tiltY)
  }

  const handleMouseEnter = () => {
    const overlay = overlayRef.current
    if (!overlay) return

    gsap.to(overlay, {
      opacity: 1,
      y: 0,
      duration: 0.35,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    const overlay = overlayRef.current

    if (card) {
      quickToX.current?.(0)
      quickToY.current?.(0)
    }

    if (overlay) {
      gsap.to(overlay, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: 'power2.in',
      })
    }
  }

  return (
    <div
      ref={cardRef}
      className="project-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid="project-card"
    >
      {/* Card image / placeholder */}
      <div className="project-card__image">
        {imageUrl ? (
          <img src={imageUrl} alt={`${title} preview`} loading="lazy" />
        ) : (
          <div className="project-card__image-placeholder" aria-hidden="true" />
        )}
      </div>

      {/* Static header — always visible */}
      <div className="project-card__header">
        <h3 className="project-card__title" data-testid="project-card-title">
          {title}
        </h3>
        <ul className="project-card__tags" aria-label="Technology tags">
          {tags.map((tag) => (
            <li key={tag} className="project-card__tag" data-testid="project-card-tag">
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay — revealed on hover via GSAP */}
      <div
        ref={overlayRef}
        className="project-card__overlay"
        data-testid="project-card-overlay"
      >
        <p className="project-card__description" data-testid="project-card-description">
          {description}
        </p>
        <div className="project-card__links">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card__link project-card__link--repo"
            data-testid="project-card-repo-link"
          >
            Source Code
          </a>
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__link project-card__link--demo"
              data-testid="project-card-demo-link"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface SkillBadgeProps {
  name: string
  category: 'Languages' | 'Frameworks' | 'Tools'
  proficiency: number // 0–1
  iconUrl?: string
}

export function SkillBadge({ name, category, proficiency, iconUrl }: SkillBadgeProps) {
  const badgeRef = useRef<HTMLDivElement>(null)
  const barFillRef = useRef<HTMLDivElement>(null)

  // Clamp proficiency to [0, 1]
  const clampedProficiency = Math.min(1, Math.max(0, proficiency))
  const targetWidth = `${clampedProficiency * 100}%`

  // Proficiency bar animation via ScrollTrigger
  useEffect(() => {
    const fill = barFillRef.current
    const badge = badgeRef.current
    if (!fill || !badge) return

    // Start at 0 width
    gsap.set(fill, { width: '0%' })

    const trigger = ScrollTrigger.create({
      trigger: badge,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(fill, {
          width: targetWidth,
          duration: 1,
          ease: 'power2.out',
        })
      },
    })

    return () => {
      trigger.kill()
    }
  }, [targetWidth])

  // 3D flip/scale on hover
  const handleMouseEnter = () => {
    if (!badgeRef.current) return
    gsap.to(badgeRef.current, {
      rotateY: 15,
      rotateX: -8,
      scale: 1.08,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    if (!badgeRef.current) return
    gsap.to(badgeRef.current, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  const categoryClass = `skill-badge__category--${category.toLowerCase()}`

  return (
    <div
      ref={badgeRef}
      className="skill-badge"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-category={category}
      data-testid="skill-badge"
    >
      <div className="skill-badge__header">
        {iconUrl && (
          <img
            src={iconUrl}
            alt={`${name} icon`}
            className="skill-badge__icon"
            loading="lazy"
          />
        )}
        <span className="skill-badge__name">{name}</span>
      </div>

      <span className={`skill-badge__category ${categoryClass}`}>{category}</span>

      <div className="skill-badge__bar" aria-label={`${name} proficiency: ${Math.round(clampedProficiency * 100)}%`}>
        <div
          ref={barFillRef}
          className="skill-badge__bar-fill"
          style={{ width: '0%' }}
          data-testid="skill-badge-bar-fill"
        />
      </div>

      <span className="skill-badge__proficiency-label">
        {Math.round(clampedProficiency * 100)}%
      </span>
    </div>
  )
}

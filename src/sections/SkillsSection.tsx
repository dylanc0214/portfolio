import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SkillBadge } from '../components/SkillBadge'
import { skillsData } from '../data'
import { useReducedMotion } from '../hooks'
import type { SkillBadgeProps } from '../components/SkillBadge'

gsap.registerPlugin(ScrollTrigger)

interface CategoryGroupProps {
  title: string
  skills: SkillBadgeProps[]
  groupRef: React.RefObject<HTMLDivElement | null>
}

function CategoryGroup({ title, skills, groupRef }: CategoryGroupProps) {
  return (
    <div className="skills__group" ref={groupRef} data-testid={`skills-group-${title.toLowerCase()}`}>
      <h3 className="skills__group-title">{title}</h3>
      <div className="skills__badges">
        {skills.map(skill => (
          <SkillBadge key={skill.name} {...skill} />
        ))}
      </div>
    </div>
  )
}

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const langGroupRef = useRef<HTMLDivElement>(null)
  const fwGroupRef = useRef<HTMLDivElement>(null)
  const toolsGroupRef = useRef<HTMLDivElement>(null)

  const reducedMotion = useReducedMotion()

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return

    const badges = section.querySelectorAll('.skill-badge')

    if (reducedMotion) {
      // Make badges immediately visible — no animation
      gsap.set(badges, { opacity: 1, scale: 1, y: 0 })
      return
    }

    // Staggered pop-in for all badges on scroll into view
    gsap.set(badges, { opacity: 0, scale: 0.6, y: 20 })

    ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(badges, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: 'back.out(1.4)',
          stagger: 0.07,
          onComplete: () => {
            badges.forEach((badge) => {
              (badge as HTMLElement).style.willChange = 'auto'
            })
          },
        })
      },
    })
  }, { scope: sectionRef, dependencies: [reducedMotion] })

  return (
    <section id="skills" ref={sectionRef} className="skills" aria-label="Skills">
      <div className="skills__container">
        <h2 className="skills__heading">Skills</h2>
        <CategoryGroup title="Languages" skills={skillsData.languages} groupRef={langGroupRef} />
        <CategoryGroup title="Frameworks" skills={skillsData.frameworks} groupRef={fwGroupRef} />
        <CategoryGroup title="Tools" skills={skillsData.tools} groupRef={toolsGroupRef} />
      </div>
    </section>
  )
}

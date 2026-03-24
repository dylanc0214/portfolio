import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ProjectCard } from '../components/ProjectCard'
import { projects } from '../data'
import { useReducedMotion } from '../hooks'
import type { ProjectCardProps } from '../components/ProjectCard'

gsap.registerPlugin(ScrollTrigger)

export interface ProjectsSectionProps {
  projects?: ProjectCardProps[] // minimum 3; defaults to data/index.ts
}

export function ProjectsSection({ projects: propProjects }: ProjectsSectionProps = {}) {
  const sectionRef = useRef<HTMLElement>(null)
  const items = propProjects ?? projects

  const reducedMotion = useReducedMotion()

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return

    const cards = section.querySelectorAll('.project-card')

    if (reducedMotion) {
      // Make cards immediately visible — no 3D entrance animation
      gsap.set(cards, { opacity: 1, rotateY: 0, rotateX: 0, z: 0 })
      return
    }

    // Start cards rotated away (3D entrance state)
    gsap.set(cards, {
      opacity: 0,
      rotateY: -60,
      rotateX: 15,
      transformOrigin: 'left center',
      z: -120,
    })

    ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          rotateY: 0,
          rotateX: 0,
          z: 0,
          duration: 0.75,
          ease: 'power3.out',
          stagger: 0.15,
          onComplete: () => {
            cards.forEach((card) => {
              (card as HTMLElement).style.willChange = 'auto'
            })
          },
        })
      },
    })
  }, { scope: sectionRef, dependencies: [reducedMotion] })

  return (
    <section id="projects" ref={sectionRef} className="projects" aria-label="Projects">
      <div className="projects__container">
        <h2 className="projects__heading">Projects</h2>
        <div className="projects__grid">
          {items.map((project, index) => (
            <ProjectCard key={project.title + index} {...project} />
          ))}
        </div>
      </div>
    </section>
  )
}

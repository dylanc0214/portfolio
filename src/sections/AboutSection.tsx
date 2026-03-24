import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks'

gsap.registerPlugin(ScrollTrigger)

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)

  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const text = textRef.current
    const avatar = avatarRef.current
    if (!text || !avatar) return

    if (reducedMotion) {
      // Make content immediately visible — no animation
      gsap.set(text, { opacity: 1, x: 0 })
      gsap.set(avatar, { opacity: 1 })
      return
    }

    // Set initial hidden state
    gsap.set(text, { opacity: 0, x: -60 })
    gsap.set(avatar, { opacity: 0 })

    // Slide text left-to-right on scroll into view
    const textTrigger = ScrollTrigger.create({
      trigger: text,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(text, {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power3.out',
          onComplete: () => {
            text.style.willChange = 'auto'
          },
        })
      },
    })

    // Fade in avatar on scroll into view
    const avatarTrigger = ScrollTrigger.create({
      trigger: avatar,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(avatar, {
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out',
          onComplete: () => {
            avatar.style.willChange = 'auto'
          },
        })
      },
    })

    return () => {
      textTrigger.kill()
      avatarTrigger.kill()
    }
  }, [reducedMotion])

  return (
    <section id="about" ref={sectionRef} className="about" aria-label="About">
      <div className="about__container">
        {/* Profile avatar */}
        <div ref={avatarRef} className="about__avatar" aria-hidden="true">
          <div className="about__avatar-initials">Dylan</div>
        </div>

        {/* Text content */}
        <div ref={textRef} className="about__text">
          <h2 className="about__heading">About Me</h2>
          <p className="about__name">Dylan Chow Yu Jun</p>
          <ul className="about__info">
            <li>
              <span className="about__info-label">Program</span>
              <span className="about__info-value">Diploma in Information & Communication Technology with a specialism in Software Engineering</span>
            </li>
            <li>
              <span className="about__info-label">Institution</span>
              <span className="about__info-value">Asia Pacific University (APU)</span>
            </li>
            <li>
              <span className="about__info-label">Expected Graduation</span>
              <span className="about__info-value">October 2026</span>
            </li>
          </ul>
          <p className="about__bio">
            Passionate software engineering student with a focus on building
            interactive, user-centric web applications. Seeking internship
            opportunities to apply my skills in real-world environments and
            grow alongside experienced engineering teams.
          </p>
          <a
            href="/Resume.pdf"
            download
            className="about__cv-link"
            aria-label="Download CV as PDF"
          >
            Download CV
          </a>
        </div>
      </div>
    </section>
  )
}

export default AboutSection

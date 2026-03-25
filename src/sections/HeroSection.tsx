import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useCursorTilt, useReducedMotion } from '../hooks'
import { Hero3DScene } from '../components/Hero3DScene'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

interface HeroSectionProps {
  /** Set to true once the Loader has completed its exit animation */
  loaderDone?: boolean
}

export function HeroSection({ loaderDone = false }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const titleRef = useRef<HTMLParagraphElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const animatedRef = useRef(false)

  const reducedMotion = useReducedMotion()

  // Cursor tilt is handled inside Hero3DScene; pass null refs to satisfy hook API
  useCursorTilt({ current: null }, { current: null }, 15)

  // Set initial hidden state for text elements
  useEffect(() => {
    const name = nameRef.current
    const title = titleRef.current
    const subtitle = subtitleRef.current
    const cta = ctaRef.current
    if (!name || !title || !subtitle) return

    if (reducedMotion) {
      // Make content immediately visible — no animation
      gsap.set([name, title, subtitle], { opacity: 1, y: 0 })
      if (cta) gsap.set(cta, { opacity: 1, y: 0 })
    } else {
      gsap.set([name, title, subtitle], { opacity: 0, y: 40 })
      if (cta) gsap.set(cta, { opacity: 0, y: 20 })
    }
  }, [reducedMotion])


  // Staggered text reveal after loader exits
  useEffect(() => {
    if (!loaderDone || animatedRef.current) return
    animatedRef.current = true

    const name = nameRef.current
    const title = titleRef.current
    const subtitle = subtitleRef.current
    const cta = ctaRef.current
    if (!name || !title || !subtitle) return

    const targets = cta ? [name, title, subtitle, cta] : [name, title, subtitle]

    if (reducedMotion) {
      // Instantly reveal — duration 0
      gsap.to(targets, { opacity: 1, y: 0, duration: 0 })
    } else {
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.2,
        onComplete: () => {
          targets.forEach((el) => {
            if (el instanceof HTMLElement) el.style.willChange = 'auto'
          })
        },
      })
    }
  }, [loaderDone, reducedMotion])

  // Scroll-out: fade + scale down hero content as user scrolls past
  useEffect(() => {
    const content = contentRef.current
    const section = sectionRef.current
    if (!content || !section || reducedMotion) return

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(content, {
          opacity: 1 - self.progress,
          scale: 1 - self.progress * 0.15,
        })
      },
    })

    return () => {
      st.kill()
    }
  }, [reducedMotion])

  function handleCtaClick() {
    gsap.to(window, {
      duration: reducedMotion ? 0 : 1,
      scrollTo: { y: '#projects', offsetY: 0 },
      ease: 'power2.inOut',
    })
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="hero"
      aria-label="Hero"
    >
      {/* 3D animated background — Three.js canvas */}
      <Hero3DScene />

      <div ref={contentRef} className="hero__content">
        <h1 ref={nameRef} className="hero__name">
          Dylan Chow Yu Jun
        </h1>
        <p ref={titleRef} className="hero__title">
          Software Engineering Diploma Student
        </p>
        <p ref={subtitleRef} className="hero__subtitle">
          Building immersive web experiences
        </p>
        <button
          ref={ctaRef}
          className="hero__cta"
          onClick={handleCtaClick}
          aria-label="View my projects"
        >
          View My Projects
        </button>
      </div>
    </section>
  )
}

export default HeroSection

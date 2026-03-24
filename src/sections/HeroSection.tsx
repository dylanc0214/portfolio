import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useCursorTilt, useReducedMotion } from '../hooks'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

interface HeroSectionProps {
  /** Set to true once the Loader has completed its exit animation */
  loaderDone?: boolean
}

// Shape definitions for the 3D background
const SHAPES = [
  { type: 'cube',   size: 60,  x: '10%',  y: '15%', depth: -80  },
  { type: 'cube',   size: 40,  x: '85%',  y: '20%', depth: -60  },
  { type: 'cube',   size: 80,  x: '75%',  y: '70%', depth: -100 },
  { type: 'sphere', size: 50,  x: '20%',  y: '75%', depth: -70  },
  { type: 'sphere', size: 30,  x: '50%',  y: '10%', depth: -50  },
  { type: 'sphere', size: 70,  x: '90%',  y: '50%', depth: -90  },
  { type: 'cube',   size: 35,  x: '5%',   y: '50%', depth: -55  },
  { type: 'sphere', size: 45,  x: '60%',  y: '85%', depth: -65  },
]

export function HeroSection({ loaderDone = false }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const titleRef = useRef<HTMLParagraphElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const shapesRef = useRef<(HTMLDivElement | null)[]>([])
  const animatedRef = useRef(false)

  const reducedMotion = useReducedMotion()

  // Cursor parallax tilt on the 3D background element (skip when reduced motion)
  useCursorTilt(reducedMotion ? { current: null } : sectionRef, bgRef, 15)

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

  // Animate floating 3D background shapes on mount
  useEffect(() => {
    const shapes = shapesRef.current.filter(Boolean) as HTMLDivElement[]
    if (shapes.length === 0) return

    if (reducedMotion) {
      // Show shapes statically, no motion
      gsap.set(shapes, { opacity: 1, scale: 1 })
      return
    }

    // Set initial 3D state
    gsap.set(shapes, { opacity: 0, scale: 0.6 })

    // Fade shapes in; remove will-change after entrance completes
    gsap.to(shapes, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power2.out',
      stagger: 0.1,
      onComplete: () => {
        shapes.forEach((shape) => {
          shape.style.willChange = 'auto'
        })
      },
    })

    // Floating / bobbing motion — each shape gets its own looping timeline
    shapes.forEach((shape, i) => {
      const yAmp = 18 + (i % 3) * 8   // 18–34 px vertical travel
      const rotAmp = 20 + (i % 4) * 10 // 20–50 deg rotation
      const dur = 3 + (i % 5) * 0.7    // 3–6.8 s period

      gsap.to(shape, {
        y: yAmp,
        rotateX: rotAmp,
        rotateY: rotAmp * 0.6,
        rotateZ: rotAmp * 0.3,
        duration: dur,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.25,
      })
    })

    return () => {
      gsap.killTweensOf(shapes)
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
      {/* 3D animated background */}
      <div ref={bgRef} className="hero__bg" aria-hidden="true">
        {SHAPES.map((shape, i) => (
          <div
            key={i}
            ref={(el) => { shapesRef.current[i] = el }}
            className={`hero__shape hero__shape--${shape.type}`}
            style={{
              width: shape.size,
              height: shape.size,
              left: shape.x,
              top: shape.y,
              transform: `translateZ(${shape.depth}px)`,
            }}
          />
        ))}
      </div>

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

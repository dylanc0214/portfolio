import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

export interface NavLink {
  label: string
  targetId: string
}

export interface NavbarProps {
  links: NavLink[]
}

export function Navbar({ links }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const drawerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  // Build the GSAP drawer timeline once on mount
  useEffect(() => {
    const drawer = drawerRef.current
    if (!drawer) return

    // Set initial state: hidden off-screen to the right
    gsap.set(drawer, { xPercent: 100, autoAlpha: 0 })

    const tl = gsap.timeline({ paused: true })
    tl.to(drawer, {
      xPercent: 0,
      autoAlpha: 1,
      duration: 0.35,
      ease: 'power3.out',
    })
    tlRef.current = tl

    return () => {
      tl.kill()
    }
  }, [])

  // Play / reverse the timeline when isOpen changes
  useEffect(() => {
    if (!tlRef.current) return
    if (isOpen) {
      tlRef.current.play()
    } else {
      tlRef.current.reverse()
    }
  }, [isOpen])

  // ScrollTrigger active-link tracking
  useEffect(() => {
    const triggers: ScrollTrigger[] = []

    links.forEach((link, index) => {
      const section = document.getElementById(link.targetId)
      if (!section) return

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActive(index),
        onEnterBack: () => setActive(index),
      })

      triggers.push(trigger)
    })

    return () => {
      triggers.forEach((t) => t.kill())
    }
  }, [links])

  function setActive(activeIndex: number) {
    linkRefs.current.forEach((el, i) => {
      if (!el) return
      if (i === activeIndex) {
        el.classList.add('active')
      } else {
        el.classList.remove('active')
      }
    })
  }

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, targetId: string) {
    e.preventDefault()
    setIsOpen(false)
    gsap.to(window, {
      duration: 0.8,
      scrollTo: { y: `#${targetId}`, offsetY: 60 },
      ease: 'power2.inOut',
    })
  }

  function toggleMenu() {
    setIsOpen((prev) => !prev)
  }

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      className="navbar"
    >
      {/* Desktop links */}
      <ul className="navbar__links" role="list">
        {links.map((link, index) => (
          <li key={link.targetId}>
            <a
              ref={(el) => { linkRefs.current[index] = el }}
              href={`#${link.targetId}`}
              onClick={(e) => handleClick(e, link.targetId)}
              className="nav-link"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Hamburger button — visible only on mobile */}
      <button
        className="navbar__hamburger"
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-drawer"
      >
        <span className={`hamburger-icon${isOpen ? ' hamburger-icon--open' : ''}`} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        className="navbar__drawer"
        aria-hidden={!isOpen}
      >
        <ul role="list" className="navbar__drawer-links">
          {links.map((link, index) => (
            <li key={link.targetId}>
              <a
                href={`#${link.targetId}`}
                onClick={(e) => handleClick(e, link.targetId)}
                className="nav-link nav-link--drawer"
                tabIndex={isOpen ? 0 : -1}
                ref={(el) => {
                  // Keep linkRefs in sync for active tracking (drawer mirrors desktop)
                  // We only need one set of refs; desktop refs are sufficient for setActive
                  // but we still want drawer links to reflect active state
                  if (el) el.dataset.drawerIndex = String(index)
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

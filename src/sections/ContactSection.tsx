import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ContactForm } from '../components/ContactForm'
import { useReducedMotion } from '../hooks'

gsap.registerPlugin(ScrollTrigger)

const CONTACT_EMAIL = 'dylanchow0214@gmail.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/dylanc0214'

export function ContactSection() {
  const formRef = useRef<HTMLDivElement>(null)

  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const form = formRef.current
    if (!form) return

    if (reducedMotion) {
      // Make form immediately visible — no animation
      gsap.set(form, { opacity: 1, y: 0 })
      return
    }

    // Set initial hidden state
    gsap.set(form, { opacity: 0, y: 40 })

    // Fade-up entrance on scroll into view
    const trigger = ScrollTrigger.create({
      trigger: form,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(form, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          onComplete: () => {
            form.style.willChange = 'auto'
          },
        })
      },
    })

    return () => {
      trigger.kill()
    }
  }, [reducedMotion])

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="contact"
      aria-label="Contact"
    >
      <div className="contact__container">
        <h2 className="contact__heading">Get In Touch</h2>

        <div className="contact__links">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            data-testid="contact-email-link"
            className="contact__email-link"
            aria-label="Send email"
          >
            {CONTACT_EMAIL}
          </a>
          <a
            href={LINKEDIN_URL}
            data-testid="contact-linkedin-link"
            className="contact__linkedin-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
          >
            LinkedIn
          </a>
        </div>

        <div ref={formRef} className="contact__form-wrapper">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}

export default ContactSection

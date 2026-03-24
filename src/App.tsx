import { useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { Loader, Navbar } from './components'
import { HeroSection, AboutSection, SkillsSection, ProjectsSection, ContactSection } from './sections'

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

interface AppState {
  loaderDone: boolean
}

const NAV_LINKS = [
  { label: 'Me',     targetId: 'hero'     },
  { label: 'About',    targetId: 'about'    },
  { label: 'Skills',   targetId: 'skills'   },
  { label: 'Projects', targetId: 'projects' },
  { label: 'Contact',  targetId: 'contact'  },
]

function App() {
  const [state, setState] = useState<AppState>({ loaderDone: false })

  function handleLoaderComplete() {
    setState({ loaderDone: true })
  }

  return (
    <div className="app">
      <Loader onComplete={handleLoaderComplete} />
      <Navbar links={NAV_LINKS} />
      <main>
        <HeroSection loaderDone={state.loaderDone} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </div>
  )
}

export default App

# Implementation Plan: 3D Portfolio Website

## Overview

Build a React + Vite (TypeScript) single-page portfolio with GSAP-driven 3D animations and scroll interactions. Tasks are ordered to establish the project scaffold first, then build each section incrementally, wiring everything together at the end.

## Tasks

- [x] 1. Scaffold project and install dependencies
  - Run `npm create vite@latest` with React + TypeScript template
  - Install GSAP and `@gsap/react`, ScrollTrigger plugin, and type definitions
  - Install EmailJS or a similar form-submission library for the contact form
  - Install `fast-check` for property-based tests
  - Set up `tsconfig.json`, `vite.config.ts`, and global CSS reset
  - Create folder structure: `src/components`, `src/sections`, `src/hooks`, `src/assets`
  - _Requirements: 1.1, 9.1_

- [x] 2. Implement Loader (preloader) component
  - [x] 2.1 Create `Loader.tsx` full-screen animated preloader
    - Use GSAP timeline to animate a progress bar or spinner
    - Track `window` load event; show progress indicator if load exceeds 3 s
    - On load complete, animate Loader out and call an `onComplete` callback
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [x] 2.2 Write unit tests for Loader
    - Verify `onComplete` fires after the GSAP timeline finishes
    - Verify progress indicator appears after a 3 s mock delay (boundary case)
    - _Requirements: 1.2, 1.3_

- [x] 3. Implement Navbar component
  - [x] 3.1 Create `Navbar.tsx` fixed navigation bar
    - Render links for all five sections; apply `position: fixed` styling
    - Use GSAP `scrollTo` plugin for smooth-scroll on link click
    - Use ScrollTrigger to detect active section and apply active class
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 3.2 Implement hamburger menu for mobile viewports
    - Collapse Navbar into hamburger icon below 768 px
    - Animate drawer open/close with GSAP slide-in timeline
    - _Requirements: 3.5, 8.2_
  - [x] 3.3 Write unit tests for Navbar
    - Verify all five section links render
    - Simulate scroll events and assert correct link receives active class
    - Verify hamburger toggle renders below 768 px
    - _Requirements: 3.2, 3.4, 3.5_
  - [x] 3.4 Write property test for active Navbar link
    - **Property 2: Active Navbar link matches scrolled section**
    - Generate random section index (0–4); assert exactly one link has the active class and it corresponds to the scrolled section
    - fast-check arbitrary: `fc.integer({min:0, max:4})`
    - **Validates: Requirements 3.4**

- [x] 4. Implement Hero section
  - [x] 4.1 Create `HeroSection.tsx` with staggered text reveal
    - Animate name and title with GSAP stagger on mount (after Loader exits)
    - _Requirements: 2.1_
  - [x] 4.2 Add 3D animated background element
    - Render floating geometric shapes or particle field using CSS 3D transforms driven by GSAP
    - _Requirements: 2.2_
  - [x] 4.3 Add cursor parallax tilt effect
    - Listen to `mousemove` on the Hero section; drive GSAP `quickTo` for smooth tilt
    - Clamp computed tiltX and tiltY to [-maxTilt, maxTilt]
    - _Requirements: 2.3_
  - [x] 4.4 Add CTA button and scroll-out animation
    - Wire CTA button to smooth-scroll to Projects section
    - Register ScrollTrigger to fade + scale Hero content out on scroll
    - _Requirements: 2.4, 2.5_
  - [x] 4.5 Write property test for Hero parallax tilt clamping
    - **Property 1: Hero tilt values are always clamped within [-maxTilt, maxTilt] for any cursor position**
    - Generate random (x, y) cursor coordinates; assert tiltX and tiltY ∈ [-maxTilt, maxTilt]
    - fast-check arbitrary: `fc.float()` pairs
    - **Validates: Requirements 2.3**

- [x] 5. Implement About section
  - [x] 5.1 Create `AboutSection.tsx` with student info and profile image
    - Display name, diploma program, institution, and expected graduation year
    - Include a downloadable CV link pointing to a PDF asset
    - _Requirements: 4.1, 4.4_
  - [x] 5.2 Add ScrollTrigger entrance animations
    - Slide text content left-to-right on scroll into view
    - Fade in profile image/avatar on scroll into view
    - _Requirements: 4.2, 4.3_
  - [x] 5.3 Write unit tests for AboutSection
    - Verify name, diploma program, institution, and graduation year are rendered
    - Verify CV link has correct `href` and `download` attribute
    - _Requirements: 4.1, 4.4_

- [x] 6. Implement Skills section
  - [x] 6.1 Create `SkillBadge.tsx` component
    - Render skill name, category, and proficiency indicator (animated bar or ring via GSAP)
    - Add GSAP 3D flip/scale on hover
    - _Requirements: 5.1, 5.3, 5.5_
  - [x] 6.2 Create `SkillsSection.tsx` with grouped badges
    - Group badges by category (Languages, Frameworks, Tools)
    - Register ScrollTrigger staggered pop-in for all badges on scroll into view
    - _Requirements: 5.2, 5.4_
  - [x] 6.3 Write property test for Skills badge count
    - **Property 3: Skills badge count equals skill data count**
    - Generate random skills array; assert rendered badge count equals total input length
    - fast-check arbitrary: `fc.array(fc.record({ name: fc.string(), category: fc.constantFrom('Languages','Frameworks','Tools'), proficiency: fc.float({min:0,max:1}) }))`
    - **Validates: Requirements 5.1**
  - [x] 6.4 Write property test for Skills badges grouped by category
    - **Property 4: Skills badges are grouped by category**
    - Generate random skills; assert every badge rendered within a category group has a category value matching that group's label
    - fast-check arbitrary: `fc.array(fc.record({...}))`
    - **Validates: Requirements 5.4**
  - [x] 6.5 Write property test for proficiency indicator bounds
    - **Property 5: Proficiency indicator is always within valid bounds**
    - Generate random proficiency values in [0, 1]; assert rendered bar/ring width ∈ [0%, 100%]
    - Include boundary values: proficiency = 0 and proficiency = 1
    - fast-check arbitrary: `fc.float({min:0, max:1})`
    - **Validates: Requirements 5.5**

- [x] 7. Implement Projects section
  - [x] 7.1 Create `ProjectCard.tsx` component
    - Render title, technology tags, description, repo link, and optional live demo link
    - Add GSAP 3D cursor-tracking tilt on hover; clamp rotation to ±15°
    - Add GSAP overlay animation to reveal description and links on hover
    - _Requirements: 6.3, 6.4, 6.5, 6.6_
  - [x] 7.2 Create `ProjectsSection.tsx` with staggered entrance
    - Display minimum three Project_Cards
    - Register ScrollTrigger staggered 3D rotation entrance on scroll into view
    - _Requirements: 6.1, 6.2_
  - [x] 7.3 Write unit tests for ProjectCard
    - Verify title, tags, description, and repo link are always rendered
    - Verify demo link renders when `demoUrl` is provided and is absent when `demoUrl` is undefined
    - _Requirements: 6.5, 6.6_
  - [x] 7.4 Write property test for Project card tilt clamping
    - **Property 6: Project card tilt rotation values are always within [-15°, 15°] for any cursor offset**
    - Generate random cursor offsets; assert computed rotation ∈ [-15°, 15°]
    - fast-check arbitrary: `fc.float()` pairs
    - **Validates: Requirements 6.3**
  - [x] 7.5 Write property test for Project card required fields
    - **Property 7: Project card always renders required fields**
    - Generate random Project objects; assert rendered card contains title, all tags, description, and repo link
    - fast-check arbitrary: `fc.record({ title: fc.string({minLength:1}), description: fc.string(), tags: fc.array(fc.string()), repoUrl: fc.webUrl() })`
    - **Validates: Requirements 6.5**
  - [x] 7.6 Write property test for demo link conditional rendering
    - **Property 8: Demo link is shown if and only if demoUrl is present**
    - Generate projects with and without `demoUrl`; assert link presence matches field presence
    - fast-check arbitrary: `fc.option(fc.webUrl())`
    - **Validates: Requirements 6.6**

- [x] 8. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement Contact section and form
  - [x] 9.1 Create `ContactForm.tsx` with validation
    - Render name, email, and message fields
    - Implement inline validation: show per-field error on submit if field is empty, no page reload
    - On success, display confirmation message; on network error, display error and preserve input
    - _Requirements: 7.2, 7.4, 7.5, 7.6_
  - [x] 9.2 Create `ContactSection.tsx` with social links and ScrollTrigger
    - Display professional email and LinkedIn URL
    - Register ScrollTrigger fade-up entrance for the form
    - _Requirements: 7.1, 7.3_
  - [x] 9.3 Write unit tests for ContactForm
    - Test inline error display for each empty required field individually
    - Test all fields empty simultaneously
    - Test success state after submission
    - Test error state with input preservation after network failure
    - _Requirements: 7.4, 7.5, 7.6_
  - [x] 9.4 Write property test for Contact form validation errors
    - **Property 9: Contact form shows an error for every empty required field**
    - Generate all non-empty subsets of {name, email, message} as empty fields; assert each empty field has a corresponding inline error and the page does not reload
    - fast-check arbitrary: `fc.subarray(['name','email','message'], {minLength:1})`
    - **Validates: Requirements 7.5**

- [x] 10. Implement responsive design and reduced-motion support
  - [x] 10.1 Apply responsive CSS for all sections
    - Use CSS media queries to enforce single-column layout below 768 px
    - Ensure viewport widths from 320 px to 2560 px render correctly
    - Verify WCAG 2.1 AA colour contrast for all text
    - _Requirements: 8.1, 8.2, 8.4_
  - [x] 10.2 Simplify animations on mobile and respect `prefers-reduced-motion`
    - Detect `prefers-reduced-motion` media query via `useReducedMotion` hook; disable or minimise GSAP animations
    - Reduce 3D animation complexity on viewports below 768 px to maintain ≥30 fps
    - _Requirements: 8.3, 9.4_
  - [x] 10.3 Write property test for layout overflow at any supported viewport width
    - **Property 10: Layout renders without overflow at any supported viewport width**
    - Generate viewport widths in [320, 2560]; assert no section produces horizontal overflow
    - Include boundary values: 320 px, 768 px, 2560 px
    - fast-check arbitrary: `fc.integer({min:320, max:2560})`
    - **Validates: Requirements 8.1**
  - [x] 10.4 Write property test for reduced-motion disabling GSAP animations
    - **Property 11: Reduced-motion disables all GSAP animations**
    - Mock `prefers-reduced-motion` as active; assert all registered GSAP animation durations are 0 or animations are skipped entirely
    - fast-check arbitrary: `fc.constant(true)`
    - **Validates: Requirements 9.4**

- [x] 11. Performance optimisation
  - [x] 11.1 Lazy-load images and heavy assets
    - Use `loading="lazy"` on images and dynamic `import()` for large modules
    - Ensure initial page load transfers ≤1 MB
    - _Requirements: 9.3_
  - [x] 11.2 Optimise GSAP animation performance
    - Use `will-change` and `transform` properties to keep animations on the GPU
    - Remove `will-change` after animation completes to avoid excessive GPU memory usage
    - Verify 60 fps on desktop during GSAP animation runs
    - _Requirements: 9.2_

- [x] 12. Wire everything together in `App.tsx`
  - [x] 12.1 Compose all sections and components in `App.tsx`
    - Render Loader → Navbar → HeroSection → AboutSection → SkillsSection → ProjectsSection → ContactSection
    - Pass `onComplete` from Loader to trigger Hero entrance animation
    - Initialise GSAP ScrollTrigger plugin globally
    - _Requirements: 1.2, 3.1_
  - [x] 12.2 Write integration tests for full page render
    - Assert all sections mount without errors
    - Assert Loader calls `onComplete` and Hero content becomes visible
    - _Requirements: 1.1, 1.2_

- [x] 13. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests use fast-check with a minimum of 100 iterations per property
- Each property test must include a comment: `// Feature: 3d-portfolio-website, Property N: <property_text>`
- Unit tests use Vitest + React Testing Library
- Property tests validate universal correctness (P1–P11); unit tests validate specific examples and edge cases

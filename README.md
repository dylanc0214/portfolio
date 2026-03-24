# Portfolio

A modern, interactive portfolio website built with React, TypeScript, and Vite, featuring smooth animations powered by GSAP.

## Technologies Used

- **Framework**: React 18, Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS with custom properties
- **Animations**: GSAP (ScrollTrigger, ScrollToPlugin)
- **Email Service**: EmailJS (`@emailjs/browser`)
- **Testing**: Vitest, React Testing Library, and Property-Based Testing (`fast-check`)

## Project Structure

- `src/components/`: Reusable UI components including the Navbar and Loader.
- `src/sections/`: Major page sections (`HeroSection`, `AboutSection`, `SkillsSection`, `ProjectsSection`, `ContactSection`).
- `src/App.tsx`: The main application entry point that integrates the UI sections and manages the global application state.
- `src/index.css`: Global styles, CSS variables, and core logic for responsiveness.

## Features

- **Interactive Animations**: Advanced scrolling effects and entry animations using GSAP.
- **Responsive Navigation**: Smooth scroll to sections via the intuitive navbar.
- **Property-Based Testing**: Ensuring layout integrity and verifying accessibility compliance (e.g., `prefers-reduced-motion`) via `fast-check`.
- **Contact Form**: Direct email functional integration using EmailJS.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory.

2. Install the dependencies:
```bash
npm install
```

### Running Locally

To start the Vite development server:
```bash
npm run dev
```

### Building for Production

To create an optimized production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

### Running Tests

To run the Vitest test suite:
```bash
npm run test
```
To run tests in watch mode:
```bash
npm run test:watch
```

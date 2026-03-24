import type { SkillBadgeProps } from '../components/SkillBadge'
import type { ProjectCardProps } from '../components/ProjectCard'

export interface Skill {
  id: string
  name: string
  category: 'Languages' | 'Frameworks' | 'Tools'
  proficiency: number // 0.0 – 1.0
  iconUrl?: string
}

export const skills: Skill[] = [
  // Languages
  { id: 'html', name: 'HTML5', category: 'Languages', proficiency: 0.6 },
  { id: 'js', name: 'JavaScript', category: 'Languages', proficiency: 0.5 },
  { id: 'css', name: 'CSS', category: 'Languages', proficiency: 0.5 },
  { id: 'python', name: 'Python', category: 'Languages', proficiency: 0.6 },
  { id: 'java', name: 'Java', category: 'Languages', proficiency: 0.6 },
  { id: 'php', name: 'PHP', category: 'Languages', proficiency: 0.6 },
  { id: 'mysql', name: 'MySQL', category: 'Languages', proficiency: 0.6 },
  { id: 'postgre', name: 'PostgreSQL', category: 'Languages', proficiency: 0.6 },

  // Frameworks
  { id: 'react', name: 'React', category: 'Frameworks', proficiency: 0.7 },
  { id: 'nextjs', name: 'Next.js', category: 'Frameworks', proficiency: 0.7 },

  // Tools
  { id: 'git', name: 'Git', category: 'Tools', proficiency: 0.9 },
  { id: 'vercel', name: 'Vercel', category: 'Tools', proficiency: 0.9 },
  { id: 'pgadmin', name: 'PgAdmin', category: 'Tools', proficiency: 0.8 },
]

export const skillsData: { languages: SkillBadgeProps[]; frameworks: SkillBadgeProps[]; tools: SkillBadgeProps[] } = {
  languages: skills.filter(s => s.category === 'Languages'),
  frameworks: skills.filter(s => s.category === 'Frameworks'),
  tools: skills.filter(s => s.category === 'Tools'),
}

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  repoUrl: string
  demoUrl?: string
  imageUrl?: string
}

export const projects: ProjectCardProps[] = [
  {
    title: 'Learning Management System',
    description:
      'Tuition Centre Management System for Advanced Tuition Centre to manage their staff and student data',
    tags: ['Java'],
    repoUrl: 'https://github.com/lw112k/LMS_Java',
  },
  {
    title: 'EcoQuest',
    description:
      'Join weekly sustainability quests, upload proof, earn points, and make a real impact through TREE PLANTING, rewards, and recognition.',
    tags: ['HTML', 'JavaScript', 'CSS', 'PHP', 'MySQL'],
    repoUrl: 'https://github.com/lw112k/EcoQuest',
    demoUrl: 'https://ecoquest.dylanchow.info/',
  },
  {
    title: 'FlowForge',
    description:
      'FlowForge is a comprehensive internal company workflow and request management platform. It streamlines business processes such as hardware/software purchase requests, IT access approvals, and travel authorizations, providing employees with an intuitive dashboard and robust analytics for managers.',
    tags: ['React', 'Vite', 'Express.js', 'Node.js', 'MySQL'],
    repoUrl: 'https://github.com/dylanc0214/flow-forge',
    demoUrl: 'https://flowforge.dylanchow.info/',
  },
  // {
  //   title: 'Fyt',
  //   description:
  //     'Personal finance tracker with category-based budgeting, recurring expense detection, and monthly trend charts. Stores data locally with optional cloud sync.',
  //   tags: ['React', 'TypeScript', 'Chart.js', 'IndexedDB'],
  //   repoUrl: 'https://github.com/example/budgetbuddy',
  // },
  // {
  //   title: 'UniConnect',
  //   description:
  //     'Personal finance tracker with category-based budgeting, recurring expense detection, and monthly trend charts. Stores data locally with optional cloud sync.',
  //   tags: ['React', 'TypeScript', 'Chart.js', 'IndexedDB'],
  //   repoUrl: 'https://github.com/example/budgetbuddy',
  // },
  // {
  //   title: 'NextHire',
  //   description:
  //     'Personal finance tracker with category-based budgeting, recurring expense detection, and monthly trend charts. Stores data locally with optional cloud sync.',
  //   tags: ['React', 'TypeScript', 'Chart.js', 'IndexedDB'],
  //   repoUrl: 'https://github.com/example/budgetbuddy',
  // },
  // {
  //   title: 'MedChain',
  //   description:
  //     'Personal finance tracker with category-based budgeting, recurring expense detection, and monthly trend charts. Stores data locally with optional cloud sync.',
  //   tags: ['React', 'TypeScript', 'Chart.js', 'IndexedDB'],
  //   repoUrl: 'https://github.com/example/budgetbuddy',
  // },
  {
    title: 'Educational Management System',
    description:
      'Educational Management System built on Python.',
    tags: ['Python'],
    repoUrl: 'https://github.com/KIT0401/Python-Assignment',
  },
  {
    title: 'Underrated Studio Booking System',
    description:
      'A full-stack web application for booking DJ studio sessions, with user authentication, booking management, payment processing, and a full admin dashboard.',
    tags: ['React', 'TypeScript', 'Vite', 'MySQL', 'Node.js', 'Express'],
    repoUrl: 'https://github.com/dylanc0214/studio-booking-system',
    demoUrl: 'https://underrated.dylanchow.info/',
  },
  {
    title: 'DuitFlow',
    description:
      'DuitFlow (meaning "Money Flow") is a modern, full-stack personal finance application built to help you track incomes, expenses, budgets, and accounts seamlessly. It offers an intuitive dashboard with a clean UI directly integrated with Supabase for backend authentication and data storage.',
    tags: ['React', 'Next.js', 'TypeScript', 'PostgreSQL (Supabase)'],
    repoUrl: 'https://github.com/dylanc0214/duitflow',
    demoUrl: 'https://duitflow.dylanchow.info/',
  },
]

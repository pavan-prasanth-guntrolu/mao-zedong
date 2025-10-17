---
description: Repository Information Overview
alwaysApply: true
---

# Qiskit Fall Fest 2025 Information

## Summary
A modern, interactive website for the Qiskit Fall Fest 2025 event at IIIT Srikakulam. Built with React, Vite, Tailwind CSS, and featuring quantum-themed 3D animations. The site includes features like interactive 3D hero section, dark/light mode toggle, responsive design, registration system, schedule management, workshop notebooks, and more.

## Structure
- **src/**: Main source code directory containing React components, pages, and utilities
  - **components/**: Reusable UI components including shadcn/ui components
  - **pages/**: Route components for different sections of the website
  - **data/**: JSON data files for speakers, schedule, notebooks, etc.
  - **lib/**: Utility functions and service integrations
  - **hooks/**: Custom React hooks
- **public/**: Static assets including images and other resources
- **Graphics/**: Design assets including badges, emojis, and illustrations
- **dist/**: Production build output directory

## Language & Runtime
**Language**: TypeScript/JavaScript (React)
**Version**: React 18.3.1
**Build System**: Vite 5.4.19
**Package Manager**: npm/bun

## Dependencies
**Main Dependencies**:
- React 18.3.1 with React DOM
- React Router DOM 6.30.1
- Tailwind CSS 3.4.17
- shadcn/ui components (via Radix UI primitives)
- Three.js 0.160.1 with React Three Fiber
- Framer Motion 11.18.2
- Supabase for authentication and backend
- TanStack React Query 5.83.0

**Development Dependencies**:
- TypeScript 5.8.3
- ESLint 9.32.0
- Vite 5.4.19 with React SWC plugin
- Tailwind plugins (typography, animate)

## Build & Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Configuration
**Vite Config**: Configured with React SWC plugin, path aliases, and development tools
**Tailwind Config**: Custom theme with quantum-inspired colors, animations, and typography
**TypeScript Config**: Separate configs for app and Node environments
**Environment Variables**: Supabase URL and anonymous key for authentication

## Backend Integration
**Service**: Supabase
**Features**: Authentication, user management
**Configuration**: Environment variables in .env.local

## Main Entry Points
**Main**: src/main.tsx - Application entry point
**App**: src/App.tsx - Main component with routing setup
**Index**: src/pages/Index.tsx - Landing page component
**Routes**: React Router with BrowserRouter setup

## UI Components
**Design System**: Custom quantum-themed design with glassmorphism effects
**Component Library**: shadcn/ui with Radix UI primitives
**Styling**: Tailwind CSS with custom animations and theme
**Fonts**: Inter for body text, Poppins for headings

## 3D Graphics
**Library**: Three.js with React Three Fiber
**Components**: Interactive 3D hero section with quantum-themed animations
**Models**: Support for GLB models with fallback to procedural 3D scenes

## Deployment
**Build Output**: dist/ directory
**Hosting Options**: GitHub Pages, Netlify, Vercel
**CI/CD**: GitHub Actions workflow for automated deployment

## Testing
**targetFramework**: Playwright
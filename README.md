# Qiskit Fall Fest 2025 — IIIT Srikakulam

A modern, interactive website for the Qiskit Fall Fest 2025 event at IIIT Srikakulam. Built with React, Vite, Tailwind CSS, and featuring quantum-themed 3D animations.

## 🚀 Quick Start

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

## 🎯 Features

- **Interactive 3D Hero Section** with quantum-themed animations
- **Dark/Light Mode Toggle** with system preference detection
- **Responsive Design** optimized for all devices
- **Registration System** with form validation and fallback options
- **Schedule Management** with filtering and calendar export (.ics)
- **Workshop Notebooks** with Colab and GitHub integration
- **Hackathon Tracks** with detailed judging rubric modal
- **Speaker Profiles** with detailed modal views
- **Glassmorphism UI** with quantum-inspired design system
- **SEO Optimized** with proper meta tags and structured data
- **Performance Optimized** with lazy loading and code splitting

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, JavaScript (JSX)
- **Styling**: Tailwind CSS, Custom Design System
- **3D Graphics**: React Three Fiber, Three.js, @react-three/drei
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **UI Components**: shadcn/ui (customized)
- **Icons**: Lucide React
- **Fonts**: Inter & Poppins (Google Fonts)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.jsx      # Navigation header with dark mode
│   ├── Footer.jsx      # Site footer with links
│   ├── Hero3D.jsx      # Interactive 3D quantum scene
│   └── ...
├── pages/              # Route components
│   ├── Home.jsx        # Landing page with hero
│   ├── About.jsx       # Event information
│   ├── Register.jsx    # Registration form
│   ├── Schedule.jsx    # Event schedule with filters
│   ├── Workshops.jsx   # Notebook listings
│   ├── Speakers.jsx    # Speaker profiles
│   ├── Hackathon.jsx   # Hackathon details & tracks
│   └── ...
├── data/               # JSON data files
│   ├── speakers.json   # Speaker information
│   ├── schedule.json   # Event schedule
│   ├── notebooks.json  # Workshop notebooks
│   ├── sponsors.json   # Sponsor details
│   └── ...
└── lib/                # Utility functions
```

## 🔧 How to Replace Placeholders

This project includes placeholder values that need to be replaced with actual information:

### 1. Contact Information
Replace in all files:
- `REPLACE_WITH_EMAIL` → qiskitfallfest25@rgukt.in
- `REPLACE_WITH_PHONE` → +91 93928 10073
- `contact@REPLACE_WITH_EMAIL` → contact.quantum@rgukt.in

### 2. Registration System
In `src/pages/Register.jsx`:
- `REPLACE_WITH_REGISTRATION_ENDPOINT` → your registration API endpoint
- `REPLACE_WITH_GOOGLE_FORM_URL` → Google Form URL as fallback

### 3. Social Media & Repository Links
In `src/components/Footer.jsx`:
- `REPLACE_WITH_GITHUB_REPO` → your GitHub repository URL
- `REPLACE_WITH_TWITTER_URL` → your Twitter profile/page
- `REPLACE_WITH_LINKEDIN_URL` → your LinkedIn profile/page

### 4. Notebook Links
In `src/data/notebooks.json`:
- `REPLACE_WITH_COLAB_LINK_*` → actual Google Colab notebook URLs
- `REPLACE_WITH_GITHUB_REPO/*` → actual GitHub repository paths

### 5. 3D Models (Optional)
Place GLB files in `public/models/`:
- `quantum-circuit.glb` → 3D quantum circuit model
- `quantum-atom.glb` → 3D atom model  
- `qiskit-logo-3d.glb` → 3D Qiskit logo

**Note**: If GLB models are not provided, the app automatically falls back to procedural 3D scenes.

### 6. Images
Place image files in `public/`:
- Speaker photos: `public/speakers/`
- Notebook thumbnails: `public/notebooks/`
- Sponsor logos: `public/sponsors/`
- Team photos: `public/team/`
- Judge photos: `public/judges/`

## 🎨 Design System

The project uses a comprehensive design system with:
- **Quantum-themed Colors**: Deep blues, purples, and cyans
- **Glassmorphism Effects**: Translucent cards with backdrop blur
- **Custom Animations**: Pulse, glow, and float effects
- **Semantic Tokens**: HSL color system for consistent theming
- **Typography Scale**: Inter for body text, Poppins for headings

## ♿ Accessibility Features

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus states
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Color Contrast**: WCAG AA compliant color combinations

## 🚀 Deployment

### GitHub Pages / Netlify / Vercel

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your preferred platform

### GitHub Actions (Included)

The project includes a GitHub Actions workflow that automatically builds and deploys on push to main branch.

## 📄 Content Guidelines

### Judging Rubric (Exact Text Required)
- Originality 25%
- Technical Merit 25% 
- Usefulness/Reproducibility 25%
- Presentation 25%

### Code of Conduct (Exact Text Required)
"We follow a zero-tolerance Code of Conduct. Respect everyone — harassment is not tolerated. Report incidents to contact.quantum@rgukt.in."

### Registration Success Message (Exact Text Required)
"Thanks! You're registered for Qiskit Fall Fest 2025 — check your email for details."

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is created for educational purposes as part of the Qiskit Fall Fest 2025 event series.

## 🆘 Support

For technical issues or questions:
- Create an issue on GitHub
- Contact the organizing team at contact.quantum@rgukt.in
- Check the FAQ section on the website

---

Built with ❤️ for the quantum computing community by IIIT Srikakulam students.
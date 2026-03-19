# Vitapia.ai | Synthetic Societies

<p align="center">
  <strong>Asia's First Population-Scale AI Prediction Platform</strong>
</p>

Vitapia.ai is an enterprise-grade Multi-Agent AI simulation platform built to replace slow, expensive, and biased traditional market research. By ingesting raw public census data, Vitapia spawns thousands of high-fidelity "Virtual Citizens" to test scenarios, pricing, and products at scale—delivering population-level insights in hours instead of months.

## 🚀 The Digital Twin of Hong Kong
This repository houses the interactive frontend for the Vitapia.ai platform.

### Key Features
- **Cinematic 3D Visuals:** Powered by `three.js` and `@react-three/fiber`, featuring an interactive WebGL particle swarm and scroll-driven morphing data nodes.
- **Interactive Data Validation:** A draggable, zoomable 3D bar chart built with `@react-three/drei` proving our N=100 pilot accuracy against real Hong Kong government survey data.
- **Smooth Scrolling Engine:** Utilitzes `lenis` for a heavy, momentum-based scrolling experience, synchronized with `framer-motion` for complex scroll-scrubbing animations.
- **Modern UI/UX:** Built with Next.js 14 (App Router) and Tailwind CSS, tailored for dark mode with high-contrast neon accents (Cyan & Green).

## 📊 Proven Accuracy
Our backend orchestrator simulated 100 synthetic HK residents against the real *2019/20 HK Household Expenditure Survey*. Without manual prompting, our LLM agents achieved:
- **97.2% Statistical Accuracy** in Food Expenditure Share predictions.
- **89.1% Discretionary Spend Accuracy** in non-food budget allocations.

*(Calculated using Mean Absolute Error across real-world data points vs synthetic agents).*

## 🛠 Tech Stack
- **Framework:** [Next.js 14](https://nextjs.org/) (React 18)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **3D Engine:** [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) + [Drei](https://github.com/pmndrs/drei)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Smooth Scroll:** [Lenis](https://github.com/studio-freight/lenis)
- **Icons:** [Lucide React](https://lucide.dev/)

## ⚙️ Getting Started

First, install the dependencies (legacy peer deps required for some Three.js ecosystem packages):

```bash
npm install --legacy-peer-deps
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3005](http://localhost:3005) with your browser to see the result.

## 📁 Project Structure
- `src/app/page.tsx` - The main landing page orchestrating the narrative flow and scroll animations.
- `src/components/ParticleSwarm.tsx` - The background WebGL particle constellation.
- `src/components/ScrollShape.tsx` - The scroll-driven morphing icosahedron data node.
- `src/components/ValidationChart3D.tsx` - The interactive 3D bar chart displaying the empirical validation data.
- `src/components/LenisProvider.tsx` - The smooth-scroll wrapper.
- `public/logo-black.png` - Transparent dark-mode optimized vector logo.

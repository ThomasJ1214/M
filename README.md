# BMW M Division Showcase

A world-class, cinematic scroll-driven 3D showcase of BMW's M Division — the definitive digital monument to 50 years of M engineering.

## Features

- **Cinematic scroll experience** — 300vh pinned M logo assembly, 400vh per-model chapters
- **Real-time 3D** — React Three Fiber with fallback procedural geometry, M-accurate lighting rig
- **GSAP ScrollTrigger** — frame-perfect scrub animations, SplitText reveals
- **Lenis smooth scroll** — physics-weight lerp: 0.07, wired to GSAP ScrollTrigger
- **Paint color picker** — switch between real BMW M colors in 3D viewer
- **Exploded view** — body panels animate apart and snap back
- **Masonry gallery** — lazy-loaded with custom Framer Motion lightbox
- **Generations timeline** — horizontal scroll through all M model history
- **Konami code** — activates M Competition Mode (red theme, overdrive animations)
- **Launch control** — fast scroll triggers red flash + screen shake
- **Idle detection** — 30s without interaction starts cinematic camera orbit
- **Long-press Nürburgring times** — tap stat row to reveal lap time
- **M1 easter egg** — "FIRST. ALWAYS." watermark
- **404 burnout** — animated M logo doing a burnout with CSS smoke particles
- **Custom cursor** — grows to ring on hover, mix-blend-mode: difference
- **Grain overlay** — SVG feTurbulence grain at 3.5% opacity
- **Sound toggle** — engine audio with user consent (muted by default)
- **Theme toggle** — M Blue / Racing Red accent color switch
- **Mobile gyroscope** — DeviceOrientation API drives model Y rotation
- **prefers-reduced-motion** — disables all parallax and scroll animations

## Stack

| Package | Version | Purpose |
|---------|---------|---------|
| React | 18 | UI |
| Vite | 5 | Build |
| Three.js | r165 | 3D rendering |
| React Three Fiber | 8 | React + Three.js |
| @react-three/drei | 9 | Three.js helpers |
| GSAP | 3.12 | Scroll animations |
| Framer Motion | 11 | Route transitions, parallax |
| Lenis | 1.1 | Smooth scroll |
| Tailwind CSS | 3 | Utility styles |
| Zustand | 4 | Global state |
| React Router | 6 | Client-side routing |
| react-helmet-async | 2 | Per-page meta tags |

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173)

## Adding Assets

### 3D Models
1. Download `.glb` or `.gltf` model from Sketchfab, TurboSquid, or CGTrader
2. Compress with Draco: `gltf-pipeline -i model.gltf -o model.glb --draco.compressionLevel 7`
3. Save to `/public/models/[slug]/model.glb`
4. The app automatically loads it; falls back to procedural geometry if not found

### Images
1. Download from BMW Press (press.bmwgroup.com) or Unsplash
2. Convert to WebP: `cwebp -q 82 input.jpg -o output.webp`
3. Save to `/public/images/[slug]/hero.webp`, `gallery-1.webp`, etc.

### Audio
1. Download from freesound.org (CC0 license)
2. Save to `/public/audio/engine-start.mp3`, `engine-idle.mp3`

See `ASSET_LOG.md` for complete asset inventory and source URLs.

## Adding a New Model

1. Add model data to `src/data/models.ts` following the `BMWModel` interface
2. Add slug to `homepageOrder` array for homepage chapter inclusion
3. Add to navbar `NAV_MODELS` or `MORE_MODELS` in `src/components/nav/Navbar.tsx`
4. Add sitemap entry in `public/sitemap.xml`
5. Place assets in `/public/models/[slug]/` and `/public/images/[slug]/`

## Project Structure

```
bmw-m-website/
├── public/
│   ├── models/[slug]/model.glb     # 3D models
│   ├── images/[slug]/              # Hero + gallery images
│   ├── audio/                      # Engine sounds
│   ├── fonts/                      # Self-hosted fonts (optional)
│   ├── robots.txt
│   ├── sitemap.xml
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── nav/                    # Navbar, MobileMenu
│   │   ├── homepage/               # LogoAssembly, ModelChapter
│   │   ├── model-page/             # HeroSection, InteractiveViewer, StatsGrid, etc.
│   │   ├── ui/                     # CustomCursor, MStripe, LoadingScreen, CountUp, Lightbox
│   │   └── three/                  # ModelViewer, HomepageScene, FallbackGeometry
│   ├── data/
│   │   └── models.ts               # Master model data — all specs, generations
│   ├── hooks/
│   │   ├── useLenis.ts             # Lenis smooth scroll init
│   │   ├── useScrollProgress.ts   # ScrollTrigger progress hook
│   │   ├── useKonami.ts           # Konami code easter egg
│   │   └── useIdleDetection.ts   # 30s idle → cinematic camera
│   ├── pages/
│   │   ├── Home.tsx               # Scroll-driven homepage
│   │   ├── ModelPage.tsx          # Individual model page
│   │   └── NotFound.tsx           # 404 burnout animation
│   ├── store/
│   │   └── index.ts               # Zustand global state
│   ├── styles/
│   │   ├── global.css             # Base styles + utilities
│   │   ├── tokens.css             # CSS custom properties
│   │   └── animations.css        # Keyframe animations
│   ├── utils/
│   │   ├── assetLoader.ts        # Asset URL helpers
│   │   └── countUp.ts            # GSAP count-up animation
│   ├── App.tsx                    # Router + global providers
│   └── main.tsx                   # Entry point + Lenis init
├── ASSET_LOG.md                   # Asset sources + licenses
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Performance Targets

- Lighthouse Performance: > 85 (desktop)
- LCP: < 2.5s
- Three.js draw calls: < 8ms/frame
- All Three.js canvases lazy-mounted via IntersectionObserver
- Code splitting: separate chunks for React, Three.js, animation libs

## Deployment

Configured for Vercel static deployment:

```bash
npm run build
# Deploy /dist to Vercel
```

Add `vercel.json` for SPA routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Easter Eggs

| Trigger | Effect |
|---------|--------|
| Konami Code (↑↑↓↓←→←→BA) | Competition Mode — 30s red theme + overdrive animations |
| Long-press model name in chapter | Nürburgring lap time overlay |
| Fast scroll (velocity > 12px/ms) | Launch control — red flash + screen shake |
| 30s idle | Cinematic camera orbit around current model |
| M1 page | "FIRST. ALWAYS." watermark behind 3D model |

## License

Fan project — not affiliated with BMW AG. All BMW, M, and related trademarks belong to BMW Group. 3D models, images, and audio assets are subject to their own licenses as documented in `ASSET_LOG.md`.

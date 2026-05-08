# BMW M Showcase — Asset Log

All external assets used in this project are documented below.

## Instructions for Asset Acquisition

The following assets are referenced but require manual download. The application includes graceful fallbacks (procedural Three.js geometry and CSS placeholder images) for all missing assets.

---

## 3D Models

| Slug | Generation | Source | URL | License | Status |
|------|-----------|--------|-----|---------|--------|
| m1 | E26 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m2-f87 | F87 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m2-g87 | G87 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m3-e30 | E30 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m3-e36 | E36 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m3-e46 | E46 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m3-e90 | E90/E92 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m3-f80 | F80 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m3-g80 | G80 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m4-f82 | F82 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m4-g82 | G82 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m5-e28 | E28 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m5-e34 | E34 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m5-e39 | E39 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m5-e60 | E60 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m5-f10 | F10 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m5-f90 | F90 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m6-e63 | E63 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m6-f12 | F12 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m8-f91 | F91 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| x5m-e70 | E70 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| x5m-f85 | F85 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| x5m-f95 | F95 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| x6m-e71 | E71 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| x6m-f96 | F96 | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| m-csl | G82 CSL | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |
| im | G90 Hybrid | Sketchfab / TurboSquid | Manual download required | Free / Licensed | Fallback active |

### Recommended 3D Model Sources

1. **Sketchfab** — sketchfab.com/tags/bmw — many free CC-licensed BMW models
2. **TurboSquid** — turbosquid.com — commercial, high quality
3. **CGTrader** — cgtrader.com — mix of free and paid
4. **Free3D** — free3d.com — free models

### Converting to GLB

If models are in .obj or .fbx format, convert with:
```bash
# Install gltf-pipeline
npm install -g gltf-pipeline

# Convert and compress with Draco
gltf-pipeline -i model.gltf -o model.glb --draco.compressionLevel 7
```

Save to: `/public/models/[slug]/model.glb`

---

## Images

| Asset | Model | Source | License | Dimensions |
|-------|-------|--------|---------|-----------|
| hero.webp | All models | BMW Press / Unsplash | CC0 / Press | 2880px+ wide |
| gallery-1.webp through gallery-6.webp | All models | BMW Press / Unsplash | CC0 / Press | 1920px+ |
| og-cover.webp | Site-wide | BMW Press | Press license | 1200x630 |
| thumb.webp | Each generation | BMW Press | Press license | 400x280 |

### Image Sources

1. **BMW Press** — press.bmwgroup.com — official BMW press images (for editorial/fan use)
2. **BMW Media Portal** — bmwgroup.com/en/mediaportal
3. **Unsplash** — unsplash.com/s/photos/bmw-m — CC0 licensed

### Converting to WebP

```bash
# Using cwebp (Google's WebP encoder)
cwebp -q 82 input.jpg -o output.webp

# Using ImageMagick
convert input.jpg -quality 82 output.webp

# Generate srcset variants
for size in 400 800 1200 2400; do
  convert input.jpg -resize ${size}x output-${size}w.webp
done
```

---

## Fonts

Self-hosted via Google Fonts CDN (loaded in index.html):

| Font | Weight | Usage | License |
|------|--------|-------|---------|
| Barlow Condensed | 400, 600, 700, 800 | Display / model names | SIL OFL |
| DM Sans | 300, 400, 500 | Body copy | SIL OFL |
| IBM Plex Mono | 400, 500, 600 | Specs / labels | SIL OFL |

To self-host: download WOFF2 files from fontsource.org and store in `/public/fonts/`

---

## Audio

| File | Description | Source | License | Notes |
|------|-------------|--------|---------|-------|
| engine-start.mp3 | BMW M engine startup sound | freesound.org | CC0 / CC-BY | Requires consent toggle |
| engine-idle.mp3 | BMW M engine idle | freesound.org | CC0 / CC-BY | Loop-ready |
| competition-mode.mp3 | Revving engine (Konami code) | freesound.org | CC0 | |

Store in: `/public/audio/`

Note: All audio requires user consent via the mute toggle in the navbar before playing.

---

## License Summary

- 3D Models: Verify individual model licenses before commercial use
- Images: BMW Press images are for editorial/non-commercial use only
- Fonts: SIL Open Font License — free for all uses
- Audio: CC0 or CC-BY as noted — attribution required for CC-BY

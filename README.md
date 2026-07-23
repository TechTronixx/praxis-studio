# Praxis Studio

Landing page for Praxis, a software engineering studio. Companies hire us to build internal tools, platforms, and the kind of software their teams use every day.

Built as a single HTML file. No build step, no dependencies beyond two CDN imports (DM Sans from Google Fonts, anime.js + Three.js from esm.sh).

## Quick start

Open `index.html` in a browser. Or serve it:

```
npx serve .
```

## Design

Black-and-white monochrome system with dark/light toggle. DM Sans typography, zero border-radius, no shadows. Greek etymology (πρᾶξις — theory into practice) woven into the copy and layout structure.

Inspired by [Radian EXR](https://www.rideradian.com/) and LOUD.

## Sections

- Hero with looping video background and character-reveal wordmark
- Stats counter strip
- Four-point features bar
- Parallax break with layered shapes and video
- Work list with cursor-following previews and case study modals
- Three.js particle network quote section
- Three-step process with hover imagery
- About with capability grid
- Six-image gallery strip
- Contact section
- Closing CTA
- Multi-column footer with ambient video

## Interactions

- Per-character wordmark rise animation (anime.js)
- Scroll-triggered reveals (IntersectionObserver)
- Count-up stats on scroll
- Magnetic text hover on wordmark
- Cursor-following thumbnail previews on work rows
- Animated modal open/close (scale + fade)
- Three-layer parallax scrolling
- Three.js particle network (nodes + connections, slowly rotating)
- Cookie consent banner with slide animation
- Respects prefers-reduced-motion throughout

## Files

| File | Purpose |
|------|---------|
| `index.html` | Full landing page (HTML + CSS + JS) |
| `cookie-policy.html` | Cookie policy page |
| `privacy-policy.html` | Privacy policy page |

## License

MIT

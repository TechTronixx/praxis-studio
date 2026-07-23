# Praxis Studio

Landing page for Praxis, a software engineering studio. Companies hire us to build internal tools, platforms, and the kind of software their teams use every day.

Single HTML file. No build step, no dependencies beyond CDN imports (DM Sans, anime.js, Three.js).

## Quick start

Open `index.html` in a browser. Or:

```
npx serve .
```

## Design

Black-and-white monochrome with dark/light toggle. DM Sans, zero border-radius, no shadows. Greek etymology (πρᾶξις, theory into practice) woven into copy and layout.

Inspired by [Radian EXR](https://www.rideradian.com/) and LOUD.

## Sections

- Hero with looping video and character-reveal wordmark
- Stats counter strip
- Four-point features bar
- Parallax break with layered shapes and ambient video
- Work list with cursor-following previews and case study modals
- Three.js particle network quote section
- Three-step process with hover imagery
- About with capability grid
- Six-image gallery strip
- Contact section
- Closing CTA
- Multi-column footer with ambient video

## Interactions

- Per-character wordmark rise (anime.js)
- Scroll-triggered reveals (IntersectionObserver)
- Count-up stats on scroll
- Magnetic text hover on wordmark
- Cursor-following previews on work rows
- Animated modal open/close (scale + fade)
- Three-layer parallax
- Three.js particle network (80 nodes, slowly rotating)
- Cookie consent banner with slide animation
- Respects prefers-reduced-motion

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main landing page |
| `legal/cookie-policy.html` | Cookie policy |
| `legal/privacy-policy.html` | Privacy policy |

## License

MIT

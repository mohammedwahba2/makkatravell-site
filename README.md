# MakkaTravel — Public site
Nuxt 4 (SSR + ISR) · UnoCSS · GSAP + Lenis · Arabic RTL · SEO (sitemap, robots, JSON-LD)

```bash
cp .env.example .env
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build (Vercel auto-detects Nuxt)
```
Data comes from the API (`NUXT_PUBLIC_API_BASE`). Pages are cached at the edge (stale-while-revalidate 2–10 min),
so admin edits appear on the site within minutes.

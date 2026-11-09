# Tactyqal Labs web (Next.js 14, App Router)
Setup: `npm install && npm run dev`, then open http://localhost:3000. Not yet run or tested.

## Real vs mock
- Real (from tactyqal.com): contact details, program phases, success-story names and blurbs, tool names, FAQ, blog titles/excerpts/dates/covers.
- DEMO: blog categories, article bodies, admin data, contact form (sends nothing), admin login (no auth). Data lives in `src/lib/api.ts` (in-memory); replace its functions with fetch() calls to the Express API.
- Brand colors and logo are PLACEHOLDERS: edit `tailwind.config.ts`.
- Testimonials, student counts and "guarantee" claims are omitted on purpose (inconsistent or unverified on the current site).

## Not built yet
Article TOC/related/share, Tiptap editor + SEO panel (/admin/posts/new, /[id]), dashboard + charts, categories, tags, media library, Framer Motion, newsletter, admin sidebar, shadcn/ui.

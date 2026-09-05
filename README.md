# StellarAdmin Website

Documentation site for the [StellarAdmin](https://www.stellaradmin.com/) components, built with [TanStack Start](https://tanstack.com/start) and [Fumadocs](https://fumadocs.dev/).

## Stack

- **TanStack Start** (Vite) — app framework, static prerendering (SSG)
- **Fumadocs** (`fumadocs-core` / `fumadocs-ui` / `fumadocs-mdx`) — docs engine + MDX content
- **Tailwind CSS v4** + **shadcn/ui** (base-ui, `base-vega` style) with the **Fumadocs shadcn theme**
- **oxlint / oxfmt** — lint & format

## Requirements

This project uses **pnpm** and blocks other package managers (`engine-strict` + `only-allow pnpm`). Install [pnpm](https://pnpm.io/) first.

```bash
pnpm install
```

## Scripts

```bash
pnpm dev          # start the dev server (http://localhost:3000)
pnpm build        # build + static prerender to .vercel/output
pnpm preview      # preview the production build
pnpm lint         # oxlint + oxfmt check
pnpm format       # oxfmt (write)
pnpm types:check  # regenerate .source types + tsc --noEmit
```

## Content

- **Docs** live in `content/docs` (the `tag-helpers` section). Navigation is driven by `meta.json` files. MDX partials under `_include/` are pulled in with `<include>` and are not standalone pages.
- **Blog** posts live in `content/blog`.
- Static component demos are served from `public/demo` and embedded via the `<Demo>` component. They are exported by `DocsSamplesGenerator` in the stellar-admin-pro repo, which injects a script into every page so demos follow the site's light/dark mode (the next-themes `theme` localStorage key) and the `<Demo>` toolbar's theme selector (`demo-theme`) — same-origin localStorage plus storage events, no iframe messaging. All theme bundles ship under stable names in `public/demo/tag-helpers/assets/`.

## Notes

- OG image generation (the old Next.js `/og/docs/...` route) is not yet ported; it needs a satori/takumi-based renderer on TanStack Start and is tracked as a follow-up.

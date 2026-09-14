# Inline component examples

Reusable embedding code retained from the homepage experiment. No website route currently imports it. The experimental `/examples/inline-components` route has been removed; the existing homepage and documentation embeds are unchanged.

When adopted by a page, the wrapper renders real StellarAdmin HTML directly into React's server-rendered output. One shared browser script activates the components after hydration. The examples use the existing Observatory theme, with its styles scoped to `.sa-inline-example`.

Import the wrapper and link its stylesheet in the consuming TanStack route's `head`:

```tsx
import { InlineExample } from "@/components/inline-example/inline-example";
import exampleCss from "@/components/inline-example/generated/observatory.css?url";

// In the route's head function, alongside any existing metadata and links:
links: [{ rel: "stylesheet", href: exampleCss }];

// In the page component:
<InlineExample name="collapsible" instanceId="hero-bookings" />
<InlineExample name="dialog" instanceId="traveler-profile" />
```

Each placement needs a unique `instanceId`. The wrapper applies that prefix to the generated IDs and their references, so two copies of a component operate independently. React owns the surrounding layout; StellarAdmin owns the HTML inside the wrapper. The dialog's Save Changes button closes the preview without persisting data.

Read these files in order:

1. [`inline-example.tsx`](inline-example.tsx) — HTML imports, deterministic IDs, shared runtime loading, and modal cleanup on navigation.
2. [`generated/collapsible.html`](generated/collapsible.html) — the actual HTML inserted into the page. `sel-collapsible` and `commandfor` provide the behavior; there is no React click handler implementing the component.
3. [`../../../scripts/export-inline-example.mjs`](../../../scripts/export-inline-example.mjs) — the temporary export adapter that produces the HTML, asset manifest and scoped CSS.

The files in `generated/` are checked in, so ordinary website builds need no .NET checkout. Export is manual, not part of `pnpm build`. After refreshing documentation exports, run this from `website/` to refresh the fragments and any changed runtime filename:

```bash
pnpm examples:export
```

The exporter reads `public/demo/tag-helpers/*-intro.html` and the exported Observatory bundle. It removes the sample page wrappers, prefixes IDs, substitutes a local preview image and adapts the compiled CSS. It uses parse5 for HTML and PostCSS for CSS; it never edits the original docs exports. The website's Tailwind build discovers layout utilities in the generated HTML. The stylesheet is linked through the route's `head`, and the runtime URL comes from the generated asset manifest, so it is not hard-coded in the wrapper.

This exporter covers the two selected examples and one theme. It is not a general-purpose fragment exporter for all components: additional ID-reference forms, custom scripts, themes and overlays need review. For the eventual homepage, export curated fragments directly from the Razor sample pipeline. Keep the public NuGet stylesheet consumption model unchanged. The complete scoped theme is retained here for clarity; CSS size can be optimized once the homepage component selection is settled.

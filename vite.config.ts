import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  server: {
    port: 3000,
  },
  build: {
    // Docs-page MDX chunks (the sidebar page especially) minify large but
    // gzip small; the default 500 kB threshold only produces noise here.
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      checks: {
        // Rolldown's build-profiling diagnostic always fires because the
        // Tailwind transform dominates this (fast) build.
        pluginTimings: false,
      },
    },
  },
  // `tslib` ships a `modules/index.js` indirection (used by the `import`+`node`
  // export condition) that re-imports the CJS `tslib.js` as a default import.
  // Once bundled, that default is `undefined`, so destructuring helpers like
  // `__extends` throws at runtime — crashing SSR/prerender on Vercel with a 500.
  // Alias tslib to its clean ESM build (proper named + default exports) and
  // inline it everywhere so no environment can fall back to the broken path.
  ssr: {
    noExternal: ["tslib"],
  },
  plugins: [
    mdx(),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        // Some docs cross-reference each other with relative links that resolve
        // to non-existent nested paths (e.g. `.../popover/tooltip`). Don't abort
        // the static build when the crawler hits one of those 404s.
        failOnError: false,
      },
    }),
    react(),
    // please see https://tanstack.com/start/latest/docs/framework/react/guide/hosting#nitro for guides on hosting
    nitro({
      // The deploy target only matters for builds; leaving it unset in dev
      // skips the vercel-dev env emulation and its VERCEL_OIDC_TOKEN nag.
      preset: command === "build" ? "vercel" : undefined,
      // Bundle tslib into the server instead of leaving a runtime `import
      // "tslib"`. Externalized, it would resolve via the package's export map to
      // the broken `modules/index.js` indirection at runtime; inlined (with the
      // alias below) it uses the clean ESM build. See the `ssr.noExternal` note.
      noExternals: ["tslib"],
    }),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      // Explicit `@` alias so imports from MDX content files (outside the
      // tsconfig include scope, where tsconfigPaths does not apply) resolve too.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // See the `ssr.noExternal` note above — force the clean ESM tslib build.
      tslib: "tslib/tslib.es6.mjs",
    },
  },
}));

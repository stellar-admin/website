import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
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
      preset: "vercel",
    }),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      // Explicit `@` alias so imports from MDX content files (outside the
      // tsconfig include scope, where tsconfigPaths does not apply) resolve too.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

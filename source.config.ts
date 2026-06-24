import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
    // `_include` files are MDX partials pulled in via <include>, not pages.
    // fumadocs-mdx's Vite codegen mangles `!` negation patterns (it prepends
    // "./", breaking import.meta.glob negation), so we exclude the partials with
    // positive, depth-scoped globs instead. Real docs live at
    // `tag-helpers/*.mdx` and `tag-helpers/components/*.mdx`; the `_include`
    // partials sit one level deeper and are therefore never matched.
    files: ["*/*.{md,mdx}", "*/*/*.{md,mdx}"],
  },
  meta: {
    schema: metaSchema,
  },
});

export const blogPosts = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: frontmatterSchema.extend({
    author: z.string(),
    date: z.iso.date().or(z.date()),
  }),
});

export default defineConfig();

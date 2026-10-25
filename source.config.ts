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
    // `ui/*.mdx` and `ui/components/*.mdx`; the `_include`
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

// Flags a page whose content starts with text instead of a heading, so the page can add an
// "On this page" entry that jumps back to the top. A page that starts with a heading already has one.
function remarkHasIntro() {
  return (
    root: { children: { type: string }[] },
    file: { data: Record<string, unknown> },
  ) => {
    const first = root.children.find(
      (node) => node.type !== "yaml" && node.type !== "mdxjsEsm",
    );
    file.data.hasIntro = first !== undefined && first.type !== "heading";
  };
}

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkHasIntro],
    valueToExport: ["hasIntro"],
  },
});

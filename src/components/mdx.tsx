import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Check, X } from "lucide-react";
import type { MDXComponents } from "mdx/types";
import { Demo } from "@/components/demo";

// A tick or cross for yes/no table cells, with the word kept for screen readers.
function Yes() {
  return (
    <span className="inline-flex align-middle text-emerald-600 dark:text-emerald-400">
      <Check aria-hidden="true" className="size-4" />
      <span className="sr-only">Yes</span>
    </span>
  );
}

function No() {
  return (
    <span className="inline-flex align-middle text-fd-muted-foreground">
      <X aria-hidden="true" className="size-4" />
      <span className="sr-only">No</span>
    </span>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Demo,
    No,
    TypeTable,
    Yes,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}

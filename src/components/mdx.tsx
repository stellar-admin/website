import { ImageZoom } from "fumadocs-ui/components/image-zoom";
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

// A screenshot with a light and a dark version, showing the one for the site's current theme. Clicking it
// zooms in.
function ThemedImage({
  alt,
  dark,
  height,
  light,
  width,
}: {
  alt: string;
  dark: string;
  height: number;
  light: string;
  width: number;
}) {
  return (
    <>
      <div className="dark:hidden">
        <ImageZoom
          alt={alt}
          className="rounded-lg border"
          height={height}
          src={light}
          width={width}
        />
      </div>
      <div className="hidden dark:block">
        <ImageZoom
          alt={alt}
          className="rounded-lg border"
          height={height}
          src={dark}
          width={width}
        />
      </div>
    </>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Demo,
    No,
    ThemedImage,
    TypeTable,
    Yes,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}

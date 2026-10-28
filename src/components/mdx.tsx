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

type CaptureSize = { height: number; width: number };

// The size of each admin panel screenshot the product's docs generator captured, by name. Empty until the
// generator first writes it.
const captureSizes: Record<string, CaptureSize> =
  Object.values(
    import.meta.glob<Record<string, CaptureSize>>(
      "/src/generated/captures.json",
      {
        eager: true,
        import: "default",
      },
    ),
  )[0] ?? {};

// The part of an image name for a variant, as the generator makes it: "Wordmark only" is wordmark-only.
function variantSlug(variant: string) {
  return variant
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// One captured screenshot, with its {name}-dark version in dark mode when there is one. Until it's
// captured, development shows what to capture, and production shows nothing.
function CaptureImage({
  alt,
  name,
  todo,
}: {
  alt: string;
  name: string;
  todo?: string;
}) {
  const light = captureSizes[name];
  if (!light) {
    return import.meta.env.DEV ? (
      <div className="my-4 rounded-lg border-2 border-dashed p-4 text-sm text-fd-muted-foreground">
        <p className="m-0 font-medium">Screenshot not captured yet: {name}</p>
        {todo && <p className="m-0 mt-1">{todo}</p>}
      </div>
    ) : null;
  }

  const darkName = captureSizes[`${name}-dark`] ? `${name}-dark` : name;
  const dark = captureSizes[darkName];
  return (
    <>
      <div className="dark:hidden">
        <ImageZoom
          alt={alt}
          className="h-auto max-w-full rounded-lg border"
          height={light.height}
          src={`/images/admin/generated/${name}.png`}
          width={light.width}
        />
      </div>
      <div className="hidden dark:block">
        <ImageZoom
          alt={alt}
          className="h-auto max-w-full rounded-lg border"
          height={dark.height}
          src={`/images/admin/generated/${darkName}.png`}
          width={dark.width}
        />
      </div>
    </>
  );
}

// An admin panel screenshot that a capture spec in the product's docs generator saves as {name}.png. todo
// says what to capture, for the spec's author. With variants, it shows {name}-{variant} for each variant,
// side by side, with the variant as the caption.
function Capture({
  alt,
  name,
  todo,
  variants,
}: {
  alt: string;
  name: string;
  todo?: string;
  variants?: string[];
}) {
  if (!variants) {
    return <CaptureImage alt={alt} name={name} todo={todo} />;
  }

  // Two or three side by side; four as two rows of two
  const columns = variants.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div className={`not-prose my-6 grid items-end gap-x-4 gap-y-6 ${columns}`}>
      {variants.map((variant) => (
        <figure key={variant}>
          <CaptureImage
            alt={`${alt}: ${variant}`}
            name={`${name}-${variantSlug(variant)}`}
            todo={todo}
          />
          <figcaption className="mt-2 text-center text-sm text-fd-muted-foreground">
            {variant}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Capture,
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

import { createFileRoute } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KnobControl } from "@/components/theme-builder/knob-control";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { baseOptions, homeLinks } from "@/lib/layout.shared";
import {
  cleanValues,
  decodeHash,
  encodeHash,
  googleFontsHref,
  type KnobManifest,
  type KnobValues,
  loadManifest,
  parseThemeCss,
  themeCss,
  webFonts,
} from "@/lib/theme-builder/knobs";
import {
  defaultPreset,
  loadPresetValues,
  usePresets,
} from "@/lib/theme-presets";
import { cn } from "@/lib/utils";

// Docs exports that together use every knob: the component spectrum, an admin page, a settings
// form, every overlay open at once, and the component studies.
const previewPages = [
  { value: "showcase-theme-showcase", label: "Showcase" },
  { value: "showcase-admin-shell", label: "Admin page" },
  { value: "showcase-forms", label: "Forms" },
  { value: "showcase-overlays", label: "Overlays" },
  { value: "showcase-masonry", label: "Studies" },
];

export const Route = createFileRoute("/theme-builder")({
  component: ThemeBuilder,
  head: () => ({
    meta: [
      { title: "Theme builder - StellarAdmin" },
      {
        name: "description",
        content:
          "Start from a preset, adjust the theme knobs against real StellarAdmin components, and download a theme file for your app.",
      },
    ],
  }),
});

type Mode = "light" | "dark";
type View = "simple" | "advanced";

const viewStorageKey = "theme-builder-view";

function ThemeBuilder() {
  const [manifest, setManifest] = useState<KnobManifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<KnobValues>({});
  const [seed, setSeed] = useState<string | null>(defaultPreset);
  const presets = usePresets();
  const seedItems = (presets ?? []).map((preset) => ({
    value: preset.name,
    label: preset.label,
  }));
  const [mode, setMode] = useState<Mode>("light");
  const [view, setViewState] = useState<View>("simple");
  const [page, setPage] = useState(previewPages[0].value);

  // The view is the reader's preference, not part of the theme, so it stays out of the URL.
  useEffect(() => {
    try {
      if (localStorage.getItem(viewStorageKey) === "advanced")
        setViewState("advanced");
    } catch {
      // Storage unavailable: stay on simple.
    }
  }, []);

  const setView = (next: View) => {
    setViewState(next);
    try {
      localStorage.setItem(viewStorageKey, next);
    } catch {
      // Not persistable; the view still changes.
    }
  };

  useEffect(() => {
    loadManifest()
      .then((loaded) => {
        const fromHash = decodeHash(loaded, location.hash);
        if (fromHash) {
          setValues(fromHash);
          setSeed(null);
        }
        setMode(
          document.documentElement.classList.contains("dark")
            ? "dark"
            : "light",
        );
        setManifest(loaded);
      })
      .catch((e: unknown) => setError(String(e)));
  }, []);

  const theme = useMemo(
    () => (manifest ? cleanValues(manifest, values) : {}),
    [manifest, values],
  );
  const hash = encodeHash(theme);

  // The URL carries the theme, so a link reproduces it. Replace, so editing adds no history.
  useEffect(() => {
    if (!manifest) return;
    history.replaceState(
      null,
      "",
      `${location.pathname}${location.search}${hash ? `#${hash}` : ""}`,
    );
  }, [manifest, hash]);

  const setKnob = useCallback((name: string, value: string | undefined) => {
    setValues((current) => {
      const next = { ...current };
      if (value === undefined) delete next[name];
      else next[name] = value;
      return next;
    });
  }, []);

  const applySeed = (name: string) => {
    if (!manifest) return;
    setSeed(name);
    // Values equal to a default are dropped (parseThemeCss cleans them), so they do not show as changed.
    loadPresetValues(manifest, name)
      .then(setValues)
      .catch((e: unknown) => setError(String(e)));
  };

  return (
    <HomeLayout {...baseOptions()} links={homeLinks}>
      <main className="grid flex-1 grid-cols-1 lg:grid-cols-[24rem_1fr]">
        <aside className="flex flex-col border-b lg:sticky lg:top-14 lg:h-[calc(100dvh-3.5rem)] lg:border-r lg:border-b-0">
          <div className="flex flex-col gap-3 border-b p-4">
            <div>
              <h1 className="text-lg font-semibold">Theme builder</h1>
              <p className="text-muted-foreground text-sm">
                Start from a preset, adjust the knobs, and download a theme file
                to link after <code>stellar-admin.css</code>.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                items={seedItems}
                value={seed}
                onValueChange={(next) => {
                  if (typeof next === "string") applySeed(next);
                }}
              >
                <SelectTrigger
                  size="sm"
                  aria-label="Start from"
                  className="min-w-36 text-sm"
                >
                  <SelectValue placeholder="Start from…" />
                </SelectTrigger>
                <SelectContent>
                  {seedItems.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Segmented
                label="Preview mode"
                options={["light", "dark"] as const}
                value={mode}
                onChange={setMode}
              />
            </div>
            <Select
              items={previewPages}
              value={page}
              onValueChange={(next) => {
                if (typeof next === "string") setPage(next);
              }}
            >
              <SelectTrigger
                size="sm"
                aria-label="Preview page"
                className="min-w-36 text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {previewPages.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Segmented
              label="Controls"
              options={["simple", "advanced"] as const}
              value={view}
              onChange={setView}
            />
            {seed && (
              <p className="text-muted-foreground text-xs">
                {presets?.find((s) => s.name === seed)?.description}
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-4">
            {error && (
              <p className="text-destructive py-4 text-sm">
                Could not load the knobs: {error}
              </p>
            )}
            {!manifest && !error && (
              <p className="text-muted-foreground py-4 text-sm">Loading…</p>
            )}
            {manifest && view === "simple" && (
              <SimpleControls
                manifest={manifest}
                values={values}
                theme={theme}
                setKnob={setKnob}
                onShowAll={() => setView("advanced")}
              />
            )}
            {manifest &&
              view === "advanced" &&
              manifest.groups.map((group) => (
                <details
                  key={group.id}
                  open
                  className="border-b py-2 last:border-b-0"
                >
                  <summary className="cursor-pointer py-1 text-sm font-semibold">
                    {group.label}
                  </summary>
                  <div className="divide-y">
                    {manifest.knobs
                      .filter((knob) => knob.group === group.id)
                      .map((knob) => (
                        <KnobControl
                          key={knob.name}
                          knob={knob}
                          value={values[knob.name]}
                          onChange={(value) => setKnob(knob.name, value)}
                        />
                      ))}
                  </div>
                </details>
              ))}
            {manifest && (
              <ExportPanel
                manifest={manifest}
                theme={theme}
                hash={hash}
                onImport={(imported) => {
                  setValues(imported);
                  setSeed(null);
                }}
              />
            )}
          </div>
        </aside>

        <Preview
          src={`/demo/tag-helpers/${page}.html`}
          manifest={manifest}
          theme={theme}
          mode={mode}
        />
      </main>
    </HomeLayout>
  );
}

/** The essential knobs only, without their explanations; the preview, link and export still carry
 *  every knob, and a note says how many changed knobs only the advanced view shows. */
function SimpleControls({
  manifest,
  values,
  theme,
  setKnob,
  onShowAll,
}: {
  manifest: KnobManifest;
  values: KnobValues;
  theme: KnobValues;
  setKnob: (name: string, value: string | undefined) => void;
  onShowAll: () => void;
}) {
  const essential = manifest.knobs.filter((knob) => knob.essential);
  const hidden = Object.keys(theme).filter(
    (name) => !essential.some((knob) => knob.name === name),
  ).length;

  return (
    <div className="py-2">
      {hidden > 0 && (
        <p className="bg-muted text-muted-foreground my-2 rounded-md p-2 text-xs">
          This theme also changes {hidden} {hidden === 1 ? "knob" : "knobs"}{" "}
          that only the advanced controls show.{" "}
          <button
            type="button"
            className="text-foreground underline"
            onClick={onShowAll}
          >
            Show all
          </button>
        </p>
      )}
      <div className="divide-y">
        {essential.map((knob) => (
          <KnobControl
            key={knob.name}
            knob={knob}
            value={values[knob.name]}
            onChange={(value) => setKnob(knob.name, value)}
            compact
          />
        ))}
      </div>
    </div>
  );
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div
      className="flex w-fit rounded-md border"
      role="group"
      aria-label={label}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          className={cn(
            "h-8 px-3 text-sm capitalize first:rounded-l-md last:rounded-r-md",
            value === option
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground",
          )}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

/** A docs export, with every knob written onto its root so a preset the reader picked for the docs
 *  demos (the page links it from localStorage) cannot show through. */
function Preview({
  src,
  manifest,
  theme,
  mode,
}: {
  src: string;
  manifest: KnobManifest | null;
  theme: KnobValues;
  mode: Mode;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loads, setLoads] = useState(0);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onLoad = () => setLoads((n) => n + 1);
    iframe.addEventListener("load", onLoad);
    if (
      iframe.contentDocument?.readyState === "complete" &&
      iframe.contentDocument.URL !== "about:blank"
    )
      onLoad();
    return () => iframe.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!manifest || !doc || loads === 0) return;
    const root = doc.documentElement;

    for (const knob of manifest.knobs) {
      // "initial" leaves an optional knob unset: its var() fallback applies.
      root.style.setProperty(
        knob.name,
        theme[knob.name] ?? knob.default ?? "initial",
      );
    }

    const href = googleFontsHref(webFonts(manifest, theme));
    let fonts = doc.querySelector<HTMLLinkElement>("link#theme-builder-fonts");
    if (href && !fonts) {
      fonts = doc.createElement("link");
      fonts.id = "theme-builder-fonts";
      fonts.rel = "stylesheet";
      doc.head.append(fonts);
    }
    if (fonts && href && fonts.getAttribute("href") !== href) fonts.href = href;

    // The page follows the site's light/dark setting on its own; keep the builder's choice.
    const applyMode = () => {
      const dark = mode === "dark";
      if (root.classList.contains("dark") !== dark)
        root.classList.toggle("dark", dark);
      root.style.colorScheme = mode;
    };
    applyMode();
    const observer = new MutationObserver(applyMode);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [manifest, theme, mode, loads]);

  return (
    // Above the controls on narrow screens, pinned, so each change shows while scrolling them.
    <div className="bg-background sticky top-14 z-10 order-first h-[45dvh] min-w-0 border-b lg:order-none lg:h-[calc(100dvh-3.5rem)] lg:border-b-0">
      <iframe
        ref={iframeRef}
        src={src}
        title="Theme preview"
        className="h-full w-full"
      />
    </div>
  );
}

function ExportPanel({
  manifest,
  theme,
  hash,
  onImport,
}: {
  manifest: KnobManifest;
  theme: KnobValues;
  hash: string;
  onImport: (values: KnobValues) => void;
}) {
  const [fontImport, setFontImport] = useState(true);
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState("");
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const builderUrl = `${typeof location === "undefined" ? "" : location.origin}/theme-builder${hash ? `#${hash}` : ""}`;
  const css = themeCss(manifest, theme, { builderUrl, fontImport });
  const count = Object.keys(theme).length;

  const copy = async () => {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([css], { type: "text/css" }));
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: "theme.css",
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  const applyImport = () => {
    // A builder link carries the theme in its hash; anything else is read as a theme file.
    const at = importText.indexOf("#v1:");
    const imported =
      at >= 0
        ? decodeHash(manifest, importText.slice(at).trim().split(/\s/)[0])
        : null;
    const values = imported ?? parseThemeCss(manifest, importText);
    onImport(values);
    setImportMessage(`Read ${Object.keys(values).length} knobs.`);
  };

  return (
    <section className="flex flex-col gap-3 border-t py-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Your theme</h2>
        <span className="text-muted-foreground text-xs">
          {count} {count === 1 ? "knob" : "knobs"} changed
        </span>
      </div>
      <pre className="bg-muted max-h-64 overflow-auto rounded-md p-3 text-xs">
        {css}
      </pre>
      <label className="text-muted-foreground flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={fontImport}
          onChange={(e) => setFontImport(e.target.checked)}
        />
        Import the chosen web fonts from Google Fonts
      </label>
      <div className="flex gap-2">
        <Button size="sm" onClick={copy}>
          {copied ? "Copied" : "Copy CSS"}
        </Button>
        <Button size="sm" variant="outline" onClick={download}>
          Download theme.css
        </Button>
      </div>
      <div className="text-muted-foreground flex flex-col gap-1.5 text-xs">
        <p>
          Save it as <code>wwwroot/css/theme.css</code> and link it after{" "}
          <code>stellar-admin.css</code>:
        </p>
        <pre className="bg-muted overflow-auto rounded-md p-2">{`<link rel="stylesheet" href="~/css/theme.css" />`}</pre>
        <p>With the Dashboard, add it as a stylesheet:</p>
        <pre className="bg-muted overflow-auto rounded-md p-2">{`dashboard.AddStylesheet("~/css/theme.css");`}</pre>
      </div>
      <details className="text-sm">
        <summary className="cursor-pointer font-semibold">
          Import a theme
        </summary>
        <div className="flex flex-col gap-2 pt-2">
          <textarea
            aria-label="Theme file or builder link"
            className="border-input min-h-28 rounded-md border bg-transparent p-2 font-mono text-xs"
            placeholder="Paste a theme.css or a builder link"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={applyImport}
              disabled={!importText.trim()}
            >
              Import
            </Button>
            {importMessage && (
              <span className="text-muted-foreground text-xs">
                {importMessage}
              </span>
            )}
          </div>
        </div>
      </details>
    </section>
  );
}

// The knob manifest the DocsSamplesGenerator exports with the demos (from the library's
// Client/css/knobs.json), and the theme file format the builder reads and writes.

export const manifestUrl = "/demo/tag-helpers/assets/stellar-admin.knobs.json";

export type KnobType =
  | "color"
  | "number"
  | "length"
  | "choice"
  | "font"
  | "switch";

export interface KnobChoice {
  label: string;
  value: string;
  /** Google Fonts family parameter, for font choices that are web fonts. */
  google?: string;
}

export interface Knob {
  name: string;
  group: string;
  label: string;
  meaning: string;
  type: KnobType;
  /** One of the few knobs shown first (the builder's simple view). */
  essential?: boolean;
  default?: string;
  optional?: boolean;
  follows?: string;
  initial?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  named?: KnobChoice[];
  choices?: KnobChoice[];
}

export interface KnobManifest {
  version: number;
  groups: { id: string; label: string }[];
  knobs: Knob[];
}

/** Knob values that differ from the library defaults, by knob name. */
export type KnobValues = Record<string, string>;

export async function loadManifest(): Promise<KnobManifest> {
  const response = await fetch(manifestUrl);
  if (!response.ok) throw new Error(`${manifestUrl}: ${response.status}`);
  return response.json();
}

const normalize = (value: string) => value.replace(/\s+/g, " ").trim();

/** Drops unknown knobs and values equal to the default. */
export function cleanValues(
  manifest: KnobManifest,
  values: KnobValues,
): KnobValues {
  const result: KnobValues = {};
  for (const knob of manifest.knobs) {
    const value = values[knob.name];
    if (value === undefined) continue;
    const normalized = normalize(value);
    if (normalized === "" || normalized === knob.default) continue;
    result[knob.name] = normalized;
  }
  return result;
}

// --- URL hash: v1: then name=value pairs, names without the --sa- prefix ----------------------

const hashPrefix = "v1:";

export function encodeHash(values: KnobValues): string {
  const pairs = Object.entries(values).map(
    ([name, value]) =>
      `${name.replace(/^--sa-/, "")}=${encodeURIComponent(value)}`,
  );
  return pairs.length ? hashPrefix + pairs.join("&") : "";
}

/** Reads a hash written by encodeHash; unknown or removed knobs are ignored. */
export function decodeHash(
  manifest: KnobManifest,
  hash: string,
): KnobValues | null {
  const text = hash.replace(/^#/, "");
  if (!text.startsWith(hashPrefix)) return null;
  const values: KnobValues = {};
  for (const pair of text.slice(hashPrefix.length).split("&")) {
    const at = pair.indexOf("=");
    if (at <= 0) continue;
    try {
      values[`--sa-${pair.slice(0, at)}`] = decodeURIComponent(
        pair.slice(at + 1),
      );
    } catch {
      // A malformed value: skip that knob.
    }
  }
  return cleanValues(manifest, values);
}

// --- Theme file -----------------------------------------------------------------------------

/** Web fonts the values choose, as Google Fonts family parameters. */
export function webFonts(manifest: KnobManifest, values: KnobValues): string[] {
  const families = new Set<string>();
  for (const knob of manifest.knobs) {
    if (knob.type !== "font") continue;
    const value = values[knob.name] ?? knob.default;
    const google = knob.choices?.find(
      (choice) => choice.value === value,
    )?.google;
    if (google) families.add(google);
  }
  return [...families];
}

export function googleFontsHref(families: string[]): string | null {
  if (!families.length) return null;
  return `https://fonts.googleapis.com/css2?${families.map((family) => `family=${family}`).join("&")}&display=swap`;
}

export function themeCss(
  manifest: KnobManifest,
  values: KnobValues,
  { builderUrl, fontImport }: { builderUrl: string; fontImport: boolean },
): string {
  const lines = [
    `/* StellarAdmin theme. Link it after stellar-admin.css. Builder: ${builderUrl} */`,
  ];
  // Only fonts the theme changes: the default font is the app's to load, as without a theme.
  const changedFonts = manifest.knobs.some(
    (knob) => knob.type === "font" && values[knob.name],
  );
  const href =
    fontImport && changedFonts
      ? googleFontsHref(webFonts(manifest, values))
      : null;
  if (href) lines.push(`@import url("${href}");`);
  lines.push("@layer sa.theme {", "  :root {");
  for (const knob of manifest.knobs) {
    if (values[knob.name] !== undefined)
      lines.push(`    ${knob.name}: ${values[knob.name]};`);
  }
  lines.push("  }", "}");
  return lines.join("\n") + "\n";
}

/** Reads the knobs out of a theme file (or any CSS); other declarations are ignored. */
export function parseThemeCss(manifest: KnobManifest, css: string): KnobValues {
  const values: KnobValues = {};
  const text = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const match of text.matchAll(/(--sa-[\w-]+)\s*:\s*([^;}]+)/g))
    values[match[1]] = match[2];
  return cleanValues(manifest, values);
}

// --- Numbers and colours for the controls ----------------------------------------------------

/** The number in a length or number value, when it uses the control's unit. */
export function numericValue(knob: Knob, value: string): number | null {
  const unit = knob.type === "length" ? (knob.unit ?? "") : "";
  const match = new RegExp(`^(-?\\d*\\.?\\d+)${unit}$`).exec(value.trim());
  return match ? Number(match[1]) : null;
}

export function formatNumber(knob: Knob, n: number): string {
  const decimals = (String(knob.step ?? 1).split(".")[1] ?? "").length;
  const text = String(Number(n.toFixed(decimals)));
  return knob.type === "length" ? `${text}${knob.unit ?? ""}` : text;
}

let colorContext: CanvasRenderingContext2D | null = null;

/** A CSS colour as #rrggbb for the colour input; null when the value is not a plain colour. */
export function toHex(value: string): string | null {
  if (typeof document === "undefined") return null;
  if (!CSS.supports("color", value)) return null;
  colorContext ??= Object.assign(document.createElement("canvas"), {
    width: 1,
    height: 1,
  }).getContext("2d", {
    willReadFrequently: true,
  });
  if (!colorContext) return null;
  colorContext.clearRect(0, 0, 1, 1);
  colorContext.fillStyle = "#000";
  colorContext.fillStyle = value;
  colorContext.fillRect(0, 0, 1, 1);
  const [r, g, b] = colorContext.getImageData(0, 0, 1, 1).data;
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

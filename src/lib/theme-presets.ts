import { useEffect, useState } from "react";
import {
  type KnobManifest,
  type KnobValues,
  parseThemeCss,
} from "@/lib/theme-builder/knobs";

// The themes the docs theme picker and the theme builder offer, exported by the DocsSamplesGenerator
// from the product's theme fixtures (util/theme-check/presets/): presets.json lists them, default
// first, and each other theme is a knob file beside it.
const presetsFolder = "/demo/tag-helpers/assets/presets";

export const defaultPreset = "default";

export interface ThemePreset {
  name: string;
  label: string;
  description: string;
}

let presets: Promise<ThemePreset[]> | null = null;

async function fetchPresets(): Promise<ThemePreset[]> {
  const response = await fetch(`${presetsFolder}/presets.json`);
  if (!response.ok) throw new Error(`presets.json: ${response.status}`);
  return response.json();
}

export function loadPresets(): Promise<ThemePreset[]> {
  presets ??= fetchPresets();
  // A failed load is retried next time.
  presets.catch(() => (presets = null));
  return presets;
}

/** The presets once loaded; null until then or when they cannot be loaded. */
export function usePresets(): ThemePreset[] | null {
  const [list, setList] = useState<ThemePreset[] | null>(null);
  useEffect(() => {
    let current = true;
    loadPresets()
      .then((loaded) => current && setList(loaded))
      .catch(() => {
        // Callers fall back to the default theme alone.
      });
    return () => {
      current = false;
    };
  }, []);
  return list;
}

/** A preset's knob values; the default theme has none. */
export async function loadPresetValues(
  manifest: KnobManifest,
  name: string,
): Promise<KnobValues> {
  if (name === defaultPreset) return {};
  const response = await fetch(`${presetsFolder}/${name}.css`);
  if (!response.ok) throw new Error(`${name}.css: ${response.status}`);
  return parseThemeCss(manifest, await response.text());
}

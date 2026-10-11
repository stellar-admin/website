import type { KnobValues } from "./knobs";

// Starting points for the builder, the only place the library's former presets live as presets.
// The product keeps the same values as theme fixtures (util/theme-check/presets/ in the product
// repository) for its theme checks and the docs theme picker.
export interface ThemeSeed {
  id: string;
  label: string;
  description: string;
  values: KnobValues;
}

export const themeSeeds: ThemeSeed[] = [
  {
    id: "default",
    label: "Default",
    description: "The library default.",
    values: {},
  },
  {
    id: "ledger",
    label: "Ledger",
    description:
      "Warm paper, an indigo accent, roomier controls and tactile buttons.",
    values: {
      "--sa-accent": "oklch(0.48 0.18 262)",
      "--sa-danger": "oklch(0.55 0.2 27)",
      "--sa-neutral-hue": "80",
      "--sa-neutral-chroma": "0.012",
      "--sa-neutral-hue-dark": "262",
      "--sa-neutral-chroma-dark": "0.022",
      "--sa-accent-tint": "0",
      "--sa-radius": "6px",
      "--sa-outlines": "1",
      "--sa-pills": "0",
      "--sa-elevation": "1",
      "--sa-density": "1.125",
      "--sa-font-sans": '"Lexend", system-ui, sans-serif',
      "--sa-weight-heading": "600",
      "--sa-section-label-transform": "uppercase",
      "--sa-section-label-tracking": "0.07em",
      "--sa-footer-fill": "0",
      "--sa-column-head-label": "1",
      "--sa-column-head-fill": "1",
      "--sa-column-head-case": "var(--sa-section-label-transform)",
      "--sa-relief": "2",
      "--sa-solid-destructive": "1",
      "--sa-link-decoration": "underline",
      "--sa-focus-width": "3px",
      "--sa-focus-color":
        "color-mix(in oklab, var(--sa-color-accent) 35%, transparent)",
      "--sa-surface-depth": "0.6",
      "--sa-section-label-text": "var(--sa-text-xs)",
    },
  },
  {
    id: "ops",
    label: "Ops",
    description:
      "Dense and sharp, with strong lines and a safety-orange accent.",
    values: {
      "--sa-accent": "oklch(0.66 0.18 48)",
      "--sa-neutral-hue": "250",
      "--sa-neutral-chroma": "0.015",
      "--sa-accent-tint": "0.2",
      "--sa-surface-depth": "0.8",
      "--sa-line-strength": "1.4",
      "--sa-radius": "3px",
      "--sa-outlines": "1",
      "--sa-pills": "0",
      "--sa-radius-outer": "4px",
      "--sa-elevation": "0.5",
      "--sa-density": "0.78",
      "--sa-focus-width": "2px",
      "--sa-focus-offset": "2px",
      "--sa-font-sans": '"IBM Plex Sans", system-ui, sans-serif',
      "--sa-column-head-label": "1",
      "--sa-column-head-fill": "1",
      "--sa-current-page-fill": "1",
      "--sa-relief": "0",
      "--sa-sheen": "0",
      "--sa-solid-destructive": "0",
      "--sa-section-label-text": "var(--sa-text-xs)",
      "--sa-footer-fill": "1",
    },
  },
  {
    id: "soft",
    label: "Soft",
    description:
      "Pill controls, roomy spacing, floating surfaces and a violet accent.",
    values: {
      "--sa-accent": "oklch(0.56 0.2 295)",
      "--sa-neutral-hue": "295",
      "--sa-neutral-chroma": "0.012",
      "--sa-accent-tint": "0.7",
      "--sa-surface-depth": "0.9",
      "--sa-nav-tint": "0.15",
      "--sa-line-strength": "0.7",
      "--sa-radius": "9999px",
      "--sa-radius-outer": "1.375rem",
      "--sa-elevation": "1.8",
      "--sa-density": "1.15",
      "--sa-font-sans": '"Figtree", system-ui, sans-serif',
      "--sa-footer-fill": "0",
      "--sa-footer-rule": "0",
      "--sa-current-page-fill": "0.15",
      "--sa-pills": "1",
      "--sa-outlines": "0",
      "--sa-relief": "0",
      "--sa-sheen": "0",
      "--sa-solid-destructive": "0",
      "--sa-section-label-text": "var(--sa-text-xs)",
      "--sa-column-head-fill": "0",
    },
  },
];

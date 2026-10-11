import { useCallback, useEffect, useState } from "react";

// Keep in sync with the presets the DocsSamplesGenerator exports into
// public/demo/tag-helpers/assets/presets/ (taken there from the product's theme fixtures,
// util/theme-check/presets/, the former library presets).
// "default" is the library's stylesheet alone, with no preset.
export const demoThemes = ["default", "ledger", "ops", "soft"] as const;

export type DemoTheme = (typeof demoThemes)[number];

const defaultTheme: DemoTheme = "default";
const storageKey = "demo-theme";
const changeEvent = "demo-theme-change";

function readDemoTheme(): DemoTheme {
  try {
    const stored = localStorage.getItem(storageKey);
    const known = demoThemes.find((theme) => theme === stored);
    if (known) return known;
  } catch {
    // localStorage unavailable — fall through to the default.
  }
  return defaultTheme;
}

/**
 * The reader's demo theme choice, persisted in localStorage. The demo pages react to
 * the key themselves (via the script the generator injects, using the storage event —
 * which only fires in _other_ browsing contexts such as the demo iframes), so setting
 * the theme here needs no direct communication with them. The custom window event
 * keeps other selectors in the same document in sync.
 */
export function useDemoTheme() {
  const [theme, setThemeState] = useState<DemoTheme>(defaultTheme);

  useEffect(() => {
    const sync = () => setThemeState(readDemoTheme());
    const syncFromStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === storageKey) sync();
    };
    sync();
    window.addEventListener(changeEvent, sync);
    window.addEventListener("storage", syncFromStorage);
    return () => {
      window.removeEventListener(changeEvent, sync);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, []);

  const setTheme = useCallback((next: DemoTheme) => {
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // Not persistable — still update the selectors in this document.
    }
    window.dispatchEvent(new Event(changeEvent));
  }, []);

  return [theme, setTheme] as const;
}

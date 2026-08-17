import { demoThemes, useDemoTheme } from "@/lib/demo-theme";

export function DemoThemeSelect() {
  const [theme, setTheme] = useDemoTheme();

  return (
    <label className="text-muted-foreground flex items-center gap-2 text-xs">
      Theme
      <select
        value={theme}
        onChange={(e) => {
          const next = demoThemes.find((t) => t === e.target.value);
          if (next) setTheme(next);
        }}
        className="border-border bg-background text-foreground dark:bg-input/30 dark:border-input focus-visible:border-ring focus-visible:ring-ring/50 h-7 rounded-md border px-2 text-xs font-medium shadow-xs outline-none focus-visible:ring-[3px]"
      >
        {demoThemes.map((demoTheme) => (
          <option key={demoTheme} value={demoTheme}>
            {demoTheme[0].toUpperCase() + demoTheme.slice(1)}
          </option>
        ))}
      </select>
    </label>
  );
}

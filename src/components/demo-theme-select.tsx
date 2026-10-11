import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemoTheme } from "@/lib/demo-theme";
import { defaultPreset, usePresets } from "@/lib/theme-presets";

export function DemoThemeSelect() {
  const [theme, setTheme] = useDemoTheme();
  const presets = usePresets();
  const themeItems = (
    presets ?? [{ name: defaultPreset, label: "Default" }]
  ).map((preset) => ({
    value: preset.name,
    label: preset.label,
  }));
  // A stored name no longer offered shows as the default, which is what the demos show.
  const value = themeItems.some((item) => item.value === theme)
    ? theme
    : defaultPreset;

  return (
    <div className="text-muted-foreground flex items-center gap-2 text-xs">
      <span>Theme</span>
      <Select
        items={themeItems}
        value={value}
        onValueChange={(next) => {
          if (typeof next === "string") setTheme(next);
        }}
      >
        <SelectTrigger size="sm" aria-label="Demo theme" className="text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="min-w-32">
          {themeItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

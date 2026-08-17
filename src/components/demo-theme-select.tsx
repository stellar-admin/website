import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { demoThemes, useDemoTheme } from "@/lib/demo-theme";

const themeItems = demoThemes.map((theme) => ({
  value: theme,
  label: theme[0].toUpperCase() + theme.slice(1),
}));

export function DemoThemeSelect() {
  const [theme, setTheme] = useDemoTheme();

  return (
    <div className="text-muted-foreground flex items-center gap-2 text-xs">
      <span>Theme</span>
      <Select
        items={themeItems}
        value={theme}
        onValueChange={(value) => {
          const next = demoThemes.find((t) => t === value);
          if (next) setTheme(next);
        }}
      >
        <SelectTrigger size="sm" aria-label="Demo theme" className="text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
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

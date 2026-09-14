import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { demoThemes, useDemoTheme } from "@/lib/demo-theme";

const themeGroups = [
  { label: "StellarAdmin themes", shadcn: false },
  { label: "Shadcn themes", shadcn: true },
].map((group) => ({
  label: group.label,
  items: demoThemes
    .filter((theme) => theme.startsWith("shadcn.") === group.shadcn)
    .map((theme) => {
      const name = theme.replace(/^shadcn\./, "");
      return { value: theme, label: name[0].toUpperCase() + name.slice(1) };
    })
    .sort((a, b) => a.label.localeCompare(b.label, "en")),
}));

const themeItems = themeGroups.flatMap((group) => group.items);

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
        <SelectContent className="min-w-44">
          {themeGroups.map((group) => (
            <SelectGroup key={group.label}>
              <SelectLabel>{group.label}</SelectLabel>
              {group.items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

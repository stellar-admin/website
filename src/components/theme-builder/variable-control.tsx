import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatNumber,
  type ThemeVariable,
  numericValue,
  toHex,
} from "@/lib/theme-builder/variables";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-8 min-w-0 rounded-md border border-input bg-transparent px-2 font-mono text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30";

/**
 * One variable. `value` is undefined when the variable is at its default (or, for an optional variable, unset);
 * `onChange(undefined)` returns it there.
 */
export function ThemeVariableControl({
  variable,
  value,
  onChange,
  compact,
}: {
  variable: ThemeVariable;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  /** Leaves out the explanation (still in the label's tooltip). */
  compact?: boolean;
}) {
  const id = useId();
  const auto = variable.optional && value === undefined;
  const effective = value ?? variable.default ?? variable.initial ?? "";

  return (
    <div className="flex flex-col gap-1.5 py-2">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="text-sm font-medium"
          title={`${variable.name}: ${variable.meaning}`}
        >
          {variable.label}
        </label>
        {variable.optional ? (
          <label className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <input
              type="checkbox"
              checked={auto}
              onChange={(e) =>
                onChange(e.target.checked ? undefined : variable.initial)
              }
            />
            Auto
          </label>
        ) : value !== undefined ? (
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground text-xs"
            onClick={() => onChange(undefined)}
          >
            Reset
          </button>
        ) : null}
      </div>
      {!compact && (
        <p className="text-muted-foreground -mt-1 text-xs">
          {variable.meaning}
          {auto && variable.follows ? ` Follows ${variable.follows}.` : ""}
        </p>
      )}
      <Input
        id={id}
        variable={variable}
        value={effective}
        disabled={auto}
        onChange={onChange}
      />
    </div>
  );
}

function Input({
  id,
  variable,
  value,
  disabled,
  onChange,
}: {
  id: string;
  variable: ThemeVariable;
  value: string;
  disabled: boolean | undefined;
  onChange: (value: string | undefined) => void;
}) {
  // A value equal to the default is stored as "no value", so links and exports stay minimal.
  const set = (next: string) =>
    onChange(
      !variable.optional && next === variable.default ? undefined : next,
    );

  switch (variable.type) {
    case "color": {
      const hex = toHex(value);
      return (
        <div className="flex items-center gap-2">
          <input
            type="color"
            aria-label={`${variable.label} colour`}
            className="h-8 w-10 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-0.5 disabled:opacity-50"
            value={hex ?? "#000000"}
            disabled={disabled}
            onChange={(e) => set(e.target.value)}
          />
          <input
            id={id}
            className={cn(fieldClass, "flex-1")}
            value={value}
            disabled={disabled}
            spellCheck={false}
            onChange={(e) => set(e.target.value)}
          />
        </div>
      );
    }

    case "number":
    case "length": {
      const n = numericValue(variable, value);
      const named = variable.named?.find((choice) => choice.value === value);
      return (
        <div className="flex items-center gap-2">
          <input
            type="range"
            aria-label={variable.label}
            className="accent-primary min-w-0 flex-1"
            min={variable.min}
            max={variable.max}
            step={variable.step}
            value={n ?? variable.min ?? 0}
            disabled={disabled}
            onChange={(e) =>
              set(formatNumber(variable, Number(e.target.value)))
            }
          />
          {variable.named?.map((choice) => (
            <button
              key={choice.value}
              type="button"
              aria-pressed={named === choice}
              disabled={disabled}
              className={cn(
                "h-8 rounded-md border border-input px-2 text-xs disabled:opacity-50",
                named === choice &&
                  "bg-primary text-primary-foreground border-primary",
              )}
              onClick={() =>
                set(
                  named === choice
                    ? (variable.default ?? variable.initial ?? "0")
                    : choice.value,
                )
              }
            >
              {choice.label}
            </button>
          ))}
          <input
            id={id}
            className={cn(fieldClass, "w-20")}
            value={value}
            disabled={disabled}
            spellCheck={false}
            onChange={(e) => set(e.target.value)}
          />
        </div>
      );
    }

    case "switch":
      return (
        <label className="flex items-center gap-2 text-sm">
          <input
            id={id}
            type="checkbox"
            className="accent-primary size-4"
            checked={value === "1"}
            disabled={disabled}
            onChange={(e) => set(e.target.checked ? "1" : "0")}
          />
          {value === "1" ? "On" : "Off"}
        </label>
      );

    case "choice":
    case "font": {
      const choices = variable.choices ?? [];
      const items = choices.some((choice) => choice.value === value)
        ? choices
        : [...choices, { label: `Custom: ${value}`, value }];
      return (
        <Select
          items={items}
          value={value}
          disabled={disabled}
          onValueChange={(next) => {
            if (typeof next === "string") set(next);
          }}
        >
          <SelectTrigger id={id} size="sm" className="w-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
  }
}

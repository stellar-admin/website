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
  type Knob,
  numericValue,
  toHex,
} from "@/lib/theme-builder/knobs";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-8 min-w-0 rounded-md border border-input bg-transparent px-2 font-mono text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30";

/**
 * One knob. `value` is undefined when the knob is at its default (or, for an optional knob, unset);
 * `onChange(undefined)` returns it there.
 */
export function KnobControl({
  knob,
  value,
  onChange,
  compact,
}: {
  knob: Knob;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  /** Leaves out the explanation (still in the label's tooltip). */
  compact?: boolean;
}) {
  const id = useId();
  const auto = knob.optional && value === undefined;
  const effective = value ?? knob.default ?? knob.initial ?? "";

  return (
    <div className="flex flex-col gap-1.5 py-2">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="text-sm font-medium"
          title={`${knob.name}: ${knob.meaning}`}
        >
          {knob.label}
        </label>
        {knob.optional ? (
          <label className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <input
              type="checkbox"
              checked={auto}
              onChange={(e) =>
                onChange(e.target.checked ? undefined : knob.initial)
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
          {knob.meaning}
          {auto && knob.follows ? ` Follows ${knob.follows}.` : ""}
        </p>
      )}
      <Input
        id={id}
        knob={knob}
        value={effective}
        disabled={auto}
        onChange={onChange}
      />
    </div>
  );
}

function Input({
  id,
  knob,
  value,
  disabled,
  onChange,
}: {
  id: string;
  knob: Knob;
  value: string;
  disabled: boolean | undefined;
  onChange: (value: string | undefined) => void;
}) {
  // A value equal to the default is stored as "no value", so links and exports stay minimal.
  const set = (next: string) =>
    onChange(!knob.optional && next === knob.default ? undefined : next);

  switch (knob.type) {
    case "color": {
      const hex = toHex(value);
      return (
        <div className="flex items-center gap-2">
          <input
            type="color"
            aria-label={`${knob.label} colour`}
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
      const n = numericValue(knob, value);
      const named = knob.named?.find((choice) => choice.value === value);
      return (
        <div className="flex items-center gap-2">
          <input
            type="range"
            aria-label={knob.label}
            className="accent-primary min-w-0 flex-1"
            min={knob.min}
            max={knob.max}
            step={knob.step}
            value={n ?? knob.min ?? 0}
            disabled={disabled}
            onChange={(e) => set(formatNumber(knob, Number(e.target.value)))}
          />
          {knob.named?.map((choice) => (
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
                    ? (knob.default ?? knob.initial ?? "0")
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
      const choices = knob.choices ?? [];
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

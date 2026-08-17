import type { ReactNode } from "react";
import { DemoLaunch } from "./demo-launch";
import { DemoPreview } from "./demo-preview";
import { DemoThemeSelect } from "./demo-theme-select";

export function Demo({
  src,
  mode = "preview",
  children,
}: {
  src: string;
  mode?: "preview" | "fullscreen";
  children: ReactNode;
}) {
  return (
    <div className="[&>*:first-child]:rounded-t-xl [&>*:first-child]:border [&>*:first-child]:border-b-0 [&>*:first-child]:shadow-sm [&>*:last-child]:rounded-t-none [&>*:last-child]:mt-0">
      <div>
        <div className="flex items-center justify-end border-b px-3 py-2">
          <DemoThemeSelect />
        </div>
        {mode === "fullscreen" ? (
          <DemoLaunch src={src} />
        ) : (
          <DemoPreview src={src} />
        )}
      </div>
      {children}
    </div>
  );
}

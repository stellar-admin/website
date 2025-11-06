import { ReactNode } from "react";
import { DemoPreview } from "./demo-preview";

export function Demo({ src, children }: { src: string; children: ReactNode }) {
  return (
    <div className="[&>*:first-child]:rounded-t-xl [&>*:first-child]:border [&>*:first-child]:border-b-0 [&>*:first-child]:shadow-sm [&>*:last-child]:rounded-t-none [&>*:last-child]:mt-0">
      <DemoPreview src={src} />
      {children}
    </div>
  );
}

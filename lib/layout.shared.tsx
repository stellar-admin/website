import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import DuneUILogo from "./dune-ui-logo";
("@/lib/dune-ui-logo");

export function baseOptions(): BaseLayoutProps {
  return {
    githubUrl: "https://github.com/dune-ui/dune-ui",
    nav: {
      title: (
        <>
          <DuneUILogo className="p-2.5" />
        </>
      ),
    },
  };
}

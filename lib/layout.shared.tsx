import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import DuneUILogo from "./dune-ui-logo";

export function baseOptions(): BaseLayoutProps {
  return {
    githubUrl: "https://github.com/dune-ui/dune-ui",
    links: [
      {
        text: "Blog",
        url: "/blog",
        secondary: false,
      },
      {
        text: "Documentation",
        url: "/docs/tag-helpers",
        secondary: false,
      },
    ],
    nav: {
      title: (
        <>
          <DuneUILogo className="p-2.5" />
        </>
      ),
    },
  };
}

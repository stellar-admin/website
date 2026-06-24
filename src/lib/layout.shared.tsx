import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import DuneUILogo from "./dune-ui-logo";
import { gitConfig } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <DuneUILogo className="p-2.5" />,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}

export const homeLinks: LinkItemType[] = [
  {
    type: "main",
    text: "Blog",
    url: "/blog",
  },
  {
    type: "main",
    text: "Documentation",
    url: "/docs/tag-helpers",
  },
];

import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import StellarAdminLogo from "./stellar-admin-logo";
import { gitConfig } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <StellarAdminLogo />,
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

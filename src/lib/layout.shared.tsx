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
    type: "menu",
    text: "Documentation",
    items: [
      {
        text: "StellarAdmin",
        description: "Admin panels for ASP.NET Core",
        url: "/docs/admin",
      },
      {
        text: "StellarAdmin.UI",
        description: "Tag Helpers for ASP.NET Core MVC and Razor Pages",
        url: "/docs/ui",
      },
    ],
  },
  {
    type: "main",
    text: "Theme builder",
    url: "/theme-builder",
  },
];

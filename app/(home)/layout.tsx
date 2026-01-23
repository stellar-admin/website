import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <HomeLayout
      {...baseOptions()}
      links={[
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
      ]}
    >
      {children}
    </HomeLayout>
  );
}

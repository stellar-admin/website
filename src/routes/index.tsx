import { createFileRoute } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import Hero from "@/components/hero";
import { baseOptions, homeLinks } from "@/lib/layout.shared";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "StellarAdmin - Create beautiful ASP.NET Core apps" },
      {
        name: "description",
        content:
          "StellarAdmin is a collection of beautifully designed components you can use to create CRUD screens in ASP.NET Core MVC and Razor Pages applications.",
      },
    ],
  }),
});

function Home() {
  return (
    <HomeLayout {...baseOptions()} links={homeLinks}>
      <Hero />
    </HomeLayout>
  );
}

import type { Metadata } from "next";
import Hero from "@/components/hero";

export const metadata: Metadata = {
  title: "DuneUI - Create beautiful ASP.NET Core apps",
  description:
    "DuneUI Tag Helpers is a collection of beautifully designed components you can use to create CRUD screens in ASP.NET Core MVC and Razor Pages applications.",
};

export default function HomePage() {
  return <Hero />;
}

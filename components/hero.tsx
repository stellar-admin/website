import { ArrowUpRight, Blocks, Book } from "lucide-react";
import Link from "next/link";
import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-3xl">
        <a
          href="https://www.nuget.org/packages/DuneUI.TagHelpers/"
          target="_blank"
          className={cn(
            badgeVariants({
              variant: "secondary",
              className: "rounded-full py-1 border-border",
            })
          )}
        >
          Beta version released <ArrowUpRight className="ml-1 size-4" />
        </a>
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl md:leading-[1.2] font-semibold tracking-tighter">
          Create beautiful ASP.NET Core apps
        </h1>
        <p className="mt-6 md:text-lg text-foreground/80">
          DuneUI Tag Helpers is a collection of beautifully designed components
          you can use to create CRUD screens in ASP.NET Core MVC and Razor Pages
          applications.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/docs/tag-helpers"
            className={cn(
              buttonVariants({
                size: "lg",
                className: "rounded-full text-base",
              })
            )}
          >
            <Book className="size-5" /> View Documentation
          </Link>
          <Link
            href="/docs/tag-helpers/components/avatar"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                className: "rounded-full text-base shadow-none",
              })
            )}
          >
            <Blocks className="size-5" /> View Components
          </Link>
        </div>
      </div>
    </div>
  );
}

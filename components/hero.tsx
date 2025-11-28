import { ArrowUpRight, Blocks, Book } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-3xl">
        <Badge
          variant="secondary"
          className="rounded-full py-1 border-border"
          asChild
        >
          <Link href="#">
            Beta version released <ArrowUpRight className="ml-1 size-4" />
          </Link>
        </Badge>
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl md:leading-[1.2] font-semibold tracking-tighter">
          Create beautiful ASP.NET Core apps
        </h1>
        <p className="mt-6 md:text-lg text-foreground/80">
          StellarAdmin Tag Helpers is a collection of beautifully designed
          components you can use to create CRUD screens in ASP.NET Core MVC and
          Razor Pages applications.
        </p>
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button size="lg" className="rounded-full text-base" asChild>
            <Link href="/docs/tag-helpers">
              <Book className="size-5" /> View Documentation
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full text-base shadow-none"
            asChild
          >
            <Link href="/docs/tag-helpers/components/badge">
              <Blocks className="size-5" /> View Components
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

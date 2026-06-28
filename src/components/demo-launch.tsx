import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DemoLaunch({ src }: { src: string }) {
  return (
    <div className="flex items-center justify-center bg-background px-6 py-16">
      <a
        href={src}
        target="_blank"
        rel="noopener"
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "no-underline",
        )}
      >
        Open full preview <ArrowUpRight className="size-4" />
      </a>
    </div>
  );
}

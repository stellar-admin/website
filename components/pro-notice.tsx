import { CircleStar } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { cn } from "@/lib/utils";

export default function ProNotice({
  componentName,
  className,
}: {
  componentName: string;
  className?: string;
}) {
  return (
    <Alert
      variant="default"
      className={cn(
        "border-none bg-sky-600/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400",
        className
      )}
    >
      <CircleStar className="size-6" strokeWidth="1.5" />
      <AlertTitle>DuneUI Pro Tag Helper</AlertTitle>
      <AlertDescription className="text-wrap mt-2 text-sm/6 text-sky-600/80 dark:text-sky-400/80">
        <span className="font-semibold">{componentName}</span> is a{" "}
        <span className="font-semibold">DuneUI Pro</span> Tag Helper and not
        currently available. <span className="font-semibold">DuneUI Pro</span>{" "}
        is a paid package which will be released around March 2026.
      </AlertDescription>
    </Alert>
  );
}

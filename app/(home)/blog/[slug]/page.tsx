import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { blog } from "@/lib/source";
import { cn } from "@/lib/utils";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();
  const Mdx = page.data.body;

  return (
    <section className={cn("py-32")}>
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
          <h1 className="max-w-3xl text-5xl font-semibold text-pretty md:text-6xl">
            {page.data.title}
          </h1>
          <h3 className="max-w-3xl text-lg text-muted-foreground md:text-xl">
            {page.data.description}
          </h3>
          <div className="flex items-center gap-3 text-sm md:text-base">
            {/* <Avatar className="h-8 w-8 border">
              <AvatarImage src={authorImage} />
              <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar> */}
            <span>
              By{" "}
              {/* <a href="#" className="font-semibold">
                {page.data.author}
              </a> */}
              <span className="font-semibold">{page.data.author}</span>
              <span className="ml-1">
                on {format(page.data.date, "MMMM d, yyyy")}
              </span>
            </span>
          </div>
          {/* <img
            src={image}
            alt="placeholder"
            className="mt-4 mb-8 aspect-video w-full rounded-lg border object-cover"
          /> */}
        </div>
      </div>
      <div className="container">
        <div className="mx-auto prose max-w-3xl dark:prose-invert my-12">
          <Mdx components={defaultMdxComponents} />
        </div>
      </div>
    </section>
  );
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: `/blog/${page.slugs}/og.png`,
    },
  };
}

import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import browserCollections from "collections/browser";
import { format } from "date-fns";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Suspense } from "react";
import { baseOptions, homeLinks } from "@/lib/layout.shared";
import { blog } from "@/lib/source";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog/$slug")({
  component: Page,
  loader: async ({ params }) => {
    const data = await serverLoader({ data: params.slug });
    await clientLoader.preload(data.path);
    return data;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Blog"} - StellarAdmin` },
      { name: "description", content: loaderData?.description ?? "" },
      { property: "og:image", content: loaderData?.image ?? "" },
    ],
  }),
});

const serverLoader = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const page = blog.getPage([slug]);
    if (!page) throw notFound();

    return {
      path: page.path,
      title: page.data.title,
      description: page.data.description,
      author: page.data.author,
      date:
        page.data.date instanceof Date
          ? page.data.date.toISOString()
          : String(page.data.date),
      image: `/blog/${page.slugs}/og.png`,
    };
  });

const clientLoader = browserCollections.blogPosts.createClientLoader({
  id: "blogPosts",
  component({ default: MDX }) {
    return (
      <div className="container">
        <div className="mx-auto prose max-w-3xl dark:prose-invert my-12">
          <MDX components={defaultMdxComponents} />
        </div>
      </div>
    );
  },
});

function Page() {
  const { path, title, description, author, date } = Route.useLoaderData();

  return (
    <HomeLayout {...baseOptions()} links={homeLinks}>
      <section className={cn("py-32")}>
        <div className="container">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
            <h1 className="max-w-3xl text-5xl font-semibold text-pretty md:text-6xl">
              {title}
            </h1>
            <h3 className="max-w-3xl text-lg text-muted-foreground md:text-xl">
              {description}
            </h3>
            <div className="flex items-center gap-3 text-sm md:text-base">
              <span>
                By <span className="font-semibold">{author}</span>
                <span className="ml-1">
                  on {format(new Date(date), "MMMM d, yyyy")}
                </span>
              </span>
            </div>
          </div>
        </div>
        <Suspense>{clientLoader.useContent(path)}</Suspense>
      </section>
    </HomeLayout>
  );
}

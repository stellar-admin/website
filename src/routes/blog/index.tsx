import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { baseOptions, homeLinks } from "@/lib/layout.shared";
import { blog } from "@/lib/source";
import { cn } from "@/lib/utils";

// Build the list on the server only. Calling `blog.getPages()` in the component
// would run the fumadocs source machinery in the browser (where the server
// collection data isn't available), crashing with "A.join is not a function".
const listPosts = createServerFn({ method: "GET" }).handler(async () =>
  blog.getPages().map((post) => ({
    url: post.url,
    slug: post.slugs[0],
    image: `/blog/${post.slugs.join("/")}/og.png`,
    title: post.data.title,
    description: post.data.description,
  })),
);

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
  loader: async () => listPosts(),
  head: () => ({
    meta: [
      { title: "Blog - DuneUI" },
      {
        name: "description",
        content: "The latest news, tips and updates from DuneUI.",
      },
    ],
  }),
});

function BlogIndex() {
  const posts = Route.useLoaderData();

  return (
    <HomeLayout {...baseOptions()} links={homeLinks}>
      <section className={cn("py-32")}>
        <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6">
              Latest Updates
            </Badge>
            <h2 className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
              Blog Posts
            </h2>
            <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
              Discover the latest trends, tips, and best practices in modern web
              development. From UI components to design systems, stay updated
              with our expert insights.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {posts.map((post) => (
              <Card
                key={post.url}
                className="grid grid-rows-[auto_auto_1fr_auto] overflow-hidden pt-0"
              >
                <div className="aspect-16/9 w-full">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="transition-opacity duration-200 fade-in hover:opacity-70"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </Link>
                </div>
                <CardHeader>
                  <h3 className="text-lg font-semibold hover:underline md:text-xl">
                    <Link to="/blog/$slug" params={{ slug: post.slug }}>
                      {post.title}
                    </Link>
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{post.description}</p>
                </CardContent>
                <CardFooter>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="flex items-center text-foreground hover:underline"
                  >
                    Read more
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}

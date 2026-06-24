import { createFileRoute } from "@tanstack/react-router";
import { siteUrl } from "@/lib/shared";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        const body = `User-Agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`;

        return new Response(body, {
          headers: { "Content-Type": "text/plain" },
        });
      },
    },
  },
});

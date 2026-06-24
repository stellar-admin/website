import { createFileRoute } from "@tanstack/react-router";
import { siteUrl } from "@/lib/shared";
import { blog, source } from "@/lib/source";

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

function toXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const parts = [`    <loc>${entry.loc}</loc>`];
      if (entry.lastmod) parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
      if (entry.changefreq)
        parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      if (entry.priority !== undefined)
        parts.push(`    <priority>${entry.priority}</priority>`);
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const url = (path: string) => new URL(path, siteUrl).toString();
        const now = new Date().toISOString();

        const entries: SitemapEntry[] = [
          { loc: url("/"), changefreq: "monthly", priority: 1 },
          { loc: url("/docs"), changefreq: "monthly", priority: 0.8 },
          ...blog.getPages().map((page) => ({
            loc: url(page.url),
            lastmod:
              page.data.date instanceof Date
                ? page.data.date.toISOString()
                : new Date(page.data.date).toISOString(),
            changefreq: "weekly",
            priority: 0.5,
          })),
          ...source.getPages().map((page) => ({
            loc: url(page.url),
            lastmod: now,
            changefreq: "weekly",
            priority: 0.5,
          })),
        ];

        return new Response(toXml(entries), {
          headers: { "Content-Type": "application/xml" },
        });
      },
    },
  },
});

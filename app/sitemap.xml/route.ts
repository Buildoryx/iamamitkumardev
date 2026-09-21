import { getPublishedPosts, isNonCanonicalSlug, SITE_URL } from "@/lib/blog";

/**
 * Must re-execute per cache-miss, not at build time. Without this, Next
 * infers the GET handler as static, prerenders it during `next build`, and
 * the sitemap freezes at the build's database snapshot — the exact failure
 * this route exists to fix. With force-dynamic, the explicit `s-maxage` below
 * governs edge caching (identical to /feed.xml, which has stayed fresh in
 * production for months on this pattern).
 */
export const dynamic = "force-dynamic";

/**
 * Sitemap as an explicit route handler (the /feed.xml pattern).
 *
 * WHY NOT `app/sitemap.ts` (Next MetadataRoute): the MetadataRoute sitemap is
 * prerendered at build time, and on this deployment its ISR revalidation never
 * fired — production served a sitemap frozen at the 2026-07-27 build snapshot
 * while the `post` table grew from 17 to 26 rows. Nine posts (Jul 31 – Sep 11)
 * were invisible to Google's sitemap signal for weeks, matching GSC showing
 * only head pages indexed.
 *
 * A route handler with an explicit `Cache-Control: s-maxage` revalidates
 * reliably on this stack — /feed.xml has stayed fresh for months with exactly
 * this pattern. Keep both routes synchronized if this one changes.
 */
export async function GET() {
  // A transient data-source error must not take down the whole sitemap;
  // static routes below are always emitted so the file stays valid.
  let blogPosts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  try {
    blogPosts = await getPublishedPosts();
  } catch {
    blogPosts = [];
  }

  // Static routes deliberately omit `lastmod`: we have no real modification
  // date for these hand-built pages, and stamping `new Date()` told Google
  // every page changed on every fetch — Google discounts `lastmod` once it
  // proves unreliable, and a sitemap it distrusts gets processed lazily.
  //
  // /newsletter, /inspiration, and /sponsor are intentionally absent: they are
  // thin utility pages carrying `robots: noindex`. Submitting a noindexed URL
  // in the sitemap sends Google contradictory signals and wastes crawl budget.
  type SitemapUrl = {
    loc: string;
    changefreq: string;
    priority: string;
    lastmod?: string;
  };

  const staticRoutes: SitemapUrl[] = [
    { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1" },
    { loc: `${SITE_URL}/agents`, changefreq: "weekly", priority: "0.95" },
    { loc: `${SITE_URL}/tools`, changefreq: "weekly", priority: "0.9" },
    { loc: `${SITE_URL}/projects/invobill`, changefreq: "monthly", priority: "0.8" },
    { loc: `${SITE_URL}/blog`, changefreq: "daily", priority: "0.9" },
    // Topic pillar — hub page for the site's strongest content cluster.
    {
      loc: `${SITE_URL}/blog/topics/self-hosted-ai-agents`,
      changefreq: "weekly",
      priority: "0.8",
    },
    { loc: `${SITE_URL}/workflow`, changefreq: "monthly", priority: "0.7" },
    { loc: `${SITE_URL}/tweets`, changefreq: "weekly", priority: "0.8" },
  ];

  const blogRoutes: SitemapUrl[] = blogPosts
    .filter((post) => !isNonCanonicalSlug(post.slug))
    .map((post, index) => {
      const lastmod = new Date(
        post.updatedAt || post.publishedAt || Date.now(),
      ).toISOString();
      return {
        loc: `${SITE_URL}/blog/${post.slug}`,
        lastmod,
        changefreq: "weekly",
        // Newest post gets a slight edge; the rest are equals.
        priority: index === 0 ? "0.9" : "0.7",
      };
    });

  const urls = [...staticRoutes, ...blogRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc.replace(/&/g, "&amp;")}</loc>
${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : ""}    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Revalidate every 10 minutes at the edge, serve stale while refreshing.
      // This exact pattern keeps /feed.xml current in production.
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60",
    },
  });
}

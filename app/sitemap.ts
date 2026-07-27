import type { MetadataRoute } from "next";
import { getPublishedPosts, isNonCanonicalSlug } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

/** Must revalidate or new DB posts never appear in sitemap until redeploy. */
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogPosts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  try {
    blogPosts = await getPublishedPosts();
  } catch {
    // A transient data-source error must not take down the whole sitemap;
    // static routes below are always emitted so the file stays valid.
    blogPosts = [];
  }
  const now = new Date();

  // Static routes deliberately omit `lastModified`.
  //
  // This file revalidates every 60s, so stamping `new Date()` on each static
  // route told Google that all ten pages had changed on *every* fetch. Google
  // discounts `lastmod` once it proves unreliable, and a sitemap it distrusts
  // gets processed lazily — which is consistent with two of our posts still
  // being "URL is unknown to Google" despite being listed here.
  //
  // Omitting the field is honest: we have no real modification date for these
  // hand-built pages. Blog entries below still send a true `lastModified`
  // sourced from the post's own updatedAt/publishedAt.
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/agents`,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/tools`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/projects/invobill`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/workflow`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // /newsletter, /inspiration, and /sponsor are intentionally absent:
    // they are thin utility pages carrying `robots: noindex`. Submitting a
    // noindexed URL in the sitemap sends Google contradictory signals and
    // wastes crawl budget, so the two must stay in sync.
    {
      url: `${SITE_URL}/tweets`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogPosts
    .filter((post) => !isNonCanonicalSlug(post.slug))
    .map((post, index) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt || now),
      changeFrequency: "weekly",
      priority: index === 0 ? 0.9 : 0.7,
    }));

  return [...staticRoutes, ...blogRoutes];
}

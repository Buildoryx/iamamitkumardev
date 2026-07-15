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

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/agents`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/projects/invobill`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/workflow`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/newsletter`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/tweets`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/inspiration`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/sponsor`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
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

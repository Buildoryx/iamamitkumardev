import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/container";
import { DottedSeparator } from "@/components/separator";
import { BlogIndex } from "@/components/blog/blog-index";
import { NewsletterCTA } from "@/components/blog/newsletter-cta";
import {
  getPublishedPosts,
  isNonCanonicalSlug,
  parseTags,
  SITE_URL,
} from "@/lib/blog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — AI Agents, MCP Tools & Build Logs",
  description:
    "Technical writing on production AI agents, MCP tools, self-hosted automations, multi-agent workflows, product shipping, and growth experiments.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
  // Without this block, /blog inherited the root layout's OpenGraph title
  // ("Amit Kumar — Production AI Agents & MCP Tools"), so link unfurls and
  // social cards showed the homepage's identity for the blog index.
  openGraph: {
    title: "Blog — AI Agents, MCP Tools & Build Logs | Amit Kumar",
    description:
      "Technical writing on production AI agents, MCP tools, self-hosted automations, multi-agent workflows, product shipping, and growth experiments.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — AI Agents, MCP Tools & Build Logs | Amit Kumar",
    description:
      "Technical writing on production AI agents, MCP tools, self-hosted automations, multi-agent workflows, product shipping, and growth experiments.",
  },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const indexPosts = posts
    .filter((post) => Boolean(post.publishedAt) && !isNonCanonicalSlug(post.slug))
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      publishedAt: post.publishedAt as string,
      summary: post.excerpt || post.summary || "",
      // Needed by BlogIndex to group posts into topic clusters.
      tags: parseTags(post.tags),
    }));

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog/#blog`,
    name: "Amit Kumar Blog",
    description:
      "Technical writing on production AI agents, MCP tools, self-hosted automations, multi-agent workflows, product shipping, and growth experiments.",
    url: `${SITE_URL}/blog`,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    blogPost: indexPosts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      author: { "@id": `${SITE_URL}/#person` },
    })),
  };

  // ItemList schema — gives Google a structured list of all blog posts,
  // which can appear in search results as a carousel or list.
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/blog/#itemlist`,
    name: "Blog posts by Amit Kumar",
    description:
      "Technical writing on production AI agents, MCP tools, self-hosted automations, and multi-agent workflows.",
    numberOfItems: indexPosts.length,
    itemListElement: indexPosts.slice(0, 15).map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Container className="flex-1">
        <h1 className="sr-only">
          Blog — AI Agents, MCP Tools & Build Logs by Amit Kumar
        </h1>
        <p className="text-muted-foreground pt-4 font-mono text-xs tracking-widest uppercase">
          TECHNICAL WRITING ON PRODUCTION AI AGENTS, MCP TOOLS, SELF-HOSTED
          AUTOMATIONS, MULTI-AGENT WORKFLOWS, AND PRODUCT SHIPPING.
        </p>

        {/* Topic-pillar entry point — the hub page links every self-hosting
            spoke in reading order; surfacing it here gives crawlers a
            homepage-strength internal link to the cluster. */}
        <p className="text-muted-foreground mt-3 text-sm">
          New to self-hosting?{" "}
          <Link
            href="/blog/topics/self-hosted-ai-agents"
            className="text-primary font-medium hover:underline"
          >
            Start with the complete guide →
          </Link>
        </p>

        <BlogIndex posts={indexPosts} />
        <DottedSeparator className="my-8" />
        <NewsletterCTA />
        <DottedSeparator className="my-8" />
      </Container>
    </>
  );
}

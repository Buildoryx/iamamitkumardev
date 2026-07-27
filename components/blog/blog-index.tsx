"use client";

import { useMemo, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { BlogPostLink } from "./blog-post-link";
import { cn } from "@/lib/utils";

export type BlogIndexPost = {
  slug: string;
  title: string;
  publishedAt: string;
  summary?: string;
  tags?: string[];
};

type BlogIndexProps = {
  posts: BlogIndexPost[];
};

/**
 * How many posts lead the page in pure reverse-chronological order.
 *
 * Recency is the primary axis: the newest writing must always be at the top,
 * regardless of topic. Topic clusters below are for browsing the archive, and
 * they only ever contain posts that have scrolled out of this section — so no
 * post is listed twice.
 */
const LATEST_COUNT = 6;

/**
 * Topic clusters, matched against post tags in this order — first match wins.
 *
 * Deliberately not derived from the tag list itself: tags are authored
 * inconsistently across posts (`self-hosting` vs `self-hosted-ai`, `vps` vs
 * `vps-deployment`), so grouping straight off them produces junk headings.
 * Note `hermes-agent` is intentionally absent from the frameworks cluster —
 * it appears on a majority of posts, so matching it would swallow everything.
 *
 * `slugHints` is a second pass for posts authored in the admin/agent editors,
 * whose tags often don't overlap our vocabulary at all. Without it, five posts
 * fell into the fallback bucket despite having an obvious home.
 */
const TOPIC_CLUSTERS = [
  {
    id: "orchestration",
    label: "Multi-agent systems",
    tags: ["multi-agent", "agent-orchestration", "production-architecture"],
    slugHints: ["multi-agent", "orchestration"],
  },
  {
    id: "frameworks",
    label: "Agent frameworks",
    tags: ["framework-comparison", "openclaw", "openhuman"],
    slugHints: ["openclaw", "openhuman", "claude-code"],
  },
  {
    id: "infrastructure",
    label: "Self-hosting & infrastructure",
    tags: [
      "vps",
      "vps-deployment",
      "hetzner",
      "hostinger",
      "digitalocean",
      "infrastructure",
      "self-hosting",
      "self-hosted-ai",
      "hosting-comparison",
      "budget-hosting",
      "tailscale",
      "systemd",
    ],
    slugHints: ["vps", "hetzner", "hostinger", "self-hosting"],
  },
  {
    id: "production",
    label: "Shipping to production",
    tags: [
      "production-deployment",
      "testing",
      "security",
      "prompt-injection",
      "memory",
      "mcp",
      "tutorial",
    ],
    slugHints: ["production", "pilot", "test", "enterprise", "injection", "mcp"],
  },
] as const;

const FALLBACK_LABEL = "More writing";

function byNewestFirst(a: BlogIndexPost, b: BlogIndexPost) {
  const diff =
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  // Several posts share a publish date. Without a tiebreak their relative
  // order depends on incoming array order, so the same two posts could swap
  // places between the homepage list and this page.
  if (diff !== 0) return diff;
  return a.slug.localeCompare(b.slug);
}

function clusterFor(post: BlogIndexPost): string {
  const tags = (post.tags ?? []).map((tag) => tag.toLowerCase());

  const byTag = TOPIC_CLUSTERS.find((cluster) =>
    cluster.tags.some((tag) => tags.includes(tag)),
  );
  if (byTag) return byTag.label;

  const slug = post.slug.toLowerCase();
  const bySlug = TOPIC_CLUSTERS.find((cluster) =>
    cluster.slugHints.some((hint) => slug.includes(hint)),
  );
  return bySlug?.label ?? FALLBACK_LABEL;
}

export function BlogIndex({ posts }: BlogIndexProps) {
  const [query, setQuery] = useState("");

  const sorted = useMemo(() => [...posts].sort(byNewestFirst), [posts]);

  /** Newest first, always at the top of the page. */
  const latest = useMemo(() => sorted.slice(0, LATEST_COUNT), [sorted]);

  /** Everything older, grouped by topic. Each post appears in exactly one place. */
  const groups = useMemo(() => {
    const rest = sorted.slice(LATEST_COUNT);

    const buckets = new Map<string, BlogIndexPost[]>();
    for (const post of rest) {
      const label = clusterFor(post);
      const bucket = buckets.get(label);
      if (bucket) bucket.push(post);
      else buckets.set(label, [post]);
    }

    // Preserve the declared cluster order, with the fallback bucket last.
    const orderedLabels: string[] = [
      ...TOPIC_CLUSTERS.map((cluster) => cluster.label),
      FALLBACK_LABEL,
    ];

    return orderedLabels
      .filter((label) => buckets.has(label))
      .map((label) => ({ label, posts: buckets.get(label)! }));
  }, [sorted]);

  const trimmedQuery = query.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;

  /** While searching, grouping is noise — show one flat relevance-free list. */
  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return sorted.filter((post) =>
      post.title.toLowerCase().includes(trimmedQuery),
    );
  }, [sorted, isSearching, trimmedQuery]);

  return (
    <section className="mt-8 flex flex-col gap-12">
      {!isSearching && latest.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-foreground/40 font-mono text-sm tracking-wide uppercase">
            Latest
          </h2>
          <ul className="flex flex-col gap-4">
            {latest.map((post) => (
              <li key={post.slug}>
                <BlogPostLink
                  title={post.title}
                  slug={post.slug}
                  publishedAt={post.publishedAt}
                />
                {post.summary ? (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {post.summary}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="relative">
        <label htmlFor="blog-search" className="sr-only">
          Search posts by title
        </label>
        <IconSearch
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
          aria-hidden
        />
        <input
          id="blog-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="FILTER_BY_TITLE"
          className={cn(
            "border-border bg-background text-foreground w-full rounded-md border py-2 pr-3 pl-9 font-mono text-xs",
            "placeholder:text-muted-foreground/50",
            "focus:border-primary focus:ring-primary focus:ring-1 focus:outline-none",
          )}
          autoComplete="off"
        />
      </div>

      {isSearching ? (
        !searchResults.length ? (
          <p className="text-foreground/70 text-sm">
            No posts match that filter.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {searchResults.map((post) => (
              <li key={post.slug}>
                <BlogPostLink
                  title={post.title}
                  slug={post.slug}
                  publishedAt={post.publishedAt}
                />
              </li>
            ))}
          </ul>
        )
      ) : (
        <div className="flex flex-col gap-12">
          {groups.map((group) => (
            <div key={group.label} className="flex flex-col gap-4">
              <h2 className="text-foreground/40 font-mono text-sm tracking-wide uppercase">
                {group.label}
              </h2>
              <ul className="flex flex-col gap-4">
                {group.posts.map((post) => (
                  <li key={post.slug}>
                    <BlogPostLink
                      title={post.title}
                      slug={post.slug}
                      publishedAt={post.publishedAt}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Container from "@/components/container";
import { DottedSeparator } from "@/components/separator";
import { BlogArticleShell } from "@/components/blog/blog-article-shell";
import { ClapButton } from "@/components/blog/clap-button";
import { NewsletterCTA } from "@/components/blog/newsletter-cta";
import {
  getPostBySlug,
  getPublishedPosts,
  getRelatedPosts,
  isNonCanonicalSlug,
  parseTags,
  resolveCanonicalSlug,
  resolvePostSeo,
  stripLeadingH1,
  SITE_URL,
} from "@/lib/blog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * The article shell already renders the post title as the page's only H1.
 * Post bodies authored via the admin/agent editors sometimes use `#` for
 * section headings, which produced 8 H1s on a single published post. Demote
 * any body-level H1 to H2.
 *
 * This runs on the parsed AST rather than as a regex over the raw markdown,
 * so a `#` inside a fenced code block — shell comments, for instance — is
 * left untouched.
 */
const markdownComponents = {
  h1: ({ node, ...props }) => <h2 {...props} />,
};

/** Keep post pages fresh when agents/admin publish via revalidatePath. */
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts();
    return posts
      .filter((post) => !isNonCanonicalSlug(post.slug))
      .map((post) => ({ slug: post.slug }));
  } catch {
    // Never fail the build if the data source is briefly unavailable;
    // pages still render on-demand via ISR (revalidate above).
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const url = `${SITE_URL}/blog/${resolveCanonicalSlug(post.slug)}`;
  const { title: seoTitle, description: articleDescription } =
    resolvePostSeo(post);
  const ogImage = post.image || post.coverImage || "/images/og-image.png";

  return {
    // `absolute` opts out of the root layout's "%s | Amit Kumar" template.
    // That suffix added 13 characters to every post title, pushing all of
    // them past Google's ~60-character display limit and getting the
    // meaningful end of the headline truncated in results.
    title: { absolute: seoTitle },
    description: articleDescription,
    alternates: { canonical: url },
    openGraph: {
      title: seoTitle,
      description: articleDescription,
      url,
      type: "article",
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || post.publishedAt || undefined,
      authors: ["Amit Kumar"],
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: articleDescription,
      images: [ogImage],
    },
    other: {
      "article:reading_time": post.readingTime?.replace(" min read", "") || "",
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  // Non-canonical duplicate slugs permanently redirect to their canonical URL.
  // Consolidates ranking signals and removes the duplicate from the index
  // instead of serving a second indexable page.
  if (isNonCanonicalSlug(slug)) {
    permanentRedirect(`/blog/${resolveCanonicalSlug(slug)}`);
  }

  const post = await getPostBySlug(slug);

  if (!post || post.status !== "published" || !post.publishedAt) {
    notFound();
  }

  const readingTime = Math.max(
    1,
    Math.ceil(post.content.split(/\s+/).filter(Boolean).length / 225),
  );
  const postTags = parseTags(post.tags);
  const related = await getRelatedPosts(post.slug, postTags, 5);
  const pageUrl = `${SITE_URL}/blog/${resolveCanonicalSlug(post.slug)}`;
  const { title: seoTitle, description: articleDescription } =
    resolvePostSeo(post);
  const ogImage =
    post.image || post.coverImage || `${SITE_URL}/images/og-image.png`;
  // Body often repeats the title as `# Heading`; shell already renders the H1.
  const bodyMarkdown = stripLeadingH1(post.content);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      { "@type": "ListItem", position: 3, name: post.title, item: pageUrl },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: seoTitle,
    description: articleDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    url: pageUrl,
    inLanguage: "en-US",
    wordCount: post.wordCount || undefined,
    keywords: postTags.length > 0 ? postTags.join(", ") : undefined,
    image: [ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`],
  };

  // Speakable schema — tells voice assistants (Google Assistant, Siri) which
  // text to read aloud when this page is the answer to a voice query.
  const speakableJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".prose > p:first-of-type"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
      />

      <Container className="pt-4">
        {/* Visible breadcrumb navigation — reinforces site hierarchy for
            both users and crawlers. Complements the BreadcrumbList JSON-LD
            above by giving crawlers a <nav> element to parse. */}
        <nav aria-label="Breadcrumb" className="text-muted-foreground mb-2 text-sm">
          <ol className="flex items-center gap-1.5" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/" itemProp="item" className="hover:underline">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <li aria-hidden className="text-foreground/30">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/blog" itemProp="item" className="hover:underline">
                <span itemProp="name">Blog</span>
              </Link>
              <meta itemProp="position" content="2" />
            </li>
            <li aria-hidden className="text-foreground/30">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name" className="text-foreground/70">{post.title}</span>
              <meta itemProp="position" content="3" />
            </li>
          </ol>
        </nav>
      </Container>

      <BlogArticleShell
        frontMatter={{
          title: post.title,
          publishedAt: post.publishedAt,
          summary: articleDescription,
          readingTime: { text: `${readingTime} min read` },
        }}
      >
        <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {bodyMarkdown}
        </Markdown>
      </BlogArticleShell>

      <Container>
        <ClapButton slug={post.slug} />
        <DottedSeparator className="my-8" />
        {related.length > 0 && (
          <section>
            <p className="text-foreground mb-4 text-sm font-semibold">
              More reading
            </p>
            <div className="space-y-4">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group block"
                >
                  <p className="text-foreground group-hover:text-primary text-sm font-medium transition-colors">
                    {item.title}
                  </p>
                  {item.excerpt || item.summary ? (
                    <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                      {(item.excerpt || item.summary || "").slice(0, 120)}
                      {(item.excerpt || item.summary || "").length > 120 ? "…" : ""}
                    </p>
                  ) : null}
                </Link>
              ))}
            </div>
            <DottedSeparator className="my-8" />
          </section>
        )}

        {/* Contextual CTA — only show on AI-agent-related posts where
            the reader is most likely to need production help. */}
        {postTags.some((t) =>
          ["hermes-agent", "openclaw", "ai-agents", "self-hosted-ai", "vps", "hetzner"].includes(t)
        ) && (
          <div className="rounded-lg border border-border/50 bg-card/30 p-5">
            <p className="text-foreground text-sm font-medium">
              Building AI agents for your business?
            </p>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              I design and ship production AI agents on Hermes and OpenClaw — self-hosted,
              model-agnostic, and tuned to how your team actually works.
            </p>
            <Link
              href="/agents"
              className="text-primary mt-3 inline-block text-xs font-medium hover:underline"
            >
              See what I build →
            </Link>
          </div>
        )}

        <DottedSeparator className="my-8" />
        <NewsletterCTA />
        <DottedSeparator className="my-8" />
      </Container>
    </>
  );
}

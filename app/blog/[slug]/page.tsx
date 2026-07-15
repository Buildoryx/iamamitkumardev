import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  parseTags,
  resolveCanonicalSlug,
  resolvePostSeo,
  stripLeadingH1,
  SITE_URL,
} from "@/lib/blog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Keep post pages fresh when agents/admin publish via revalidatePath. */
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts();
    return posts.map((post) => ({ slug: post.slug }));
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
    title: seoTitle,
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

      <Container className="pt-4">
        <Link
          href="/blog"
          className="text-muted-foreground text-sm hover:underline"
        >
          ← Back to blog
        </Link>
      </Container>

      <BlogArticleShell
        frontMatter={{
          title: post.title,
          publishedAt: post.publishedAt,
          summary: articleDescription,
          readingTime: { text: `${readingTime} min read` },
        }}
      >
        <Markdown remarkPlugins={[remarkGfm]}>{bodyMarkdown}</Markdown>
      </BlogArticleShell>

      <Container>
        <ClapButton slug={post.slug} />
        <DottedSeparator className="my-8" />
        {related.length > 0 && (
          <div>
            <p className="text-foreground mb-4 text-sm font-semibold">
              More writing
            </p>
            <div className="space-y-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>
            <DottedSeparator className="my-8" />
          </div>
        )}
        <NewsletterCTA />
        <DottedSeparator className="my-8" />
      </Container>
    </>
  );
}

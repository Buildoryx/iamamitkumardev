import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { getSupabaseClient, hasSupabaseConfig } from "./supabase";
import { SITE_URL } from "./site";

const root = process.cwd();

export { SITE_URL } from "./site";

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  publishedAt: string | null;
  summary: string | null;
  image: string | null;
  excerpt: string | null;
  coverImage: string | null;
  tags: string | null;
  readingTime: string;
  wordCount: number;
}

export interface Post extends PostSummary {
  content: string;
  status: string;
  metaTitle: string | null;
  metaDescription: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export const AUTHOR = {
  name: "Amit Kumar",
  url: SITE_URL,
  twitter: "@growthperclick",
} as const;

export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 238;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function parseTags(
  tags: string | string[] | null | undefined
): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(normalizeTag);
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed.map(normalizeTag) : [];
  } catch {
    return tags
      .split(",")
      .map((t) => normalizeTag(t.trim()))
      .filter(Boolean);
  }
}

export function serializeTags(tags: string[]): string {
  return JSON.stringify(tags);
}

/**
 * Remove a leading markdown H1 so the page shell can own the single document H1.
 * Handles ATX (`# Title`) and setext (`Title\n===`) forms, with optional BOM/whitespace.
 */
export function stripLeadingH1(content: string): string {
  if (!content) return content;
  return content
    .replace(/^\uFEFF?/, "")
    .replace(/^\s*#\s+[^\n]+\n+/, "")
    .replace(/^\s*[^\n]+\n={2,}\s*\n+/, "");
}

/** Prefer dedicated SEO fields, then excerpt/summary, then a safe fallback. */
export function resolvePostSeo(post: {
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  excerpt?: string | null;
  summary?: string | null;
}): { title: string; description: string } {
  const title = (post.metaTitle || post.title || "").trim() || post.title;
  const description =
    (post.metaDescription || post.excerpt || post.summary || "").trim() ||
    `Blog post by Amit Kumar — ${post.title}`;
  return { title, description };
}

function mapMdxToPostSummary(
  slug: string,
  data: Record<string, any>,
  content: string
): PostSummary {
  const normalizedContent = content
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/HighlightBox>\s+([^\n])/g, "</HighlightBox>\n\n$1");
  const wordCount = normalizedContent.split(/\s+/u).length;
  const rt = readingTime(normalizedContent);
  const summary = data.summary || data.description || null;
  const image = data.image || null;
  const tagsJson =
    Array.isArray(data.tags) && data.tags.length > 0
      ? JSON.stringify(data.tags)
      : typeof data.tags === "string"
      ? data.tags
      : null;

  return {
    id: slug,
    title: data.title || "",
    slug,
    publishedAt: data.publishedAt || null,
    summary,
    image,
    excerpt: summary,
    coverImage: image,
    tags: tagsJson,
    readingTime: rt.text,
    wordCount,
  };
}

function mapMdxToPost(
  slug: string,
  data: Record<string, any>,
  content: string
): Post {
  const summary = mapMdxToPostSummary(slug, data, content);
  const publishedAt = summary.publishedAt;

  return {
    ...summary,
    content,
    status: publishedAt ? "published" : "draft",
    metaTitle: null,
    metaDescription: null,
    authorId: "local-mdx",
    createdAt: publishedAt || new Date().toISOString(),
    updatedAt: publishedAt || new Date().toISOString(),
  };
}

type DbPostRow = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  status: string;
  tags: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  authorId: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function mapDbToPost(dbPost: DbPostRow): Post {
  const wordCount = dbPost.content.trim().split(/\s+/).length;
  return {
    id: dbPost.id,
    title: dbPost.title,
    slug: dbPost.slug,
    content: dbPost.content,
    excerpt: dbPost.excerpt,
    coverImage: dbPost.coverImage,
    summary: dbPost.excerpt,
    image: dbPost.coverImage,
    status: dbPost.status,
    tags: dbPost.tags,
    metaTitle: dbPost.metaTitle,
    metaDescription: dbPost.metaDescription,
    authorId: dbPost.authorId,
    publishedAt: dbPost.publishedAt,
    createdAt: dbPost.createdAt,
    updatedAt: dbPost.updatedAt,
    readingTime: `${estimateReadingTime(dbPost.content)} min read`,
    wordCount,
  };
}

async function getMdxFiles(): Promise<string[]> {
  try {
    return fs.readdirSync(path.join(root, "data", "blog"));
  } catch {
    return [];
  }
}

async function getMdxPostBySlug(slug: string): Promise<Post | null> {
  try {
    const source = fs.readFileSync(
      path.join(root, "data", "blog", `${slug}.mdx`),
      "utf8"
    );
    const { data, content } = matter(source);
    return mapMdxToPost(slug, data, content);
  } catch {
    return null;
  }
}

async function getMdxAllPosts(): Promise<Post[]> {
  const files = await getMdxFiles();
  const posts: Post[] = [];

  for (const file of files) {
    try {
      const source = fs.readFileSync(path.join(root, "data", "blog", file), "utf8");
      const { data, content } = matter(source);
      posts.push(mapMdxToPost(file.replace(".mdx", ""), data, content));
    } catch {
      // skip unreadable files
    }
  }

  return posts;
}

async function getMdxPublishedPosts(
  limit?: number,
  offset?: number
): Promise<Post[]> {
  const allPosts = await getMdxAllPosts();
  const posts = allPosts
    .filter((p) => p.publishedAt)
    .sort(
      (a, b) =>
        new Date(b.publishedAt || 0).getTime() -
        new Date(a.publishedAt || 0).getTime()
    );

  if (offset !== undefined) return posts.slice(offset, offset + (limit ?? 12));
  if (limit !== undefined) return posts.slice(0, limit);
  return posts;
}

export async function getAllFilesFrontMatter(): Promise<PostSummary[]> {
  const posts = await getMdxAllPosts();
  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    publishedAt: post.publishedAt,
    summary: post.summary,
    image: post.image,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    tags: post.tags,
    readingTime: post.readingTime,
    wordCount: post.wordCount,
  }));
}

export async function getPublishedPosts(
  limit?: number,
  offset?: number
): Promise<Post[]> {
  if (hasSupabaseConfig()) {
    const supabase = getSupabaseClient();
    let query = supabase
      .from("post")
      .select("*")
      .eq("status", "published")
      .not("publishedAt", "is", null)
      .order("publishedAt", { ascending: false });

    if (offset !== undefined) {
      query = query.range(offset, offset + (limit ?? 12) - 1);
    } else if (limit !== undefined) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((row) => mapDbToPost(row as DbPostRow));
  }

  return getMdxPublishedPosts(limit, offset);
}

export async function getPublishedPostCount(): Promise<number> {
  if (hasSupabaseConfig()) {
    const supabase = getSupabaseClient();
    const { count, error } = await supabase
      .from("post")
      .select("*", { count: "exact", head: true })
      .eq("status", "published")
      .not("publishedAt", "is", null);
    if (error) throw error;
    return count ?? 0;
  }

  const posts = await getMdxPublishedPosts();
  return posts.length;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (hasSupabaseConfig()) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("post")
      .select("*")
      .eq("slug", slug)
      .limit(1);
    if (error) throw error;
    return data?.[0] ? mapDbToPost(data[0] as DbPostRow) : null;
  }

  return getMdxPostBySlug(slug);
}

export async function getFileBySlug(slug: string): Promise<Post | null> {
  return getPostBySlug(slug);
}

export async function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  limit = 3
): Promise<Post[]> {
  const allPosts = await getPublishedPosts();
  const others = allPosts.filter((post) => post.slug !== currentSlug);

  if (tags.length === 0) {
    return others.slice(0, limit);
  }

  const tagged = others.filter((post) => {
    const postTags = parseTags(post.tags);
    return postTags.some((t) => tags.includes(t));
  });

  // Prefer topical overlap; backfill with latest so the block never looks empty.
  if (tagged.length >= limit) return tagged.slice(0, limit);
  const seen = new Set(tagged.map((p) => p.slug));
  const backfill = others.filter((p) => !seen.has(p.slug));
  return [...tagged, ...backfill].slice(0, limit);
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getPublishedPosts();
  const tagSet = new Set<string>();
  posts.forEach((post) => parseTags(post.tags).forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const normalizedTag = normalizeTag(tag);
  const posts = await getPublishedPosts();
  return posts.filter((post) => parseTags(post.tags).includes(normalizedTag));
}

#!/usr/bin/env node
/**
 * Publish markdown posts from data/blog/<slug>.mdx into the Supabase `post` table.
 *
 * Production reads posts from the database only (when Supabase is configured).
 * MDX files in this repo are the editorial source / drafts — this script is the
 * bridge that makes them live.
 *
 * Usage:
 *   node scripts/push-mdx-to-supabase.mjs <slug> [<slug>...]
 *   node scripts/push-mdx-to-supabase.mjs --all-seo
 *   node scripts/push-mdx-to-supabase.mjs deploy-hermes-agent-on-hetzner --dry-run
 *
 * Flags:
 *   --dry-run     Parse and print payload; do not write
 *   --update      If slug exists, update content/metadata instead of skipping
 *   --all-seo     Publish the AI-agent SEO cluster listed below
 *
 * Requires in env (.env or .env.local): PROJECT_URL (or NEXT_PUBLIC_SUPABASE_URL)
 * and SERVICE_ROLE.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import matter from "gray-matter";

const ROOT = process.cwd();

/** High-intent AI-agent posts that were written to disk but never made it live. */
const SEO_CLUSTER_SLUGS = [
  "deploy-hermes-agents-to-vps-the-right-way",
  "deploy-hermes-agent-on-hetzner",
  "best-vps-for-self-hosted-ai-agents-2026",
  "openhuman-vs-hermes-vs-openclaw",
  "run-14-ai-agents-on-single-hetzner-vps",
  "hostinger-vps-for-self-hosted-ai-agents",
];

const SITE_URL = "https://iamamitkumar.dev";
const DEFAULT_COVER = `${SITE_URL}/images/og-image.png`;
/** Must exist in public."user" (seeded by hermes_agent_blog migration). */
const AUTHOR_ID = "hermes-agent";

function loadEnv() {
  for (const file of [".env", ".env.local"]) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) continue;
    const content = fs.readFileSync(p, "utf8");
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
      if (!m) continue;
      const [, k, raw] = m;
      if (process.env[k]) continue;
      process.env[k] = raw.replace(/^["']|["']$/g, "");
    }
  }
}

loadEnv();

function stripLeadingH1(content) {
  if (!content) return content;
  return content
    .replace(/^\uFEFF?/, "")
    .replace(/^\s*#\s+[^\n]+\n+/, "")
    .replace(/^\s*[^\n]+\n={2,}\s*\n+/, "");
}

function truncate(str, max) {
  const s = (str || "").trim();
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

function serializeTags(tags) {
  if (!tags) return null;
  if (Array.isArray(tags)) return JSON.stringify(tags.map(String));
  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return JSON.stringify(parsed.map(String));
    } catch {
      /* fall through */
    }
    return JSON.stringify(
      tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    );
  }
  return null;
}

function resolveCoverImage(image) {
  if (!image || typeof image !== "string") return DEFAULT_COVER;
  const trimmed = image.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // Relative paths are not valid for DB coverImage consumers that expect http(s).
  // Prefer site OG until real covers are uploaded to Supabase Storage.
  if (trimmed.startsWith("/")) {
    const absolute = `${SITE_URL}${trimmed}`;
    // Local July posts reference cover.png files that do not exist in public/.
    if (trimmed.includes("/cover.png")) return DEFAULT_COVER;
    return absolute;
  }
  return DEFAULT_COVER;
}

function loadPost(slug) {
  const mdxPath = path.join(ROOT, "data", "blog", `${slug}.mdx`);
  if (!fs.existsSync(mdxPath)) {
    throw new Error(`file not found: ${mdxPath}`);
  }
  const source = fs.readFileSync(mdxPath, "utf8");
  const { data: fm, content: rawBody } = matter(source);
  const body = stripLeadingH1(rawBody).trim();
  const title = (fm.title || slug).trim();
  const summary = (fm.summary || fm.description || "").trim();
  const publishedAt = fm.publishedAt
    ? new Date(fm.publishedAt).toISOString()
    : new Date().toISOString();
  const metaTitle = truncate(fm.metaTitle || title, 70);
  const metaDescription = truncate(
    fm.metaDescription || summary || `Blog post by Amit Kumar — ${title}`,
    160,
  );

  return {
    id: crypto.randomUUID(),
    title,
    slug,
    content: body,
    excerpt: truncate(summary, 500) || null,
    coverImage: resolveCoverImage(fm.image || fm.coverImage),
    status: "published",
    tags: serializeTags(fm.tags),
    metaTitle,
    metaDescription,
    authorId: AUTHOR_ID,
    publishedAt,
    createdAt: publishedAt,
    updatedAt: new Date().toISOString(),
  };
}

function parseArgs(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith("--")));
  let slugs = argv.filter((a) => !a.startsWith("--"));
  if (flags.has("--all-seo")) {
    slugs = [...new Set([...SEO_CLUSTER_SLUGS, ...slugs])];
  }
  return {
    slugs,
    dryRun: flags.has("--dry-run"),
    update: flags.has("--update"),
  };
}

async function main() {
  const { slugs, dryRun, update } = parseArgs(process.argv.slice(2));
  if (slugs.length === 0) {
    console.error(
      "usage: node scripts/push-mdx-to-supabase.mjs <slug> [...] [--update] [--dry-run]\n" +
        "       node scripts/push-mdx-to-supabase.mjs --all-seo [--update] [--dry-run]",
    );
    process.exit(2);
  }

  const url =
    process.env.PROJECT_URL ||
    process.env.NEXT_PUBLIC_PROJECT_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SERVICE_ROLE;
  if (!url || !service) {
    console.error(
      "missing PROJECT_URL (or NEXT_PUBLIC_SUPABASE_URL) and SERVICE_ROLE",
    );
    process.exit(1);
  }

  const supabase = createClient(url, service);
  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const slug of slugs) {
    try {
      const row = loadPost(slug);
      console.log(`\n→ ${slug}`);
      console.log(`  title: ${row.title}`);
      console.log(`  words: ${row.content.split(/\s+/).filter(Boolean).length}`);
      console.log(`  cover: ${row.coverImage}`);
      console.log(`  metaTitle: ${row.metaTitle}`);
      console.log(`  metaDescription: ${row.metaDescription}`);

      if (dryRun) {
        console.log("  dry-run: not writing");
        ok++;
        continue;
      }

      const { data: existing, error: lookupError } = await supabase
        .from("post")
        .select("id, slug, status")
        .eq("slug", slug)
        .maybeSingle();

      if (lookupError) throw lookupError;

      if (existing) {
        if (!update) {
          console.log(`  skip: already exists (id=${existing.id}); pass --update to overwrite`);
          skipped++;
          continue;
        }
        const { error: updateError } = await supabase
          .from("post")
          .update({
            title: row.title,
            content: row.content,
            excerpt: row.excerpt,
            coverImage: row.coverImage,
            status: "published",
            tags: row.tags,
            metaTitle: row.metaTitle,
            metaDescription: row.metaDescription,
            publishedAt: row.publishedAt,
            updatedAt: row.updatedAt,
          })
          .eq("id", existing.id);
        if (updateError) throw updateError;
        console.log(`  updated id=${existing.id}`);
        ok++;
        continue;
      }

      const { data: inserted, error: insertError } = await supabase
        .from("post")
        .insert(row)
        .select("id, slug")
        .single();
      if (insertError) throw insertError;
      console.log(`  inserted id=${inserted.id}`);
      ok++;
    } catch (err) {
      failed++;
      const msg =
        err && typeof err === "object" && "message" in err
          ? `${err.message}${err.code ? ` (${err.code})` : ""}${err.details ? ` — ${err.details}` : ""}`
          : err instanceof Error
            ? err.message
            : String(err);
      console.error(`  ERROR: ${msg}`);
    }
  }

  console.log(`\nDone. ok=${ok} skipped=${skipped} failed=${failed}`);
  if (failed > 0) process.exit(1);
  if (!dryRun && ok > 0) {
    console.log(
      "\nNext: force ISR revalidation (agent PUT or deploy) so /blog, /sitemap.xml, /feed.xml refresh.",
    );
    console.log(
      "  Example: re-PUT each slug via /api/agents/blog/posts/:slug (HMAC) — that calls revalidatePath.",
    );
    console.log(
      "Then in GSC: resubmit sitemap and Request Indexing on the new URLs.",
    );
  }
}

main();

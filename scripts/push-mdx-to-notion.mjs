#!/usr/bin/env node
/**
 * Push an MDX blog post to the Notion content calendar.
 *
 * Usage:
 *   node scripts/push-mdx-to-notion.mjs <slug> [--status=draft|published]
 *
 * Examples:
 *   node scripts/push-mdx-to-notion.mjs deploy-hermes-agents-to-vps-the-right-way
 *   node scripts/push-mdx-to-notion.mjs my-post --status=published
 *
 * Reads from data/blog/<slug>.mdx, parses frontmatter, converts the
 * markdown body to Notion blocks via @tryfabric/martian, and creates
 * a page in NOTION_CONTENT_CALENDAR_DB_ID. By default the page is
 * created as a draft so you can review formatting in Notion before
 * flipping Status to "published".
 *
 * If a page with the same Slug already exists, the script aborts
 * (with the URL of the existing page) so we don't accidentally
 * overwrite.
 *
 * After the page is created, run "Sync from Notion" in your admin
 * dashboard to push it to Supabase and make it live on the blog.
 */

import fs from "node:fs";
import path from "node:path";
import { Client } from "@notionhq/client";
import matter from "gray-matter";
import { markdownToBlocks } from "@tryfabric/martian";

// Lazy-load env from .env / .env.local so we don't need a runner wrapper
function loadEnv() {
  const root = process.cwd();
  for (const file of [".env", ".env.local"]) {
    const p = path.join(root, file);
    if (!fs.existsSync(p)) continue;
    const content = fs.readFileSync(p, "utf8");
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
      if (!m) continue;
      const [, k, raw] = m;
      if (process.env[k]) continue;
      // strip surrounding quotes if any
      const v = raw.replace(/^["']|["']$/g, "");
      process.env[k] = v;
    }
  }
}

loadEnv();

const slugArg = process.argv[2];
if (!slugArg) {
  console.error("usage: node scripts/push-mdx-to-notion.mjs <slug> [--status=draft|published]");
  process.exit(2);
}

const statusArg = (process.argv.find((a) => a.startsWith("--status=")) || "--status=draft")
  .split("=")[1];
if (!["draft", "published"].includes(statusArg)) {
  console.error(`invalid --status=${statusArg}; must be 'draft' or 'published'`);
  process.exit(2);
}

const NOTION_TOKEN = process.env.NOTION_INTEGRATION_SECRET;
const DB_ID = process.env.NOTION_CONTENT_CALENDAR_DB_ID;
if (!NOTION_TOKEN || !DB_ID) {
  console.error("missing NOTION_INTEGRATION_SECRET or NOTION_CONTENT_CALENDAR_DB_ID");
  process.exit(1);
}

const mdxPath = path.join(process.cwd(), "data", "blog", `${slugArg}.mdx`);
if (!fs.existsSync(mdxPath)) {
  console.error(`file not found: ${mdxPath}`);
  process.exit(1);
}

const source = fs.readFileSync(mdxPath, "utf8");
const { data: fm, content: body } = matter(source);

const title = fm.title;
const slug = slugArg;
const summary = fm.summary || fm.description || null;
const publishedAt = fm.publishedAt || new Date().toISOString().slice(0, 10);
const tags = Array.isArray(fm.tags) ? fm.tags : [];

if (!title) {
  console.error("frontmatter missing 'title'");
  process.exit(1);
}

console.log(`→ pushing "${title}"`);
console.log(`  slug:        ${slug}`);
console.log(`  status:      ${statusArg}`);
console.log(`  publishedAt: ${publishedAt}`);
console.log(`  tags:        [${tags.join(", ")}]`);
console.log(`  body length: ${body.length} chars (${body.split("\n").length} lines)`);

const notion = new Client({ auth: NOTION_TOKEN });

// Pre-flight: confirm no existing page with same slug (refuse overwrite by default)
const existing = await notion.databases.query({
  database_id: DB_ID,
  filter: { property: "Slug", rich_text: { equals: slug } },
});
if (existing.results.length > 0) {
  const url = existing.results[0].url;
  console.error(`✖ a page with slug="${slug}" already exists in Notion:`);
  console.error(`  ${url}`);
  console.error(
    "  delete or rename that page in Notion first, or change the slug, then re-run.",
  );
  process.exit(1);
}

// Convert markdown to Notion blocks (martian).
// strictImageUrls=false lets relative image paths through (we have none here).
const blocks = markdownToBlocks(body, { strictImageUrls: false });
console.log(`  blocks generated: ${blocks.length}`);

// Notion API: max 100 blocks per request when creating a page.
// If we have more, create with first 100 and append the rest in batches.
const FIRST_BATCH = blocks.slice(0, 100);
const REST = blocks.slice(100);

// Truncate summary to fit Notion rich_text 2000-char limit (defensive).
const safeSummary = summary ? String(summary).slice(0, 1900) : null;

const page = await notion.pages.create({
  parent: { database_id: DB_ID },
  properties: {
    Title: { title: [{ text: { content: title.slice(0, 1900) } }] },
    Slug: { rich_text: [{ text: { content: slug } }] },
    Status: { select: { name: statusArg } },
    "Published At": { date: { start: publishedAt } },
    ...(tags.length > 0 && {
      Tags: { multi_select: tags.map((name) => ({ name })) },
    }),
    ...(safeSummary && {
      Excerpt: { rich_text: [{ text: { content: safeSummary } }] },
    }),
  },
  children: FIRST_BATCH,
});

console.log(`✓ page created (${FIRST_BATCH.length} blocks attached)`);
console.log(`  url: ${page.url}`);

// Append remaining blocks in chunks of 100
if (REST.length > 0) {
  console.log(`  appending ${REST.length} more blocks in chunks...`);
  for (let i = 0; i < REST.length; i += 100) {
    const chunk = REST.slice(i, i + 100);
    await notion.blocks.children.append({
      block_id: page.id,
      children: chunk,
    });
    console.log(`  +${chunk.length} blocks (${i + chunk.length}/${REST.length})`);
  }
}

console.log("");
console.log("✓ done.");
console.log(`  open in Notion: ${page.url}`);
console.log("  next: review formatting → flip Status to 'published' →");
console.log("        click 'Sync from Notion' in /admin/dashboard");

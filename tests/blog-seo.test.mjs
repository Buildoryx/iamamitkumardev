import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

// blog.ts is TypeScript; test pure helpers by inlining the same logic
// (kept in sync with lib/blog.ts stripLeadingH1 / resolvePostSeo).

function stripLeadingH1(content) {
  if (!content) return content;
  return content
    .replace(/^\uFEFF?/, "")
    .replace(/^\s*#\s+[^\n]+\n+/, "")
    .replace(/^\s*[^\n]+\n={2,}\s*\n+/, "");
}

function resolvePostSeo(post) {
  const title = (post.metaTitle || post.title || "").trim() || post.title;
  const description =
    (post.metaDescription || post.excerpt || post.summary || "").trim() ||
    `Blog post by Amit Kumar — ${post.title}`;
  return { title, description };
}

test("stripLeadingH1 removes ATX title", () => {
  const out = stripLeadingH1("# Hello World\n\nBody paragraph.\n");
  assert.equal(out, "Body paragraph.\n");
});

test("stripLeadingH1 removes setext title", () => {
  const out = stripLeadingH1("Hello World\n===========\n\nBody.\n");
  assert.equal(out, "Body.\n");
});

test("stripLeadingH1 leaves body-only content alone", () => {
  const src = "## Section\n\nText.\n";
  assert.equal(stripLeadingH1(src), src);
});

test("resolvePostSeo prefers meta fields", () => {
  const { title, description } = resolvePostSeo({
    title: "Long display title that is fine for H1",
    metaTitle: "Short SEO Title",
    metaDescription: "Query-matched description under 160 chars.",
    excerpt: "Narrative excerpt that should lose.",
    summary: "Summary that should lose.",
  });
  assert.equal(title, "Short SEO Title");
  assert.equal(description, "Query-matched description under 160 chars.");
});

test("resolvePostSeo falls back to excerpt then summary", () => {
  const a = resolvePostSeo({
    title: "T",
    excerpt: "From excerpt",
    summary: "From summary",
  });
  assert.equal(a.description, "From excerpt");
  const b = resolvePostSeo({ title: "T", summary: "From summary" });
  assert.equal(b.description, "From summary");
});

#!/usr/bin/env node
/**
 * jev-serp-audit.mjs — End-to-end SERP audit of iamamitkumar.dev via Jev (TypeSafe System One).
 *
 * Evidence state below was collected on 2026-09-21 by direct inspection:
 * live HTTP responses (sitemap.xml, robots.txt, feed.xml, page HTML, headers),
 * the Supabase `post` table (26 published rows), git history (deployed vs local
 * commits), and the site's own SEO planning docs. Jev supplies the judgments;
 * every fact in `state` was verified by code, not assumed.
 *
 * Usage: node scripts/jev-serp-audit.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { choice, noul, score, TypeSafeClient } from "@typesafe-ai/sdk";

const env = Object.fromEntries(
  readFileSync(".env", "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)].map((s) => s.trim())),
);

if (!env.TYPESAFE_API_KEY) {
  console.error("TYPESAFE_API_KEY missing from .env");
  process.exit(1);
}

const client = new TypeSafeClient({
  apiKey: env.TYPESAFE_API_KEY,
  baseURL: "https://api.typesafe.ai",
});

/** Verified evidence — see header comment. */
const state = {
  site: {
    domain: "iamamitkumar.dev",
    stack: "Next.js App Router, deployed on Vercel behind Cloudflare",
    production_build: "2026-07-27 (commit 652af57). A newer local commit 7af3817 (2026-09-20) adding FAQPage, WebSite SearchAction, blog-index ItemList, Speakable, visible breadcrumbs, related-posts with excerpts, contextual CTAs, and a sitemap revalidate fix was NEVER pushed to GitHub and is NOT live.",
  },
  search_console: {
    window: "last 6 months",
    clicks: 4,
    impressions: 112,
    ctr_percent: 3.6,
    indexed_surface: "site: query surfaces only 4 head pages (/, /agents, /blog, /tweets). None of the 25 blog posts surface. A repo comment records two sitemap-listed posts flagged 'URL is unknown to Google' in GSC.",
  },
  sitemap: {
    live_urls: 23,
    static_urls: 7,
    blog_urls_in_sitemap: 16,
    db_published_posts: 26,
    canonical_posts: 25,
    missing_from_sitemap: 9,
    missing_posts: [
      "ai-agent-budget-guardrails-runaway-loops (published Jul 31)",
      "ai-agent-tool-call-verification (Aug 4)",
      "ai-agent-failures-model-or-harness (Aug 7)",
      "context-engineering-ai-agents-practical-guide (Aug 14)",
      "how-to-build-your-own-mcp-server (Aug 18)",
      "when-to-use-ai-agents-vs-scripts (Aug 25)",
      "ai-agent-observability-in-production (Aug 21)",
      "a2a-protocol-vs-mcp-what-it-actually-solves (Aug 28)",
      "how-to-build-ai-agents-that-get-cited-in-ai-search (Sep 11)",
    ],
    cause: "sitemap.xml is a Next.js MetadataRoute prerendered at build time. Its ISR never revalidates in production: edge cache age grows unbounded and content is frozen at the 2026-07-27 build's database snapshot (newest lastmod 2026-07-21). The deployed getPublishedPosts query returns 26 rows today, so fresh regeneration would list 25 blog URLs. The RSS feed (app route handler with Cache-Control s-maxage=3600) stays fresh with all 26 posts, proving the route-handler pattern works on this exact stack.",
    lastmod_policy: "Static routes honestly omit lastmod; blog posts use real updatedAt.",
  },
  redirects: {
    http_to_https: "308 single-hop",
    www_to_apex: "308 single-hop",
    trailing_slash: "308 to clean URL",
    non_canonical_slug: "308 to canonical post",
    unknown_slug: "404",
  },
  robots: {
    policy: "Googlebot/Bingbot + AI bots (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended, Applebot-Extended, DuckAssistBot, YouBot) allowed; scraper bots (AhrefsBot, SemrushBot, Bytespider, CCBot, MJ12bot, DotBot, PetalBot, Amazonbot, DataForSeoBot) blocked; /admin, /api/admin, /api/auth disallowed; sitemap referenced; Content-Signal: ai-train=no, search=yes, ai-input=yes (also sent as HTTP header).",
  },
  live_schema: {
    present: ["Person", "WebSite (without SearchAction)", "Organization", "ItemList on homepage (3 products)", "Blog + BlogPosting stubs on /blog", "BlogPosting on posts", "BreadcrumbList on posts"],
    missing: ["FAQPage", "WebSite SearchAction", "SpeakableSpecification", "ItemList on blog index", "HowTo (nowhere on site)"],
  },
  page_meta: {
    homepage: { title_chars: 45, meta_description_chars: 148, h1_count: 1, visible_words: 837 },
    blog_index: { title_chars: 53, meta_description_chars: 143, defect: "og:title falls back to the homepage OG title instead of the blog page title" },
    blog_post_example: { title_chars: 43, meta_description_chars: 108, h2_count: 15, visible_words: 2040, defect: "og:image is the generic site image, not post-specific" },
  },
  content: {
    posts: "26 published (25 canonical), focused on production AI agents: self-hosting, Hermes/OpenClaw, MCP, Hetzner VPS, prompt injection defense, memory, testing, observability, budget guardrails. Posts are long, specific, first-person, with real configs and numbers.",
    openings: "Posts open with a one-line summary then narrative; not consistently answer-first.",
    missing_elements: ["key-takeaway boxes", "author expertise bylines with experience claims", "HowTo markup on the two step-by-step deploy guides"],
  },
  internal_linking: {
    live_state: "The live deploy guide contains 8 contextual links to other posts; the blog index links all 25 posts; the homepage has a 'Start here for AI agents' hub block linking /agents, /tools and 4 key posts; agent posts cross-link each other.",
    missing: "No pillar/hub page for the self-hosted-agents topic cluster (planned as P1 twice, never built).",
  },
  offsite_authority: {
    executed_outreach: "Zero. The submission tracker lists 22 targets, all still Todo/Queue/Pitching/Review/Backlog.",
    tracker_drift: "The tracker targets 8 URLs that do not exist on the site (/projects/openclaw-mission-control, /projects/jarvis, /projects/sprintlabs, /logs/* articles) — superseded by a reconciled backlink plan listing only real URLs; the tracker was never updated to match.",
    referring_domains: "Near zero. Site pivoted to AI-agents content in March 2026.",
  },
  known_defects: [
    "RSS feed includes the non-canonical duplicate slug (sitemap and blog index filter it correctly)",
    "vercel.json cron points to /api/seo/flywheel which was deleted from the repo — dead cron 404s daily",
    "Stale top-level blog/ directory with 6 duplicate MDX files plus dead renderer code (BlogPostClient.tsx, BlogPostRenderer.tsx, lib/mdx.ts) — flagged P1 in a prior audit, never cleaned",
    "X-Robots-Tag 'index,follow' is applied to /api/* responses as well as pages",
    "SearchAction (in the undeployed commit) targets /blog?q= but the blog index filters only client-side; ?q= is not honored server-side",
    "sitemap.ts comment says 'all ten pages' but 7 static routes exist",
  ],
};

const rubric5 = (zero, one, two, three, four) => [zero, one, two, three, four];

const result = await client.systemOne({
  model: "jev-latest",
  state,
  questions: {
    technical_seo: score(
      "Score the site's technical SEO plumbing (redirects, host canonicalization, robots policy, index directives) as described in `redirects`, `robots`, and `known_defects`.",
      rubric5(
        "Crawl-blocking failures: broken redirects, duplicate hosts both resolving 200, or robots/canonical signals contradicting each other",
        "Redirects and robots basically work but real defects leak equity: redirect chains, missing canonicals, or contradictory index headers",
        "Correct host canonicalization and robots policy; isolated defects remain, like a blanket X-Robots-Tag on API routes or minor inconsistencies",
        "Clean single-hop redirects on every variant and consistent index directives; only cosmetic issues remain",
        "Nothing to fix: every variant redirects in one hop, robots and headers deliberate and consistent, canonicals exact on all pages",
      ),
    ),
    sitemap_health: score(
      "Score sitemap health given `sitemap`: 9 of 25 canonical posts are missing from the live sitemap because it is frozen at a build-time snapshot.",
      rubric5(
        "Sitemap missing, invalid, or contradicting robots/noindex directives",
        "Sitemap stale or missing a large share of indexable URLs; Google cannot rely on it or its lastmod",
        "Sitemap covers most URLs but freshness is unreliable: new posts lag for weeks and lastmod trust is mixed",
        "Sitemap closely matches the database with honest lastmod; only occasional lag on brand-new posts",
        "Sitemap current within minutes, covers every canonical URL, excludes noindex pages, lastmod always honest",
      ),
    ),
    indexability: score(
      "Score how discoverable/indexable the site's pages are by Google right now, given `sitemap`, `search_console`, and `internal_linking`.",
      rubric5(
        "Key pages error out or are accidentally noindex",
        "Many important pages absent from the sitemap AND weakly linked, so Google discovers them late or never",
        "All pages reachable, but discovery depends on crawl luck; no reliable sitemap push for new posts",
        "All canonical URLs in the sitemap and internally linked; new posts appear in the sitemap promptly",
        "Everything in level three plus indexing actively nudged via IndexNow/GSC requests and verified in Search Console",
      ),
    ),
    structured_data: score(
      "Score the live structured data given `live_schema` (what is actually served in production HTML today).",
      rubric5(
        "No JSON-LD or invalid JSON-LD",
        "Basic entity schema only (Person/WebSite); article and breadcrumb types missing or erroring",
        "Person, WebSite, Organization, BlogPosting, BreadcrumbList present and valid; but no answer-engine types (FAQ, HowTo, Speakable, SearchAction, ItemList)",
        "Full set including FAQ/SearchAction/ItemList; minor gaps like HowTo on guides or one type with warnings",
        "Gold standard: every eligible type present, valid, entity-linked with @id references, zero errors",
      ),
    ),
    content_aeo: score(
      "Score answer-engine readiness of the blog content given `content`.",
      rubric5(
        "Content not extractable: walls of narrative with no quotable answers",
        "Posts open with narrative; no quotable definition paragraphs, no takeaway boxes, no bylines",
        "Some posts open answer-first; takeaways or bylines present on a minority of posts",
        "Most posts open with a 1-2 sentence direct answer; key-takeaway boxes and expertise bylines on most posts",
        "Every post: answer-first opening, takeaway box, expertise byline, citable stats and definitions throughout",
      ),
    ),
    internal_linking: score(
      "Score the internal linking architecture given `internal_linking`.",
      rubric5(
        "Pages are islands with no contextual links",
        "Sparse or tag-only linking; no hubs; commercial pages never linked from content",
        "Good contextual links across posts plus a homepage hub block, but no pillar page for the main topic cluster",
        "Contextual links plus a pillar/hub page linking every spoke; commercial pages linked contextually",
        "Full hub-and-spoke: pillar per cluster, series navigation, contextual CTAs, commercial pages linked from every relevant post",
      ),
    ),
    offsite_authority: score(
      "Score offsite authority given `offsite_authority` and `search_console`.",
      rubric5(
        "No web presence beyond the domain itself",
        "Zero executed outreach; plans exist but target stale or nonexistent URLs; no earned links; entity limited to social profiles",
        "A few profile/directory links live; editorial outreach started but nothing landed",
        "Consistent link velocity: several relevant referring domains earned over months; cross-posting with canonicals",
        "Recognized topical authority: editorial links from relevant publications, citations in AI answers, strong branded search demand",
      ),
    ),
    serp_presence: score(
      "Score actual Google SERP presence given `search_console` (4 clicks, 112 impressions in 6 months).",
      rubric5(
        "Site effectively invisible: impressions near zero, key pages not indexed",
        "Head pages only surface; content pages rarely impress (under ~20 impressions/month site-wide)",
        "Content pages surface occasionally for long-tails; average position outside top 20",
        "Regular impressions across the cluster; several pages ranking 10-20; brand queries won",
        "Top-3 rankings for cluster head terms; growing impressions; featured snippets or AI citations appearing",
      ),
    ),
    top_lever: choice(
      "Pick the single change most likely to grow organic clicks in the next 90 days, given all supplied evidence.",
      {
        deploy_unpushed_commit: "Push and deploy the 2026-09-20 commit so FAQPage, SearchAction, ItemList, Speakable, and breadcrumbs actually reach production",
        fix_sitemap_freshness: "Convert sitemap.xml from the frozen prerendered route to a fresh route handler (the feed.xml pattern) so all 25 canonical posts reach Google",
        build_pillar_page: "Create the missing self-hosted-AI-agents pillar page linking every cluster spoke",
        execute_outreach_wave: "Execute the first backlink wave (GitHub profile, Dev.to/Hashnode cross-posts with canonicals, one HN Show HN) after reconciling the stale tracker",
        gsc_indexing_push: "Resubmit the sitemap and request indexing for all URLs in Google Search Console, plus IndexNow ping for every URL",
        aeo_content_upgrades: "Answer-first openings, key-takeaway boxes, expertise bylines, and HowTo markup on the two deploy guides",
      },
    ),
    second_lever: choice(
      "After the top lever, which change is the next most valuable for organic growth?",
      {
        deploy_unpushed_commit: "Push and deploy the 2026-09-20 commit",
        fix_sitemap_freshness: "Make the sitemap always-fresh via a route handler",
        build_pillar_page: "Build the self-hosted-agents pillar page",
        execute_outreach_wave: "Execute the first backlink wave after reconciling the tracker",
        gsc_indexing_push: "GSC sitemap resubmission plus per-URL indexing requests",
        aeo_content_upgrades: "Answer-first openings, takeaways, bylines, HowTo markup",
      },
    ),
    ship_gate: choice(
      "A fix package is staged: push and deploy the missing commit; convert sitemap.xml to an always-fresh route handler; filter the non-canonical slug from the feed; fix the blog og:title; delete the stale duplicate MDX directory and dead renderer code; reconcile the outreach tracker to real URLs. Decide how it should ship.",
      {
        ship_now: "No user review needed: changes are additive, reversible, and verified by build/type-check",
        ship_after_review: "Show the user a diff summary and get a go-ahead before pushing to production",
        hold: "Something in the package is risky enough to rework first",
      },
    ),
    pillar_scope: choice(
      "If the self-hosted-AI-agents pillar page is built in this pass, which scope fits best given the site's current state?",
      {
        concise_hub: "A 600-900 word curated guide that defines the topic and links every spoke with one-line descriptions — fast, honest, immediately useful",
        full_guide: "A 2000+ word definitive pillar targeting the head term, expanded later with a section per spoke",
        defer: "Skip the pillar this pass; discovery and deployment fixes matter more right now",
      },
    ),
    deploy_drift_is_primary: noul(
      "Is the undeployed 2026-09-20 commit the primary reason the live site lacks FAQPage, SearchAction, ItemList, and Speakable schema?",
      { true: "Yes — the code exists in the local commit and is absent from production HTML", false: "No — some other cause, like schema code failing at runtime, explains the absence" },
    ),
    sitemap_frozen_is_primary: noul(
      "Is the frozen build-time sitemap the primary reason Google has not discovered the 9 newest posts?",
      { true: "Yes — the posts return 200 and are internally linked, but absent from the sitemap Google reads", false: "No — another factor like domain authority or crawl frequency dominates" },
    ),
    content_is_binding_constraint: noul(
      "Is the existing content strong enough that discovery and authority — not content rewriting — are the binding constraints on traffic?",
      { true: "Yes — posts are deep, specific, and experience-based; distribution is the bottleneck", false: "No — the content itself needs rework before distribution matters" },
    ),
    howto_worth_it: noul(
      "Would adding HowTo markup to the two step-by-step deployment guides meaningfully improve rich-result eligibility?",
      { true: "Yes — they are genuine step-by-step tutorials eligible for HowTo rich results", false: "No — marginal or ineligible" },
    ),
  },
});

const answers = result.answers;
const to10 = (s) => Math.round(s.score * 2.5 * 10) / 10;

console.log("═".repeat(72));
console.log(" JEV SERP AUDIT — iamamitkumar.dev — 2026-09-21");
console.log(` model: ${result.model} | tokens in/out: ${result.usage.input_tokens}/${result.usage.output_tokens}`);
console.log("═".repeat(72));

console.log("\n── DIMENSION SCORES (rubric 0-4 → /10) ──");
const dims = [
  ["technical_seo", "Technical SEO plumbing"],
  ["sitemap_health", "Sitemap health"],
  ["indexability", "Indexability / discovery"],
  ["structured_data", "Structured data (live)"],
  ["content_aeo", "Content AEO readiness"],
  ["internal_linking", "Internal linking"],
  ["offsite_authority", "Offsite authority"],
  ["serp_presence", "SERP presence (GSC)"],
];
const scores = {};
for (const [key, label] of dims) {
  const a = answers[key];
  scores[key] = { ten: to10(a), raw: a.score, confidence: a.confidence };
  const bar = "█".repeat(Math.round(a.score)) + "░".repeat(4 - Math.round(a.score));
  console.log(` ${label.padEnd(26)} ${bar} ${String(to10(a)).padStart(4)}/10  (conf ${(a.confidence * 100).toFixed(0)}%)`);
}
const overall = Math.round((Object.values(scores).reduce((t, s) => t + s.ten, 0) / dims.length) * 10) / 10;
console.log(` ${"OVERALL".padEnd(26)} ${" ".repeat(5)}${String(overall).padStart(4)}/10`);

console.log("\n── PRIORITIES ──");
for (const key of ["top_lever", "second_lever"]) {
  const a = answers[key];
  const top3 = Object.entries(a.probabilities).sort((x, y) => y[1] - x[1]).slice(0, 3);
  console.log(` ${key}: ${a.choice}  (conf ${(a.confidence * 100).toFixed(0)}%)`);
  for (const [label, p] of top3) console.log(`    ${label}: ${(p * 100).toFixed(0)}%`);
}

console.log("\n── DECISIONS ──");
const ship = answers.ship_gate;
console.log(` ship gate: ${ship.choice.toUpperCase()}  (conf ${(ship.confidence * 100).toFixed(0)}%)`);
const pillar = answers.pillar_scope;
console.log(` pillar scope: ${pillar.choice}  (conf ${(pillar.confidence * 100).toFixed(0)}%)`);

console.log("\n── DIAGNOSTICS (P(yes)) ──");
for (const key of ["deploy_drift_is_primary", "sitemap_frozen_is_primary", "content_is_binding_constraint", "howto_worth_it"]) {
  const a = answers[key];
  console.log(` ${key}: ${(a.noul * 100).toFixed(0)}%`);
}

console.log("\n" + "═".repeat(72));

writeFileSync(
  "scripts/jev-serp-audit-latest.json",
  JSON.stringify({ ranAt: new Date().toISOString(), model: result.model, scores, overall, priorities: { top: answers.top_lever.choice, second: answers.second_lever.choice }, shipGate: ship.choice, pillarScope: pillar.choice, nouls: Object.fromEntries(["deploy_drift_is_primary", "sitemap_frozen_is_primary", "content_is_binding_constraint", "howto_worth_it"].map((k) => [k, answers[k].noul])), raw: result }, null, 2),
);
console.log("Saved: scripts/jev-serp-audit-latest.json");

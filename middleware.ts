import { NextRequest, NextResponse } from "next/server";

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function acceptsMarkdown(acceptHeader: string): boolean {
  return acceptHeader
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .some((part) => {
      const [mediaType, ...parameters] = part
        .split(";")
        .map((value) => value.trim());
      const q = parameters
        .find((parameter) => parameter.startsWith("q="))
        ?.slice(2);

      return mediaType === "text/markdown" && q !== "0" && q !== "0.0";
    });
}

function titleFromPath(pathname: string): string {
  if (pathname === "/") return "Amit Kumar";

  return pathname
    .split("/")
    .filter(Boolean)
    .at(-1)!
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function pageMarkdown(pathname: string): {
  title: string;
  description: string;
  body: string;
} {
  if (pathname === "/") {
    return {
      title: "Amit Kumar | Production AI Agents, MCP Tools & Automation Systems",
      description:
        "I build production AI agents, MCP tools, self-hosted automations, and multi-agent workflows for founders and teams using Hermes, OpenClaw, Claude, OpenAI, Supabase, and Next.js.",
      body: `I build **production AI agents**, MCP tools, self-hosted automations, and multi-agent workflows for founders and teams. Agents that live inside real tools — Telegram, Slack, Discord, Postgres, Notion, CRMs, and internal ops systems.

## Hire / services

- [Production AI agent development](/agents) — Hermes (Nous Research) & OpenClaw builds, self-hosted and model-agnostic
- [AI agent tools I use](/tools) — practical stack notes for builders

## Technical writing

- [Blog](/blog) — deploy guides, framework comparisons, production hardening
- [Deploy Hermes Agent on Hetzner](/blog/deploy-hermes-agent-on-hetzner)
- [OpenHuman vs Hermes vs OpenClaw](/blog/openhuman-vs-hermes-vs-openclaw)
- [Best VPS for self-hosted AI agents (2026)](/blog/best-vps-for-self-hosted-ai-agents-2026)
- [How I run 14 AI agents on one Hetzner VPS](/blog/run-14-ai-agents-on-single-hetzner-vps)

## Products

- [InvoBill](/projects/invobill) — inventory, GST billing, accounting, CRM for Indian SMBs ([invobill.xyz](https://invobill.xyz))
- [LaunchSuite.tech](https://launchsuite.tech) — SaaS boilerplate MVP for founders

## Social

- [X / Twitter](https://x.com/growthperclick)
- [Substack](https://substack.com/@growthperclick)
- [GitHub](https://github.com/ravenrepo)

## Explore

- [Home](https://iamamitkumar.dev/)
- [Newsletter](/newsletter)
- [Workflow](/workflow)
`,
    };
  }

  if (pathname === "/projects/invobill") {
    return {
      title:
        "InvoBill — Inventory, GST Billing & Accounting Platform for Indian SMBs | Amit Kumar",
      description:
        "InvoBill is a live business management platform for Indian SMBs with inventory, GST billing, accounting, attendance, CRM, lead management, and financial reporting in one system.",
      body: `# InvoBill

InvoBill is a live business management platform for Indian SMBs. It combines inventory management, GST billing, accounting, team attendance, CRM, lead management, expenses, and financial reporting in one system.

## Live site

- [invobill.xyz](https://invobill.xyz)

## Core modules

- Inventory management — multi-warehouse stock tracking, low-stock alerts, SKUs, barcode workflows, and inventory valuation.
- GST billing and invoicing — GST-compliant invoices with CGST, SGST, IGST calculations, payment tracking, and reminders.
- Accounting and finance — double-entry bookkeeping, chart of accounts, trial balance, balance sheet, P&L, cash flow, GST, and TDS visibility.
- Team and attendance — employee attendance, shifts, leave, location-aware tracking, and team operations.
- CRM and leads — lead tracking, activity logs, sales pipeline visibility, conversion analytics, and follow-up management.

## Built for

Indian businesses that want operational visibility across stock, invoices, expenses, leads, teams, and financial reports without stitching together multiple tools.
`,
    };
  }

  if (pathname === "/blog") {
    return {
      title: "Blog — Founder Notes & Build Logs | Amit Kumar",
      description:
        "Founder notes, build logs, and technical writing on shipping products, AI systems, and growth experiments.",
      body: `Founder notes, build logs, and technical writing on shipping products, AI systems, and growth experiments.

## Recent writing

- [Deploy Hermes Agent on Hetzner](/blog/deploy-hermes-agent-on-hetzner)
- [Best VPS for self-hosted AI agents (2026)](/blog/best-vps-for-self-hosted-ai-agents-2026)
- [OpenHuman vs Hermes vs OpenClaw](/blog/openhuman-vs-hermes-vs-openclaw)
- [How I run 14 AI agents on one Hetzner VPS](/blog/run-14-ai-agents-on-single-hetzner-vps)
- [How to Set Up OpenClaw: A Builder's Honest Setup Guide (2026)](/blog/how-to-set-up-openclaw-a-builder-s-honest-setup-guide-2026)
- [Why Your AI Agent Pilot Never Makes It to Production](/blog/ai-agent-pilot-to-production)
- [MCP and safe tool use](/blog/why-your-ai-agent-cant-use-tools-safely-how-mcp-fixes-it)

## Stay in the loop

Get build logs, shipping notes, and AI product breakdowns delivered to your inbox. No spam — just the stuff worth reading.
`,
    };
  }

  if (pathname === "/agents") {
    return {
      title:
        "Production AI Agent Development Services — Hermes & OpenClaw | Amit Kumar",
      description:
        "Production AI agents built on Hermes (Nous Research) and OpenClaw — self-hosted, model-agnostic, tuned to your business. Personal AI for founders, business intelligence agents for teams, ops agents in Telegram, Slack, Discord.",
      body: `I build production-grade AI agents on **Hermes** (by [Nous Research](https://nousresearch.com/)) and **OpenClaw**. Self-hosted. Model-agnostic. Tuned to how your business actually runs.

## The stack — Hermes & OpenClaw

### Hermes Agent (Nous Research, MIT)

Self-improving agent that builds and refines its own skills from experience, remembers across sessions, lives across Telegram, Slack, Discord, WhatsApp, Signal, and CLI from one gateway, runs scheduled crons, and spawns subagents for parallel work. Use any model — OpenAI, Anthropic, OpenRouter, Nous Portal, or your own endpoint.

Repo: <https://github.com/NousResearch/hermes-agent>

### OpenClaw (Peter Steinberger, MIT)

Self-hosted, messaging-first agent framework. Markdown-based memory (\`SOUL.md\`), plugin pipeline, runs on your own hardware. The simplest path to an agent that's actually yours.

Repo: <https://github.com/openclaw/openclaw>

## Why open-source

- **You own the agent.** Your stack, your data, your weights, your bill. Vendor lock-in is a choice, not a necessity.
- **Any model, any time.** Swap GPT-5 for Claude or Llama in one config line. No rewrites.
- **It compounds.** Memory and skills accrue inside your system. Every week, your agent gets sharper at *your* work — not someone else's average user.

## What I build

1. **Personal AI assistant.** A senior chief-of-staff in Telegram or Slack. Reads inbox, manages calendar, runs scheduled briefings, remembers everyone you've talked to.
2. **Business intelligence agent.** Wired into Postgres, Notion, Stripe, GA4, your CRM. Answers in plain English, writes weekly reports, flags anomalies, acts when you say go.
3. **Ops & workflow agent.** Lead triage, customer support tier-zero, internal RAG, scheduled reports, alert routing, code review companions.

## Who it's for

- Founders & indie hackers who want a personal AI that lives in Telegram and isn't tied to one vendor.
- Agencies & operators who want agents that actually do the work — hooked into their tools, not floating in a third-party UI.
- Businesses building intelligence layers — sales copilot, finance reviewer, support tier-zero — behind their own firewall.

## Proof: 14 specialist agents in production on Hermes

A working autonomous agent operating system on a private VPS — continuous uptime, real tasks shipped end-to-end, audit trail for every decision. Identity-first design (\`SOUL.md\` + \`AGENTS.md\`), SQLite kanban for coordination, credential pool with auto-rotation and provider fallback, Discord-first ops with cron, Tailscale-only networking, two-layer memory (recent context + cross-session vector store).

## Hermes vs OpenClaw — which one?

- **Hermes** if you want self-improving agents, scheduled crons, subagent spawning, multi-channel gateway out of the box, and a richer skill system. Model-agnostic.
- **OpenClaw** if you want the simplest possible self-hosted, messaging-first agent with markdown memory and a plugin pipeline. Easier mental model.

I help you pick on the discovery call.

## How a project runs

1. **Discovery call (20 min, free).** I tell you whether agents are the right answer.
2. **Scoping doc (within 48 hours).** Fixed-scope plan, no hourly games.
3. **Build sprint.** First progress in Telegram or Slack within the first week.
4. **Production hardening.** Approval flows, command allowlists, container isolation, runbook.
5. **Run, learn, expand.** Optional managed retainer.

## FAQ

- **Will my data leave my infrastructure?** Only if you decide it should. Default deployment is self-hosted on your servers.
- **Which model?** Hermes is model-agnostic — OpenAI, Anthropic, OpenRouter, Nous Portal, or self-hosted weights. One config change.
- **Where does the agent live?** Telegram, Slack, Discord, WhatsApp, Signal, CLI, web dashboard — or several at once.
- **Different from ChatGPT Enterprise / Claude Teams / Zapier agents?** Those are great until you want memory that persists, tools not on the vendor's allowlist, models other than the one they sell you, or your data not crossing their wire.
- **Timeline?** Most first agents reach a usable v1 in 1–3 weeks. Production hardening adds 1–2 weeks.

## Start a project

- Book a 20-min discovery call: <https://cal.com/growthperclick/discovery-call>
- Lead form: <https://iamamitkumar.dev/agents#start-a-project>
- Email: hi@iamamitkumar.dev

## Related reading

- [Deploy Hermes Agent on Hetzner](/blog/deploy-hermes-agent-on-hetzner)
- [OpenHuman vs Hermes vs OpenClaw](/blog/openhuman-vs-hermes-vs-openclaw)
- [Best VPS for self-hosted AI agents (2026)](/blog/best-vps-for-self-hosted-ai-agents-2026)
- [How I run 14 AI agents on one Hetzner VPS](/blog/run-14-ai-agents-on-single-hetzner-vps)
- [How to Set Up OpenClaw — A Builder's Honest Setup Guide (2026)](/blog/how-to-set-up-openclaw-a-builder-s-honest-setup-guide-2026)
- [Why Your AI Agent Pilot Never Makes It to Production](/blog/ai-agent-pilot-to-production)

## Canonical URL

[https://iamamitkumar.dev/agents](https://iamamitkumar.dev/agents)
`,
    };
  }

  const title = titleFromPath(pathname);
  return {
    title: `${title} | Amit Kumar`,
    description:
      "A public page on Amit Kumar's portfolio site for agentic architecture, product building, and growth experiments.",
    body: `# ${title}

This is a public page on Amit Kumar's portfolio site.

## Useful links

- [Home](/)
- [Blog](/blog)
- [Newsletter](/newsletter)
- [Workflow](/workflow)
- [Tweets](/tweets)
- [Sponsor](/sponsor)
`,
  };
}

function buildMarkdown(pathname: string): string {
  const page = pageMarkdown(pathname);

  return `---
title: "${page.title.replace(/"/g, '\\"')}"
description: "${page.description.replace(/"/g, '\\"')}"
url: "${pathname}"
author: "Amit Kumar (aka growthperclick)"
---

${page.body.trim()}
`;
}

// Aggressive scraper-farm bots that crawl thousands of URLs in bursts and
// drive metered Edge/function cost with little SEO upside. We keep the
// AI-search bots that actually send traffic (GPTBot, ClaudeBot, PerplexityBot,
// Googlebot, etc.) fully allowed — these are throttled instead.
const THROTTLED_BOT_PATTERN =
  /(bytespider|ccbot|amazonbot|dataforseo|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot|seekport|megaindex)/i;

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  if (request.method !== "GET") {
    return NextResponse.next();
  }

  const userAgent = request.headers.get("user-agent") || "";

  // Short-circuit aggressive crawlers before any rendering work happens.
  // Returning 429 here also avoids the downstream page/ISR function cost.
  if (THROTTLED_BOT_PATTERN.test(userAgent)) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "86400",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  const acceptHeader = request.headers.get("accept") || "";

  if (!acceptsMarkdown(acceptHeader)) {
    return NextResponse.next();
  }

  const pathname = url.pathname;

  const skipExtensions = [
    ".ico",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".webp",
    ".css",
    ".js",
    ".map",
    ".woff",
    ".woff2",
    ".ttf",
    ".xml",
    ".json",
    ".webmanifest",
    ".txt",
  ];

  if (
    skipExtensions.some((ext) => pathname.endsWith(ext)) ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  // Individual blog content (posts, tag pages) must serve the full HTML
  // article — never a thin markdown stub. The stub was near-empty and
  // undermined AEO for the exact pages we want AI engines to cite. The
  // curated markdown variant is kept for the /blog index and marketing pages.
  if (/^\/blog\/.+/.test(pathname)) {
    return NextResponse.next();
  }

  const blockedPaths = [
    "/admin",
    "/dashboard",
    "/settings",
    "/login",
    "/signup",
    "/account",
    "/profile",
    "/.well-known",
  ];

  if (blockedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const markdown = buildMarkdown(pathname);

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      // Cache hard at the edge so repeat crawler hits are served from cache
      // and don't re-run the middleware logic / count as origin work.
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "Content-Signal": "ai-train=no, search=yes, ai-input=yes",
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "x-markdown-tokens": estimateTokens(markdown).toString(),
    },
  });
}

// Only run middleware on the content paths that actually serve the
// AI-markdown variant. This drastically shrinks billed Edge Middleware
// invocations: random/404 URLs and asset-ish paths no longer invoke it.
export const config = {
  matcher: [
    "/",
    "/agents",
    "/tools",
    "/workflow",
    "/newsletter",
    "/tweets",
    "/sponsor",
    "/inspiration",
    "/projects/:path*",
    "/blog/:path*",
    "/blog",
  ],
};

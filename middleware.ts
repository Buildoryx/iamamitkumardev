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
      title: "Amit Kumar | Agentic Architect & Full-Stack Engineer",
      description:
        "Indie hacker building AI products in public — from LaunchSuite.tech to multi-agent systems, growth experiments, and fast MVP launches.",
      body: `I'm an indie hacker shipping AI products in public. I go from idea to MVP fast, test demand, and iterate weekly. I share the full journey on [X / Twitter](https://x.com/growthperclick) — wins, mistakes, and what actually worked.

I launched [LaunchSuite.tech](https://launchsuite.tech) as a production SaaS boilerplate and pushed it to Product Hunt. I also build high-leverage products in AI automation, trading intelligence, and growth systems.

I publish founder notes, build logs, and playbooks on [Substack](https://substack.com/@growthperclick) for builders who want speed plus real execution.

## Things I ship

- [LaunchSuite.tech](https://launchsuite.tech) — shipped SaaS boilerplate MVP for founders.
- [Product launches](https://www.producthunt.com) — public validation with real users.
- [Build in public](https://x.com/growthperclick) — daily experiments on distribution, product, and growth loops.

## Building now

- VidoTask — turns saved social content into actionable plans. Try [vidotask.com](https://vidotask.com) (in active development).
- ComplianceHQ — AI-powered compliance automation for startup security readiness.
- SharkOS — LinkedIn operating system replacing multiple GTM SaaS tools.
- BrandCo — AI brand strategy engine for conversion-led positioning.
- JARVIS OS — local-first AI morning briefing assistant for focused execution.

### How VidoTask fixes it

1. **Auto-import saves** — Connect Instagram, TikTok, and LinkedIn; saves sync automatically with no manual entry.
2. **AI-powered task extraction** — Each save becomes concrete next steps (e.g. recipe → grocery list, tutorial → schedule).
3. **Actionable plans, not bookmarks** — Structured tasks with deadlines and context instead of a dead save folder.

## Explore

- [iamamitkumar.dev](https://iamamitkumar.dev) — home
- [Blog](/blog)
- [Newsletter](/newsletter)
- [Workflow](/workflow)
- [Tweets](/tweets)
- [Sponsor](/sponsor)
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

- [Why Your AI Agent Pilot Never Makes It to Production (And How to Fix It)](/blog/ai-agent-pilot-to-production)
- [How to Set Up OpenClaw: A Builder's Honest Setup Guide (2026)](/blog/how-to-set-up-openclaw-a-builder-s-honest-setup-guide-2026)
- [What's Actually Inside Claude Code (It's More Impressive Than You Think)](/blog/what-is-inside-claude-code)
- [How to Build Enterprise-Grade, Production-Ready AI Agents](/blog/how-to-build-enterprise-grade-production-ready-ai-agents)
- [Building Enterprise-Grade Production-Ready AI Agents: My Practical Guide to Deployment](/blog/building-enterprise-grade-production-ready-ai-agents-my-practical-guide-to-deployment)

## Stay in the loop

Get build logs, shipping notes, and AI product breakdowns delivered to your inbox. No spam — just the stuff worth reading.
`,
    };
  }

  if (pathname.startsWith("/blog/")) {
    const title = titleFromPath(pathname);
    return {
      title: `${title} | Amit Kumar`,
      description:
        "A public blog post by Amit Kumar about AI systems, product building, and growth experiments.",
      body: `# ${title}

This is a public Amit Kumar blog article.

For the canonical HTML article, visit [${pathname}](${pathname}). Agents can also request site index pages with \`Accept: text/markdown\`.

## Related links

- [Blog index](/blog)
- [Home](/)
- [Newsletter](/newsletter)
`,
    };
  }

  if (pathname === "/agents") {
    return {
      title:
        "Hermes & OpenClaw AI Agents — Production Builds | Amit Kumar",
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

- [How to Set Up OpenClaw — A Builder's Honest Setup Guide (2026)](/blog/how-to-set-up-openclaw-a-builder-s-honest-setup-guide-2026)
- [How to Build Enterprise-Grade, Production-Ready AI Agents](/blog/how-to-build-enterprise-grade-production-ready-ai-agents)
- [Why Your AI Agent Pilot Never Makes It to Production](/blog/ai-agent-pilot-to-production)

## Canonical URL

[https://agents.iamamitkumar.dev/](https://agents.iamamitkumar.dev/)
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

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const hostname = (request.headers.get("host") || "").split(":")[0];

  // ---------------------------------------------------------------------------
  // Subdomain routing: agents.iamamitkumar.dev/* → /agents/*
  // Preserves /api, /_next, and well-known top-level files so that
  // robots.txt/sitemap.xml/feed.xml/manifest still resolve on the subdomain.
  // ---------------------------------------------------------------------------
  if (hostname.startsWith("agents.")) {
    const passthroughPaths = new Set([
      "/robots.txt",
      "/sitemap.xml",
      "/feed.xml",
      "/manifest.webmanifest",
      "/favicon.ico",
      "/favicon.png",
      "/favicon.svg",
      "/apple-touch-icon.png",
    ]);

    const isInternal =
      url.pathname.startsWith("/_next/") ||
      url.pathname.startsWith("/api/") ||
      url.pathname.startsWith("/.well-known/") ||
      passthroughPaths.has(url.pathname);

    if (!isInternal && !url.pathname.startsWith("/agents")) {
      const rewritten = new URL(url.toString());
      rewritten.pathname =
        url.pathname === "/" ? "/agents" : `/agents${url.pathname}`;
      return NextResponse.rewrite(rewritten);
    }
  }

  if (request.method !== "GET") {
    return NextResponse.next();
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
  ];

  if (
    skipExtensions.some((ext) => pathname.endsWith(ext)) ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/")
  ) {
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
      "Cache-Control": "public, max-age=3600",
      "Content-Signal": "ai-train=no, search=yes, ai-input=yes",
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "x-markdown-tokens": estimateTokens(markdown).toString(),
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

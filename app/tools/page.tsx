import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/container";
import { DottedSeparator } from "@/components/separator";
import { Subheading } from "@/components/subheading";
import { SITE_URL } from "@/lib/site";

const TOOLS_URL = `${SITE_URL}/tools`;
const DESCRIPTION =
  "The AI agent tools I use in production: Hermes, OpenClaw, Claude Code, MCP servers, OpenAI, Anthropic, Supabase, Postgres, Docker, Tailscale, and Next.js.";

const toolGroups = [
  {
    title: "Agent frameworks",
    description:
      "Frameworks I use when the agent needs memory, tools, messaging, scheduling, and production ownership.",
    tools: [
      {
        name: "Hermes Agent",
        detail:
          "Self-improving, model-agnostic agents from Nous Research with memory, scheduled crons, subagents, and messaging gateways.",
      },
      {
        name: "OpenClaw",
        detail:
          "Self-hosted, messaging-first agent framework with SOUL.md identity, plugin pipelines, and simple ownership of the runtime.",
      },
      {
        name: "LangGraph and CrewAI",
        detail:
          "Useful for graph-based workflows, role-based agent teams, experiments, and prototypes that need explicit orchestration.",
      },
    ],
  },
  {
    title: "Coding agents and development workflow",
    description:
      "Tools I use to move from architecture to working code without losing review, tests, and deployment discipline.",
    tools: [
      {
        name: "Claude Code",
        detail:
          "Daily driver for repository-aware coding, refactors, test loops, debugging, and agent workflow design.",
      },
      {
        name: "Zed agents and Codex-style coding agents",
        detail:
          "Useful for parallel implementation, codebase audits, documentation, and fast iteration on focused tasks.",
      },
      {
        name: "Next.js and TypeScript",
        detail:
          "My default web layer for dashboards, admin surfaces, agent control panels, and marketing pages.",
      },
    ],
  },
  {
    title: "Models and AI APIs",
    description:
      "I keep agents model-agnostic so the workflow can switch providers as quality, latency, or cost changes.",
    tools: [
      {
        name: "OpenAI and Anthropic",
        detail:
          "Frontier models for reasoning-heavy tasks, complex synthesis, tool planning, and quality-sensitive automation.",
      },
      {
        name: "OpenRouter and Nous Portal",
        detail:
          "Provider flexibility for routing, fallback chains, cost control, and access to multiple open and hosted models.",
      },
      {
        name: "Local and open-weight models",
        detail:
          "Used when privacy, cost, or infrastructure ownership matters more than using a single hosted vendor.",
      },
    ],
  },
  {
    title: "MCP, tools, and data access",
    description:
      "The useful part of an agent is usually the tools it can safely call and the context it can reliably retrieve.",
    tools: [
      {
        name: "MCP servers",
        detail:
          "Model Context Protocol servers for connecting agents to files, databases, SaaS tools, browsers, and internal APIs.",
      },
      {
        name: "Supabase and Postgres",
        detail:
          "Structured memory, application data, auth, admin dashboards, audit trails, and reporting workflows.",
      },
      {
        name: "Vector search and RAG",
        detail:
          "Semantic retrieval for long-term knowledge, support docs, internal processes, and domain-specific memory.",
      },
    ],
  },
  {
    title: "Infrastructure and operations",
    description:
      "Production agents need boring infrastructure: isolation, logs, retries, approvals, secrets, and network boundaries.",
    tools: [
      {
        name: "Docker and VPS deployments",
        detail:
          "Containers on Hetzner, DigitalOcean, Hostinger, or client-owned infrastructure for self-hosted agents.",
      },
      {
        name: "Tailscale",
        detail:
          "Private mesh networking so agent services, dashboards, and SSH are reachable without exposing public ports.",
      },
      {
        name: "Cron, queues, logs, and evals",
        detail:
          "Scheduled work, background jobs, full audit trails, regression checks, and observability from day one.",
      },
    ],
  },
];

const relatedLinks = [
  {
    href: "/agents",
    title: "Production AI agent builds",
    description:
      "Custom self-hosted agents for founders, teams, ops workflows, and business intelligence.",
  },
  {
    href: "/blog/ai-agent-pilot-to-production",
    title: "Why AI agent pilots fail before production",
    description:
      "The SAFE framework I use to move agents from demo to reliable production workflow.",
  },
  {
    href: "/blog/how-to-set-up-openclaw-a-builder-s-honest-setup-guide-2026",
    title: "OpenClaw setup guide",
    description:
      "A practical setup guide for OpenClaw, SOUL.md, and self-hosted agent work.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute: "AI Agent Tools I Use to Build Production Agents | Amit Kumar",
  },
  description: DESCRIPTION,
  keywords: [
    "AI agent tools",
    "AI agent development tools",
    "production AI agents",
    "MCP tools",
    "Claude Code workflow",
    "Hermes Agent",
    "OpenClaw",
    "LangGraph",
    "CrewAI",
    "self-hosted AI agents",
  ],
  alternates: {
    canonical: TOOLS_URL,
  },
  openGraph: {
    title: "AI Agent Tools I Use to Build Production Agents | Amit Kumar",
    description:
      "A practical production stack for AI agents: frameworks, MCP servers, models, infrastructure, memory, and operations.",
    url: TOOLS_URL,
    type: "website",
    images: ["/images/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agent Tools I Use to Build Production Agents | Amit Kumar",
    description:
      "Hermes, OpenClaw, Claude Code, MCP servers, OpenAI, Anthropic, Supabase, Docker, Tailscale, and Next.js.",
    images: ["/images/og-image.png"],
  },
};

export default function ToolsPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${TOOLS_URL}/#tools`,
    name: "AI Agent Tools Amit Kumar Uses to Build Production Agents",
    description: DESCRIPTION,
    url: TOOLS_URL,
    itemListElement: toolGroups.flatMap((group, groupIndex) =>
      group.tools.map((tool, toolIndex) => ({
        "@type": "ListItem",
        position: groupIndex * 10 + toolIndex + 1,
        name: tool.name,
        description: tool.detail,
      })),
    ),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "AI Agent Tools",
        item: TOOLS_URL,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Container>
        <div className="py-12 md:py-16">
          <Subheading>AI agent tools</Subheading>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            AI agent tools I use to build production agents
          </h1>
          <p className="text-foreground/70 mt-6 max-w-2xl text-lg leading-relaxed">
            This is the practical stack behind my production AI agent work:
            frameworks, coding agents, MCP servers, models, databases,
            infrastructure, monitoring, and deployment patterns I trust when an
            agent has to do real work.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link
              href="/agents"
              className="bg-primary rounded-md px-4 py-2 font-medium text-white transition-opacity hover:opacity-90"
            >
              Build an AI agent with me
            </Link>
            <Link
              href="/blog/ai-agent-pilot-to-production"
              className="rounded-md border border-neutral-200 px-4 py-2 font-medium transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
            >
              Read the production checklist
            </Link>
          </div>

          <DottedSeparator className="my-12" />

          <div className="space-y-12">
            {toolGroups.map((group) => (
              <section key={group.title}>
                <h2 className="text-foreground text-xl font-semibold">
                  {group.title}
                </h2>
                <p className="text-foreground/70 mt-2 max-w-2xl leading-relaxed">
                  {group.description}
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {group.tools.map((tool) => (
                    <article
                      key={tool.name}
                      className="rounded-lg border border-neutral-200/70 p-4 dark:border-neutral-800"
                    >
                      <h3 className="text-foreground font-medium">
                        {tool.name}
                      </h3>
                      <p className="text-foreground/70 mt-2 text-sm leading-relaxed">
                        {tool.detail}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <DottedSeparator className="my-12" />

          <section>
            <h2 className="text-foreground text-xl font-semibold">
              How I choose tools for production AI agents
            </h2>
            <div className="text-foreground/70 mt-4 space-y-4 leading-relaxed">
              <p>
                I do not pick tools because they are trendy. I pick them based
                on whether they make an agent easier to own, inspect, secure,
                and improve over time.
              </p>
              <p>
                A useful production agent needs narrow scope, durable memory,
                safe tool access, human approval where it matters, clear logs,
                fallback behavior, and a cost model that still works at 10x
                usage. The tools above are the pieces I use to make that real.
              </p>
            </div>
          </section>

          <DottedSeparator className="my-12" />

          <section>
            <h2 className="text-foreground text-xl font-semibold">
              Related AI agent resources
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group rounded-lg border border-neutral-200/70 p-4 transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/40"
                >
                  <h3 className="text-foreground group-hover:text-primary font-medium">
                    {link.title}
                  </h3>
                  <p className="text-foreground/70 mt-2 text-sm leading-relaxed">
                    {link.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}

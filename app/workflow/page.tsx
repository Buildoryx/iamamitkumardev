import type { Metadata } from "next";
import Script from "next/script";
import Container from "@/components/container";
import { DottedSeparator } from "@/components/separator";
import { Subheading } from "@/components/subheading";
import { SITE_URL } from "@/lib/site";
import React from "react";
import {
  IconBrain,
  IconBrandBunpo,
  IconBrandGithubCopilot,
  IconBrandNodejs,
  IconBrandPython,
  IconBrandRust,
  IconBrandTypescript,
  IconBrandVscode,
  IconCoffee,
  IconDatabase,
  IconBrandSupabase,
  IconTerminal2,
  IconPrompt,
  IconTerminal,
  IconCommand,
  IconAppWindow,
  IconBrandDocker,
  IconNotebook,
  IconCloud,
  IconBolt,
  IconBrandOpenai,
  IconRobot,
  IconServer,
  IconShieldLock,
  IconPlug,
  IconBrandCloudflare,
  IconBrandVercel,
  IconNetwork,
} from "@tabler/icons-react";

const TITLE = "AI Dev Stack — Hermes, OpenClaw & Hetzner";
const DESCRIPTION =
  "The stack I use to ship production AI agents: Hermes, OpenClaw and OpenHuman, self-hosted on Hetzner, Hostinger, or DigitalOcean.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "AI dev stack",
    "AI agent stack",
    "Hermes agent",
    "OpenClaw",
    "OpenHuman agent",
    "Hetzner AI agents",
    "Hostinger AI agents",
    "DigitalOcean AI agents",
    "self-hosted AI agent",
    "best VPS for AI agents",
    "Tailscale agent network",
    "Cloudflare AI agent",
    "Vercel AI deploy",
    "Supabase Postgres",
    "AI code assistant",
    "Cursor",
    "Claude code",
    "OpenCode",
    "MCP server",
    "Context7",
    "Ruflo",
    "Supermemory",
    "NotebookLM",
    "developer workflow",
    "agentic architect workflow",
  ],
  alternates: {
    canonical: "/workflow",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/og-image.png"],
  },
};

type Item = {
  icon: React.ComponentType<{ className?: string; stroke?: number }>;
  label: string;
  description: string;
  /** Optional canonical URL, used for SoftwareApplication JSON-LD `sameAs`. */
  href?: string;
};

type Section = {
  id: string;
  title: string;
  /** Lead paragraph rendered above the list. Carries the on-page keywords. */
  lede: string;
  items: Item[];
};

const sections: Section[] = [
  {
    id: "agent-frameworks",
    title: "Agent frameworks",
    lede: "The three open-source AI agent frameworks I build production agents on. All self-hosted, all model-agnostic, all yours after the build.",
    items: [
      {
        icon: IconRobot,
        label: "Hermes Agent (Nous Research)",
        description:
          "My primary agent framework. Self-improving, persistent memory, scheduled crons, subagent spawning, single gateway across Telegram, Slack, Discord, WhatsApp, Signal, and CLI. Model-agnostic — OpenAI, Anthropic, OpenRouter, Nous Portal, or self-hosted weights.",
        href: "https://github.com/NousResearch/hermes-agent",
      },
      {
        icon: IconRobot,
        label: "OpenClaw",
        description:
          "Self-hosted, messaging-first agent framework with markdown-based memory (SOUL.md) and a plugin pipeline. The simplest mental model when a Hermes setup is more than the project needs.",
        href: "https://github.com/openclaw/openclaw",
      },
      {
        icon: IconRobot,
        label: "OpenHuman",
        description:
          "Open-source human-in-the-loop AI agent framework I use when an agent needs explicit approval gates, audit trails, and policy-controlled tool calls before it acts on production systems.",
      },
      {
        icon: IconCloud,
        label: "Hindsight (Hermes memory)",
        description:
          "Cloud memory layer that pairs with Hermes for cross-session recall — semantic vector store plus structured episodic memory.",
      },
    ],
  },
  {
    id: "hosting-infrastructure",
    title: "Hosting & infrastructure",
    lede: "Where the agents actually run. I default to self-hosted on European VPS providers — Hetzner is my primary, Hostinger is the budget tier, DigitalOcean for clients who already use it. Vercel for the web layer. Tailscale for private networking, ngrok for local-dev tunnels, Cloudflare in front of everything public.",
    items: [
      {
        icon: IconServer,
        label: "Hetzner",
        description:
          "Primary VPS provider for self-hosted Hermes and OpenClaw deployments. Best price-to-performance for agents that need 24/7 uptime in Europe. CX/CCX line for general agents, dedicated for heavier workloads.",
        href: "https://www.hetzner.com/",
      },
      {
        icon: IconServer,
        label: "Hostinger",
        description:
          "The budget VPS tier. Where I put smaller, single-purpose agents and prototypes. KVM VPS plans are surprisingly capable for a $5–10/mo Hermes or OpenClaw node.",
        href: "https://www.hostinger.com/vps-hosting",
      },
      {
        icon: IconServer,
        label: "DigitalOcean",
        description:
          "Used when clients already standardize on DO Droplets. Solid for AI agents, easy team access, predictable pricing.",
        href: "https://www.digitalocean.com/",
      },
      {
        icon: IconBrandVercel,
        label: "Vercel",
        description:
          "Hosts every Next.js front end I ship — including the site you're reading. The agents live on the VPS; the web layer lives here.",
        href: "https://vercel.com/",
      },
      {
        icon: IconBrandCloudflare,
        label: "Cloudflare",
        description:
          "DNS, CDN, WAF, and Workers in front of every public surface. R2 for object storage on agent builds that need it.",
        href: "https://www.cloudflare.com/",
      },
      {
        icon: IconNetwork,
        label: "Tailscale",
        description:
          "Private mesh VPN that ties my laptop, phone, and every agent VPS into one zero-trust network. No public ports on agent boxes — SSH and admin dashboards are Tailscale-only.",
        href: "https://tailscale.com/",
      },
      {
        icon: IconPlug,
        label: "ngrok",
        description:
          "Instant secure tunnels for local development and webhook testing while building agents.",
        href: "https://ngrok.com/",
      },
    ],
  },
  {
    id: "ai-code-assistants",
    title: "AI code assistants",
    lede: "The four AI coders I rotate between depending on context size, latency, and the kind of work I'm doing.",
    items: [
      {
        icon: IconTerminal2,
        label: "OpenCode",
        description: "Primary AI code assistant — terminal-native, Hermes-friendly.",
      },
      {
        icon: IconBrandOpenai,
        label: "Claude (Code)",
        description: "Secondary AI assistant — long context, agentic edits, paired with Hermes for scoped tasks.",
      },
      {
        icon: IconBrandGithubCopilot,
        label: "GitHub Copilot",
        description: "Tertiary inline completions while typing.",
      },
      {
        icon: IconPrompt,
        label: "Cursor",
        description: "AI-native editor for high-context multi-file refactors.",
      },
    ],
  },
  {
    id: "ai-memory-mcp",
    title: "AI memory & MCP servers",
    lede: "Persistent memory and Model Context Protocol servers — what makes an agent stop forgetting and start compounding.",
    items: [
      {
        icon: IconNotebook,
        label: "NotebookLM",
        description: "Deep context and RAG for long documents.",
      },
      {
        icon: IconBrain,
        label: "Supermemory",
        description: "Persistent knowledge layer across sessions and tools.",
      },
      {
        icon: IconTerminal,
        label: "Ruflo (custom MCP)",
        description: "My MCP server for agent orchestration — the layer that lets one agent delegate to specialists.",
      },
      {
        icon: IconTerminal,
        label: "fullstackskills (custom MCP)",
        description: "Custom 21-agent scaffolding system exposed as an MCP server.",
      },
      {
        icon: IconTerminal,
        label: "Context7 (MCP)",
        description: "Live documentation retrieval inside chat — the agent reads the actual docs, not 2024 training data.",
      },
    ],
  },
  {
    id: "languages-runtimes",
    title: "Languages & runtimes",
    lede: "What I actually write code in.",
    items: [
      { icon: IconBrandNodejs, label: "Node.js / pnpm", description: "Primary JS runtime and package manager." },
      { icon: IconBrandRust, label: "Rust / cargo", description: "Systems programming and CLI tooling." },
      { icon: IconBrandBunpo, label: "Bun", description: "Fast JS runtime for edge-ready scripts." },
      { icon: IconBrandPython, label: "Python / uv", description: "AI/ML scripts, fast dependency management." },
      { icon: IconCoffee, label: "Java / SDKMAN", description: "Enterprise integrations and JVM tooling." },
      { icon: IconBrandTypescript, label: "TypeScript", description: "Strict typing across the entire stack." },
    ],
  },
  {
    id: "editors",
    title: "Editors",
    lede: "What I open every morning.",
    items: [
      { icon: IconBrandVscode, label: "VS Code", description: "Primary editor with full extension ecosystem." },
      { icon: IconAppWindow, label: "Zed", description: "Fast, GPU-accelerated editor for focused sessions." },
      { icon: IconTerminal, label: "Neovim", description: "Terminal-native editing and scripting." },
      { icon: IconPrompt, label: "Cursor", description: "AI-native editor for high-context sessions." },
    ],
  },
  {
    id: "devops-databases",
    title: "DevOps & databases",
    lede: "Containers, queues, and stores that keep agents running 24/7.",
    items: [
      { icon: IconBrandDocker, label: "Podman", description: "Rootless container runtime — primary choice over Docker for agent isolation." },
      { icon: IconDatabase, label: "PostgreSQL", description: "OLTP workhorse for agent state, kanban tables, and audit trails." },
      { icon: IconBrandSupabase, label: "Supabase", description: "Backend-as-a-service with Postgres, auth, and realtime — the SaaS layer for client work." },
      { icon: IconDatabase, label: "Redis", description: "Caching, pub/sub, and session store." },
      { icon: IconDatabase, label: "NeonDB", description: "Serverless Postgres for edge workloads." },
      { icon: IconShieldLock, label: "SOPS / age", description: "Encrypted secrets in Git, decrypted only on the agent host." },
    ],
  },
  {
    id: "terminal-power-tools",
    title: "Terminal & power tools",
    lede: "The shell tools I'd refuse to live without.",
    items: [
      { icon: IconTerminal, label: "zsh + Starship", description: "Shell and prompt for maximum clarity." },
      { icon: IconBolt, label: "RTK", description: "Custom token killer — 60–90% token savings on dev ops." },
      { icon: IconCommand, label: "lazygit", description: "Terminal UI for git — fast and visual." },
      { icon: IconCommand, label: "eza", description: "Modern ls replacement with icons." },
      { icon: IconCloud, label: "rclone", description: "Cloud storage sync and backup automation." },
    ],
  },
];

const PAGE_URL = `${SITE_URL}/workflow`;

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${PAGE_URL}/#itemlist`,
  name: "Amit Kumar's AI-First Dev Stack",
  description: DESCRIPTION,
  url: PAGE_URL,
  itemListElement: sections.flatMap((section, sectionIdx) =>
    section.items.map((item, itemIdx) => ({
      "@type": "ListItem",
      position: sectionIdx * 100 + itemIdx + 1,
      name: item.label,
      description: item.description,
      ...(item.href ? { url: item.href } : {}),
    })),
  ),
};

// SoftwareApplication entities for the named tools that have canonical URLs.
// This is the entity-graph signal that lets Google associate Amit Kumar
// with each named product (Hermes, OpenClaw, Hetzner, Hostinger, etc.).
const softwareJsonLd = sections
  .flatMap((section) => section.items)
  .filter((item): item is Item & { href: string } => Boolean(item.href))
  .map((item) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: item.label,
    description: item.description,
    url: item.href,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Linux, macOS",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  }));

export default function WorkflowPage() {
  return (
    <>
      <Script
        id="workflow-itemlist-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        strategy="afterInteractive"
      />
      {softwareJsonLd.map((schema, idx) => (
        <Script
          key={`workflow-software-${idx}`}
          id={`workflow-software-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          strategy="afterInteractive"
        />
      ))}

      <Container className="min-h-screen">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight pt-4 mb-2">
          AI-first dev stack — agent frameworks, hosting, and the tools that
          ship production agents.
        </h1>
        <p className="text-foreground/70 text-base md:text-lg leading-relaxed mt-3">
          The full stack I use to design, build, and run production AI agents.
          Three open-source frameworks —{" "}
          <a
            href="#agent-frameworks"
            className="hover:text-foreground underline decoration-dotted underline-offset-[0.2em] transition-colors"
          >
            Hermes (Nous Research), OpenClaw, and OpenHuman
          </a>
          . Self-hosted on{" "}
          <a
            href="#hosting-infrastructure"
            className="hover:text-foreground underline decoration-dotted underline-offset-[0.2em] transition-colors"
          >
            Hetzner, Hostinger, and DigitalOcean
          </a>
          , wired together with Tailscale, Cloudflare, Supabase, and Postgres.
          Every choice on this page is something I&apos;m running in
          production today — not a wishlist.
        </p>
        <p className="text-foreground/55 text-sm mt-4">
          Looking for the agent-services version of this?{" "}
          <a
            href="/agents#hermes-and-openclaw"
            className="hover:text-foreground underline decoration-dotted underline-offset-[0.2em] transition-colors"
          >
            See the Hermes &amp; OpenClaw agent stack →
          </a>
        </p>

        <div className="mt-12 flex flex-col gap-12">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className="flex flex-col gap-5 scroll-mt-24"
            >
              <Subheading>
                <span id={`${section.id}-heading`}>{section.title}</span>
              </Subheading>
              <p className="text-foreground/80 text-base leading-relaxed">
                {section.lede}
              </p>

              <div className="flex flex-col gap-3">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const Inner = (
                    <div className="group flex flex-col items-start gap-1.5 md:flex-row md:items-center md:gap-2">
                      <div className="flex shrink-0 items-center gap-2">
                        <Icon
                          className="text-foreground/50 size-4 transition-colors group-hover:text-foreground"
                          stroke={1.5}
                        />
                        <p className="text-foreground font-medium">
                          {item.label}
                        </p>
                      </div>
                      <div className="hidden size-1 rounded-full bg-neutral-200 dark:bg-neutral-800 md:block" />
                      <p className="text-foreground/70 text-balance">
                        {item.description}
                      </p>
                    </div>
                  );
                  return item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:bg-muted/50 -mx-2 rounded-md px-2 py-1 transition-colors"
                    >
                      {Inner}
                    </a>
                  ) : (
                    <div key={item.label}>{Inner}</div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </Container>
      <Container>
        <DottedSeparator className="my-8" />
      </Container>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/container";
import { DottedSeparator } from "@/components/separator";
import { SITE_URL } from "@/lib/site";

/**
 * Topic pillar for the site's strongest content cluster.
 *
 * Hub-and-spoke: this page is the hub; the deployment guides, VPS comparisons,
 * and production-hardening posts are the spokes. Individual posts link to each
 * other contextually, but only this page links to *every* spoke in reading
 * order — which is what establishes topical coverage for crawlers and gives
 * readers an entry point that individual posts cannot.
 *
 * Spoke lists are curated statically on purpose: a pillar's job is editorial
 * ordering, not a live query. Slugs below are stable canonical slugs.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Self-Hosted AI Agents: The Complete 2026 Guide",
  description:
    "Run AI agents on your own VPS for €4–6/month instead of per-call APIs — the complete path from empty server to production, tested on a real 14-agent stack.",
  alternates: {
    canonical: `${SITE_URL}/blog/topics/self-hosted-ai-agents`,
  },
  openGraph: {
    title: "Self-Hosted AI Agents: The Complete 2026 Guide | Amit Kumar",
    description:
      "Run AI agents on your own VPS for €4–6/month instead of per-call APIs — the complete path from empty server to production.",
    url: `${SITE_URL}/blog/topics/self-hosted-ai-agents`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Self-Hosted AI Agents: The Complete 2026 Guide | Amit Kumar",
    description:
      "Run AI agents on your own VPS for €4–6/month instead of per-call APIs — the complete path from empty server to production.",
  },
};

type Spoke = { href: string; title: string; note: string };

const startHere: Spoke[] = [
  {
    href: "/blog/self-hosting-ai-agents-why-i-moved-off-apis",
    title: "Why I moved off APIs to self-hosted AI agents",
    note: "The economics and control argument — what API billing actually cost me and what a €4 VPS replaced.",
  },
  {
    href: "/blog/best-vps-for-self-hosted-ai-agents-2026",
    title: "Best VPS for self-hosted AI agents (2026)",
    note: "Hetzner vs Hostinger vs DigitalOcean for agent workloads, with real numbers on cost, RAM, and IPv4.",
  },
  {
    href: "/blog/deploy-hermes-agent-on-hetzner",
    title: "Deploy Hermes Agent on Hetzner — the complete walkthrough",
    note: "Your first agent end-to-end: CX22, Tailscale, Telegram gateway, systemd, and the gotchas that break most deploys.",
  },
  {
    href: "/blog/run-14-ai-agents-on-single-hetzner-vps",
    title: "Running 14 AI agents on a single Hetzner VPS",
    note: "The case study that proves the ceiling: what 14 concurrent agents actually cost in RAM, CPU, and ops.",
  },
];

const deploySpokes: Spoke[] = [
  {
    href: "/blog/deploy-hermes-agents-to-vps-the-right-way",
    title: "Deploy Hermes agents to a VPS the right way",
    note: "The production deployment pattern: security baseline, per-agent isolation, and systemd supervision.",
  },
  {
    href: "/blog/how-to-set-up-openclaw-a-builder-s-honest-setup-guide-2026",
    title: "How to set up OpenClaw — a builder's honest guide",
    note: "OpenClaw from zero: SOUL.md, tool wiring, and the parts the docs gloss over.",
  },
  {
    href: "/blog/openhuman-vs-hermes-vs-openclaw",
    title: "OpenHuman vs Hermes vs OpenClaw",
    note: "Which framework for which job — architecture, memory, and real deployment trade-offs.",
  },
];

const hardeningSpokes: Spoke[] = [
  {
    href: "/blog/ai-agent-pilot-to-production",
    title: "Why your AI agent pilot never makes it to production",
    note: "The gap between demo and production, and the checklist that closes it.",
  },
  {
    href: "/blog/how-to-test-ai-agents-before-production",
    title: "How to test AI agents before production",
    note: "Testing discipline for non-deterministic systems: evals, regression suites, and staging agents.",
  },
  {
    href: "/blog/ai-agent-prompt-injection-defense",
    title: "AI agent prompt injection defense",
    note: "The attack surface every tool-using agent has, and the layered defenses that hold.",
  },
  {
    href: "/blog/beyond-context-window-ai-agent-memory-production-failures",
    title: "Beyond the context window: agent memory in production",
    note: "Why agents that forget everything after a reboot fail in production — and the memory patterns that fix it.",
  },
  {
    href: "/blog/ai-agent-observability-in-production",
    title: "AI agent observability in production",
    note: "What to log, what to alert on, and how to see an agent failing before your users tell you.",
  },
  {
    href: "/blog/ai-agent-budget-guardrails-runaway-loops",
    title: "AI agent budget guardrails for runaway loops",
    note: "Hard spend caps and loop breakers — the difference between a €4 month and a €400 one.",
  },
  {
    href: "/blog/ai-agent-tool-call-verification",
    title: "AI agent tool-call verification",
    note: "Verifying what your agent *did*, not what it says it did.",
  },
  {
    href: "/blog/when-to-use-ai-agents-vs-scripts",
    title: "When to use AI agents vs plain scripts",
    note: "The honest decision rule — most automations still don't need an LLM in the loop.",
  },
];

const toolsSpokes: Spoke[] = [
  {
    href: "/blog/why-your-ai-agent-cant-use-tools-safely-how-mcp-fixes-it",
    title: "Why your AI agent can't use tools safely (and how MCP fixes it)",
    note: "The tool-safety problem, and how the Model Context Protocol's design addresses it.",
  },
  {
    href: "/blog/how-to-build-your-own-mcp-server",
    title: "How to build your own MCP server",
    note: "A working MCP server from scratch — protocol, tool definitions, and testing.",
  },
  {
    href: "/blog/a2a-protocol-vs-mcp-what-it-actually-solves",
    title: "A2A protocol vs MCP — what it actually solves",
    note: "Agent-to-agent vs agent-to-tools: where each protocol fits in a multi-agent stack.",
  },
];

const allSpokes = [...startHere, ...deploySpokes, ...hardeningSpokes, ...toolsSpokes];

function SpokeList({ spokes }: { spokes: Spoke[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {spokes.map((spoke) => (
        <li key={spoke.href}>
          <Link href={spoke.href} className="group block">
            <p className="text-foreground group-hover:text-primary text-sm font-medium transition-colors">
              {spoke.title}
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
              {spoke.note}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-foreground/40 font-mono text-sm tracking-wide uppercase">
      {children}
    </h2>
  );
}

export default function SelfHostedAIAgentsPillarPage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/blog/topics/self-hosted-ai-agents#collection`,
    name: "Self-Hosted AI Agents: The Complete 2026 Guide",
    description:
      "Run AI agents on your own VPS for €4–6/month instead of per-call APIs — the complete path from empty server to production.",
    url: `${SITE_URL}/blog/topics/self-hosted-ai-agents`,
    isPartOf: { "@id": `${SITE_URL}/blog/#blog` },
    author: { "@id": `${SITE_URL}/#person` },
    about: { "@type": "Thing", name: "Self-hosted AI agents" },
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/blog/topics/self-hosted-ai-agents#itemlist`,
    name: "Self-hosted AI agent guides",
    numberOfItems: allSpokes.length,
    itemListElement: allSpokes.map((spoke, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}${spoke.href}`,
      name: spoke.title,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Self-Hosted AI Agents",
        item: `${SITE_URL}/blog/topics/self-hosted-ai-agents`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Container className="flex-1">
        <nav aria-label="Breadcrumb" className="text-muted-foreground mb-2 text-sm">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-foreground/30">/</li>
            <li>
              <Link href="/blog" className="hover:underline">
                Blog
              </Link>
            </li>
            <li aria-hidden className="text-foreground/30">/</li>
            <li className="text-foreground/70">Self-Hosted AI Agents</li>
          </ol>
        </nav>

        <h1 className="text-primary pt-3 font-mono text-2xl font-bold tracking-widest uppercase">
          Self-Hosted AI Agents: The Complete 2026 Guide
        </h1>

        <div className="border-border/60 mt-4 border-l-2 pl-4">
          <p className="text-primary font-mono text-[10px] tracking-widest uppercase">
            Key takeaway
          </p>
          <p className="text-foreground/80 pt-1.5 text-sm leading-relaxed">
            Self-hosting an AI agent means running an open-source framework like
            Hermes or OpenClaw on a ~€4–6/month VPS you control, instead of
            paying per-call APIs — and with Tailscale, systemd, and the right
            hardening, one small server reliably runs a double-digit number of
            agents.
          </p>
        </div>

        <div className="prose prose-sm mt-8 max-w-none">
          <p>
            This guide is the map. Every link below is a piece I wrote after
            doing the thing on my own infrastructure — I currently run{" "}
            <strong>14 AI agents on a single Hetzner VPS</strong>, and every
            tutorial here was tested on that stack before publishing. Read the
            four pieces in <em>Start here</em> in order and you will go from an
            empty server to a working, supervised agent. The rest is organized
            by the problems you hit next.
          </p>
        </div>

        <DottedSeparator className="my-8" />

        <section className="flex flex-col gap-4">
          <SectionHeading>Start here — the four-read path</SectionHeading>
          <SpokeList spokes={startHere} />
        </section>

        <DottedSeparator className="my-8" />

        <section className="flex flex-col gap-4">
          <SectionHeading>Deploy more agents, properly</SectionHeading>
          <SpokeList spokes={deploySpokes} />
        </section>

        <DottedSeparator className="my-8" />

        <section className="flex flex-col gap-4">
          <SectionHeading>Harden for production</SectionHeading>
          <SpokeList spokes={hardeningSpokes} />
        </section>

        <DottedSeparator className="my-8" />

        <section className="flex flex-col gap-4">
          <SectionHeading>Tools &amp; protocols (MCP, A2A)</SectionHeading>
          <SpokeList spokes={toolsSpokes} />
        </section>

        <DottedSeparator className="my-8" />

        <div className="rounded-lg border border-border/50 bg-card/30 p-5">
          <p className="text-foreground text-sm font-medium">
            Want this stack built for your business?
          </p>
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            I design and ship production AI agents on Hermes and OpenClaw —
            self-hosted, model-agnostic, and hardened with everything documented
            above.
          </p>
          <Link
            href="/agents"
            className="text-primary mt-3 inline-block text-xs font-medium hover:underline"
          >
            See what I build →
          </Link>
        </div>

        <DottedSeparator className="my-8" />

        <p className="text-muted-foreground pb-8 text-xs">
          Maintained by Amit Kumar ·{" "}
          <Link href="/blog" className="hover:underline">
            All posts
          </Link>
        </p>
      </Container>
    </>
  );
}

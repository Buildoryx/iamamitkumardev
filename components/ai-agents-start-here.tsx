import Link from "next/link";
import { Subheading } from "@/components/subheading";

const links = [
  {
    href: "/agents",
    title: "Production AI agent builds",
    description:
      "Hire me to design, ship, and harden custom AI agents for your business.",
  },
  {
    href: "/tools",
    title: "AI agent tools I use",
    description:
      "The practical stack behind my agents: Hermes, OpenClaw, MCP, Claude, OpenAI, Supabase, Docker, and more.",
  },
  {
    href: "/blog/deploy-hermes-agent-on-hetzner",
    title: "Deploy Hermes Agent on Hetzner",
    description:
      "Production walkthrough: VPS setup, Tailscale, Telegram gateway, and the gotchas that break most deploys.",
  },
  {
    href: "/blog/openhuman-vs-hermes-vs-openclaw",
    title: "OpenHuman vs Hermes vs OpenClaw",
    description:
      "When to use each open-source agent framework — architecture, memory, and real deployment trade-offs.",
  },
  {
    href: "/blog/best-vps-for-self-hosted-ai-agents-2026",
    title: "Best VPS for self-hosted AI agents (2026)",
    description:
      "Hetzner, Hostinger, and DigitalOcean compared for agent workloads — cost, performance, and when to pick each.",
  },
  {
    href: "/blog/how-to-set-up-openclaw-a-builder-s-honest-setup-guide-2026",
    title: "OpenClaw setup guide",
    description:
      "A builder's guide to OpenClaw, SOUL.md, and self-hosted agent workflows.",
  },
];

export function AiAgentsStartHere() {
  return (
    <section>
      <Subheading>Start here for AI agents</Subheading>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-lg border border-neutral-200/70 p-4 transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/40"
          >
            <h2 className="text-foreground group-hover:text-primary text-sm font-medium">
              {link.title}
            </h2>
            <p className="text-foreground/70 mt-2 text-sm leading-relaxed">
              {link.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

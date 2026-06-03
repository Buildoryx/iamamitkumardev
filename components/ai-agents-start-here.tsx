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
    href: "/blog/ai-agent-pilot-to-production",
    title: "Why AI agent pilots fail before production",
    description:
      "A practical framework for getting agents past demos and into reliable workflows.",
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

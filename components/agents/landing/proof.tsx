import React from "react";
import { Subheading } from "@/components/subheading";
import { AGENTS_PLAYBOOK_URL } from "@/lib/site";

const stats = [
  { value: "14", label: "specialist agents" },
  { value: "~5,000", label: "lines of operating doctrine" },
  { value: "Multi-day", label: "continuous uptime" },
];

const layers = [
  {
    title: "14 specialist agents in production",
    body: "Commander, Concierge, Research, Dreamer, Coder, QA, OSINT, Content-Studio, SEO-Recon, and others. Each with a sharp identity and a single domain. No overlapping ownership.",
  },
  {
    title: "Identity-first design",
    body: "Every agent loads a SOUL.md (who they are, hard limits, refusal triggers) plus an AGENTS.md (mission, data paths, decision process, cross-agent matrix). Vague agents do vague work.",
  },
  {
    title: "Coordination via SQLite kanban",
    body: "Single source of truth for every task — atomic claims, dependencies, retries, full audit trail. No message queues, no event buses, no service discovery to deploy.",
  },
  {
    title: "Reliability as architecture, not a wishlist",
    body: "Credential pool auto-rotates exhausted API keys; a fallback chain swaps providers when one's down. The agent never sees the failure. Free-tier rate limits stop being a problem.",
  },
  {
    title: "Discord-first ops with cron",
    body: "I talk to one agent (the Commander) in a private channel. It delegates via kanban to the right specialist. Cron auto-fires recurring work — daily briefs, weekly retention sweeps. Output lands in a structured vault.",
  },
  {
    title: "Private-by-default networking",
    body: "Tailscale mesh only. No public ports. SSH and dashboards reach the VPS from my laptop and phone — and nowhere else.",
  },
  {
    title: "Two-layer memory",
    body: "Automatic recent-context (holographic, runtime-native) plus deliberate cross-session knowledge (vector store, semantic recall). Different time horizons, different memory shapes.",
  },
];

export function Proof() {
  return (
    <section>
      <Subheading>Proof</Subheading>
      <p className="text-foreground mt-3 text-base font-medium md:text-lg">
        I build and run my own 14-agent stack on Hermes.
      </p>
      <p className="text-foreground/70 mt-3 text-base leading-relaxed">
        A working autonomous agent operating system on a private VPS —
        continuous uptime, real tasks shipped end-to-end, audit trail for every
        decision. The same architecture I bring to client builds.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-border/50 flex flex-col gap-1 border-l-2 pl-3"
          >
            <p className="text-foreground text-lg font-medium tracking-tight md:text-xl">
              {stat.value}
            </p>
            <p className="text-foreground/55 text-xs leading-snug">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <ul className="mt-8 flex flex-col gap-5">
        {layers.map((layer) => (
          <li key={layer.title} className="flex flex-col gap-1">
            <p className="text-foreground font-medium leading-snug">
              {layer.title}
            </p>
            <p className="text-foreground/70 text-base leading-relaxed">
              {layer.body}
            </p>
          </li>
        ))}
      </ul>

      {AGENTS_PLAYBOOK_URL ? (
        <p className="text-foreground/60 mt-6 text-sm">
          <a
            href={AGENTS_PLAYBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground underline decoration-dotted underline-offset-[0.2em] transition-colors"
          >
            Read the full playbook →
          </a>
        </p>
      ) : null}
    </section>
  );
}

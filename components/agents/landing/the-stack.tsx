import React from "react";
import { Subheading } from "@/components/subheading";

const stack = [
  {
    name: "Hermes Agent",
    attribution: "by Nous Research",
    license: "MIT",
    href: "https://github.com/NousResearch/hermes-agent",
    body: "Self-improving agent that builds and refines its own skills from experience, remembers across sessions, lives across Telegram, Slack, Discord, WhatsApp, Signal, and CLI from one gateway, runs scheduled crons, and spawns subagents for parallel work. Use any model — OpenAI, Anthropic, OpenRouter, Nous Portal, or your own endpoint.",
  },
  {
    name: "OpenClaw",
    attribution: "by Peter Steinberger",
    license: "MIT",
    href: "https://github.com/openclaw/openclaw",
    body: "Self-hosted, messaging-first agent framework. Markdown-based memory (SOUL.md), plugin pipeline, runs on your own hardware. The simplest path to an agent that's actually yours.",
  },
];

const principles = [
  {
    title: "You own the agent.",
    body: "Your stack, your data, your weights, your bill. Vendor lock-in is a choice, not a necessity.",
  },
  {
    title: "Any model, any time.",
    body: "Swap GPT-5 for Claude or Llama in one config line. No rewrites.",
  },
  {
    title: "It compounds.",
    body: "Memory and skills accrue inside your system. Every week, your agent gets sharper at your work — not someone else's average user.",
  },
];

export function TheStack() {
  return (
    <section id="hermes-and-openclaw" aria-labelledby="hermes-and-openclaw-heading">
      <Subheading className="" >
        <span id="hermes-and-openclaw-heading">
          The stack — Hermes &amp; OpenClaw
        </span>
      </Subheading>
      <p className="text-foreground mt-3 text-base font-medium md:text-lg">
        The two open-source frameworks I build on, and why it matters.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {stack.map((entry) => (
          <a
            key={entry.name}
            href={entry.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border-border/70 bg-card/35 hover:border-primary/40 hover:bg-primary/5 group flex flex-col rounded-lg border p-4 transition-colors"
          >
            <div className="flex items-baseline gap-2">
              <p className="text-foreground font-medium">{entry.name}</p>
              <span className="text-foreground/45 font-mono text-xs uppercase tracking-wide">
                {entry.license}
              </span>
            </div>
            <p className="text-foreground/55 mt-0.5 text-sm">
              {entry.attribution}
            </p>
            <p className="text-foreground/70 mt-3 text-sm leading-relaxed">
              {entry.body}
            </p>
          </a>
        ))}
      </div>

      <div className="mt-8">
        <p className="text-foreground/45 font-mono text-xs uppercase tracking-wide">
          Why open-source
        </p>
        <ul className="mt-3 flex flex-col gap-3">
          {principles.map((p) => (
            <li
              key={p.title}
              className="border-border/40 border-l-2 pl-4 text-base leading-relaxed"
            >
              <span className="text-foreground font-medium">{p.title}</span>{" "}
              <span className="text-foreground/70">{p.body}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

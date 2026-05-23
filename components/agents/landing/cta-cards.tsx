import React from "react";
import { AGENTS_DISCOVERY_CALL_URL } from "@/lib/site";

export function CtaCards() {
  const isExternal = AGENTS_DISCOVERY_CALL_URL.startsWith("http");

  return (
    <section aria-label="Get started">
      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href={AGENTS_DISCOVERY_CALL_URL}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="border-border/70 bg-card/35 hover:border-primary/40 hover:bg-primary/5 group flex flex-col rounded-lg border p-5 transition-colors"
        >
          <p className="text-foreground/45 font-mono text-xs uppercase tracking-wide">
            01 — Talk first
          </p>
          <p className="text-foreground mt-3 text-lg font-medium">
            Book a 20-minute discovery call
          </p>
          <p className="text-foreground/70 mt-2 text-sm leading-relaxed">
            No pitch deck. We talk about what you want to build, what&apos;s
            realistic, and what it would take. Free.
          </p>
          <p className="text-foreground/55 group-hover:text-foreground mt-4 text-sm font-medium transition-colors">
            Pick a time →
          </p>
        </a>

        <a
          href="#start-a-project"
          className="border-border/70 bg-card/35 hover:border-primary/40 hover:bg-primary/5 group flex flex-col rounded-lg border p-5 transition-colors"
        >
          <p className="text-foreground/45 font-mono text-xs uppercase tracking-wide">
            02 — Or write
          </p>
          <p className="text-foreground mt-3 text-lg font-medium">
            Send me the details
          </p>
          <p className="text-foreground/70 mt-2 text-sm leading-relaxed">
            Tell me what you want to build and I&apos;ll come back within one
            business day with a take and the next step.
          </p>
          <p className="text-foreground/55 group-hover:text-foreground mt-4 text-sm font-medium transition-colors">
            Open the form ↓
          </p>
        </a>
      </div>
    </section>
  );
}

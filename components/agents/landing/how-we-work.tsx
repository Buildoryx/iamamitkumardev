import React from "react";
import { Subheading } from "@/components/subheading";

const steps = [
  {
    title: "Discovery call (20 min, free)",
    body: "You describe the problem. I tell you whether agents are the right answer, and what the smallest version looks like.",
  },
  {
    title: "Scoping doc (within 48 hours)",
    body: "A one-pager: the agent's job, where it lives, what it touches, success metrics, and a fixed-scope plan. No hourly games.",
  },
  {
    title: "Build sprint",
    body: "I design the agent, wire the tools, write the skills, set up the gateway and infra on your stack. You see progress in your Telegram or Slack within the first week.",
  },
  {
    title: "Production hardening",
    body: "Approval flows, command allowlists, container isolation, logging, and a runbook. We don't ship toys.",
  },
  {
    title: "Run, learn, expand",
    body: "Optional managed retainer where I keep the agent improving, add skills as new edges show up, and review what it's learning each month.",
  },
];

export function HowWeWork() {
  return (
    <section>
      <Subheading>How we work</Subheading>
      <p className="text-foreground mt-3 text-base font-medium md:text-lg">
        How a project runs.
      </p>
      <ol className="mt-6 flex flex-col gap-5">
        {steps.map((step, idx) => (
          <li key={step.title} className="flex items-start gap-4">
            <span className="text-foreground/40 font-mono text-sm tabular-nums">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <div className="flex-1">
              <p className="text-foreground font-medium leading-snug">
                {step.title}
              </p>
              <p className="text-foreground/70 mt-1 text-base leading-relaxed">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

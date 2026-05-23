import React from "react";
import {
  IconUserBolt,
  IconChartHistogram,
  IconRobot,
} from "@tabler/icons-react";
import { Box } from "@/components/box";
import { Subheading } from "@/components/subheading";

const offerings = [
  {
    title: "Personal AI assistant",
    body: "A senior chief-of-staff that lives in Telegram or Slack. Reads your inbox, manages your calendar, runs scheduled briefings, remembers everyone you've talked to, and gets better the more you use it.",
    icon: (
      <IconUserBolt className="size-4 text-white drop-shadow-xl drop-shadow-black/40" />
    ),
    boxClassName:
      "bg-linear-to-b from-blue-400 to-blue-600 ring-offset-blue-500",
  },
  {
    title: "Business intelligence agent",
    body: "An agent wired into your data — Postgres, Notion, Stripe, GA4, your CRM — that answers questions in plain English, writes weekly reports, flags anomalies, and acts on them when you say go.",
    icon: (
      <IconChartHistogram className="size-4 text-white drop-shadow-xl drop-shadow-black/40" />
    ),
    boxClassName:
      "bg-linear-to-b from-violet-400 to-violet-600 ring-offset-violet-500",
  },
  {
    title: "Ops & workflow agent",
    body: "The unsexy, high-leverage one. Lead triage. Customer support tier-zero. Internal RAG. Scheduled reports. Alert routing. Code review companions. Anything repetitive you do today.",
    icon: (
      <IconRobot className="size-4 text-white drop-shadow-xl drop-shadow-black/40" />
    ),
    boxClassName:
      "bg-linear-to-b from-emerald-400 to-emerald-600 ring-offset-emerald-500",
  },
];

export function WhatIBuild() {
  return (
    <section>
      <Subheading>What I build</Subheading>
      <p className="text-foreground mt-3 text-base font-medium md:text-lg">
        Three things, done end-to-end.
      </p>
      <ul className="mt-6 flex flex-col">
        {offerings.map((offer) => (
          <li
            key={offer.title}
            className="hover:bg-muted/50 flex items-start gap-3 rounded-lg px-3 py-3 transition-colors"
          >
            <div className="shrink-0 pt-0.5">
              <Box className={offer.boxClassName}>{offer.icon}</Box>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground leading-snug font-medium">
                {offer.title}
              </p>
              <p className="text-foreground/70 mt-1 text-sm leading-relaxed">
                {offer.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-foreground/50 mt-4 text-sm">
        Custom builds, advisory, or build + run as a managed retainer. We figure
        out the right shape on the call.
      </p>
    </section>
  );
}

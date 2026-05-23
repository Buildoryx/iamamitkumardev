import React from "react";
import {
  IconRocket,
  IconBriefcase,
  IconBuildingFactory2,
} from "@tabler/icons-react";
import { Box } from "@/components/box";
import { Subheading } from "@/components/subheading";

const personas = [
  {
    title: "Founders & indie hackers",
    body: "You want a personal AI that lives in your Telegram, knows your projects, follows up on your tasks, runs nightly reports while you sleep — and isn't tied to one vendor's whims.",
    icon: (
      <IconRocket className="size-4 text-white drop-shadow-xl drop-shadow-black/40" />
    ),
    boxClassName:
      "bg-linear-to-b from-blue-400 to-blue-600 ring-offset-blue-500",
  },
  {
    title: "Agencies & operators",
    body: "You want agents that actually do the work: triage inbox, draft client updates, run research loops, post to channels, escalate exceptions. Hooked into your tools, not floating in a third-party UI.",
    icon: (
      <IconBriefcase className="size-4 text-white drop-shadow-xl drop-shadow-black/40" />
    ),
    boxClassName:
      "bg-linear-to-b from-orange-400 to-orange-600 ring-offset-orange-500",
  },
  {
    title: "Businesses building intelligence layers",
    body: "You want a domain-specific brain — a sales copilot, a finance reviewer, a support tier-zero agent — that learns from your data, lives behind your firewall, and gets sharper every week.",
    icon: (
      <IconBuildingFactory2 className="size-4 text-white drop-shadow-xl drop-shadow-black/40" />
    ),
    boxClassName:
      "bg-linear-to-b from-emerald-400 to-emerald-600 ring-offset-emerald-500",
  },
];

export function WhoItsFor() {
  return (
    <section>
      <Subheading>Who it&apos;s for</Subheading>
      <p className="text-foreground mt-3 text-base font-medium md:text-lg">
        Built for people who want to own their AI.
      </p>
      <ul className="mt-6 flex flex-col gap-6">
        {personas.map((persona) => (
          <li
            key={persona.title}
            className="flex flex-col items-start gap-2 md:flex-row md:gap-4"
          >
            <div className="shrink-0 pt-0.5">
              <Box className={persona.boxClassName}>{persona.icon}</Box>
            </div>
            <div className="flex-1">
              <p className="text-foreground font-medium">{persona.title}</p>
              <p className="text-foreground/70 mt-1 text-base leading-relaxed">
                {persona.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

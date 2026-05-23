import React from "react";
import { Subheading } from "@/components/subheading";

const faqs = [
  {
    q: "Will my data leave my infrastructure?",
    a: "Only if you decide it should. The default deployment is self-hosted on your servers — a $5 VPS works, a GPU cluster works, your existing AWS / Hetzner / Render works. The agent only talks to the model provider you choose. If you want fully local — Llama, Mistral, your own endpoint — that's supported on day one.",
  },
  {
    q: "Which model should I use?",
    a: "Whatever fits your task and budget. Hermes is model-agnostic — you can switch between OpenAI, Anthropic, OpenRouter, Nous Portal, or self-hosted weights with one config change. We pick on the discovery call.",
  },
  {
    q: "Where does the agent live?",
    a: "Telegram, Slack, Discord, WhatsApp, Signal, a CLI, a web dashboard, an internal tool — or several of those at once. Hermes was designed for messaging-first; OpenClaw is too. Email, voice memos, and scheduled tasks all work out of the box.",
  },
  {
    q: "How is this different from buying ChatGPT Enterprise / Claude Teams / a Zapier agent?",
    a: "Those are great until you want memory that persists, tools that aren't on the vendor's allowlist, models other than the one they sell you, or your data not crossing their wire. The moment any of that shows up, you need an agent you actually own. That's what I build.",
  },
  {
    q: "Do you do build-only, or build + run?",
    a: "Both. Default is a fixed-scope build with a runbook so your team can operate it. If you'd rather I keep improving it monthly — adding skills, watching telemetry, hardening edges — there's a managed retainer.",
  },
  {
    q: "What about security and approvals?",
    a: "Every command the agent runs can be allowlisted, sandboxed, or require human approval. Hermes ships with command approval, DM pairing, and container isolation; I extend that with whatever your security review needs. Nothing ships without an audit trail.",
  },
  {
    q: "Timeline?",
    a: "Most first agents reach a usable v1 in 1–3 weeks. Production hardening adds 1–2 weeks. Anything bigger we phase.",
  },
  {
    q: "Pricing?",
    a: "Quoted per project after the discovery call. Fixed scope, fixed price, no hourly games. Retainers are monthly with a clear deliverable list.",
  },
];

export function Faq() {
  return (
    <section>
      <Subheading>Things people ask</Subheading>
      <p className="text-foreground mt-3 text-base font-medium md:text-lg">
        Things people ask before we start.
      </p>
      <dl className="mt-6 flex flex-col gap-6">
        {faqs.map((faq) => (
          <div key={faq.q} className="flex flex-col gap-2">
            <dt className="text-foreground font-medium leading-snug">
              {faq.q}
            </dt>
            <dd className="text-foreground/70 text-base leading-relaxed">
              {faq.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

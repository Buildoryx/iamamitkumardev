import React from "react";
import { LinkPreview } from "@/components/link-preview";
import { Subheading } from "@/components/subheading";
import { SUBSTACK_URL, X_URL } from "@/lib/site";

export function WhyMe() {
  return (
    <section>
      <Subheading>Why me</Subheading>
      <div className="mt-4 flex flex-col gap-4 text-base leading-relaxed">
        <p className="text-foreground">
          I&apos;m Amit, aka{" "}
          <LinkPreview url={X_URL}>@growthperclick</LinkPreview>. I ship in
          public — products, agents, build logs, mistakes — on X every day. I
          write about agentic architectures, multi-agent orchestration, and
          the stuff that actually breaks in production on{" "}
          <LinkPreview url={SUBSTACK_URL}>Substack</LinkPreview>.
        </p>
        <p className="text-foreground">
          I&apos;m not an agency. There&apos;s no sales team, no offshore
          subcontractor, no CMS-coloured pricing tiers. You talk to me, I build
          it, you own it — same shape as the stack above. If I&apos;m not the
          right fit, I&apos;ll tell you on the call and point you somewhere
          better.
        </p>
        <p className="text-foreground/60 text-sm">
          Reading on agents:{" "}
          <a
            href="https://iamamitkumar.dev/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground underline decoration-dotted underline-offset-[0.2em] transition-colors"
          >
            posts on production-ready agents and OpenClaw setups →
          </a>
        </p>
      </div>
    </section>
  );
}

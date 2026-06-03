import React from "react";
import { SUBSTACK_URL } from "@/lib/site";
import { LinkPreview } from "./link-preview";

export const Header = () => {
  return (
    <div>
      <h1 className="sr-only">
        Amit Kumar — Production AI Agents, MCP Tools, and Automation Systems
      </h1>
      <div className="text-foreground pt-4 text-base">
        I build production AI agents, MCP tools, self-hosted automations, and
        multi-agent workflows for founders and teams. My work focuses on agents
        that live inside real tools — Telegram, Slack, Discord, Postgres,
        Notion, CRMs, dashboards, and internal ops systems.
      </div>
      <div className="text-foreground pt-4 text-base">
        The stack I write and build with includes Hermes by Nous Research,
        OpenClaw, Claude Code, OpenAI, Anthropic, OpenRouter, Supabase, Next.js,
        Docker, Tailscale, and VPS deployments on Hetzner or DigitalOcean.
      </div>
      <div className="text-foreground pt-4 text-base">
        I still build in public on{" "}
        <LinkPreview url="https://x.com/growthperclick">
          X / Twitter
        </LinkPreview>{" "}
        and publish practical AI-agent build logs and playbooks on{" "}
        <LinkPreview url={SUBSTACK_URL}>Substack</LinkPreview> — what worked,
        what broke, and how I fixed it.
      </div>
    </div>
  );
};

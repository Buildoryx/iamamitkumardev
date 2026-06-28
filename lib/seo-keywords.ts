export interface SeededKeyword {
  keyword: string;
  monthly_searches: number;
  difficulty: number;
  gap_level: "low" | "medium" | "high";
  suggested_angle: string;
  cluster: string;
  top_urls: string[];
}

const KEYWORD_CLUSTERS: Record<
  string,
  { cluster_label: string; keywords: Omit<SeededKeyword, "cluster">[] }
> = {
  "hermes-agent": {
    cluster_label: "Hermes Agent (Nous Research)",
    keywords: [
      {
        keyword: "how to deploy hermes agent on hetzner vps",
        monthly_searches: 420,
        difficulty: 28,
        gap_level: "high",
        suggested_angle:
          "Step-by-step guide deploying Hermes Agent on a Hetzner VPS with Docker, Tailscale, and production hardening",
        top_urls: [],
      },
      {
        keyword: "hermes agent telegram setup guide",
        monthly_searches: 580,
        difficulty: 24,
        gap_level: "high",
        suggested_angle:
          "Complete walkthrough connecting Hermes Agent to Telegram with bot tokens, command registration, and multi-user support",
        top_urls: [],
      },
      {
        keyword: "hermes agent nous research tutorial",
        monthly_searches: 890,
        difficulty: 35,
        gap_level: "medium",
        suggested_angle:
          "Getting started with Nous Research Hermes Agent from installation to first autonomous task",
        top_urls: [],
      },
      {
        keyword: "hermes agent subagent spawning configuration",
        monthly_searches: 310,
        difficulty: 22,
        gap_level: "high",
        suggested_angle:
          "How to configure and manage subagent spawning in Hermes Agent for parallel task execution",
        top_urls: [],
      },
      {
        keyword: "hermes agent multi-channel gateway setup",
        monthly_searches: 260,
        difficulty: 26,
        gap_level: "high",
        suggested_angle:
          "Setting up Hermes Agent across Telegram, Slack, Discord, and CLI from a single gateway instance",
        top_urls: [],
      },
      {
        keyword: "hermes agent persistent memory configuration",
        monthly_searches: 340,
        difficulty: 20,
        gap_level: "high",
        suggested_angle:
          "Configuring persistent memory and cross-session recall in Hermes Agent for production use",
        top_urls: [],
      },
      {
        keyword: "hermes agent cron job scheduling",
        monthly_searches: 290,
        difficulty: 18,
        gap_level: "high",
        suggested_angle:
          "Automating recurring tasks with Hermes Agent cron scheduling for daily briefings, reports, and monitoring",
        top_urls: [],
      },
      {
        keyword: "hermes agent vs openclaw comparison",
        monthly_searches: 720,
        difficulty: 30,
        gap_level: "medium",
        suggested_angle:
          "Honest comparison of Hermes Agent vs OpenClaw for self-hosted AI agent use cases in 2026",
        top_urls: [],
      },
      {
        keyword: "self-hosted hermes agent production hardening",
        monthly_searches: 380,
        difficulty: 32,
        gap_level: "high",
        suggested_angle:
          "Production hardening guide for self-hosted Hermes Agent including security, monitoring, and backup strategies",
        top_urls: [],
      },
      {
        keyword: "hermes agent slack integration",
        monthly_searches: 410,
        difficulty: 25,
        gap_level: "high",
        suggested_angle:
          "Integrating Hermes Agent with Slack for workplace automation and team collaboration",
        top_urls: [],
      },
      {
        keyword: "hermes agent discord bot setup",
        monthly_searches: 350,
        difficulty: 23,
        gap_level: "high",
        suggested_angle:
          "Building a Discord bot with Hermes Agent for community management and moderation",
        top_urls: [],
      },
      {
        keyword: "hermes agent docker deployment",
        monthly_searches: 450,
        difficulty: 27,
        gap_level: "high",
        suggested_angle:
          "Docker-based Hermes Agent deployment with compose files, volumes, and networking best practices",
        top_urls: [],
      },
      {
        keyword: "hermes agent tailscale networking",
        monthly_searches: 220,
        difficulty: 19,
        gap_level: "high",
        suggested_angle:
          "Securing Hermes Agent with Tailscale mesh networking for private VPS deployment",
        top_urls: [],
      },
      {
        keyword: "hermes agent skill system tutorial",
        monthly_searches: 280,
        difficulty: 21,
        gap_level: "high",
        suggested_angle:
          "Building custom skills for Hermes Agent to extend its capabilities for your specific use case",
        top_urls: [],
      },
    ],
  },
  openclaw: {
    cluster_label: "OpenClaw Agent Framework",
    keywords: [
      {
        keyword: "openclaw agent framework setup guide",
        monthly_searches: 480,
        difficulty: 26,
        gap_level: "high",
        suggested_angle:
          "Complete setup guide for OpenClaw agent framework from installation to first running agent",
        top_urls: [],
      },
      {
        keyword: "openclaw soul.md memory file tutorial",
        monthly_searches: 390,
        difficulty: 22,
        gap_level: "high",
        suggested_angle:
          "How to write effective SOUL.md files for OpenClaw agent identity and persistent memory",
        top_urls: [],
      },
      {
        keyword: "openclaw plugin pipeline development",
        monthly_searches: 270,
        difficulty: 24,
        gap_level: "high",
        suggested_angle:
          "Building custom plugins for the OpenClaw agent pipeline to extend functionality",
        top_urls: [],
      },
      {
        keyword: "openclaw messaging-first agent architecture",
        monthly_searches: 210,
        difficulty: 20,
        gap_level: "high",
        suggested_angle:
          "Understanding OpenClaw messaging-first architecture and why it matters for production agents",
        top_urls: [],
      },
      {
        keyword: "self-hosted openclaw agent vps",
        monthly_searches: 320,
        difficulty: 25,
        gap_level: "high",
        suggested_angle:
          "Deploying OpenClaw on a self-hosted VPS for complete data privacy and control",
        top_urls: [],
      },
      {
        keyword: "openclaw agent telegram integration",
        monthly_searches: 340,
        difficulty: 23,
        gap_level: "high",
        suggested_angle:
          "Connecting OpenClaw agent to Telegram for conversational AI interactions",
        top_urls: [],
      },
      {
        keyword: "openclaw plugin development tutorial",
        monthly_searches: 230,
        difficulty: 21,
        gap_level: "high",
        suggested_angle:
          "Step-by-step OpenClaw plugin development tutorial with examples and best practices",
        top_urls: [],
      },
      {
        keyword: "openclaw agent production deployment",
        monthly_searches: 300,
        difficulty: 29,
        gap_level: "high",
        suggested_angle:
          "Taking OpenClaw from development to production with monitoring, backups, and scaling",
        top_urls: [],
      },
    ],
  },
  "self-hosted-infra": {
    cluster_label: "Self-Hosted AI Infrastructure",
    keywords: [
      {
        keyword: "self-hosted ai agent on hetzner tutorial",
        monthly_searches: 650,
        difficulty: 34,
        gap_level: "medium",
        suggested_angle:
          "Complete tutorial for running self-hosted AI agents on Hetzner cloud with Docker and Tailscale",
        top_urls: [],
      },
      {
        keyword: "self-hosted ai agent on hostinger",
        monthly_searches: 340,
        difficulty: 28,
        gap_level: "high",
        suggested_angle:
          "Setting up an AI agent on Hostinger VPS for budget-friendly self-hosted deployment",
        top_urls: [],
      },
      {
        keyword: "self-hosted ai agent on digitalocean",
        monthly_searches: 520,
        difficulty: 32,
        gap_level: "medium",
        suggested_angle:
          "DigitalOcean droplet setup for production AI agents with monitoring and backup",
        top_urls: [],
      },
      {
        keyword: "vps ai agent deployment guide",
        monthly_searches: 890,
        difficulty: 38,
        gap_level: "medium",
        suggested_angle:
          "The definitive guide to deploying AI agents on any VPS provider with security and reliability",
        top_urls: [],
      },
      {
        keyword: "tailscale mesh networking for ai agents",
        monthly_searches: 280,
        difficulty: 24,
        gap_level: "high",
        suggested_angle:
          "Using Tailscale to create private mesh networks for multi-agent communication and security",
        top_urls: [],
      },
      {
        keyword: "cloudflare ai agent security setup",
        monthly_searches: 190,
        difficulty: 26,
        gap_level: "high",
        suggested_angle:
          "Securing self-hosted AI agents behind Cloudflare for DDoS protection and SSL",
        top_urls: [],
      },
      {
        keyword: "docker ai agent production setup",
        monthly_searches: 560,
        difficulty: 33,
        gap_level: "medium",
        suggested_angle:
          "Production Docker setup for AI agents with compose, volumes, health checks, and logging",
        top_urls: [],
      },
      {
        keyword: "ai agent infrastructure on budget vps",
        monthly_searches: 440,
        difficulty: 30,
        gap_level: "high",
        suggested_angle:
          "Running production AI agents on a budget VPS under $15/month without sacrificing reliability",
        top_urls: [],
      },
      {
        keyword: "self-hosted vs cloud ai agents comparison",
        monthly_searches: 380,
        difficulty: 27,
        gap_level: "high",
        suggested_angle:
          "Self-hosted vs cloud AI agents: cost, privacy, performance, and maintenance tradeoffs compared",
        top_urls: [],
      },
    ],
  },
  mcp: {
    cluster_label: "MCP (Model Context Protocol)",
    keywords: [
      {
        keyword: "how to build mcp servers for ai agents",
        monthly_searches: 720,
        difficulty: 36,
        gap_level: "medium",
        suggested_angle:
          "Building MCP servers from scratch to give AI agents access to custom tools and data sources",
        top_urls: [],
      },
      {
        keyword: "model context protocol server tutorial",
        monthly_searches: 580,
        difficulty: 34,
        gap_level: "medium",
        suggested_angle:
          "Complete MCP server tutorial covering transport, tools, resources, and prompts",
        top_urls: [],
      },
      {
        keyword: "mcp server typescript tutorial",
        monthly_searches: 640,
        difficulty: 32,
        gap_level: "medium",
        suggested_angle:
          "Building MCP servers in TypeScript with type safety and best practices",
        top_urls: [],
      },
      {
        keyword: "mcp server integration with hermes agent",
        monthly_searches: 310,
        difficulty: 28,
        gap_level: "high",
        suggested_angle:
          "Connecting custom MCP servers to Hermes Agent for extended tool capabilities",
        top_urls: [],
      },
      {
        keyword: "mcp tools for ai agents",
        monthly_searches: 490,
        difficulty: 31,
        gap_level: "medium",
        suggested_angle:
          "The essential MCP tools every AI agent should have and how to build them",
        top_urls: [],
      },
      {
        keyword: "building custom mcp servers guide",
        monthly_searches: 420,
        difficulty: 30,
        gap_level: "high",
        suggested_angle:
          "Practical guide to designing, building, and deploying custom MCP servers for production",
        top_urls: [],
      },
    ],
  },
  "multi-agent": {
    cluster_label: "Multi-Agent Orchestration & Automation",
    keywords: [
      {
        keyword: "multi-agent orchestration tutorial",
        monthly_searches: 840,
        difficulty: 40,
        gap_level: "medium",
        suggested_angle:
          "Multi-agent orchestration patterns for coordinating multiple AI agents working together on complex tasks",
        top_urls: [],
      },
      {
        keyword: "telegram ai agent for business automation",
        monthly_searches: 620,
        difficulty: 33,
        gap_level: "medium",
        suggested_angle:
          "Using Telegram AI agents for business automation including lead capture, customer support, and operations",
        top_urls: [],
      },
      {
        keyword: "slack ai agent workflow automation",
        monthly_searches: 550,
        difficulty: 32,
        gap_level: "medium",
        suggested_angle:
          "Automating team workflows with Slack-integrated AI agents for reporting, alerts, and task management",
        top_urls: [],
      },
      {
        keyword: "ai agent lead generation automation",
        monthly_searches: 480,
        difficulty: 35,
        gap_level: "medium",
        suggested_angle:
          "Building AI agents that automate lead generation from multiple sources with qualification and routing",
        top_urls: [],
      },
      {
        keyword: "discord ai agent for community management",
        monthly_searches: 390,
        difficulty: 28,
        gap_level: "high",
        suggested_angle:
          "Running AI agents in Discord for community moderation, FAQ answering, and member onboarding",
        top_urls: [],
      },
      {
        keyword: "building production ai agent pipeline",
        monthly_searches: 510,
        difficulty: 38,
        gap_level: "medium",
        suggested_angle:
          "End-to-end production AI agent pipeline from data ingestion to action execution with monitoring",
        top_urls: [],
      },
      {
        keyword: "ai agent monitoring and observability",
        monthly_searches: 360,
        difficulty: 30,
        gap_level: "high",
        suggested_angle:
          "Monitoring self-hosted AI agents with logging, metrics, alerts, and audit trails",
        top_urls: [],
      },
      {
        keyword: "ai agent security best practices",
        monthly_searches: 670,
        difficulty: 37,
        gap_level: "medium",
        suggested_angle:
          "AI agent security guide covering credential management, sandboxing, approval flows, and data isolation",
        top_urls: [],
      },
      {
        keyword: "production ai agent deployment checklist",
        monthly_searches: 430,
        difficulty: 29,
        gap_level: "high",
        suggested_angle:
          "The production AI agent deployment checklist covering everything from infrastructure to monitoring",
        top_urls: [],
      },
      {
        keyword: "ai agent approval workflows human-in-the-loop",
        monthly_searches: 340,
        difficulty: 26,
        gap_level: "high",
        suggested_angle:
          "Implementing human-in-the-loop approval workflows for AI agents in production environments",
        top_urls: [],
      },
      {
        keyword: "ai agent credential management",
        monthly_searches: 290,
        difficulty: 25,
        gap_level: "high",
        suggested_angle:
          "Secure credential management for AI agents with auto-rotation and provider fallback",
        top_urls: [],
      },
      {
        keyword: "ai agent cron job automation",
        monthly_searches: 320,
        difficulty: 24,
        gap_level: "high",
        suggested_angle:
          "Automating recurring business tasks with AI-powered cron jobs for reporting and monitoring",
        top_urls: [],
      },
    ],
  },
  general: {
    cluster_label: "General AI Agent Topics",
    keywords: [
      {
        keyword: "indie hacker ai agent stack 2026",
        monthly_searches: 480,
        difficulty: 31,
        gap_level: "high",
        suggested_angle:
          "The indie hacker AI agent stack for 2026: tools, frameworks, and deployment strategies on a budget",
        top_urls: [],
      },
      {
        keyword: "production ai agent for founders",
        monthly_searches: 420,
        difficulty: 33,
        gap_level: "high",
        suggested_angle:
          "Why founders should invest in custom AI agents and how to start with minimal technical debt",
        top_urls: [],
      },
      {
        keyword: "open-source ai agent framework comparison",
        monthly_searches: 920,
        difficulty: 42,
        gap_level: "medium",
        suggested_angle:
          "Comparing open-source AI agent frameworks: Hermes, OpenClaw, LangChain, AutoGPT, and CrewAI",
        top_urls: [],
      },
      {
        keyword: "ai agent data isolation self-hosted",
        monthly_searches: 270,
        difficulty: 23,
        gap_level: "high",
        suggested_angle:
          "Achieving data isolation with self-hosted AI agents for privacy-sensitive business applications",
        top_urls: [],
      },
      {
        keyword: "how to build ai agent that remembers conversations",
        monthly_searches: 740,
        difficulty: 34,
        gap_level: "medium",
        suggested_angle:
          "Building AI agents with persistent memory that remembers context across conversations and sessions",
        top_urls: [],
      },
      {
        keyword: "switching ai models in production agent",
        monthly_searches: 230,
        difficulty: 20,
        gap_level: "high",
        suggested_angle:
          "How to build model-agnostic agents that can switch between OpenAI, Anthropic, and open-source models",
        top_urls: [],
      },
      {
        keyword: "ai agent cost optimization vps",
        monthly_searches: 350,
        difficulty: 28,
        gap_level: "high",
        suggested_angle:
          "Optimizing AI agent operating costs on a VPS including model selection, caching, and resource management",
        top_urls: [],
      },
    ],
  },
};

export function getAllSeededKeywords(): SeededKeyword[] {
  const all: SeededKeyword[] = [];
  for (const [cluster, group] of Object.entries(KEYWORD_CLUSTERS)) {
    for (const kw of group.keywords) {
      all.push({ ...kw, cluster });
    }
  }
  return all;
}

export function getSeededKeywordsByCluster(cluster: string): SeededKeyword[] {
  return (
    KEYWORD_CLUSTERS[cluster]?.keywords.map((kw) => ({ ...kw, cluster })) ?? []
  );
}

export function getSeededKeywordsByDifficulty(
  maxDifficulty: number,
): SeededKeyword[] {
  return getAllSeededKeywords().filter((kw) => kw.difficulty <= maxDifficulty);
}

export function getKeywordClusters(): {
  id: string;
  label: string;
  count: number;
}[] {
  return Object.entries(KEYWORD_CLUSTERS).map(([id, group]) => ({
    id,
    label: group.cluster_label,
    count: group.keywords.length,
  }));
}

export function getSeededKeywordsForGenerate(): SeededKeyword[] {
  return getAllSeededKeywords().sort((a, b) => a.difficulty - b.difficulty);
}

# SEO fixes implemented for `iamamitkumar.dev`

**Date:** 2026-06-03  
**Target topic cluster:** production AI agents, AI agent tools, MCP tools, self-hosted agents, agent automation

---

## What changed

### 1. Consolidated the agents page on the main domain

The canonical agents page is now:

```txt
https://iamamitkumar.dev/agents
```

Implemented changes:

- `/agents` metadata now uses `https://iamamitkumar.dev/agents` as canonical.
- `/agents` Open Graph URL now points to `https://iamamitkumar.dev/agents`.
- `/agents` structured data IDs now use the main-domain URL.
- `sitemap.xml` now lists only the main-domain agents page.
- `robots.txt` now references only the main-domain sitemap.
- The old agents subdomain is handled only by a permanent redirect rule to consolidate signals.

### 2. Added a dedicated AI agent tools hub

New page:

```txt
https://iamamitkumar.dev/tools
```

Primary target keywords:

- AI agent tools
- AI agent development tools
- production AI agents
- MCP tools
- Claude Code workflow
- Hermes Agent
- OpenClaw
- self-hosted AI agents

The page includes:

- focused metadata
- canonical URL
- Open Graph/Twitter metadata
- `ItemList` structured data
- breadcrumb structured data
- internal links to `/agents` and key AI-agent blog posts

### 3. Repositioned the homepage toward AI agents/tools

Homepage metadata now targets:

```txt
Production AI Agents, MCP Tools & Automation Systems
```

Homepage copy now clearly says Amit builds:

- production AI agents
- MCP tools
- self-hosted automations
- multi-agent workflows
- agents for Telegram, Slack, Discord, Postgres, Notion, CRMs, dashboards, and ops systems

### 4. Added homepage internal links for the AI-agent topic cluster

New homepage block: `Start here for AI agents`

Links to:

- `/agents`
- `/tools`
- `/blog/ai-agent-pilot-to-production`
- `/blog/how-to-set-up-openclaw-a-builder-s-honest-setup-guide-2026`

This helps search engines understand the relationship between the homepage, services page, tools page, and supporting blog content.

### 5. Updated blog index SEO

The blog index now targets AI-agent writing more directly:

```txt
Blog — AI Agents, MCP Tools & Build Logs
```

Description now mentions:

- production AI agents
- MCP tools
- self-hosted automations
- multi-agent workflows
- product shipping

### 6. Updated supporting references

Updated internal source/docs/defaults from the old agents subdomain to:

```txt
iamamitkumar.dev/agents
```

Affected areas include:

- agent lead source defaults
- admin lead label
- Supabase migration comments/default source
- content brief references
- Markdown representation of `/agents`

---

## Post-deploy Search Console steps

After deployment, do this in Google Search Console:

1. Inspect and request indexing for `https://iamamitkumar.dev/`.
2. Inspect and request indexing for `https://iamamitkumar.dev/agents`.
3. Inspect and request indexing for `https://iamamitkumar.dev/tools`.
4. Resubmit `https://iamamitkumar.dev/sitemap.xml`.
5. Check the “Google-selected canonical” for `/agents` after recrawl.
6. Monitor queries for:
   - `production AI agents`
   - `AI agent tools`
   - `MCP tools`
   - `self-hosted AI agents`
   - `Hermes Agent`
   - `OpenClaw`

---

## Remaining content opportunities

The technical SEO cleanup is done, but ranking will still depend on topical authority and links. Next high-value posts/pages:

1. `Hermes vs OpenClaw vs LangGraph vs CrewAI`
2. `How to Build a Self-Hosted AI Agent Stack`
3. `MCP Server Examples for AI Agents`
4. `Production AI Agent Checklist: Memory, Tools, Approvals, Logs, Evals`
5. `How to Build a Telegram AI Agent for Your Business`

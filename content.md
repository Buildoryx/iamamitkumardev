# Content Brief — iamamitkumar.dev (5-Post SEO Sprint)

**Author of record:** Amit Kumar (a.k.a. growthperclick)
**Target site:** https://iamamitkumar.dev
**Agents page in scope:** https://iamamitkumar.dev/agents
**Brief owner:** Amit Kumar
**Brief version:** 1.0 (2026-05-23)
**Deliverables due:** All five posts within 14 days of brief acceptance.

---

## 1. What this brief is

You are writing **five SEO-targeted blog posts** for a personal portfolio + agent-services site. The posts have one job: rank Amit Kumar's site for high-intent, low-competition queries about **Hermes (Nous Research) AI agents, OpenClaw, OpenHuman**, and **self-hosted AI agents on VPS providers like Hetzner, Hostinger, and DigitalOcean**.

Code-level SEO is already done. Sitemap, structured data, navigation, canonical URLs, and entity graph are in place. Your job is the content layer — the part Google ranks. Assume the on-page work is already shipping.

You will deliver **five MDX files**. The user will publish them. You will not need access to the codebase or the deploy pipeline.

---

## 2. The five posts at a glance

| # | Working title (use exactly) | Primary query | Slug |
|---|------|------|------|
| 1 | How to deploy Hermes Agent on Hetzner — a complete 2026 walkthrough | how to deploy hermes agent on hetzner | `deploy-hermes-agent-on-hetzner` |
| 2 | Hostinger VPS for self-hosted AI agents — what works in 2026 | hostinger vps for ai agents | `hostinger-vps-for-self-hosted-ai-agents` |
| 3 | OpenHuman vs Hermes vs OpenClaw — when to use each open-source agent framework | openhuman vs hermes vs openclaw | `openhuman-vs-hermes-vs-openclaw` |
| 4 | Best VPS for self-hosted AI agents in 2026 (Hetzner, Hostinger, DigitalOcean compared) | best vps for self-hosted ai agents | `best-vps-for-self-hosted-ai-agents-2026` |
| 5 | How I run 14 AI agents on a single Hetzner VPS | run multiple ai agents on one vps | `run-14-ai-agents-on-single-hetzner-vps` |

Word count target per post: **1,800–2,500 words**. Anything under 1,500 is rejected.

Publish order: 1 → 2 → 3 → 4 → 5. They cross-link in that order, so writing them out of order creates rework.

---

## 3. Hard facts you must not get wrong

These are the entity facts. Get any of these wrong and the post comes back for rewrite.

### About Amit
- Full name: Amit Kumar.
- Handle on X / GitHub / Substack / Peerlist: `growthperclick` (and `ravenrepo` on GitHub specifically).
- Tagline: *Agentic Architect & Full-Stack Engineer*.
- Lives on X at https://x.com/growthperclick.
- Newsletter on Substack: https://substack.com/@growthperclick.
- Calls his agent-services page: `iamamitkumar.dev/agents`.
- Books discovery calls at: https://cal.com/growthperclick/discovery-call.
- Email: `hi@iamamitkumar.dev`.
- Self-description: *indie hacker shipping AI products in public*. He is **not an agency**. There is no sales team.

### About the named entities

**Hermes Agent** (used most)
- Official name: *Hermes* (sometimes "Hermes Agent").
- Maker: **Nous Research** (https://nousresearch.com/).
- Repo: https://github.com/NousResearch/hermes-agent
- License: MIT.
- Properties to repeat correctly:
  - Self-improving agent that builds and refines its own skills.
  - Persistent memory across sessions (paired with a memory layer called **Hindsight**).
  - Multi-channel gateway: Telegram, Slack, Discord, WhatsApp, Signal, CLI — from one agent instance.
  - Scheduled crons.
  - Spawns subagents for parallel work.
  - **Model-agnostic**: OpenAI, Anthropic, OpenRouter, Nous Portal, or self-hosted weights. Switch with one config line.
  - Ships with command approval, DM pairing, container isolation.

**OpenClaw**
- Maker: **Peter Steinberger** (https://steipete.com/).
- Repo: https://github.com/openclaw/openclaw
- License: MIT.
- Properties:
  - Self-hosted, **messaging-first** agent framework.
  - Markdown-based memory file: **`SOUL.md`** (always uppercase, with the `.md`).
  - Plugin pipeline.
  - Simpler mental model than Hermes — better for single-purpose agents.

**OpenHuman**
- Open-source **human-in-the-loop** AI agent framework.
- Used when an agent needs explicit approval gates, audit trails, and policy-controlled tool calls before acting on production systems.
- If you can't find a specific official site, refer to it as "the OpenHuman framework" and link to the GitHub repo Amit will provide. **Do not invent a URL.** If unsure, ask before publishing.

**The hosting trio**
- **Hetzner** — primary VPS, European, best price/performance. https://www.hetzner.com/. CX (shared CPU, cheap) and CCX (dedicated CPU) lines for general agents.
- **Hostinger** — budget VPS tier. KVM VPS plans. https://www.hostinger.com/vps-hosting. Used for $5–10/mo single-purpose agents.
- **DigitalOcean** — used when clients already standardize on DO. Droplets. https://www.digitalocean.com/.

**Networking & ops**
- **Tailscale** — private mesh VPN. https://tailscale.com/. Key story: no public ports on agent boxes; SSH and admin dashboards are Tailscale-only.
- **Cloudflare** — DNS, CDN, WAF, Workers, R2. https://www.cloudflare.com/.
- **Vercel** — hosts the Next.js front end (this site). https://vercel.com/.
- **ngrok** — local-dev tunnels. https://ngrok.com/.

**Data layer**
- **PostgreSQL**, **Supabase** (https://supabase.com), **Redis**, **NeonDB** (https://neon.tech).

**Memory & MCP**
- **Hindsight** — Hermes's memory layer (cloud, pairs with Hermes for cross-session recall).
- **Supermemory** — persistent knowledge layer.
- **NotebookLM** — Google's RAG-over-documents product.
- **Ruflo, fullstackskills, Context7** — Amit's custom MCP (Model Context Protocol) servers. **MCP** = Model Context Protocol.

**Amit's own production setup** (use only in posts 4 & 5)
- 14 specialist agents on Hermes, on a private Hetzner VPS.
- Roles: Commander, Concierge, Research, Dreamer, Coder, QA, OSINT, Content-Studio, SEO-Recon, and others.
- Each agent has a `SOUL.md` (identity) and `AGENTS.md` (mission).
- Coordination via SQLite kanban. Single source of truth, atomic claims, dependencies, retries, audit trail.
- Credential pool auto-rotates exhausted API keys; fallback chain swaps providers when one's down.
- Discord-first ops. Cron auto-fires recurring work.
- Tailscale-only network. No public ports.
- Two-layer memory: automatic recent-context (holographic, runtime-native) + deliberate cross-session knowledge (vector store, semantic recall).

If any of the above feels uncertain to you, **ask before publishing**. Inventing a property of these tools is the fastest way to get the post rejected and lose Google's trust if the inaccuracy goes live.

---

## 4. Voice & style guide

### Tone

Direct. Plain-spoken. Builder-to-builder. No corporate fluff. No "in today's fast-moving world" intros. No emoji.

The site already has a voice. Match it. Examples of the voice from existing pages:

> "I'm not an agency. There's no sales team, no offshore subcontractor, no CMS-coloured pricing tiers. You talk to me, I build it, you own it."

> "We don't ship toys."

> "Vague agents do vague work."

> "Pricing? Quoted per project after the discovery call. Fixed scope, fixed price, no hourly games."

> "You own the agent. Your stack, your data, your weights, your bill. Vendor lock-in is a choice, not a necessity."

### Write in first person ("I")

Posts are by Amit. He runs 14 agents on a Hetzner box. He has actually deployed Hermes. The voice is "I tried this, here's what happened." Not "one might consider…" Not "developers often face…"

### Sentence rules

- **Short.** Average sentence length 12–18 words. If a sentence is over 30 words, split it.
- **Active voice.** "I deployed Hermes" — not "Hermes was deployed by me."
- **Concrete numbers.** Not "fast" — say "boots in 4 seconds." Not "cheap" — say "$4.51/mo."
- **Em-dashes are fine.** Amit uses them often. Don't overdo it.
- **Single quotes for inline code is wrong** — use backticks. `like this`.

### Words and phrases to ban

Never use:
- "leverage" (verb), "synergy", "robust", "cutting-edge", "next-generation", "best-in-class"
- "in today's world", "in this article we will", "without further ado"
- "game-changer", "deep dive", "unlock"
- "as an AI" or any meta reference to AI assistance
- "delve", "tapestry", "navigate the landscape of", "moreover", "furthermore" — these are the AI-content tells. Google's helpful-content systems pattern-match them.
- "Hermes Agent (a tool by Nous Research that…)" parenthetical definitions on every mention. Define once, then use the name.
- Emoji. Anywhere.

### Formatting rules

- **One H1 per post.** That's the title in frontmatter (the page renders the title automatically) — **do not put another `# Heading` at the top of the body.** The first body element should be a paragraph or an `<Image>` block.
- Use `## H2` for section headers, `### H3` for subsections.
- Use bullet points sparingly. Prefer paragraphs that argue something. A wall of bullets is a sign the writer didn't know what to say.
- Code blocks: triple-backtick with language tag (`bash`, `yaml`, `ts`, `json`). Always.
- Internal links: relative URLs (`/agents`, `/blog/some-post`), not absolute.
- External links: full `https://` URLs. The MDX components automatically open them in a new tab with `rel="noopener noreferrer"`.

### Length & rhythm

- Open with a 2–3 sentence hook that names the problem and previews the takeaway. **No history lessons. No "AI is changing the world" preambles.**
- One screenshot or code block every ~400 words to break the page. Use the `<Image>` MDX component (see §10).
- Close with a "what to do next" section + a CTA block (see §11).

---

## 5. The briefs

Each brief below contains: target query, search intent, outline, required mentions, internal links, and a CTA.

---

### POST 1 — Deploy Hermes Agent on Hetzner

**Slug:** `deploy-hermes-agent-on-hetzner`
**Title:** *How to Deploy Hermes Agent on Hetzner — A Complete 2026 Walkthrough*
**Meta description (155 char target):** *Deploy a production Hermes Agent on Hetzner VPS in under an hour. Step-by-step setup, Tailscale networking, Telegram gateway, and the gotchas I hit.*
**Primary query:** `how to deploy hermes agent on hetzner`
**Secondary queries:** `hermes agent hetzner setup`, `self-hosted hermes vps`, `hermes agent installation`, `nous research hermes setup`, `hermes telegram agent`
**Search intent:** Tutorial / how-to. The reader has heard of Hermes, has a Hetzner account or is about to get one, and wants to actually run an agent before the end of the day.
**Word count:** 2,000–2,500.

**Outline (use these H2s, in order):**

1. **What you're building** — A self-hosted Hermes agent on a Hetzner CX22 (or similar), accessible from Telegram, with persistent memory and Tailscale-only SSH. End state: you can DM a bot and it remembers you tomorrow.
2. **Why Hetzner for this** — 1 short paragraph: price/performance, EU data location, plays well with Tailscale. Compare CX vs CCX briefly. Link out to Hetzner.
3. **Prerequisites** — Hetzner account, a domain (optional), a Telegram bot token (link to BotFather), an OpenAI or Anthropic API key (or Nous Portal). 4–6 bullet items max.
4. **Step 1: Spin up the Hetzner VPS** — exact box recommendation (start with CX22, ~€4/mo), OS choice (Ubuntu 24.04 LTS), SSH key setup. Include a `bash` code block.
5. **Step 2: Lock it down with Tailscale** — install Tailscale, join your tailnet, **firewall off public SSH**. Code block. This section is the differentiator — most tutorials skip it.
6. **Step 3: Install Hermes** — clone the repo, install deps, run the bootstrap. Reference the official `NousResearch/hermes-agent` repo. Code block.
7. **Step 4: Configure the model and gateway** — `config.yaml` (or whatever the actual file is — verify against the repo) with the API key, the Telegram token, and the model choice. Show one OpenAI example and one Anthropic example.
8. **Step 5: First boot and DM test** — start the service (`systemd` unit recommended — show the unit file), DM the bot, confirm a response.
9. **Persisting memory across reboots** — point to Hindsight or the SQLite memory file (verify against the repo); explain volume mounting if Docker is used.
10. **Things that broke for me (the gotchas)** — 4–6 honest debugging stories, each ~3 sentences. e.g. "Tailscale's MagicDNS broke my webhook URL until I added the `--accept-dns=false` flag." This is what makes the post rank — Google rewards firsthand experience.
11. **What to do next** — link to post 5 (running 14 agents), to `/agents` for the services page.

**Required mentions, each at least once:**
- "Hermes Agent" (or "Hermes")
- "Nous Research"
- "Hetzner" (multiple — it's the primary keyword)
- "Tailscale"
- "self-hosted"
- "Ubuntu 24.04"
- "systemd"

**Internal links to include:**
- `/agents` — anchor text: "production Hermes agent builds"
- `/workflow#hosting-infrastructure` — anchor text: "the rest of my hosting stack"
- `/workflow#agent-frameworks` — anchor text: "the agent frameworks I build on"

**External links to include:**
- https://github.com/NousResearch/hermes-agent (Hermes repo)
- https://nousresearch.com/ (Nous Research)
- https://www.hetzner.com/cloud (Hetzner Cloud)
- https://tailscale.com/ (Tailscale)
- https://core.telegram.org/bots#botfather (BotFather)

**CTA at end:** Discovery call CTA block (see §11).

---

### POST 2 — Hostinger VPS for AI agents

**Slug:** `hostinger-vps-for-self-hosted-ai-agents`
**Title:** *Hostinger VPS for Self-Hosted AI Agents — What Works in 2026*
**Meta description:** *Honest review of Hostinger's KVM VPS for running self-hosted AI agents like Hermes and OpenClaw. What works, what doesn't, and when to pick Hetzner instead.*
**Primary query:** `hostinger vps for ai agents`
**Secondary queries:** `hostinger ai agent hosting`, `cheap vps for ai agents`, `hostinger kvm vps`, `hostinger for openclaw`, `is hostinger good for self-hosted ai`
**Search intent:** Decision / evaluation. Reader is comparing budget hosts and wants to know if Hostinger is "good enough" for an agent. Probably $5–15/mo budget.
**Word count:** 1,800–2,200.

**Outline:**

1. **The honest answer up front** — short verdict: yes for single-purpose agents under ~2 GB RAM, no for production stacks of 5+ agents. Don't bury the lede.
2. **What I tested** — KVM 2 plan, Ubuntu 24.04, ran an OpenClaw agent and a Hermes single-instance for 30 days. State the price, the spec, the workload.
3. **The good** — bandwidth allowance, Lite Speed defaults are fine, pricing is genuinely cheaper than Hetzner for the smallest tier. Be specific.
4. **The bad** — noisy neighbors on shared CPU plans (test data: include real numbers — agent latency variance), Bangalore region only intermittent, control panel is heavier than `kamatera` or pure cloud.
5. **The ugly** — anything genuinely bad: e.g., outbound SMTP blocked by default, support response times, AUP for AI workloads (verify before publishing).
6. **Hostinger vs Hetzner for AI agents** — table or paragraph comparison. Hetzner wins on raw performance and predictable I/O; Hostinger wins on absolute cheapest entry tier.
7. **When Hostinger is the right call** — single OpenClaw agent for a personal Telegram bot, a side-project Hermes node, or a client who already has a Hostinger account. Be specific.
8. **When to skip Hostinger and go Hetzner** — production agent stacks, anything needing predictable I/O, anything with strict EU residency.
9. **Setup quick-start** — point to post 1 with a note that the same Tailscale + systemd recipe works on Hostinger; just swap the host. Don't repeat the whole tutorial.
10. **What to do next** — link to post 4 (best VPS comparison), to `/agents`.

**Required mentions:**
- "Hostinger" (multiple)
- "VPS" (multiple)
- "Hermes Agent"
- "OpenClaw"
- "Hetzner" (for comparison)
- "self-hosted"

**Internal links:**
- Post 1 — anchor: "deploy Hermes on a Hetzner box"
- Post 4 — anchor: "the full VPS comparison"
- `/agents` — anchor: "I build production AI agents on Hermes and OpenClaw"

**External links:**
- https://www.hostinger.com/vps-hosting
- https://www.hetzner.com/cloud (comparison)
- https://github.com/openclaw/openclaw

**CTA:** Newsletter signup block (see §11).

---

### POST 3 — OpenHuman vs Hermes vs OpenClaw

**Slug:** `openhuman-vs-hermes-vs-openclaw`
**Title:** *OpenHuman vs Hermes vs OpenClaw — When to Use Each Open-Source Agent Framework*
**Meta description:** *A no-fluff comparison of OpenHuman, Hermes (Nous Research), and OpenClaw — three open-source AI agent frameworks. Architecture, memory, deployment, and which one to pick.*
**Primary query:** `openhuman vs hermes vs openclaw`
**Secondary queries:** `hermes vs openclaw`, `open-source ai agent framework comparison`, `best open-source ai agent`, `openhuman ai agent framework`, `which open-source agent framework to use`
**Search intent:** Decision / comparison. Reader is choosing between frameworks and wants someone who has used all three to tell them which one fits their job. **This is your highest-converting post.** Comparison queries drive the most leads.
**Word count:** 2,200–2,800. The longest of the five.

**Outline:**

1. **TL;DR (3 bullets)** — one-line verdict per framework. Pin this at the top.
2. **Why these three** — short paragraph on why these three frameworks are worth comparing in 2026 (vs. Letta, AutoGen, CrewAI). Don't trash competitors; just say what these three share.
3. **At a glance** — comparison table. Columns: Hermes, OpenClaw, OpenHuman. Rows: maker, license, primary metaphor (self-improving / messaging-first / human-in-the-loop), memory model, channels supported, model providers, recommended VPS size.
4. **Hermes Agent (Nous Research)** — H2 section, 350–500 words. Architecture (gateway → skills → memory). Strengths. Weaknesses. Best fit. One screenshot or `bash` block of a real Hermes config.
5. **OpenClaw (Peter Steinberger)** — same structure. SOUL.md, plugin pipeline, single-purpose agents.
6. **OpenHuman** — same structure. Approval gates, audit trails, policy enforcement.
7. **Memory: how each framework persists state** — substantive subsection. This is where the post earns the rank. Be specific about Hindsight, SOUL.md, and how OpenHuman handles approvals + audit logs.
8. **Cost & deployment footprint** — RAM/CPU/disk for each at a typical workload. Pair with link to post 4.
9. **Which one should you pick?** — flowchart-style decision tree, in prose:
   - "Building a personal AI for one person → Hermes."
   - "Building a single-purpose Telegram bot with persistent identity → OpenClaw."
   - "Building an agent that operates on production systems where wrong actions cost money → OpenHuman."
10. **What I run** — Amit runs Hermes for 13 of 14 agents and OpenClaw for one. State this. Authority through specificity.
11. **What to do next** — link to post 1 (Hermes setup), to `/agents`.

**Required mentions:**
- "Hermes Agent" / "Hermes"
- "OpenClaw"
- "OpenHuman"
- "Nous Research"
- "Peter Steinberger"
- "SOUL.md"
- "Hindsight"
- "MIT license"
- "model-agnostic"
- "self-hosted"

**Internal links:**
- Post 1 — anchor: "how I deploy Hermes on Hetzner"
- Post 4 — anchor: "the right VPS for each"
- Post 5 — anchor: "running 14 agents on one box"
- `/agents` — anchor: "production builds on Hermes and OpenClaw"
- `/agents#hermes-and-openclaw` — anchor: "the stack I bet on"

**External links:**
- https://github.com/NousResearch/hermes-agent
- https://nousresearch.com/
- https://github.com/openclaw/openclaw
- https://steipete.com/ (Peter Steinberger)
- The official OpenHuman repo URL — **ask Amit before publishing if you can't confirm.**

**CTA:** Discovery call CTA block.

---

### POST 4 — Best VPS for self-hosted AI agents

**Slug:** `best-vps-for-self-hosted-ai-agents-2026`
**Title:** *Best VPS for Self-Hosted AI Agents in 2026 (Hetzner, Hostinger, DigitalOcean Compared)*
**Meta description:** *I tested Hetzner, Hostinger, and DigitalOcean for running self-hosted AI agents. Here's the honest verdict, real benchmark numbers, and which to pick for your stack.*
**Primary query:** `best vps for self-hosted ai agents`
**Secondary queries:** `vps for ai agents 2026`, `hetzner vs hostinger vs digitalocean`, `cheapest vps for hermes`, `where to host self-hosted ai agent`, `ai agent hosting`
**Search intent:** Decision / commercial. Reader has decided to self-host an AI agent and is picking a provider. High intent.
**Word count:** 1,800–2,400.

**Outline:**

1. **The honest verdict (1 paragraph)** — Hetzner for production, Hostinger for budget single-agent, DigitalOcean for clients on existing DO accounts.
2. **What I'm benchmarking** — explain methodology in 1 paragraph. A Hermes agent + a Postgres + Tailscale, on the smallest plan that fits 2 GB RAM. 30-day uptime test.
3. **Hetzner CX22 / CCX13** — H2. Price, specs, ping from common locations, real RAM under load, disk speed. **Use real numbers. If you don't have benchmarks, ask Amit for them — do not invent.**
4. **Hostinger KVM 2** — H2. Same template.
5. **DigitalOcean Basic / CPU-Optimized** — H2. Same template.
6. **The comparison table** — multi-column markdown table. Plan name, vCPUs, RAM, disk, monthly price, region count, network egress allowance, EU data residency, snapshot pricing, agent-suitability score (1–5).
7. **What I'd actually pick today** — 3 scenarios, 3 picks:
   - "First Hermes agent for myself" → Hetzner CX22.
   - "Side-project bot for my Telegram group" → Hostinger KVM 2.
   - "Client deployment, they want a familiar logo" → DO Basic Droplet.
8. **What about AWS / GCP / Azure?** — short section explaining why they're rarely the right call for sub-100-agent self-hosted setups (cost, complexity, no flat pricing).
9. **Setup recipe (works on all three)** — point to post 1. Don't repeat.
10. **What to do next** — link to posts 1, 2, 3, 5 and to `/agents`.

**Required mentions:**
- "Hetzner", "Hostinger", "DigitalOcean" (multiple each)
- "VPS"
- "Hermes Agent"
- "OpenClaw"
- "self-hosted"
- "EU data residency" (at least once — important for ranking on adjacent queries)

**Internal links:**
- Post 1 — anchor: "the full Hermes-on-Hetzner walkthrough"
- Post 2 — anchor: "the Hostinger deep-dive"
- Post 3 — anchor: "compare the agent frameworks themselves"
- Post 5 — anchor: "fitting 14 agents on one box"
- `/agents` — anchor: "production agent builds"
- `/workflow#hosting-infrastructure` — anchor: "the full hosting stack"

**External links:**
- All three provider URLs (already listed above).

**CTA:** Discovery call CTA.

---

### POST 5 — How I run 14 AI agents on one Hetzner VPS

**Slug:** `run-14-ai-agents-on-single-hetzner-vps`
**Title:** *How I Run 14 AI Agents on a Single Hetzner VPS*
**Meta description:** *The architecture behind running 14 specialist AI agents on one Hetzner box: SQLite kanban coordination, credential pool rotation, Tailscale networking, and what actually breaks at scale.*
**Primary query:** `run multiple ai agents on one vps`
**Secondary queries:** `multi-agent system on single server`, `hermes agent multi-agent setup`, `running 14 agents`, `agent orchestration single box`, `self-hosted multi-agent architecture`
**Search intent:** Aspiration / how-to. Reader has one agent running and wants to scale. Probably a builder/founder.
**Word count:** 2,000–2,500.

**Outline:**

1. **The setup at a glance** — Hetzner CCX (verify size with Amit), Hermes for 13 agents + OpenClaw for 1, Discord-first ops, Tailscale-only network. 1 paragraph.
2. **The 14 agents and what each does** — list the names: Commander, Concierge, Research, Dreamer, Coder, QA, OSINT, Content-Studio, SEO-Recon (and 5 more — get from Amit). 1–2 sentences each. **This is the section that ranks.** It's specific and unique to Amit's site.
3. **Identity-first design (SOUL.md + AGENTS.md)** — explain the two-file pattern. Why it matters: vague agents do vague work. Show one tiny example of each file (~10 lines).
4. **Coordination via SQLite kanban** — the crucial section. Explain why no message queues, no event buses. Atomic claims, dependencies, retries, audit trail. Single source of truth. Code or table example.
5. **Credential pool & fallback chain** — auto-rotation when API keys hit rate limits, provider fallback when one's down. Why this matters at 14 agents.
6. **Discord-first ops with cron** — Amit talks to one agent (the Commander) in a private channel; it delegates via kanban. Cron auto-fires recurring work. Output lands in a structured vault.
7. **Two-layer memory** — automatic recent-context (runtime-native, holographic) + deliberate cross-session knowledge (vector store, semantic recall). Different time horizons.
8. **Private-by-default networking** — Tailscale mesh only, no public ports, SSH/dashboards reach the VPS from laptop and phone.
9. **What broke at scale** — 4–6 honest war stories. e.g. SQLite WAL contention, Discord rate limits, Hetzner IPv6-only quirks, model provider 429s.
10. **Could you do this?** — yes; here's the smallest version of this architecture (1 commander + 2 specialists). Then point to post 1.
11. **What to do next** — link to `/agents`, post 3 (framework comparison), and Amit's Substack.

**Required mentions:**
- All 14 agent names (get the full list from Amit before writing).
- "Hetzner"
- "Hermes Agent" / "Hermes"
- "OpenClaw"
- "SQLite"
- "Tailscale"
- "SOUL.md", "AGENTS.md"
- "MCP" / "Model Context Protocol" — if mentioned, define on first use.

**Internal links:**
- Post 1, Post 3, Post 4 — see post 4 for anchor text.
- `/agents` — anchor: "this is the same architecture I bring to client builds"
- `/workflow` — anchor: "my full dev stack"
- https://substack.com/@growthperclick — anchor: "more posts on agent ops"

**External links:**
- Hermes repo, Tailscale.

**CTA:** Discovery call + newsletter dual CTA.

---

## 6. Universal SEO requirements (every post)

These apply to all five posts. No exceptions.

1. **Primary query in the H1 (the title).** Use it verbatim or with one-word reordering. The title in frontmatter renders as the H1.
2. **Primary query in the meta description.** Description should be 140–160 chars.
3. **Primary query in the first 100 words of the body.** Naturally — not stuffed.
4. **Primary query in at least one H2.** The H2 must read naturally as a section heading, not as keyword bait.
5. **Use the secondary queries** at least once each, anywhere in the body, in natural phrasing.
6. **Every post links to `/agents` at least once** with descriptive anchor text (not "click here").
7. **Every post links to at least 2 other posts in this 5-post cluster** with descriptive anchor text. Cross-linking is the entire reason we're shipping these as a set.
8. **Every external link** uses the canonical URL (no UTM tracking parameters; no redirector URLs).
9. **Every image has alt text** describing the image content (not the keyword).
10. **No more than one H1 per post.** Frontmatter `title` produces it. Body starts at H2.
11. **No keyword density games.** If you use the primary query more than 8 times in a 2,000-word post, you've gone too far. Google penalizes obvious stuffing.

---

## 7. Internal-linking map

These five posts must form a closed cluster. Every post links into the cluster at least twice.

```
Post 1 (Hermes on Hetzner)
  → Post 4 (VPS comparison)
  → Post 5 (running 14 agents)

Post 2 (Hostinger)
  → Post 1 (Hermes setup)
  → Post 4 (full VPS comparison)

Post 3 (Framework comparison)
  → Post 1 (Hermes setup)
  → Post 4 (right VPS for each)
  → Post 5 (running 14 agents)

Post 4 (VPS comparison)
  → Post 1, Post 2, Post 3, Post 5

Post 5 (14 agents)
  → Post 1, Post 3, Post 4
```

Every post also links to **`/agents`** and at least one of `/workflow`, `/workflow#hosting-infrastructure`, `/workflow#agent-frameworks`, or `/agents#hermes-and-openclaw`.

---

## 8. MDX file format

Each post is delivered as a single `.mdx` file. Filename = slug + `.mdx`.

### Frontmatter spec

Use this exact format. The build will reject posts with malformed frontmatter.

```mdx
---
title: "How to Deploy Hermes Agent on Hetzner — A Complete 2026 Walkthrough"
publishedAt: "2026-05-24"
summary: "Deploy a production Hermes Agent on Hetzner VPS in under an hour. Step-by-step setup, Tailscale networking, Telegram gateway, and the gotchas I hit."
image: "/static/images/deploy-hermes-agent-on-hetzner/cover.png"
tags: ["hermes-agent", "hetzner", "self-hosted-ai", "ai-agents", "tutorial"]
---
```

Field rules:

- `title`: 50–70 chars. Must be the working title from §2 (or with at most one-word edit).
- `publishedAt`: ISO date, format `YYYY-MM-DD`. Use the day Amit publishes — leave it as a placeholder `"YYYY-MM-DD"` if unsure.
- `summary`: 140–160 chars. This is the meta description — write it for click-through, not just SEO.
- `image`: path to a 1200×630 cover image inside `/public/static/images/{slug}/cover.png`. Even if you don't have the image, fill the path correctly.
- `tags`: 3–6 lowercase, hyphenated tags. Reuse tags across posts where it makes sense — that creates `/blog/tag/{tag}` collection pages.

### Body conventions

After the frontmatter:

- **Do not start with `# Title`** — frontmatter renders the H1.
- Optionally start with a hero image:
  ```mdx
  <Image
    alt="Architecture diagram of a Hermes agent on Hetzner with Tailscale"
    src="/static/images/deploy-hermes-agent-on-hetzner/cover.png"
    width={1800}
    height={1000}
    priority
  />
  ```
- Then the opening paragraph (the hook).
- Then `## Section heading` for each H2.

### MDX components you can use

These render correctly on the site. Don't use anything else without checking.

- `<Image src="..." alt="..." width={...} height={...} priority />` — for hero/figure images.
- `<StepLarge number={1} title="Section title" />` — big numbered section header.
- `<StepCheck title="Benefit or feature line" />` — checkmark item, useful for "what you'll get" lists.
- `<HighlightBox>...</HighlightBox>` — pull-quote / callout. Use for warnings or key insights, max 2 per post.
- `<Divider />` — visual section break. Optional.
- `<Button href="...">CTA text</Button>` — primary CTA button.

Plain markdown also works: `**bold**`, `*italic*`, `[link](/url)`, `> blockquote`, `\`\`\`bash` code blocks, tables.

---

## 9. Image guidance

Every post needs:

1. **One cover image** — 1200×630 (OG image standard). Saved to `/public/static/images/{slug}/cover.png`. The slug folder must match the post slug exactly.
2. **2–4 in-body images** — screenshots, architecture diagrams, code screenshots, terminal output. Each gets descriptive alt text.

Image sourcing:

- Original screenshots from Amit's actual setup are best. Ask for them.
- Architecture diagrams: build in Excalidraw or tldraw, export as PNG. Keep them simple — boxes and arrows beat 3D renders.
- **Do not use AI-generated images for technical content.** They produce hallucinated UI that hurts trust.
- **No stock photos of "person at laptop" or "AI brain."** Banned.
- All images must be web-optimized: PNG for diagrams/screenshots with text, JPG for photos. Target file size <300 KB per image.

Alt text rules:

- Describe what the image shows, not the keyword you want to rank for.
- Good: `"Hermes agent config.yaml file open in VS Code with the model field set to claude-3-5-sonnet"`.
- Bad: `"hermes agent on hetzner"` (keyword stuffing, gives Google nothing useful).

---

## 10. CTA block templates (copy-paste)

Pick one of these for the bottom of each post. The choice is noted in each brief.

### Discovery call CTA

```mdx
---

## Want me to build one for you?

I design and ship production AI agents on Hermes and OpenClaw —
self-hosted, model-agnostic, and tuned to how your business actually
runs. Personal AI for founders. Business intelligence agents for teams.
Ops agents in Telegram, Slack, or Discord.

[See what I build →](/agents)

Or skip ahead and book a free 20-minute discovery call:
[cal.com/growthperclick/discovery-call](https://cal.com/growthperclick/discovery-call).
```

### Newsletter CTA

```mdx
---

## Get the next post

Every week I publish what I learn shipping production AI agents — real
builds, real code, real mistakes. No fluff.

[Subscribe to the newsletter →](/newsletter)
```

### Dual CTA (use on post 5)

```mdx
---

## What's next

If you're building your own multi-agent setup, the
[OpenHuman vs Hermes vs OpenClaw comparison](/blog/openhuman-vs-hermes-vs-openclaw)
is probably the next thing to read. Or, if you'd rather have me build
it for you, [see the agent-build offer](/agents) or
[book a 20-minute discovery call](https://cal.com/growthperclick/discovery-call).
```

---

## 11. Quality bar — what gets a post rejected

A post is rejected and sent back for rewrite if any of these are true:

1. **Word count below 1,500** or padded above 3,000.
2. **AI-generated tells.** "Delve", "tapestry", "navigate the landscape", "in today's", three-em-dashes-in-a-row, robotic transitions ("Furthermore," "Moreover,"). Posts that read like ChatGPT default output get rejected on sight.
3. **Inaccurate entity facts.** Hermes attributed to the wrong org. OpenClaw spelled "Open Claw." `SOUL.md` written as `soul.md` or `Soul.md`. Hetzner spelled "Hertzner." Each is an instant rewrite.
4. **Generic intro** ("AI agents are taking over the world…"). Hook with the specific problem and the specific takeaway.
5. **Keyword stuffing.** Primary query appearing more than 8 times. Or appearing in headings unnaturally.
6. **No firsthand voice.** If the post could have been written by someone who has never deployed Hermes, it's wrong. Specific numbers, specific debugging stories, specific config snippets are required.
7. **Missing internal links.** Each post must hit the link map in §7.
8. **No CTA block at the end.**
9. **One or zero images.** Posts of 2,000 words need 3+ images.
10. **Stock photos or AI-generated UI.** See §9.

---

## 12. Workflow

1. **Acceptance.** Reply to Amit confirming you've read this brief end-to-end and have no blocking questions. List anything ambiguous.
2. **Outline pass.** Submit a 1-page outline for each of the 5 posts before writing. Amit signs off in 24 hours.
3. **Draft 1.** Deliver post 1's MDX file. Amit reviews within 48 hours.
4. **Iterate.** Address feedback. Then proceed to post 2 — the rest go faster.
5. **Final delivery.** All 5 MDX files in a single zip or shared folder, plus an `images/` folder mirroring the slug structure, plus filled-in OG images for each.

Per-post turnaround target: ~2 days. All five within 14 days of brief acceptance.

---

## 13. After the writer is done — Amit's distribution playbook

This is for Amit, not the writer. Listed here so the brief is self-contained.

For each published post:

1. **Drop the MDX in `/data/blog/{slug}.mdx`** (or paste into the admin dashboard if using Supabase mode).
2. **Drop images** in `/public/static/images/{slug}/`.
3. **Run `pnpm build`** locally to confirm the post renders.
4. **Push to `main`.** Vercel deploys.
5. **Submit to Google Search Console** — request indexing for the new URL.
6. **Cross-post to Hashnode** with `rel=canonical` pointing back to the iamamitkumar.dev URL.
7. **Cross-post to Dev.to** with the same canonical.
8. **Submit to Hacker News once** — only post 3 (the framework comparison) is HN-suitable. Title it "Show HN: I compared Hermes, OpenClaw, and OpenHuman after building on all three."
9. **Tweet the post** with a screenshot of the most interesting paragraph. Pin for 24 hours.
10. **Send to the Substack list** once 2 posts are out. Bundle them.

---

## 14. FAQ

**Q: Can I write these in any order?**
A: Write post 1 first; the others can be parallel. But **publish 1 → 2 → 3 → 4 → 5** because the cross-links assume that order.

**Q: Can I use ChatGPT/Claude to draft?**
A: For research and outlines, yes. For prose, no — the AI tells in §11.2 are the fastest way to get a post rejected. The voice has to read like Amit. AI-default voice does not.

**Q: What if I can't verify a fact about OpenHuman / a Hermes config field / a Hetzner plan name?**
A: Ask Amit before publishing. Inventing a property of a named tool is the only error that's worse than missing the deadline.

**Q: Should I include affiliate links to Hetzner / Hostinger / DigitalOcean?**
A: Only if Amit explicitly tells you he wants them. Default: plain non-affiliate URLs.

**Q: Can I use first-person plural ("we")?**
A: No. Always "I". Posts are by Amit.

**Q: Can I add posts beyond the five?**
A: Not in this brief. Stick to the five.

**Q: What if a post hits the word ceiling and there's still more to say?**
A: Cut. The discipline is part of the deliverable. If the cut material is genuinely useful, propose a 6th post in your final notes — don't bloat the existing five.

---

## 15. Resources for research

- Hermes repo & docs: https://github.com/NousResearch/hermes-agent
- Nous Research: https://nousresearch.com/
- OpenClaw repo: https://github.com/openclaw/openclaw
- Peter Steinberger (OpenClaw): https://steipete.com/
- Hetzner Cloud pricing: https://www.hetzner.com/cloud
- Hostinger VPS: https://www.hostinger.com/vps-hosting
- DigitalOcean pricing: https://www.digitalocean.com/pricing
- Tailscale docs: https://tailscale.com/kb
- Existing Amit posts (read these first to lock the voice):
  - https://iamamitkumar.dev/blog/how-to-set-up-openclaw-a-builder-s-honest-setup-guide-2026
  - https://iamamitkumar.dev/blog/how-to-build-enterprise-grade-production-ready-ai-agents
  - https://iamamitkumar.dev/blog/ai-agent-pilot-to-production
- Existing service page (the canonical voice): https://iamamitkumar.dev/agents
- The full dev-stack page: https://iamamitkumar.dev/workflow

---

## 16. Definition of done

A post is "done" when:

- ✅ MDX file in the format from §8.
- ✅ Frontmatter all fields filled correctly.
- ✅ Word count inside the target range (§5 per post).
- ✅ Primary query in title, meta description, first 100 words, at least one H2.
- ✅ All required mentions (§5 per post) present.
- ✅ All internal links hit (§7).
- ✅ All external links have canonical URLs.
- ✅ Cover image at `/public/static/images/{slug}/cover.png`.
- ✅ 2–4 in-body images with descriptive alt text.
- ✅ CTA block at the end (§10).
- ✅ Voice matches §4. None of the banned words. None of the AI tells.
- ✅ Entity facts verified against §3.
- ✅ Renders cleanly with `pnpm build` (Amit will confirm).

---

## Final note from Amit

You are not writing marketing copy. You are writing the posts I would write myself if I had the time. They have to read like a builder who has actually shipped this stuff — because that's the only voice that ranks on these queries in 2026.

If anything in this brief is unclear, ask before you start writing. A 5-minute clarification beats a 2,500-word rewrite.

— Amit

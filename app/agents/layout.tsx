import type { Metadata } from "next";
import Script from "next/script";
import { faqStructuredData } from "@/components/agents/landing/faq";
import { SITE_URL } from "@/lib/site";

const AGENTS_PAGE_URL = `${SITE_URL}/agents`;

const TITLE = "Production AI Agent Development — Hermes & OpenClaw";
const DESCRIPTION =
  "Production AI agents built on Hermes and OpenClaw — self-hosted, model-agnostic, tuned to your business. Ops agents in Telegram, Slack, Discord.";

const KEYWORDS = [
  "Hermes agent",
  "Hermes Agent setup",
  "Nous Research Hermes",
  "build Hermes agent",
  "self-hosted Hermes",
  "Hermes ai agent",
  "Hermes Telegram agent",
  "Hermes Slack agent",
  "OpenClaw",
  "OpenClaw setup",
  "OpenClaw SOUL.md",
  "OpenClaw tutorial",
  "OpenClaw agent framework",
  "self-hosted OpenClaw",
  "OpenHuman agent",
  "OpenHuman AI framework",
  "human-in-the-loop AI agent",
  "Hermes vs OpenClaw vs OpenHuman",
  "Hermes vs OpenClaw",
  "open-source AI agent framework",
  "production AI agents",
  "self-hosted AI agent",
  "AI agent on Hetzner",
  "AI agent on Hostinger",
  "AI agent on DigitalOcean",
  "self-hosted agent VPS",
  "Tailscale AI agent",
  "Cloudflare AI agent",
  "AI agent builder",
  "AI agent developer",
  "agentic architect",
  "multi-agent orchestration",
  "Telegram AI agent",
  "Slack AI agent",
  "Discord AI agent",
];

export const metadata: Metadata = {
  // Use `absolute` so the root template (`%s | Amit Kumar`) does not append
  // a second " | Amit Kumar" — the page TITLE already includes it.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  alternates: {
    canonical: AGENTS_PAGE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: AGENTS_PAGE_URL,
    siteName: "Amit Kumar — Agents",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Amit Kumar — Production AI Agents on Hermes & OpenClaw",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@growthperclick",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ProfessionalService: this is the page's primary commercial entity
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${AGENTS_PAGE_URL}/#service`,
    name: "Amit Kumar — Production AI Agent Development Services on Hermes & OpenClaw",
    url: AGENTS_PAGE_URL,
    description: DESCRIPTION,
    provider: { "@id": `${SITE_URL}/#person` },
    serviceType: [
      "AI agent development",
      "Hermes agent development",
      "OpenClaw agent development",
      "OpenHuman agent development",
      "Self-hosted AI agent deployment",
      "Multi-agent orchestration",
      "AI agent deployment on Hetzner, Hostinger, and DigitalOcean",
    ],
    areaServed: "Worldwide",
    knowsAbout: [
      "Hermes Agent (Nous Research)",
      "OpenClaw agent framework",
      "OpenHuman AI agent framework",
      "SOUL.md identity files",
      "AGENTS.md mission files",
      "Self-hosted AI agents",
      "Model-agnostic agent design",
      "Multi-agent orchestration",
      "Telegram AI agents",
      "Slack AI agents",
      "Discord AI agents",
      "Self-hosted AI agents on Hetzner",
      "Self-hosted AI agents on Hostinger",
      "Self-hosted AI agents on DigitalOcean",
      "Tailscale mesh networking for agents",
      "Cloudflare in front of AI agents",
      "Vercel for agent web layers",
      "Model Context Protocol (MCP) servers",
    ],
    keywords: KEYWORDS.join(", "),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "USD",
        description: "Quoted per project after a free discovery call.",
      },
    },
  };

  // SoftwareApplication entities for Hermes Agent and OpenClaw — the
  // entity-association signal that helps search engines tie Amit Kumar
  // (the @id Person) to these two named open-source projects.
  const hermesJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${AGENTS_PAGE_URL}/#hermes-agent`,
    name: "Hermes Agent",
    alternateName: ["Hermes", "Hermes Agent (Nous Research)"],
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Linux, macOS",
    description:
      "Hermes is an open-source, self-improving AI agent by Nous Research. Self-hosted, model-agnostic, with persistent memory, scheduled crons, subagent spawning, and a single gateway across Telegram, Slack, Discord, WhatsApp, Signal, and CLI.",
    license: "https://opensource.org/licenses/MIT",
    url: "https://github.com/NousResearch/hermes-agent",
    sameAs: [
      "https://github.com/NousResearch/hermes-agent",
      "https://nousresearch.com/",
    ],
    creator: {
      "@type": "Organization",
      name: "Nous Research",
      url: "https://nousresearch.com/",
    },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const openClawJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${AGENTS_PAGE_URL}/#openclaw`,
    name: "OpenClaw",
    alternateName: ["OpenClaw agent framework"],
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Linux, macOS",
    description:
      "OpenClaw is a self-hosted, messaging-first AI agent framework with markdown-based memory (SOUL.md), a plugin pipeline, and runs on your own hardware. The simplest path to an agent that's actually yours.",
    license: "https://opensource.org/licenses/MIT",
    url: "https://github.com/openclaw/openclaw",
    sameAs: ["https://github.com/openclaw/openclaw"],
    creator: {
      "@type": "Person",
      name: "Peter Steinberger",
      sameAs: "https://steipete.com/",
    },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  // BreadcrumbList helps Google render breadcrumbs in search results.
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Agents",
        item: AGENTS_PAGE_URL,
      },
    ],
  };

  return (
    <>
      <Script
        id="agents-service-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        strategy="afterInteractive"
      />
      <Script
        id="agents-hermes-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hermesJsonLd) }}
        strategy="afterInteractive"
      />
      <Script
        id="agents-openclaw-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(openClawJsonLd) }}
        strategy="afterInteractive"
      />
      <Script
        id="agents-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        strategy="afterInteractive"
      />
      <Script
        id="agents-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        strategy="afterInteractive"
      />
      {children}
    </>
  );
}

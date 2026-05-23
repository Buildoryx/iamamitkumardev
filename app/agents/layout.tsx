import type { Metadata } from "next";
import Script from "next/script";
import { faqStructuredData } from "@/components/agents/landing/faq";
import { AGENTS_URL, SITE_URL } from "@/lib/site";

const TITLE = "Production AI Agents on Hermes & OpenClaw — Amit Kumar";
const DESCRIPTION =
  "I build production-grade AI agents on open-source frameworks — self-hosted, model-agnostic, and tuned to your business. Personal AI, business intelligence agents, and ops automation for founders and teams.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: AGENTS_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: AGENTS_URL,
    siteName: "Amit Kumar — Agents",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Amit Kumar — Production AI Agents",
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
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${AGENTS_URL}/#service`,
    name: "Amit Kumar — Production AI Agent Builds",
    url: AGENTS_URL,
    description: DESCRIPTION,
    provider: { "@id": `${SITE_URL}/#person` },
    serviceType: "AI agent development",
    areaServed: "Worldwide",
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

  return (
    <>
      <Script
        id="agents-service-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
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

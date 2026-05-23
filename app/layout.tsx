import Providers from "./providers";
import "./globals.css";

import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Schibsted_Grotesk, Geist } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Settings } from "@/components/settings";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { WebMcpProvider } from "@/components/agents/webmcp-provider";
import {
  MEDIUM_URL,
  SITE_HOST,
  SITE_URL,
  SUBSTACK_URL,
  X_URL,
} from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const analyticsDomain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
const analyticsScriptUrl = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL;

function isConfiguredAnalyticsScriptUrl(
  url: string | undefined,
): url is string {
  if (!url?.trim()) return false;
  if (/placeholder|your.?script|your_domain/i.test(url)) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Amit Kumar | Agentic Architect & Full-Stack Engineer",
    template: "%s | Amit Kumar",
  },
  description:
    "Production AI agents on Hermes (Nous Research) and OpenClaw — self-hosted, model-agnostic, and tuned to your business. Engineering agentic architectures, multi-agent orchestration, and enterprise SaaS.",
  keywords: [
    "Amit Kumar",
    "iamamitkumar",
    "growthperclick",
    "Hermes agent",
    "Nous Research Hermes",
    "Hermes Agent setup",
    "build Hermes agent",
    "self-hosted Hermes",
    "OpenClaw",
    "OpenClaw setup",
    "OpenClaw SOUL.md",
    "OpenClaw agent framework",
    "Hermes vs OpenClaw",
    "self-hosted AI agent",
    "open-source AI agent",
    "production AI agent",
    "AI agent builder",
    "agentic architect",
    "multi-agent orchestration",
    "AI automation",
    "Telegram AI agent",
    "Slack AI agent",
    "full-stack engineer",
    "MVP builder",
  ],
  authors: [{ name: "Amit Kumar", url: SITE_URL }],
  creator: "Amit Kumar",
  openGraph: {
    title: "Amit Kumar | Agentic Architect & Full-Stack Engineer",
    description:
      "Production AI agents on Hermes (Nous Research) and OpenClaw — self-hosted, model-agnostic, and tuned to your business.",
    url: SITE_URL,
    siteName: "Amit Kumar",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Amit Kumar - Agentic Architect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amit Kumar | Agentic Architect & Full-Stack Engineer",
    description:
      "Production AI agents on Hermes & OpenClaw — self-hosted, model-agnostic, tuned to your business.",
    creator: "@growthperclick",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-schibsted-grotesk",
});

export default function RootLayout({ children }) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Amit Kumar",
    alternateName: ["growthperclick", "iamamitkumar"],
    url: SITE_URL,
    description:
      "Developer, writer, and content creator building production-grade agentic architectures, multi-agent orchestration, and enterprise SaaS.",
    image: `${SITE_URL}/images/og-image.png`,
    email: "hi@iamamitkumar.dev",
    jobTitle: "Developer, Writer, Content Creator",
    sameAs: [
      X_URL,
      "https://github.com/ravenrepo",
      "https://www.linkedin.com/in/growthperclick/",
      "https://peerlist.io/growthperclick",
      SUBSTACK_URL,
      MEDIUM_URL,
    ],
    knowsAbout: [
      "Hermes Agent (Nous Research)",
      "OpenClaw agent framework",
      "Self-hosted AI agents",
      "Multi-agent orchestration",
      "Model-agnostic agent design",
      "Telegram and Slack AI agents",
      "Production agentic architectures",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Amit Kumar",
    alternateName: SITE_HOST,
    url: SITE_URL,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en-US",
  };

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(
        inter.variable,
        schibstedGrotesk.variable,
        GeistSans.variable,
        "font-sans antialiased",
      )}
      suppressHydrationWarning
    >
      <body className={cn("font-display bg-theme-bg")}>
        <Script
          id="person-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
          strategy="afterInteractive"
        />
        <Script
          id="website-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
          strategy="afterInteractive"
        />
        <Navbar />
        <main className="flex min-h-screen flex-col">
          <Providers>
            <PageViewTracker />
            <WebMcpProvider />
            {children}
          </Providers>
        </main>
        <Footer />
        <Settings />
        <Analytics />
        <SpeedInsights />
        {analyticsDomain &&
        analyticsScriptUrl &&
        isConfiguredAnalyticsScriptUrl(analyticsScriptUrl) ? (
          <Script
            src={analyticsScriptUrl}
            data-domain={analyticsDomain}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}

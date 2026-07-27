import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  // `absolute` avoids the root template appending a second " | Amit Kumar"
  // to a title that already names the author.
  title: { absolute: "Newsletter — AI Agent Insights from Amit Kumar" },
  description:
    "Weekly insights on building autonomous AI agents, orchestrating multi-agent workflows, and shipping SaaS products in public. Join 200+ indie hackers.",
  alternates: {
    canonical: `${SITE_URL}/newsletter`,
  },
  // Thin utility page (137 words, flagged by crawl audit). It exists to
  // convert traffic, not to rank — noindexed so it doesn't dilute
  // site-level quality signals.
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Newsletter — AI Agent Insights from Amit Kumar",
    description:
      "Weekly insights on building autonomous AI agents, orchestrating multi-agent workflows, and shipping SaaS products in public.",
    url: `${SITE_URL}/newsletter`,
    type: "website",
  },
};

export default function NewsletterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Newsletter — AI Agent Insights from Amit Kumar",
  description:
    "Weekly insights on building autonomous AI agents, orchestrating multi-agent workflows, and shipping SaaS products in public. Join 200+ indie hackers.",
  alternates: {
    canonical: `${SITE_URL}/newsletter`,
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

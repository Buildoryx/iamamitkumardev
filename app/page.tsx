import type { Metadata } from "next";
import Container from "@/components/container";
import { Header } from "@/components/header";
import { Work } from "@/components/work";
import { DottedSeparator } from "@/components/separator";
import { Companies } from "@/components/companies";
import { getPublishedPosts } from "@/lib/blog";
import { BlogList } from "@/components/blog/blog-list";
import { WorkWithMe } from "@/components/work-with-me";
import { VidoTask } from "@/components/vidotask";
import { AiAgentsStartHere } from "@/components/ai-agents-start-here";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute:
      "Amit Kumar | Production AI Agents, MCP Tools & Automation Systems",
  },
  description:
    "I build production AI agents, MCP tools, self-hosted automations, and multi-agent workflows for founders and teams using Hermes, OpenClaw, Claude, OpenAI, Supabase, and Next.js.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const posts = await getPublishedPosts(6);

  const projectsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/#projects`,
    name: "Products built by Amit Kumar",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "SoftwareApplication",
          name: "InvoBill",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: "https://invobill.xyz",
          sameAs: `${SITE_URL}/projects/invobill`,
          description:
            "Live inventory, GST billing, accounting, attendance, CRM, lead management, and financial reporting platform for Indian SMBs.",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "SoftwareApplication",
          name: "LaunchSuite.tech",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          url: "https://launchsuite.tech",
          description:
            "SaaS boilerplate MVP for founders, launched for speed-to-revenue.",
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "SoftwareApplication",
          name: "Index Mavens",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description:
            "8-agent trading intelligence system for Indian market workflows.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }}
      />
      <Container>
        <Header />
        <DottedSeparator className="my-10" />
        <AiAgentsStartHere />
        <DottedSeparator className="my-10" />
        <Work />
        <DottedSeparator className="my-10" />
        <VidoTask />
        <DottedSeparator className="my-10" />
        <Companies />
        <DottedSeparator className="my-10" />
        <WorkWithMe />
        <DottedSeparator className="my-10" />
        <BlogList posts={posts} />
        <DottedSeparator className="my-10" />
      </Container>
    </>
  );
}

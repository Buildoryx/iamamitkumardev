import type { Metadata } from "next";
import Container from "@/components/container";
import { Header } from "@/components/header";
import { Work } from "@/components/work";
import { DottedSeparator } from "@/components/separator";
import { Companies } from "@/components/companies";
import { getPublishedPosts, isNonCanonicalSlug } from "@/lib/blog";
import { BlogList } from "@/components/blog/blog-list";
import { WorkWithMe } from "@/components/work-with-me";
import { VidoTask } from "@/components/vidotask";
import { AiAgentsStartHere } from "@/components/ai-agents-start-here";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Amit Kumar — Production AI Agents & MCP Tools",
  },
  description:
    "I build production AI agents, MCP tools, and self-hosted automations for founders and teams — using Hermes, OpenClaw, Claude, Supabase, and Next.js.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const posts = (await getPublishedPosts(8))
    .filter((post) => !isNonCanonicalSlug(post.slug))
    .slice(0, 6);

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
      <Container className="pb-20">
        <Header />

        {/*
          Hierarchy comes from spacing, not rules.
          Seven identical `DottedSeparator my-10` calls used to sit between
          every section, which gave eight blocks the same visual weight and
          made the page read as a stack of boxes. Now: ~64px between related
          sections, ~96px at a real topic boundary, and the dotted rule kept
          for only the two genuine shifts in subject.
        */}
        <div className="mt-14 flex flex-col gap-16">
          <AiAgentsStartHere />
          <Work />
          <VidoTask />
        </div>

        <DottedSeparator className="mt-24 mb-16" />
        <Companies />

        <div className="mt-24 flex flex-col gap-16">
          <WorkWithMe />
        </div>

        <DottedSeparator className="mt-24 mb-16" />
        <BlogList posts={posts} />
      </Container>
    </>
  );
}

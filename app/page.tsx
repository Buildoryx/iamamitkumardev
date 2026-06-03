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
  const posts = await getPublishedPosts(3);

  return (
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
  );
}

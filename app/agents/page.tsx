import Container from "@/components/container";
import { DottedSeparator } from "@/components/separator";
import { AgentsHero } from "@/components/agents/landing/hero";
import { WhoItsFor } from "@/components/agents/landing/who-its-for";
import { WhatIBuild } from "@/components/agents/landing/what-i-build";
import { TheStack } from "@/components/agents/landing/the-stack";
import { Proof } from "@/components/agents/landing/proof";
import { HowWeWork } from "@/components/agents/landing/how-we-work";
import { WhyMe } from "@/components/agents/landing/why-me";
import { CtaCards } from "@/components/agents/landing/cta-cards";
import { LeadForm } from "@/components/agents/landing/lead-form";
import { Faq } from "@/components/agents/landing/faq";

export default function AgentsPage() {
  return (
    <Container>
      <div className="pt-2 md:pt-4">
        <AgentsHero />
      </div>

      <DottedSeparator className="my-10" />
      <WhoItsFor />

      <DottedSeparator className="my-10" />
      <WhatIBuild />

      <DottedSeparator className="my-10" />
      <TheStack />

      <DottedSeparator className="my-10" />
      <Proof />

      <DottedSeparator className="my-10" />
      <HowWeWork />

      <DottedSeparator className="my-10" />
      <WhyMe />

      <DottedSeparator className="my-10" />
      <CtaCards />

      <DottedSeparator className="my-10" />
      <LeadForm />

      <DottedSeparator className="my-10" />
      <Faq />

      <DottedSeparator className="my-10" />
    </Container>
  );
}

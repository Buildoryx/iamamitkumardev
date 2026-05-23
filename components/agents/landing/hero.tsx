"use client";

import React from "react";
import { motion } from "motion/react";
import { GENERAL_VARIANT, SPRING_CONFIG } from "@/lib/motion-config";
import { AGENTS_DISCOVERY_CALL_URL } from "@/lib/site";

export function AgentsHero() {
  return (
    <section className="pt-2 md:pt-4">
      <motion.h1
        variants={GENERAL_VARIANT}
        initial="initial"
        animate="animate"
        transition={SPRING_CONFIG}
        className="text-foreground text-3xl font-medium tracking-tight text-balance md:text-5xl"
      >
        Production AI agents on{" "}
        <span className="text-foreground">Hermes</span> &{" "}
        <span className="text-foreground">OpenClaw</span>.
        <br />
        <span className="text-foreground/55">
          Self-hosted. Model-agnostic. Yours.
        </span>
      </motion.h1>

      <p className="text-foreground mt-6 text-base leading-relaxed md:text-lg md:leading-relaxed">
        I design and ship AI agents on{" "}
        <span className="text-foreground font-medium">
          Hermes (by Nous Research)
        </span>{" "}
        and{" "}
        <span className="text-foreground font-medium">OpenClaw</span> — the two
        open-source frameworks I&apos;ve bet my own stack on. Self-hosted,
        model-agnostic, and tuned to how your business actually runs. Personal
        AI for founders. Business intelligence agents for teams. Ops agents
        that live in Telegram, Slack, Discord, or wherever your work happens.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href="#start-a-project"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-medium shadow-sm shadow-black/[0.04] transition-colors"
        >
          Start a project →
        </a>
        <a
          href={AGENTS_DISCOVERY_CALL_URL}
          target={
            AGENTS_DISCOVERY_CALL_URL.startsWith("http") ? "_blank" : undefined
          }
          rel={
            AGENTS_DISCOVERY_CALL_URL.startsWith("http")
              ? "noopener noreferrer"
              : undefined
          }
          className="border-border/70 bg-card/35 text-foreground/80 hover:border-primary/40 hover:bg-primary/5 hover:text-foreground inline-flex h-11 items-center justify-center rounded-md border px-5 text-sm font-medium transition-colors"
        >
          Book a 20-min discovery call
        </a>
      </div>

      <p className="text-foreground/50 mt-3 text-sm">
        Free 20-minute call. We talk about what you want to build. If it&apos;s
        a fit, we go from there.
      </p>
    </section>
  );
}

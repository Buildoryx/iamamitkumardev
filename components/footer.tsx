"use client";
import React from "react";
import Container from "./container";
import { LinkPreview } from "./link-preview";

export const Footer = () => {
  return (
    <Container className="mt-auto pb-10">
      <footer className="my-8 flex flex-col items-center gap-4">
        <img
          src="/amit-kumar.svg"
          alt="Amit Kumar signature"
          className="mx-auto h-8 w-auto"
        />
        <a
          href="https://www.scrolllaunch.com/products/amit-kumar-agentic-architect-full-stack-engineer?utm_source=badge&utm_medium=embed&utm_campaign=amit-kumar-agentic-architect-full-stack-engineer&ref=scrolllaunch"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://www.scrolllaunch.com/api/badge/amit-kumar-agentic-architect-full-stack-engineer"
            alt="Featured on ScrollLaunch"
            width={220}
            height={48}
            loading="lazy"
          />
        </a>
        <div className="flex flex-col items-center gap-1.5">
          <div className="text-foreground/40 text-center text-sm text-balance">
            Built in public by an indie hacker. Here&apos;s the{" "}
            <LinkPreview url="https://github.com/designerdada/Designerdadacom">code</LinkPreview>{" "}
            and{" "}
            <LinkPreview url="https://substack.com/@growthperclick">
              launch notes
            </LinkPreview>{" "}
            behind product decisions.
          </div>
          <p className="text-foreground/40 text-sm text-balance">
            Shipping products fast, testing demand, and compounding
            distribution.
          </p>
        </div>
      </footer>
    </Container>
  );
};

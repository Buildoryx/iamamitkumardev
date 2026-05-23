"use client";
import React from "react";
import { IconBrandMedium, IconBrandX, IconMail } from "@tabler/icons-react";
import { MEDIUM_URL, SUBSTACK_URL, X_URL } from "@/lib/site";
import Container from "./container";
import { LinkPreview } from "./link-preview";

const socialLinks = [
  {
    label: "X",
    href: X_URL,
    icon: IconBrandX,
  },
  {
    label: "Substack",
    href: SUBSTACK_URL,
    icon: IconMail,
  },
  {
    label: "Medium",
    href: MEDIUM_URL,
    icon: IconBrandMedium,
  },
];

export const Footer = () => {
  return (
    <Container className="mt-auto pb-10">
      <footer className="my-8 flex flex-col items-center gap-5">
        <img
          src="/amit-kumar.svg"
          alt="Amit Kumar signature"
          className="mx-auto h-8 w-auto"
        />
        <div className="flex flex-col items-center gap-1.5">
          <div className="text-foreground/40 text-center text-sm text-balance">
            Built in public by an indie hacker. Here&apos;s the{" "}
            <LinkPreview url="https://github.com/designerdada/Designerdadacom">
              code
            </LinkPreview>{" "}
            and <LinkPreview url={SUBSTACK_URL}>launch notes</LinkPreview>{" "}
            behind product decisions.
          </div>
          <p className="text-foreground/40 text-sm text-balance">
            Shipping products fast, testing demand, and compounding
            distribution.
          </p>
        </div>
        <nav
          aria-label="Amit Kumar social links"
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow Amit Kumar on ${label}`}
              className="border-border/70 bg-card/35 text-foreground/60 hover:border-primary/40 hover:bg-primary/5 hover:text-foreground focus-visible:ring-primary/35 group inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm font-medium shadow-sm shadow-black/[0.02] transition-all hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:outline-none"
            >
              <Icon
                aria-hidden="true"
                className="text-foreground/45 group-hover:text-primary size-3.5 transition-colors"
                stroke={1.8}
              />
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </footer>
    </Container>
  );
};

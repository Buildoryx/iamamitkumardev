"use client";

import React, { useState } from "react";
import Container from "@/components/container";
import { Subheading } from "@/components/subheading";
import { DottedSeparator } from "@/components/separator";
import { csrfFetch } from "@/lib/csrf-client";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await csrfFetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're in! Check your inbox.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to connect. Please try again.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === "loading"}
            className="text-foreground focus:ring-primary disabled:opacity-50 flex-1 rounded-md border border-neutral-200 bg-transparent px-4 py-3 placeholder:text-neutral-400 focus:ring-2 focus:outline-none dark:border-neutral-800"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-primary rounded-md px-6 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "loading" ? "Joining..." : "Join"}
          </button>
        </div>
        {message && (
          <p
            className={`text-sm ${
              status === "success"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default function NewsletterPage() {
  return (
    <Container>
      <div className="py-12 md:py-20">
        <Subheading>Newsletter</Subheading>

        <h1 className="mt-2 mb-6 text-3xl font-bold tracking-tight md:text-5xl">
          Get smarter about <span className="text-primary">AI Agents</span>
        </h1>

        <p className="mb-12 max-w-lg text-lg text-neutral-600 dark:text-neutral-400">
          Every week, I share what I learned building autonomous AI agents,
          orchestrating multi-agent workflows, and shipping SaaS products in
          public. Zero fluff. Real code. Actual results.
        </p>

        <NewsletterSignup />

        <DottedSeparator className="my-12" />

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-2 font-medium">What you'll get</h3>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>✓ Real builds with code examples</li>
              <li>✓ Mistakes I made (so you don't)</li>
              <li>✓ Tool recommendations that actually work</li>
              <li>✓ Early access to my projects</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Join 200+ indie hackers</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              I respect your inbox. No spam, no fluff, no "buy my course"
              emails. Just real insights from someone building in public.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

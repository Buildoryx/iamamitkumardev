"use client";

import React, { useEffect, useState } from "react";
import { Subheading } from "@/components/subheading";
import { csrfFetch } from "@/lib/csrf-client";

type Status = "idle" | "loading" | "success" | "error";

const AGENT_TYPES = [
  { value: "personal", label: "Personal AI assistant" },
  { value: "business_intelligence", label: "Business intelligence agent" },
  { value: "ops_workflow", label: "Ops & workflow agent" },
  { value: "not_sure", label: "Not sure yet — let's figure it out" },
] as const;

const ROLES = [
  { value: "founder", label: "Founder" },
  { value: "operator", label: "Operator" },
  { value: "engineer", label: "Engineer" },
  { value: "other", label: "Other" },
] as const;

const STAGES = [
  { value: "idea", label: "Idea" },
  { value: "prototyping", label: "Already prototyping" },
  { value: "in_production", label: "Have something in production" },
] as const;

const TIMELINES = [
  { value: "this_month", label: "This month" },
  { value: "one_to_two_months", label: "Next 1–2 months" },
  { value: "exploring", label: "Just exploring" },
] as const;

interface FormState {
  name: string;
  email: string;
  company: string;
  role: string;
  agent_type: string;
  description: string;
  stage: string;
  timeline: string;
  referral: string;
  consent: boolean;
  /** Honeypot — hidden, must stay empty */
  website: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  role: "",
  agent_type: "",
  description: "",
  stage: "",
  timeline: "",
  referral: "",
  consent: false,
  website: "",
};

const inputBase =
  "border-border/70 bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-primary/30 w-full rounded-md border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 disabled:opacity-60";

const labelBase =
  "text-foreground text-sm font-medium leading-none";

const helpBase = "text-foreground/55 mt-1 text-xs";

function getUtmParams(): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
} {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
  };
}

export function LeadForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [utm, setUtm] = useState<ReturnType<typeof getUtmParams>>({});

  useEffect(() => {
    setUtm(getUtmParams());
  }, []);

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await csrfFetch("/api/agent-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ...utm,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setStatus("success");
        setMessage(
          data.message ||
            "Got it. I'll reply within one business day.",
        );
        setForm(initialState);
        return;
      }

      setStatus("error");
      setMessage(
        data?.error ||
          "Something went wrong. Try again, or email me at hi@iamamitkumar.dev.",
      );
    } catch {
      setStatus("error");
      setMessage(
        "Couldn't reach the server. Try again, or email me at hi@iamamitkumar.dev.",
      );
    }
  }

  if (status === "success") {
    return (
      <section id="start-a-project" aria-labelledby="lead-form-heading">
        <Subheading>Sent</Subheading>
        <h2
          id="lead-form-heading"
          className="text-foreground mt-3 text-2xl font-medium tracking-tight md:text-3xl"
        >
          Got it.
        </h2>
        <p className="text-foreground/70 mt-3 text-base leading-relaxed">
          {message}
        </p>
        <p className="text-foreground/55 mt-4 text-sm">
          Want to send another? Refresh the page.
        </p>
      </section>
    );
  }

  return (
    <section id="start-a-project" aria-labelledby="lead-form-heading">
      <Subheading>Start a project</Subheading>
      <h2
        id="lead-form-heading"
        className="text-foreground mt-3 text-2xl font-medium tracking-tight md:text-3xl"
      >
        Tell me what you want to build.
      </h2>
      <p className="text-foreground/70 mt-2 text-base">
        The more concrete, the better. One business day reply.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-6 flex flex-col gap-5"
      >
        {/* Honeypot — visually hidden, must stay empty for humans */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor="website">
            If you&apos;re a human, leave this field empty.
          </label>
          <input
            id="website"
            name="website"
            type="text"
            autoComplete="off"
            tabIndex={-1}
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </div>

        {/* Name + Email */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className={labelBase}>
              Your name <span className="text-foreground/40">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              disabled={status === "loading"}
              placeholder="Full name"
              className={inputBase}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className={labelBase}>
              Work email <span className="text-foreground/40">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              disabled={status === "loading"}
              placeholder="you@company.com"
              className={inputBase}
            />
          </div>
        </div>

        {/* Company + Role */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="company" className={labelBase}>
              Company or project
            </label>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
              disabled={status === "loading"}
              placeholder="Optional"
              className={inputBase}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="role" className={labelBase}>
              Your role
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              disabled={status === "loading"}
              className={inputBase}
            >
              <option value="">Select…</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Agent type */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="agent_type" className={labelBase}>
            What kind of agent? <span className="text-foreground/40">*</span>
          </label>
          <select
            id="agent_type"
            name="agent_type"
            required
            value={form.agent_type}
            onChange={(e) => update("agent_type", e.target.value)}
            disabled={status === "loading"}
            className={inputBase}
          >
            <option value="">Select…</option>
            {AGENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className={labelBase}>
            What do you want the agent to do?{" "}
            <span className="text-foreground/40">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={6}
            minLength={40}
            maxLength={4000}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            disabled={status === "loading"}
            placeholder="Where should it live (Telegram, Slack, web)? What tools should it touch (CRM, Postgres, Stripe…)? What does success look like in 30 days?"
            className={`${inputBase} min-h-32 resize-y leading-relaxed`}
          />
          <p className={helpBase}>
            {form.description.length} / 4000 characters · 40 minimum
          </p>
        </div>

        {/* Stage */}
        <fieldset className="flex flex-col gap-2">
          <legend className={labelBase}>
            Where are you today? <span className="text-foreground/40">*</span>
          </legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {STAGES.map((s) => (
              <label
                key={s.value}
                className={`border-border/70 bg-card/30 hover:border-primary/40 hover:bg-primary/5 flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2.5 text-sm transition-colors ${
                  form.stage === s.value
                    ? "border-primary/50 bg-primary/5"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="stage"
                  value={s.value}
                  required
                  checked={form.stage === s.value}
                  onChange={(e) => update("stage", e.target.value)}
                  disabled={status === "loading"}
                  className="text-primary focus:ring-primary/30 size-3.5"
                />
                <span className="text-foreground/80">{s.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Timeline */}
        <fieldset className="flex flex-col gap-2">
          <legend className={labelBase}>
            Timeline <span className="text-foreground/40">*</span>
          </legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {TIMELINES.map((t) => (
              <label
                key={t.value}
                className={`border-border/70 bg-card/30 hover:border-primary/40 hover:bg-primary/5 flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2.5 text-sm transition-colors ${
                  form.timeline === t.value
                    ? "border-primary/50 bg-primary/5"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="timeline"
                  value={t.value}
                  required
                  checked={form.timeline === t.value}
                  onChange={(e) => update("timeline", e.target.value)}
                  disabled={status === "loading"}
                  className="text-primary focus:ring-primary/30 size-3.5"
                />
                <span className="text-foreground/80">{t.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Referral */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="referral" className={labelBase}>
            How&apos;d you find me?
          </label>
          <input
            id="referral"
            name="referral"
            type="text"
            value={form.referral}
            onChange={(e) => update("referral", e.target.value)}
            disabled={status === "loading"}
            placeholder="Optional — Twitter, Substack, friend, search…"
            className={inputBase}
          />
        </div>

        {/* Consent */}
        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            name="consent"
            required
            checked={form.consent}
            onChange={(e) => update("consent", e.target.checked)}
            disabled={status === "loading"}
            className="text-primary focus:ring-primary/30 mt-0.5 size-4 rounded"
          />
          <span className="text-foreground/70">
            I&apos;m okay with Amit replying by email about this project.
          </span>
        </label>

        {/* Submit */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-medium shadow-sm shadow-black/[0.04] transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "Sending…" : "Send to Amit →"}
          </button>
          <p className="text-foreground/50 text-sm">
            One business day reply. No spam, ever.
          </p>
        </div>

        {status === "error" && message ? (
          <p
            role="alert"
            className="rounded-md border border-red-300/50 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
          >
            {message}
          </p>
        ) : null}
      </form>
    </section>
  );
}

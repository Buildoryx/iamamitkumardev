"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import Container from "@/components/container";
import { Subheading } from "@/components/subheading";
import { DottedSeparator } from "@/components/separator";
import { Box } from "@/components/box";
import {
  RefreshCw,
  Mail,
  MessageSquare,
  Globe,
  Bell,
  Database,
  Bot,
} from "lucide-react";

interface ContactInquiryRecord {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  source: string | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface NewsletterSubscriberRecord {
  id: number;
  email: string;
  source: string | null;
  ip: string | null;
  userAgent: string | null;
  isActive: boolean;
  subscribedAt: string;
  updatedAt: string;
}

type AgentType =
  | "personal"
  | "business_intelligence"
  | "ops_workflow"
  | "not_sure";
type AgentStage = "idea" | "prototyping" | "in_production";
type AgentTimeline = "this_month" | "one_to_two_months" | "exploring";
type AgentStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "won"
  | "lost"
  | "spam";

interface AgentLeadRecord {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: "founder" | "operator" | "engineer" | "other" | null;
  agent_type: AgentType;
  description: string;
  stage: AgentStage;
  timeline: AgentTimeline;
  referral: string | null;
  source: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  ip: string | null;
  user_agent: string | null;
  status: AgentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface LeadsApiResponse {
  contactInquiries: ContactInquiryRecord[];
  newsletterSubscribers: NewsletterSubscriberRecord[];
  agentLeads: AgentLeadRecord[];
}

const AGENT_TYPE_LABEL: Record<AgentType, string> = {
  personal: "Personal AI",
  business_intelligence: "Business intelligence",
  ops_workflow: "Ops & workflow",
  not_sure: "Not sure yet",
};

const STAGE_LABEL: Record<AgentStage, string> = {
  idea: "Idea",
  prototyping: "Prototyping",
  in_production: "In production",
};

const TIMELINE_LABEL: Record<AgentTimeline, string> = {
  this_month: "This month",
  one_to_two_months: "1–2 months",
  exploring: "Exploring",
};

const STATUS_COLOR: Record<AgentStatus, string> = {
  new: "text-blue-500",
  contacted: "text-amber-500",
  qualified: "text-violet-500",
  won: "text-emerald-500",
  lost: "text-foreground/30",
  spam: "text-red-500",
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncate(value: string, length = 100) {
  if (value.length <= length) return value;
  return `${value.slice(0, length - 1)}…`;
}

export default function AdminLeadsPage() {
  const { session } = useAuth();
  const [contactInquiries, setContactInquiries] = useState<
    ContactInquiryRecord[]
  >([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<
    NewsletterSubscriberRecord[]
  >([]);
  const [agentLeads, setAgentLeads] = useState<AgentLeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!session) return;
    let isMounted = true;

    const run = async () => {
      try {
        const res = await fetch(
          "/api/admin/leads?contactLimit=100&newsletterLimit=100&agentsLimit=100",
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        );
        const data = (await res.json()) as LeadsApiResponse & {
          error?: string;
        };

        if (!res.ok) {
          throw new Error(data.error || "Failed to load leads");
        }

        if (!isMounted) return;
        setContactInquiries(
          Array.isArray(data.contactInquiries) ? data.contactInquiries : [],
        );
        setNewsletterSubscribers(
          Array.isArray(data.newsletterSubscribers)
            ? data.newsletterSubscribers
            : [],
        );
        setAgentLeads(Array.isArray(data.agentLeads) ? data.agentLeads : []);
        setErrorMsg("");
      } catch (error) {
        if (!isMounted) return;
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to load leads",
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [session, refreshTick]);

  if (!session) return null;

  const totalLeads =
    contactInquiries.length +
    newsletterSubscribers.length +
    agentLeads.length;

  function toggleExpanded(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <Container className="pt-4 pb-24">
      <div className="flex items-start justify-between">
        <div>
          <Subheading>Lead intelligence</Subheading>
          <div className="mt-4 flex flex-col gap-1 md:flex-row md:items-center md:gap-2">
            <p className="text-foreground font-medium">{totalLeads} leads</p>
            <div className="hidden size-1 rounded-full bg-neutral-200 md:block" />
            <p className="text-foreground/70">
              Agent project requests, contact inquiries, and newsletter
              subscribers.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            setRefreshTick((n) => n + 1);
          }}
          disabled={loading}
          className="text-foreground/40 hover:text-foreground font-mono text-[10px] tracking-widest uppercase transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`mr-1 inline h-3 w-3 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {errorMsg && (
        <div className="bg-destructive/10 border-destructive text-destructive mt-4 border p-3 font-mono text-xs tracking-wider">
          {errorMsg}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className="flex flex-col items-start gap-1.5 md:flex-row md:items-center md:gap-2">
          <Box className="bg-linear-to-b from-fuchsia-400 to-fuchsia-600 ring-offset-fuchsia-500">
            <Bot className="size-4 text-white drop-shadow-xl drop-shadow-black/40" />
          </Box>
          <p className="text-foreground font-medium">{agentLeads.length}</p>
          <div className="hidden size-1 rounded-full bg-neutral-200 md:block" />
          <p className="text-foreground/70 text-sm">Agent projects</p>
        </div>
        <div className="flex flex-col items-start gap-1.5 md:flex-row md:items-center md:gap-2">
          <Box className="bg-linear-to-b from-blue-400 to-blue-600 ring-offset-blue-500">
            <MessageSquare className="size-4 text-white drop-shadow-xl drop-shadow-black/40" />
          </Box>
          <p className="text-foreground font-medium">
            {contactInquiries.length}
          </p>
          <div className="hidden size-1 rounded-full bg-neutral-200 md:block" />
          <p className="text-foreground/70 text-sm">Contact inquiries</p>
        </div>
        <div className="flex flex-col items-start gap-1.5 md:flex-row md:items-center md:gap-2">
          <Box className="bg-linear-to-b from-violet-400 to-violet-600 ring-offset-violet-500">
            <Bell className="size-4 text-white drop-shadow-xl drop-shadow-black/40" />
          </Box>
          <p className="text-foreground font-medium">
            {newsletterSubscribers.length}
          </p>
          <div className="hidden size-1 rounded-full bg-neutral-200 md:block" />
          <p className="text-foreground/70 text-sm">Newsletter subs</p>
        </div>
        <div className="flex flex-col items-start gap-1.5 md:flex-row md:items-center md:gap-2">
          <Box className="bg-linear-to-b from-emerald-400 to-emerald-600 ring-offset-emerald-500">
            <Database className="size-4 text-white drop-shadow-xl drop-shadow-black/40" />
          </Box>
          <p className="text-foreground font-medium">{totalLeads}</p>
          <div className="hidden size-1 rounded-full bg-neutral-200 md:block" />
          <p className="text-foreground/70 text-sm">Total</p>
        </div>
      </div>

      <DottedSeparator className="my-6" />

      <section>
        <p className="text-foreground font-medium">Agent project requests</p>
        <p className="text-foreground/50 mt-1 font-mono text-[10px] tracking-widest uppercase">
          From agents.iamamitkumar.dev
        </p>

        {loading ? (
          <p className="text-foreground/40 mt-4 font-mono text-xs tracking-widest uppercase">
            Loading…
          </p>
        ) : agentLeads.length === 0 ? (
          <p className="text-foreground/40 mt-4 font-mono text-xs tracking-widest uppercase">
            No records
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-5">
            {agentLeads.map((lead) => {
              const isExpanded = expanded[lead.id] ?? false;
              return (
                <div
                  key={lead.id}
                  className="border-border/50 flex flex-col gap-2 border-l-2 pl-4"
                >
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <a
                      className="text-foreground hover:text-primary font-medium transition-colors"
                      href={`mailto:${lead.email}`}
                    >
                      <Mail className="mr-1 inline h-3 w-3" />
                      {lead.name}
                    </a>
                    {lead.company && (
                      <>
                        <span className="text-foreground/30">·</span>
                        <span className="text-foreground/70 text-sm">
                          {lead.company}
                        </span>
                      </>
                    )}
                    {lead.role && (
                      <>
                        <span className="text-foreground/30">·</span>
                        <span className="text-foreground/50 text-xs capitalize">
                          {lead.role}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
                    <span className="text-foreground/40">
                      {formatDateTime(lead.created_at)}
                    </span>
                    <span className="text-foreground/30">·</span>
                    <span className={STATUS_COLOR[lead.status]}>
                      {lead.status}
                    </span>
                    <span className="text-foreground/30">·</span>
                    <span className="text-fuchsia-500">
                      {AGENT_TYPE_LABEL[lead.agent_type]}
                    </span>
                    <span className="text-foreground/30">·</span>
                    <span className="text-foreground/60">
                      {STAGE_LABEL[lead.stage]}
                    </span>
                    <span className="text-foreground/30">·</span>
                    <span className="text-foreground/60">
                      {TIMELINE_LABEL[lead.timeline]}
                    </span>
                    {lead.utm_source && (
                      <>
                        <span className="text-foreground/30">·</span>
                        <span className="text-foreground/40">
                          <Globe className="mr-1 inline h-3 w-3" />
                          {lead.utm_source}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-foreground/70 text-sm leading-relaxed whitespace-pre-wrap">
                    {isExpanded
                      ? lead.description
                      : truncate(lead.description, 240)}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    {lead.description.length > 240 && (
                      <button
                        onClick={() => toggleExpanded(lead.id)}
                        className="text-foreground/40 hover:text-foreground font-mono text-[10px] tracking-widest uppercase transition-colors"
                      >
                        {isExpanded ? "Collapse" : "Expand"}
                      </button>
                    )}
                    {lead.referral && (
                      <span className="text-foreground/40 font-mono text-[10px] tracking-widest uppercase">
                        Referral: {lead.referral}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <DottedSeparator className="my-6" />

      <section>
        <p className="text-foreground font-medium">Contact inquiries</p>

        {loading ? (
          <p className="text-foreground/40 mt-4 font-mono text-xs tracking-widest uppercase">
            Loading…
          </p>
        ) : contactInquiries.length === 0 ? (
          <p className="text-foreground/40 mt-4 font-mono text-xs tracking-widest uppercase">
            No records
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {contactInquiries.map((lead) => (
              <div key={lead.id} className="flex flex-col gap-1">
                <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-2">
                  <a
                    className="text-foreground hover:text-primary font-medium transition-colors"
                    href={`mailto:${lead.email}`}
                  >
                    <Mail className="mr-1 inline h-3 w-3" />
                    {lead.name}
                  </a>
                  <div className="hidden size-1 rounded-full bg-neutral-200 md:block" />
                  <span className="text-foreground/40 font-mono text-[10px] tracking-widest uppercase">
                    {formatDateTime(lead.createdAt)}
                  </span>
                  {lead.source && (
                    <a
                      href={lead.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/40 hover:text-foreground transition-colors"
                    >
                      <Globe className="h-3 w-3" />
                    </a>
                  )}
                </div>
                {lead.subject && (
                  <p className="text-foreground/70 text-sm">{lead.subject}</p>
                )}
                <p className="text-foreground/50 text-sm">
                  {truncate(lead.message)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <DottedSeparator className="my-6" />

      <section>
        <p className="text-foreground font-medium">Newsletter subscribers</p>

        {loading ? (
          <p className="text-foreground/40 mt-4 font-mono text-xs tracking-widest uppercase">
            Loading…
          </p>
        ) : newsletterSubscribers.length === 0 ? (
          <p className="text-foreground/40 mt-4 font-mono text-xs tracking-widest uppercase">
            No records
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {newsletterSubscribers.map((sub) => (
              <div
                key={sub.id}
                className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-2"
              >
                <a
                  className="text-foreground hover:text-primary font-medium transition-colors"
                  href={`mailto:${sub.email}`}
                >
                  <Mail className="mr-1 inline h-3 w-3" />
                  <span className="font-mono text-xs">{sub.email}</span>
                </a>
                <div className="hidden size-1 rounded-full bg-neutral-200 md:block" />
                <span
                  className={`font-mono text-[10px] tracking-widest uppercase ${
                    sub.isActive ? "text-emerald-500" : "text-foreground/30"
                  }`}
                >
                  {sub.isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-foreground/40 font-mono text-[10px] tracking-widest uppercase">
                  {formatDateTime(sub.updatedAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}

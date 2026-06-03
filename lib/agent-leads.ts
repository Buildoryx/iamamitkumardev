import { z } from "zod";
import { getSupabaseAdmin } from "./supabase";

/* -------------------------------------------------------------------------- */
/*  Validation                                                                 */
/* -------------------------------------------------------------------------- */

export const AgentLeadInputSchema = z.object({
  name: z
    .string()
    .min(2, "Name is too short")
    .max(120, "Name must be under 120 characters")
    .transform((v) => v.trim()),

  email: z
    .string()
    .email("Please enter a valid email")
    .max(254, "Email is too long")
    .transform((v) => v.trim().toLowerCase()),

  company: z
    .string()
    .max(160, "Company must be under 160 characters")
    .optional()
    .transform((v) => (v ? v.trim() : undefined)),

  role: z.enum(["founder", "operator", "engineer", "other"]).optional(),

  agent_type: z.enum([
    "personal",
    "business_intelligence",
    "ops_workflow",
    "not_sure",
  ]),

  description: z
    .string()
    .min(40, "Tell me a bit more — at least a couple of sentences")
    .max(4000, "Keep it under 4,000 characters please")
    .transform((v) => v.trim()),

  stage: z.enum(["idea", "prototyping", "in_production"]),

  timeline: z.enum(["this_month", "one_to_two_months", "exploring"]),

  referral: z
    .string()
    .max(200, "Keep it short")
    .optional()
    .transform((v) => (v ? v.trim() : undefined)),

  consent: z
    .union([z.boolean(), z.literal("on"), z.literal("true")])
    .refine((v) => v === true || v === "on" || v === "true", {
      message: "Consent is required to contact you back",
    }),

  /** Hidden honeypot — must be empty. Bots fill it in, humans don't. */
  website: z.string().max(0, "Bot detected").optional().or(z.literal("")),

  utm_source: z.string().max(120).optional(),
  utm_medium: z.string().max(120).optional(),
  utm_campaign: z.string().max(120).optional(),
});

export type AgentLeadInput = z.infer<typeof AgentLeadInputSchema>;

export function validateAgentLeadInput(body: unknown): {
  success: boolean;
  data?: AgentLeadInput;
  errors: string[];
} {
  const result = AgentLeadInputSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map(
      (issue) => `${issue.path.join(".") || "form"}: ${issue.message}`,
    );
    return { success: false, errors };
  }

  return { success: true, data: result.data, errors: [] };
}

/* -------------------------------------------------------------------------- */
/*  Persistence                                                                */
/* -------------------------------------------------------------------------- */

interface InsertAgentLeadParams {
  input: AgentLeadInput;
  ip: string | null;
  userAgent: string | null;
  source?: string;
}

export async function insertAgentLead({
  input,
  ip,
  userAgent,
  source = "iamamitkumar.dev/agents",
}: InsertAgentLeadParams): Promise<{ id: string } | { error: string }> {
  const supabaseAdmin = getSupabaseAdmin();

  const { data, error } = await supabaseAdmin
    .from("agent_leads")
    .insert({
      name: input.name,
      email: input.email,
      company: input.company ?? null,
      role: input.role ?? null,
      agent_type: input.agent_type,
      description: input.description,
      stage: input.stage,
      timeline: input.timeline,
      referral: input.referral ?? null,
      utm_source: input.utm_source ?? null,
      utm_medium: input.utm_medium ?? null,
      utm_campaign: input.utm_campaign ?? null,
      source,
      ip,
      user_agent: userAgent,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[agent-leads] insert failed:", error);
    return { error: "Failed to save your message. Please try again." };
  }

  return { id: data.id };
}

export async function listAgentLeads(limit = 50) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("agent_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[agent-leads] list failed:", error);
    return [];
  }

  return data || [];
}

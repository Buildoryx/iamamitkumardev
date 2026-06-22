import "server-only";
import { getSupabaseAdmin } from "./supabase";

/**
 * Audit every agent write attempt and result to `agent_blog_event`.
 * Never throws — audit failures must not break the request path, but are
 * logged to the server console for observability.
 */
export type AgentBlogAction = "create" | "update" | "media_upload";
export type AgentBlogStatus = "success" | "rejected" | "error";

export interface AgentBlogEventInput {
  action: AgentBlogAction;
  status: AgentBlogStatus;
  keyId?: string | null;
  requestId?: string | null;
  slug?: string | null;
  postId?: string | null;
  mediaUrl?: string | null;
  httpStatus?: number | null;
  validationErrors?: string[] | null;
  message?: string | null;
}

export async function logAgentBlogEvent(e: AgentBlogEventInput): Promise<void> {
  try {
    // agent_blog_event isn't in the generated Database type yet; use an
    // untyped client view for this new table.
    const supabase = getSupabaseAdmin() as unknown as {
      from: (t: string) => {
        insert: (row: Record<string, unknown>) => Promise<{ error: unknown }>;
      };
    };
    await supabase.from("agent_blog_event").insert({
      action: e.action,
      status: e.status,
      key_id: e.keyId ?? null,
      request_id: e.requestId ?? null,
      slug: e.slug ?? null,
      post_id: e.postId ?? null,
      media_url: e.mediaUrl ?? null,
      http_status: e.httpStatus ?? null,
      validation_errors: e.validationErrors ?? null,
      message: e.message ?? null,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    // Audit must never break the request. Log and continue.
    console.error("[agent-audit] failed to write agent_blog_event:", err);
  }
}

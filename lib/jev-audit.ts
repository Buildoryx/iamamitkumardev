import { getSupabaseAdmin } from "./supabase";
import type { JevDecision } from "./jev";

export async function recordJevDecision<T>(decision: JevDecision<T>) {
  const supabase = getSupabaseAdmin() as unknown as {
    from(table: string): {
      insert(values: unknown): Promise<{ error: { message: string } | null }>;
    };
  };
  const { error } = await supabase.from("seo_decision_log").insert({
    decision_id: decision.decisionId,
    decision_type: decision.decisionType,
    input_state: decision.inputState,
    result: decision.result,
    confidence: decision.confidence,
    threshold: decision.threshold,
    fallback_action: decision.fallbackAction,
    evidence: decision.evidence,
    model_version: decision.modelVersion,
    usage: decision.usage,
    decided_at: decision.timestamp,
  } as never);

  if (error) {
    throw new Error(`Failed to persist Jev decision: ${error.message}`);
  }
}

import { choice, TypeSafeClient, type EntryType } from "@typesafe-ai/sdk";
import { z } from "zod";
import { getEnv } from "./env";

export const JEV_MODEL = "jev-latest";

export const seoDecisionInputSchema = z.object({
  decisionType: z.enum(["intent", "content", "overlap"]),
  state: z.record(z.string(), z.unknown()),
});

export type SeoDecisionType = z.infer<
  typeof seoDecisionInputSchema
>["decisionType"];

export interface JevDecision<T> {
  decisionId: string;
  decisionType: SeoDecisionType;
  inputState: EntryType;
  result: T;
  confidence: number;
  threshold: number;
  fallbackAction: string;
  evidence: string[];
  timestamp: string;
  modelVersion: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

interface JevApiResult {
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface SearchIntentDecision {
  primaryIntent:
    | "informational"
    | "commercial"
    | "transactional"
    | "navigational"
    | "local"
    | "comparison"
    | "problem_solution"
    | "how_to"
    | "alternative"
    | "competitor"
    | "pricing"
    | "template"
    | "tool"
    | "definition"
    | "educational"
    | "product_led"
    | "mixed";
  funnelStage: "awareness" | "consideration" | "decision" | "retention";
  businessRelevance: "low" | "medium" | "high";
}

export interface ContentEvaluation {
  intentFit: "fail" | "weak" | "acceptable" | "strong";
  audienceFit: "fail" | "weak" | "acceptable" | "strong";
  originality: "fail" | "weak" | "acceptable" | "strong";
  specificity: "fail" | "weak" | "acceptable" | "strong";
  duplicationRisk: "low" | "medium" | "high";
  publicationReadiness: "blocked" | "review" | "ready";
}

export interface PageOverlapDecision {
  relationship:
    | "no_overlap"
    | "low_overlap"
    | "medium_overlap"
    | "high_overlap";
}

let client: TypeSafeClient | undefined;

function getClient(): TypeSafeClient {
  if (!client) {
    const apiKey = getEnv().TYPESAFE_API_KEY;
    if (!apiKey) {
      throw new Error("TYPESAFE_API_KEY is required for Jev decisions");
    }
    client = new TypeSafeClient({
      apiKey,
      baseURL: "https://api.typesafe.ai",
      defaultModel: JEV_MODEL,
    });
  }
  return client;
}

function usage(result: JevApiResult) {
  return {
    inputTokens: result.usage.input_tokens,
    outputTokens: result.usage.output_tokens,
  };
}

function baseDecision<T>(
  decisionType: SeoDecisionType,
  state: Record<string, unknown>,
  result: JevApiResult,
  answer: T,
  confidence: number,
  threshold: number,
  fallbackAction: string,
  evidence: string[],
): JevDecision<T> {
  return {
    decisionId: crypto.randomUUID(),
    decisionType,
    inputState: state as EntryType,
    result: answer,
    confidence,
    threshold,
    fallbackAction,
    evidence,
    timestamp: new Date().toISOString(),
    modelVersion: result.model,
    usage: usage(result),
  };
}

export async function classifySearchIntent(
  state: Record<string, unknown>,
): Promise<JevDecision<SearchIntentDecision>> {
  const result = await getClient().systemOne({
    model: JEV_MODEL,
    state: state as EntryType,
    questions: {
      primaryIntent: choice(
        "Classify the primary search intent represented by the supplied query and context.",
        {
          informational: null,
          commercial: null,
          transactional: null,
          navigational: null,
          local: null,
          comparison: null,
          problem_solution: null,
          how_to: null,
          alternative: null,
          competitor: null,
          pricing: null,
          template: null,
          tool: null,
          definition: null,
          educational: null,
          product_led: null,
          mixed: null,
        },
      ),
      funnelStage: choice(
        "Classify the dominant funnel stage for this search opportunity.",
        {
          awareness: null,
          consideration: null,
          decision: null,
          retention: null,
        },
      ),
      businessRelevance: choice(
        "Classify how relevant this opportunity is to the supplied business context.",
        { low: null, medium: null, high: null },
      ),
    },
  });

  const primary = result.answers.primaryIntent;
  const funnel = result.answers.funnelStage;
  const relevance = result.answers.businessRelevance;
  const confidence = Math.min(
    primary.confidence,
    funnel.confidence,
    relevance.confidence,
  );

  return baseDecision(
    "intent",
    state,
    result,
    {
      primaryIntent: primary.choice as SearchIntentDecision["primaryIntent"],
      funnelStage: funnel.choice as SearchIntentDecision["funnelStage"],
      businessRelevance:
        relevance.choice as SearchIntentDecision["businessRelevance"],
    },
    confidence,
    0.75,
    "route to human review; do not create or publish a page",
    ["query", "audience", "business context"],
  );
}

export async function evaluateContent(
  state: Record<string, unknown>,
): Promise<JevDecision<ContentEvaluation>> {
  const result = await getClient().systemOne({
    model: JEV_MODEL,
    state: state as EntryType,
    questions: {
      intentFit: choice(
        "Does the complete draft satisfy the stated search intent?",
        { fail: null, weak: null, acceptable: null, strong: null },
      ),
      audienceFit: choice(
        "Does the draft address the stated audience and their problem?",
        { fail: null, weak: null, acceptable: null, strong: null },
      ),
      originality: choice(
        "Does the draft provide original, differentiated value beyond generic coverage?",
        { fail: null, weak: null, acceptable: null, strong: null },
      ),
      specificity: choice(
        "Does the draft contain concrete details, examples, or decisions rather than filler?",
        { fail: null, weak: null, acceptable: null, strong: null },
      ),
      duplicationRisk: choice(
        "How much does the draft overlap with the supplied existing pages?",
        { low: null, medium: null, high: null },
      ),
      publicationReadiness: choice(
        "What publication route is justified by the supplied evidence?",
        { blocked: null, review: null, ready: null },
      ),
    },
  });

  const answers = result.answers;
  const confidence = Math.min(
    answers.intentFit.confidence,
    answers.audienceFit.confidence,
    answers.originality.confidence,
    answers.specificity.confidence,
    answers.duplicationRisk.confidence,
    answers.publicationReadiness.confidence,
  );

  return baseDecision(
    "content",
    state,
    result,
    {
      intentFit: answers.intentFit.choice as ContentEvaluation["intentFit"],
      audienceFit: answers.audienceFit
        .choice as ContentEvaluation["audienceFit"],
      originality: answers.originality
        .choice as ContentEvaluation["originality"],
      specificity: answers.specificity
        .choice as ContentEvaluation["specificity"],
      duplicationRisk: answers.duplicationRisk
        .choice as ContentEvaluation["duplicationRisk"],
      publicationReadiness: answers.publicationReadiness
        .choice as ContentEvaluation["publicationReadiness"],
    },
    confidence,
    0.8,
    "block publication and route to revision or human review",
    ["draft", "brief", "project context", "existing pages"],
  );
}

export async function classifyPageOverlap(
  state: Record<string, unknown>,
): Promise<JevDecision<PageOverlapDecision>> {
  const result = await getClient().systemOne({
    model: JEV_MODEL,
    state: state as EntryType,
    questions: {
      relationship: choice(
        "Classify the semantic and search-purpose overlap between the proposed page and existing page.",
        {
          no_overlap: null,
          low_overlap: null,
          medium_overlap: null,
          high_overlap: null,
        },
      ),
    },
  });
  const answer = result.answers.relationship;

  return baseDecision(
    "overlap",
    state,
    result,
    {
      relationship: answer.choice as PageOverlapDecision["relationship"],
    },
    answer.confidence,
    0.8,
    "do not merge or redirect automatically; request review",
    ["proposed page", "existing page", "target query"],
  );
}

export function passesPublicationGate(
  evaluation: ContentEvaluation,
  confidence: number,
): boolean {
  return (
    confidence >= 0.8 &&
    evaluation.intentFit !== "fail" &&
    evaluation.intentFit !== "weak" &&
    evaluation.audienceFit !== "fail" &&
    evaluation.audienceFit !== "weak" &&
    evaluation.originality !== "fail" &&
    evaluation.originality !== "weak" &&
    evaluation.specificity !== "fail" &&
    evaluation.specificity !== "weak" &&
    evaluation.duplicationRisk === "low" &&
    evaluation.publicationReadiness === "ready"
  );
}

export function isJevConfigured(): boolean {
  return Boolean(getEnv().TYPESAFE_API_KEY);
}

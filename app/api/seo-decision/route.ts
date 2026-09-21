import { NextRequest, NextResponse } from "next/server";
import {
  classifyPageOverlap,
  classifySearchIntent,
  evaluateContent,
  seoDecisionInputSchema,
} from "@/lib/jev";
import type { JevDecision } from "@/lib/jev";
import { recordJevDecision } from "@/lib/jev-audit";
import { getEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const env = getEnv();
  const secret = env.SEO_DECISION_SECRET;
  const suppliedSecret = request.headers.get("x-seo-decision-secret");

  if (!secret || suppliedSecret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = seoDecisionInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid decision request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const decision =
      parsed.data.decisionType === "intent"
        ? await classifySearchIntent(parsed.data.state)
        : parsed.data.decisionType === "content"
          ? await evaluateContent(parsed.data.state)
          : await classifyPageOverlap(parsed.data.state);

    await recordJevDecision(decision as JevDecision<unknown>);
    return NextResponse.json(decision);
  } catch (error) {
    console.error("SEO Jev decision failed", error);
    return NextResponse.json({ error: "SEO decision failed" }, { status: 502 });
  }
}

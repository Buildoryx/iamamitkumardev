import { NextRequest, NextResponse } from "next/server";
import { rateLimitAsync } from "@/lib/rate-limit";
import { withCsrfProtection } from "@/lib/csrf";
import { insertAgentLead, validateAgentLeadInput } from "@/lib/agent-leads";

export const dynamic = "force-dynamic";

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || null;
  return request.headers.get("x-real-ip") || null;
}

async function handleAgentLead(request: NextRequest) {
  const limitResult = await rateLimitAsync(request, {
    windowMs: 60_000,
    maxRequests: 3,
  });

  if (!limitResult.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": "3",
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const validation = validateAgentLeadInput(body);

  if (!validation.success) {
    // Honeypot trip: pretend it succeeded so bots don't learn.
    const honeypotTripped = validation.errors.some((e) =>
      e.includes("Bot detected"),
    );
    if (honeypotTripped) {
      return NextResponse.json({
        success: true,
        message:
          "Got it. I'll reply within one business day. If it's urgent, the discovery call link is faster.",
      });
    }

    return NextResponse.json(
      { error: validation.errors.join(", ") },
      { status: 400 },
    );
  }

  const result = await insertAgentLead({
    input: validation.data!,
    ip: getClientIp(request),
    userAgent: request.headers.get("user-agent"),
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message:
      "Got it. I'll reply within one business day. If it's urgent, the discovery call link is faster.",
    id: result.id,
  });
}

export const POST = withCsrfProtection(handleAgentLead);

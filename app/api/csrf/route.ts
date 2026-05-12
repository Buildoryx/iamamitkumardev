import { NextRequest, NextResponse } from "next/server";
import {
  CSRF_HEADER_NAME,
  generateCsrfToken,
  getCsrfTokenFromRequest,
  setCsrfCookie,
} from "@/lib/csrf";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = getCsrfTokenFromRequest(request) || generateCsrfToken();
  const response = NextResponse.json({ csrfToken: token });

  setCsrfCookie(response, token);
  response.headers.set(CSRF_HEADER_NAME, token);

  return response;
}

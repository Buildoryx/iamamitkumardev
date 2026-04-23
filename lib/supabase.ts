import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getEnv } from "./env";

let supabasePublic: SupabaseClient<Database> | undefined;
let supabaseAdminClient: SupabaseClient<Database> | undefined;

function resolvePublicCredentials(): { url: string; anon: string } | null {
  const e = getEnv();
  const url = e.PROJECT_URL ?? e.NEXT_PUBLIC_SUPABASE_URL;
  const anon = e.ANON_KEY ?? e.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !anon) return null;
  return { url, anon };
}

function getPublicClient(): SupabaseClient<Database> {
  if (!supabasePublic) {
    const creds = resolvePublicCredentials();
    if (!creds) {
      throw new Error(
        "Supabase is not configured. Set PROJECT_URL and ANON_KEY (or NEXT_PUBLIC_PROJECT_URL / NEXT_PUBLIC_ANON_KEY) in your environment.",
      );
    }
    supabasePublic = createClient<Database>(creds.url, creds.anon);
  }
  return supabasePublic;
}

function getAdminClient(): SupabaseClient<Database> {
  if (!supabaseAdminClient) {
    const e = getEnv();
    const url = e.PROJECT_URL ?? e.NEXT_PUBLIC_SUPABASE_URL;
    const service = e.SERVICE_ROLE;
    if (!url || !service) {
      throw new Error(
        "Supabase admin requires PROJECT_URL and SERVICE_ROLE in your environment.",
      );
    }
    supabaseAdminClient = createClient<Database>(url, service);
  }
  return supabaseAdminClient;
}

function lazyClient(getter: () => SupabaseClient<Database>) {
  return new Proxy({} as SupabaseClient<Database>, {
    get(_, prop) {
      const client = getter();
      const value = Reflect.get(client, prop as PropertyKey);
      return typeof value === "function"
        ? (value as (...args: unknown[]) => unknown).bind(client)
        : value;
    },
  });
}

export const supabase = lazyClient(getPublicClient);
export const supabaseAdmin = lazyClient(getAdminClient);

export const createSupabaseClient = () => getPublicClient();

export const getSupabaseClient = () => getPublicClient();

/** Use for admin routes that need the service role client. */
export const getSupabaseAdmin = () => getAdminClient();

export function hasSupabaseConfig(): boolean {
  return resolvePublicCredentials() !== null;
}

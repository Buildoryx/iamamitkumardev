import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient<Database> | undefined;

/** Lazy client so `next build` does not require NEXT_PUBLIC_* at module evaluation time. */
export function getSupabaseBrowser(): SupabaseClient<Database> {
  if (client) return client;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_PROJECT_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_PROJECT_URL and NEXT_PUBLIC_ANON_KEY (or NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).",
    );
  }

  client = createClient<Database>(supabaseUrl, supabaseAnonKey);
  return client;
}

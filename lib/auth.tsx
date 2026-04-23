"use client";

import { createBrowserClient } from "@supabase/ssr";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Database } from "@/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { User, Session } from "@supabase/supabase-js";

let browserClient: SupabaseClient<Database> | undefined;

function getBrowserClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient;

  const url =
    process.env.NEXT_PUBLIC_PROJECT_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase browser env missing: set NEXT_PUBLIC_PROJECT_URL and NEXT_PUBLIC_ANON_KEY (see Vercel → Environment Variables).",
    );
  }

  browserClient = createBrowserClient<Database>(url, key);
  return browserClient;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  isPending: boolean;
}

const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  isPending: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isPending: true,
  });

  useEffect(() => {
    let cancelled = false;
    const supabase = getBrowserClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) {
        setState({
          user: session?.user ?? null,
          session,
          isPending: false,
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        session,
        isPending: false,
      });
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export async function signInWithEmail(email: string, password: string) {
  return getBrowserClient().auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return getBrowserClient().auth.signOut();
}

/** Lazy proxy — safe during `next build` until actually used in the browser. */
export const authClient = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop) {
    const client = getBrowserClient();
    const value = Reflect.get(client, prop as PropertyKey);
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});

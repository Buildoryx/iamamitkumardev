import { z } from "zod";

function emptyToUndefined(val: unknown) {
  if (val === "" || val === null) return undefined;
  return val;
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_PROJECT_URL: z.preprocess(
    emptyToUndefined,
    z.string().url().optional(),
  ),
  NEXT_PUBLIC_ANON_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  PROJECT_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  ANON_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  SERVICE_ROLE: z.preprocess(emptyToUndefined, z.string().optional()),
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(
    emptyToUndefined,
    z.string().url().optional(),
  ),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.preprocess(
    emptyToUndefined,
    z.string().optional(),
  ),
  DATABASE_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  NOTION_INTEGRATION_SECRET: z.preprocess(
    emptyToUndefined,
    z.string().optional(),
  ),
  NOTION_WEBHOOK_SECRET: z.string().optional(),
  NOTION_PROJECTS_DB_ID: z.string().optional(),
  NOTION_CONTENT_CALENDAR_DB_ID: z.string().optional(),
  NOTION_SOPS_DB_ID: z.string().optional(),
  NOTION_PARENT_PAGE_ID: z.string().optional(),
  NOTION_REVIEW_PARENT_PAGE_ID: z.string().optional(),
  OPENCLAW_API_KEY: z.string().optional(),
  TYPESAFE_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  SEO_DECISION_SECRET: z.preprocess(emptyToUndefined, z.string().optional()),

  REDIS_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  ADMIN_USER_IDS: z.string().optional(),

  // Hermes agent blog publishing (HMAC-signed agent API)
  HERMES_AGENT_KEY_ID: z.preprocess(emptyToUndefined, z.string().optional()),
  HERMES_AGENT_HMAC_SECRET: z.preprocess(
    emptyToUndefined,
    z.string().optional(),
  ),
  HERMES_MAX_CLOCK_SKEW_SECONDS: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number().int().positive().max(3600).optional().default(300),
  ),
  SUPABASE_BLOG_MEDIA_BUCKET: z.preprocess(
    emptyToUndefined,
    z.string().optional().default("blog-media"),
  ),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | undefined;

export function getEnv(): Env {
  if (_env) return _env;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`,
    );
    throw new Error(
      `❌ Invalid environment variables:\n${errors.join("\n")}\n\n` +
        `Check .env.example. On Vercel: Project → Settings → Environment Variables.`,
    );
  }

  _env = result.data;
  return _env;
}

/** Lazy access — safe at build time when secrets are not yet injected. */
export const env = new Proxy({} as Env, {
  get(_, prop: keyof Env) {
    return getEnv()[prop];
  },
});

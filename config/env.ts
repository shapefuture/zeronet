import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  EDGE_PLATFORM: z.enum(['cloudflare', 'vercel', 'netlify', 'deno']),
  VLM_PROVIDER: z.string(),
  VLM_ENDPOINT: z.string().url().optional(),
  VLM_MODEL_NAME: z.string().optional(),
  VLM_FALLBACK_PROVIDER: z.string().optional(),
  VLM_FALLBACK_MODEL: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),
  ENABLE_PRERENDER: z.boolean().optional(),
  CACHE_TTL_EDGE: z.number().optional(),
  CACHE_TTL_BROWSER: z.number().optional(),
  CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_ZONE_ID: z.string().optional()
});
export const env = envSchema.parse(process.env);
// Centralized environment configuration with validation
import { z } from 'zod';

// Schema for validating environment variables
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  EDGE_PLATFORM: z.enum(['cloudflare', 'vercel', 'netlify', 'deno']),
  VLM_PROVIDER: z.enum(['local_vllm', 'openrouter']).default('local_vllm'),
  VLM_ENDPOINT: z.string().url().optional(),
  VLM_MODEL_NAME: z.string().optional(),
  VLM_FALLBACK_PROVIDER: z.string().optional(),
  VLM_FALLBACK_MODEL: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),
  ENABLE_PRERENDER: z.boolean().default(true),
  CACHE_TTL_EDGE: z.number().default(60),
  CACHE_TTL_BROWSER: z.number().default(0),
  CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_ZONE_ID: z.string().optional(),
});

// Parse and validate environment
export const env = envSchema.parse(process.env);

// Type-safe access to environment configuration
export type Env = z.infer<typeof envSchema>;
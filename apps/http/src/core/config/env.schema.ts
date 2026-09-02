import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  DATABASE_URL: z.string().refine((v) => /^postgres(ql)?:\/\//.test(v), {
    message: 'DATABASE_URL must be a postgres:// or postgresql:// URL',
  }),
  DATABASE_MAX_CONNECTIONS: z.coerce.number().int().min(1).default(10),
  DATABASE_IDLE_TIMEOUT_MS: z.coerce.number().int().min(0).default(30_000),
  DATABASE_CONNECTION_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(0)
    .default(10_000),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Passed to `ConfigModule.forRoot({ validate })`. The returned object REPLACES
 * the config store, which is what makes coerced numbers and defaults visible
 * to `ConfigService`. Note `process.env` still holds the raw strings — always
 * read config through `ConfigService`, never `process.env`.
 */
export function validate(raw: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(`Invalid environment:\n${z.prettifyError(parsed.error)}`);
  }

  return parsed.data;
}

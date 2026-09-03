import { z } from 'zod';

export const envSchema = z
	.object({
		NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
		PORT: z.coerce.number().int().min(1).max(65535).default(3000),

		DATABASE_URL: z.string().refine((v) => /^postgres(ql)?:\/\//.test(v), {
			message: 'DATABASE_URL must be a postgres:// or postgresql:// URL',
		}),
		DATABASE_MAX_CONNECTIONS: z.coerce.number().int().min(1).default(10),
		DATABASE_IDLE_TIMEOUT_MS: z.coerce.number().int().min(0).default(30_000),
		DATABASE_CONNECTION_TIMEOUT_MS: z.coerce.number().int().min(0).default(10_000),

		/**
		 * Credentials for NestJS Observe (https://observe.nestjs.com), issued as a
		 * pair from its dashboard. Optional, and absence is a supported state: with
		 * them unset, `observeImports()` leaves ObserveModule unregistered rather
		 * than booting an agent whose every flush the collector answers 401.
		 *
		 * OBSERVE_ENDPOINT is deliberately NOT declared here. @nestjs/observe reads
		 * that variable off process.env itself, and a second copy in the config
		 * store could disagree with the endpoint the agent actually dials.
		 */
		OBSERVE_APP_KEY: z.string().min(1).optional(),
		OBSERVE_APP_SECRET: z.string().min(1).optional(),

		/**
		 * Distinguishes instances of this service in the APM. Default is fine for
		 * one process; set it per-container (hostname, task id) when scaling out.
		 */
		OBSERVE_SERVICE_ID: z.string().min(1).default('backend'),
		OBSERVE_SERVICE_VERSION: z.string().min(1).optional(),
	})
	// Both or neither. Half-configured telemetry is the failure worth catching at
	// boot: the agent starts, every batch is rejected, and nothing in the logs
	// connects that to a missing second half of the pair.
	.superRefine((env, ctx) => {
		if (Boolean(env.OBSERVE_APP_KEY) === Boolean(env.OBSERVE_APP_SECRET)) {
			return;
		}

		ctx.addIssue({
			code: 'custom',
			path: [env.OBSERVE_APP_KEY ? 'OBSERVE_APP_SECRET' : 'OBSERVE_APP_KEY'],
			message:
				'OBSERVE_APP_KEY and OBSERVE_APP_SECRET must be set together (or both left unset to disable telemetry)',
		});
	});

export type Env = z.infer<typeof envSchema>;

/**
 * Passed to `ConfigModule.forRoot({ validate })`. The returned object REPLACES
 * the config store, which is what makes coerced numbers and defaults visible
 * to `ConfigService`. Note `process.env` still holds the raw strings — always
 * read config through `ConfigService`, never `process.env`. The one sanctioned
 * exception is `observeImports()` in core/observe/observe.ts, which decides
 * whether to register a module at all and so runs before DI exists.
 */
export function validate(raw: Record<string, unknown>): Env {
	const parsed = envSchema.safeParse(raw);

	if (!parsed.success) {
		throw new Error(`Invalid environment:\n${z.prettifyError(parsed.error)}`);
	}

	return parsed.data;
}

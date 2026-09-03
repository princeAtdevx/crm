import { Controller, Get } from '@nestjs/common';
import { HealthCheck, type HealthCheckResult, HealthCheckService } from '@nestjs/terminus';
import { DatabaseHealthIndicator } from './database.health-indicator';

/**
 * Split liveness from readiness, the way Kubernetes and Docker expect:
 *
 * - `/health/live` answers "is the process wedged?" and MUST NOT touch
 *   dependencies. A failing database here would get the container killed and
 *   restarted, which cannot fix a database.
 * - `/health/ready` answers "can this instance serve traffic?" and does check
 *   dependencies, so a load balancer drains it instead of restarting it.
 *
 * Both return 200 with `{ status: 'ok', ... }` or 503 with
 * `{ status: 'error', ... }` — Terminus maps the status to the HTTP code.
 */
@Controller('health')
export class HealthController {
	constructor(
		private readonly health: HealthCheckService,
		private readonly database: DatabaseHealthIndicator,
	) {}

	/** Liveness: the event loop is turning and Nest is routing. No I/O. */
	@Get('live')
	@HealthCheck()
	liveness(): Promise<HealthCheckResult> {
		return this.health.check([]);
	}

	/** Readiness: every dependency this instance needs to serve a request. */
	@Get('ready')
	@HealthCheck()
	readiness(): Promise<HealthCheckResult> {
		return this.health.check([() => this.database.isHealthy('database')]);
	}
}

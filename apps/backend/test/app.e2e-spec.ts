import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';

/**
 * Boots the real AppModule, so it needs a reachable database: NODE_ENV=test
 * (set by vitest) makes ConfigModule read the repo-root .env.test first, which
 * points at the throwaway `crm_test` database — created by
 * docker/postgres/init when `pnpm db:start` first builds the volume.
 * Migrate it once with `pnpm db:migrate:test` before running this suite.
 */
describe('Health (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		// Runs onApplicationBootstrap (the DatabaseHealth ping) and lets
		// app.close() drain the pg pool, so the suite exits cleanly.
		await app.init();
	});

	it('/health/live (GET) reports ok without touching the database', async () => {
		const res = await request(app.getHttpServer()).get('/health/live').expect(200);

		expect(res.body.status).toBe('ok');
		expect(res.body.details).toEqual({});
	});

	it('/health/ready (GET) reports the database as up', async () => {
		const res = await request(app.getHttpServer()).get('/health/ready').expect(200);

		expect(res.body.status).toBe('ok');
		expect(res.body.details.database).toEqual({ status: 'up' });
	});

	afterAll(async () => {
		await app.close();
	});
});

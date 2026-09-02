import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

/**
 * Boots the real AppModule, so it needs a reachable database: NODE_ENV=test
 * (set by vitest) makes ConfigModule read apps/http/.env.test first, which
 * points at the throwaway `crm_test` database. Run `pnpm --filter @crm/db
 * db:migrate` against it once before running this suite.
 */
describe('AppController (e2e)', () => {
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

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/users/:id (GET) returns an empty list for an unknown id', () => {
    return request(app.getHttpServer())
      .get('/users/does-not-exist')
      .expect(200)
      .expect([]);
  });

  afterAll(async () => {
    await app.close();
  });
});

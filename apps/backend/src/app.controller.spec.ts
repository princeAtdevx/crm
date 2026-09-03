import { DrizzleDb } from '@crm/db';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
	let appController: AppController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [
				AppService,
				// AppService injects DrizzleDb. Unit tests must not open a pg pool, so
				// supply a fake under the same token instead of importing
				// DatabaseModule. (`overrideProvider` only replaces providers already
				// declared in the module, so the token has to be provided here.)
				{
					provide: DrizzleDb,
					useValue: {
						users: { getUserById: vi.fn().mockResolvedValue([]) },
					} as unknown as DrizzleDb,
				},
			],
		}).compile();

		appController = app.get<AppController>(AppController);
	});

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(appController.getHello()).toBe('Hello World!');
		});
	});

	describe('users/:id', () => {
		it('delegates to the db model', async () => {
			await expect(appController.getUserById('abc')).resolves.toEqual([]);
		});
	});
});

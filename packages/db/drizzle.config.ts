import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Single source of truth: the repo-root .env, same file apps/backend reads.
config({ path: ['../../.env.local', '../../.env'] });

const url = process.env.DATABASE_URL;
if (!url) {
	throw new Error('DATABASE_URL is not set (looked in <repo>/.env.local, <repo>/.env)');
}

export default defineConfig({
	// Generated SQL lives outside ./src so it never enters tsc's rootDir.
	out: './drizzle',
	schema: './src/schema/schema.ts',
	dialect: 'postgresql',
	dbCredentials: { url },
	verbose: true,
	strict: true,
});

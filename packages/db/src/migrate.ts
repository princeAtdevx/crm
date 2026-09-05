import { fileURLToPath } from 'node:url';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { createDrizzleClient } from './client';

// Deliberately NOT drizzle-kit: drizzle-kit is a devDependency (see
// package.json), stripped from the production image by `pnpm install --prod`
// (docker/Dockerfile.backend). This uses only drizzle-orm + pg, both real
// dependencies, so it runs unmodified inside the same image that becomes the
// API/worker ECS tasks -- no second image, no drizzle-kit in production.
//
// Run as a one-off ECS Fargate task before each deploy (see
// .aws/task-definition.migrate.{staging,production}.json), sharing the VPC,
// security group, and Secrets-Manager-injected DATABASE_URL that the API
// task uses -- migrations never need RDS reachable from outside the VPC.

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error('DATABASE_URL is not set');
}

const db = createDrizzleClient({ connectionString });

// Resolved from this file's own location, not process.cwd() -- the API
// task's WORKDIR is /app/apps/backend (see docker/Dockerfile.backend), and
// this same image/command is what the migrate task definition also runs, so
// a cwd-relative path would break unless the task definition also changed
// WORKDIR. Anchoring to import.meta.url makes the script correct regardless
// of which directory it's invoked from.
const migrationsFolder = fileURLToPath(new URL('../drizzle', import.meta.url));

async function main() {
	console.log('Running migrations...');
	await migrate(db, { migrationsFolder });
	console.log('Migrations completed');
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});

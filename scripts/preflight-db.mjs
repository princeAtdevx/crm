#!/usr/bin/env node
/**
 * Fails `pnpm dev` fast, with instructions, when Postgres is not reachable.
 *
 * Without this the failure surfaces as a pg connection error inside Nest's
 * bootstrap several seconds in, which reads like an application bug rather than
 * "you have not started the database".
 *
 * Deliberately dependency-free (no dotenv, no pg) so the root workspace stays
 * at four devDependencies: it parses the env files itself and only opens a TCP
 * socket. A listening port is not proof the server is ready, but Postgres does
 * not bind until it is, and `pnpm db:start` waits on the real healthcheck.
 *
 * Escape hatches: SKIP_DB_CHECK=1, or scope the dev server to a workspace that
 * does not need a database (`pnpm --filter @crm/web dev`).
 */
import { readFileSync } from 'node:fs';
import net from 'node:net';

const CONNECT_TIMEOUT_MS = 1_500;

/** Minimal KEY=VALUE reader. Same precedence as app.module.ts: .local first. */
function readDatabaseUrl() {
	if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

	for (const file of ['.env.local', '.env']) {
		let contents;
		try {
			contents = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
		} catch {
			continue;
		}

		for (const line of contents.split('\n')) {
			const match = /^\s*(?:export\s+)?DATABASE_URL\s*=\s*(.*)$/.exec(line);
			if (!match) continue;

			return match[1].trim().replace(/^(['"])(.*)\1$/, '$2');
		}
	}

	return undefined;
}

function reachable(host, port) {
	return new Promise((resolve) => {
		const socket = net.connect({ host, port });
		const done = (result) => {
			socket.destroy();
			resolve(result);
		};

		socket.setTimeout(CONNECT_TIMEOUT_MS);
		socket.once('connect', () => done(true));
		socket.once('timeout', () => done(false));
		socket.once('error', () => done(false));
	});
}

function fail(lines) {
	process.stderr.write(`\n  ${lines.join('\n  ')}\n\n`);
	process.exit(1);
}

if (process.env.SKIP_DB_CHECK === '1') process.exit(0);

const url = readDatabaseUrl();

if (!url) {
	fail([
		'DATABASE_URL is not set (looked in the environment, ./.env.local, ./.env).',
		'',
		'  Copy the template and try again:  cp .env.example .env',
	]);
}

let host;
let port;
try {
	const parsed = new URL(url);
	host = parsed.hostname;
	port = Number(parsed.port) || 5432;
} catch {
	fail([`DATABASE_URL is not a valid URL: ${url}`]);
}

if (!(await reachable(host, port))) {
	fail([
		`Cannot reach Postgres at ${host}:${port} (from DATABASE_URL).`,
		'',
		'  Start it:                      pnpm db:start',
		'  Front end only, no database:   pnpm --filter @crm/web dev',
		'  Override this check:           SKIP_DB_CHECK=1 pnpm dev',
	]);
}

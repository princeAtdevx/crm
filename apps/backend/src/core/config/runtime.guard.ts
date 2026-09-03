/**
 * Asserts the process is Bun, at or above the floor this app requires.
 *
 * This exists because nothing else enforces it. `engines.bun` in package.json
 * is documentation only: pnpm validates `engines.node` and `engines.pnpm` (and
 * with `strictEngines: true` it fails the install on those), but it ignores
 * `engines.bun` entirely, and `bun run` does not read `engines` at all. So the
 * check has to happen here, at boot.
 *
 * The floor is 1.4.0 for two reasons:
 *  - pnpm 11 imports `node:sqlite`, which Bun only implements from 1.4.0. On
 *    older Bun the toolchain dies with "No such built-in module: node:sqlite".
 *  - the container image is built on `oven/bun:1.4.0-slim`, so anything lower
 *    means local behaviour has diverged from production.
 *
 * Import this before anything else in main.ts: a clear message beats a
 * confusing failure deeper in Nest or the pg driver.
 */

const MINIMUM_BUN_VERSION = '1.4.0';

/** Compares dotted numeric versions. Negative when `a` precedes `b`. */
function compareVersions(a: string, b: string): number {
	const pa = a.split('.').map(Number);
	const pb = b.split('.').map(Number);

	for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
		const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
		if (diff !== 0) return diff;
	}

	return 0;
}

export function assertRuntime(): void {
	// Bun sets process.versions.bun; Node does not. Checked this way rather
	// than via the `Bun` global so the failure is a thrown Error under Node
	// instead of a ReferenceError.
	const bunVersion = process.versions.bun;

	if (!bunVersion) {
		throw new Error(
			`This app must run under Bun >= ${MINIMUM_BUN_VERSION}, but the runtime is ` +
				`Node ${process.versions.node}. Start it with \`bun src/main.ts\` ` +
				'(or `pnpm start`), not `node`.',
		);
	}

	// A prerelease like "1.4.0-canary.1" is treated as its release version;
	// close enough for a floor check, and avoids pulling in a semver library.
	const release = bunVersion.split('-')[0] ?? bunVersion;

	if (compareVersions(release, MINIMUM_BUN_VERSION) < 0) {
		throw new Error(
			`This app requires Bun >= ${MINIMUM_BUN_VERSION}, but is running on ${bunVersion}. ` +
				'Upgrade with `bun upgrade`.',
		);
	}
}

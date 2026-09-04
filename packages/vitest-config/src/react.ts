/**
 * React packages: @crm/ui, apps/web.
 *
 *   // vitest.config.ts
 *   export { default } from '@crm/vitest-config/react';
 *
 * Note what is NOT here: @vitejs/plugin-react. Its job is Fast Refresh and the
 * React Compiler pass, neither of which means anything in a test run -- Vite
 * already transforms .tsx on its own, picking `jsx: "react-jsx"` up from each
 * workspace's tsconfig. Leaving the plugin out keeps Babel off the test path
 * and drops four peer dependencies from this package.
 */
import { fileURLToPath } from 'node:url';
import { node } from '@crm/vitest-config/node';
import { defineConfig, mergeConfig, type ViteUserConfig } from 'vitest/config';

export const react: ViteUserConfig = mergeConfig(
	node,
	defineConfig({
		test: {
			environment: 'jsdom',
			// Resolved against this file, not the consumer's cwd -- every
			// workspace gets the same setup without copying a path around.
			setupFiles: [fileURLToPath(new URL('./setup/react.ts', import.meta.url))],

			// `css: false` is Vitest's default and we want to keep it: apps/web
			// pulls in @crm/ui/styles.css, and parsing Tailwind v4's @theme
			// block buys a test suite nothing.
			css: false,
		},
	}),
);

export default react;

/**
 * Loaded by ../react.ts into every React workspace.
 */
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Testing Library only auto-cleans when it can see a global afterEach at import
// time, which is not guaranteed across runners. Doing it explicitly means a
// component from one test can never still be mounted during the next.
afterEach(() => {
	cleanup();
});

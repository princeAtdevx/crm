// Separate from vite.config.ts on purpose. The app build runs the React
// Compiler through Babel; tests do not need it and are faster without it.
export { default } from '@crm/vitest-config/react';

import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		// React Compiler still runs through Babel; rolldown handles the rest.
		babel({ presets: [reactCompilerPreset()] }),
		tailwindcss(),
	],
});

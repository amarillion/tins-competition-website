import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
	return {
		build: {
			outDir: './static', // <- this is where djanog expects the static assets when running in local dev mode...
			sourcemap: mode === 'development',
		},
		base: '/static/',
	}
});

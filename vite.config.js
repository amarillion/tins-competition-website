import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => {
	return {
		plugins: [
			viteCompression()
		],
		build: {
			outDir: './static', // <- this is where djanog expects the static assets when running in local dev mode...
			sourcemap: mode === 'development',
		},
		base: '/static/',
	}
});

import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
	return {
		plugins: [
			viteCompression(),
			vue(),
		],
		build: {
			outDir: './static', // <- this is where djanog expects the static assets when running in local dev mode...
			sourcemap: mode === 'development',
		},
		base: '/static/',
	}
});

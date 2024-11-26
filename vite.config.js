import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression2';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
	return {
		plugins: [
			compression(),
			vue(),
		],
		build: {
			outDir: './static', // <- this is where djanog expects the static assets when running in local dev mode...
			sourcemap: mode === 'development',
		},
		base: '/static/',
		test: {
			environment: 'jsdom'
		}
	};
});

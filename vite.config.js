import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression2';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
	return {
		plugins: [
			compression(),
			vue({
				template: {
					compilerOptions: {
						isCustomElement: (tag) => tag.startsWith('tins-'),
					},
				},
			}),
		],
		build: {
			outDir: './static', // <- this is where django expects the static assets when running in local dev mode...
			sourcemap: mode === 'development',
		},
		base: '/static/',
		test: {
			environment: 'jsdom',
			include: ['test/**/*.test.ts']
		}
	};
});

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const staticDir = path.join(rootDir, 'static');
const indexFile = path.join(staticDir, 'index.html');
const port = Number(process.env.PORT || 4173);

const MIME_TYPES = {
	'.br': 'application/octet-stream',
	'.css': 'text/css; charset=utf-8',
	'.gif': 'image/gif',
	'.gz': 'application/octet-stream',
	'.html': 'text/html; charset=utf-8',
	'.ico': 'image/x-icon',
	'.jpeg': 'image/jpeg',
	'.jpg': 'image/jpeg',
	'.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
	'.webp': 'image/webp',
};

async function sendFile(res, filePath, { cacheControl = 'no-cache' } = {}) {
	try {
		const fileStat = await stat(filePath);
		if (!fileStat.isFile()) throw new Error('not a file');
		const body = await readFile(filePath);
		const ext = path.extname(filePath).toLowerCase();
		res.writeHead(200, {
			'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
			'Content-Length': body.length,
			'Cache-Control': cacheControl,
		});
		res.end(body);
	}
	catch {
		res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
		res.end('Not found');
	}
}

async function sendIndex(res) {
	await sendFile(res, indexFile);
}

async function handleStatic(res, pathname) {
	if (pathname === '/static' || pathname === '/static/') {
		await sendIndex(res);
		return;
	}

	const relative = pathname.replace(/^\/static\//, '');
	const filePath = path.resolve(staticDir, relative);

	// Prevent path traversal outside the static output directory.
	if (filePath !== staticDir && !filePath.startsWith(staticDir + path.sep)) {
		res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
		res.end('Forbidden');
		return;
	}

	await sendFile(res, filePath);
}

const server = createServer(async (req, res) => {
	try {
		const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
		let pathname = decodeURIComponent(requestUrl.pathname);

		if (pathname !== '/' && pathname.endsWith('/')) {
			pathname = pathname.replace(/\/$/, '');
		}

		// The built app expects Django-style root URLs such as /news, but all
		// assets are emitted under /static/ by Vite's base configuration.
		if (pathname.startsWith('/static')) {
			await handleStatic(res, pathname);
			return;
		}

		// API calls are normally intercepted by Playwright route mocks.
		if (pathname.startsWith('/api/')) {
			res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
			res.end(JSON.stringify({ error: 'API not mocked in Playwright test' }));
			return;
		}

		// SPA fallback: any root-level route returns the app shell.
		await sendIndex(res);
	}
	catch (err) {
		res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
		res.end(`Server error: ${err instanceof Error ? err.message : String(err)}`);
	}
});

server.listen(port, '127.0.0.1', () => {
	console.log(`Playwright SPA server listening on http://127.0.0.1:${port}`);
});

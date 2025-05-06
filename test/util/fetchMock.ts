type HttpMethod = 'GET' | 'POST';

interface MockResponse {
	status?: number;
	headers?: Record<string, string>;
	body: any;
}

function routeKey(method: HttpMethod, url: string): string {
	return `${method.toUpperCase()} ${url}`;
}

export class FetchMock {
	static builder() {
		return new FetchMockBuilder();
	}
}

class FetchMockBuilder {
	private routes: Map<string, MockResponse> = new Map();
	private originalFetch?: typeof fetch;

	get(url: string, body: any, status = 200, headers: Record<string, string> = { 'Content-Type': 'application/json' }) {
		this.routes.set(routeKey('GET', url), { status, headers, body });
		return this;
	}

	post(url: string, body: any, status = 200, headers: Record<string, string> = { 'Content-Type': 'application/json' }) {
		this.routes.set(routeKey('POST', url), { status, headers, body });
		return this;
	}

	async run<T>(fn: () => Promise<T> | T): Promise<T> {
		this.installFetchMock();
		try {
			return await fn();
		} finally {
			this.restoreFetch();
		}
	}

	private installFetchMock() {
		if (this.originalFetch) return;
		this.originalFetch = globalThis.fetch;

		globalThis.fetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
			const method = (init?.method || 'GET').toUpperCase();
			const url = typeof input === 'string' ? input : input.url;
			const key = routeKey(method as HttpMethod, url);

			if (this.routes.has(key)) {
				const mock = this.routes.get(key)!;
				const body = typeof mock.body === 'string' ? mock.body : JSON.stringify(mock.body);
				return new Response(body, {
					status: mock.status ?? 200,
					headers: mock.headers,
				});
			}

			return Promise.reject(new Error(`No mock defined for ${method} ${url}`));
		};
	}

	private restoreFetch() {
		if (this.originalFetch) {
			globalThis.fetch = this.originalFetch;
			this.originalFetch = undefined;
		}
		this.routes.clear();
	}
}

/*
	Adds an event listener on a DOM element, and returns a function that 
	removes it again when called.
*/
export default function registerEventListener(elt, type, func, capture = false) {
	elt.addEventListener(type, func, capture);
	return () => {
		elt.removeEventListener(type, func, capture);
	};
}

export function formatBytes(bytes) {
	const GB = 1 << 30;
	const MB = 1 << 20;
	const KB = 1 << 10;
	if (bytes > GB / 2) {
		return `${(bytes/GB).toFixed(2)} Gb`;
	}
	else if (bytes > MB / 2) {
		return `${(bytes/MB).toFixed(2)} Mb`;
	}
	else if (bytes > KB / 2) {
		return `${(bytes/KB).toFixed(2)} Kb`;
	}
	else {
		return `${bytes} b`;
	}
}

export async function formatErrorResponse(response) {
	const message = (await response.text()).split("\n")[0];
	switch(response.status) {
	case 401: return `Access denied: ${message}`;
	case 403: return `Unauthorized: ${message}`;
	case 404: return `Not found: ${message}`;
	default: return `Error: ${message}`;
	}
}

/** gets data from URL and parses json. Sets loading and error flags on self. */
export async function asyncFetchJSON(url, self) {
	self.loading = true;
	const response = await fetch(url);
	if (response.ok) {
		// parse json only if response is OK. Error state may contain invalid json.
		const data = await response.json(); 
		// clear loading flag AFTER awaiting data.
		self.loading = false; 
		return data;
	}
	else {
		self.loading = false;
		self.error = await formatErrorResponse(response);
		return null;
	}
}

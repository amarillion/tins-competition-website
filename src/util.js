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

/** gets data from URL. Sets loading and error flags on self. */
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
		const message = await response.text();
		if (response.status === 401) {
			self.error = `Access denied: ${message}`;
		}
		else if (response.status === 403) {
			self.error = `Unauthorized: ${message}`;
		}
		else {
			self.error = `Error: ${message}`;
		}
		return null;
	}
}
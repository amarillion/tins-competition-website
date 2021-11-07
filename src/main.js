import './router.js';
import { postOrThrow } from './util.js';

window.onerror = async (event, fileName, lineNumber, columnNumber, error) => {
	try {
		const body = JSON.stringify({
			fileName, lineNumber, columnNumber, error,
			path: window.location.path
		});
		await postOrThrow('/api/v1/error', JSON.stringify(body));
	}
	catch (e) { /* ignore cascade */}
};

window.onunhandledrejection = async (event) => {
	try {
		const { message, columnNumber, lineNumber, fileName } = event.reason;
		const body = {
			message, columnNumber, lineNumber, fileName, 
			path: window.location.pathname
		};
		await postOrThrow('/api/v1/error', JSON.stringify(body));
	}
	catch (e) { /* ignore cascade */ }
};

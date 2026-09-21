import { createApp, h } from 'vue';
import { RouterView } from 'vue-router';
import { postOrThrow } from './util.js';
import { installInternalLinkHandler } from './linkHandler.js';
import { router } from './router.js';

window.onerror = async (event, fileName, lineNumber, columnNumber, error) => {
	try {
		const body = JSON.stringify({
			fileName, lineNumber, columnNumber, error,
			path: window.location.pathname
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

const app = createApp({
	render: () => h(RouterView),
});

app.use(router);
app.mount('#outlet');

// Vaadin Router used to intercept same-origin anchor clicks and turn them into
// SPA navigations. Vue Router does not do this globally, so keep the same
// user-visible behaviour while pages still use plain <a href> links.
installInternalLinkHandler(router);

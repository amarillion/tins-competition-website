import type { Router } from 'vue-router';

type AnchorClickState = {
	button: number;
	metaKey: boolean;
	ctrlKey: boolean;
	shiftKey: boolean;
	altKey: boolean;
	defaultPrevented: boolean;
};

export function shouldHandleAnchorClick(anchor: HTMLAnchorElement | null, event: AnchorClickState) {
	if (!anchor || event.defaultPrevented) {
		return false;
	}

	// Only handle plain left-clicks without modifier keys. Let the browser
	// open links in new tabs/windows when the user asks for it.
	if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
		return false;
	}

	// router-ignore is the existing marker for links that should perform a
	// full-page navigation (Django-managed pages, uploads, etc.).
	if (anchor.hasAttribute('router-ignore')) {
		return false;
	}

	if (anchor.target && anchor.target !== '_self') {
		return false;
	}

	const href = anchor.getAttribute('href');
	if (!href || href.startsWith('#') || /^(?:mailto|tel|javascript):/i.test(href)) {
		return false;
	}

	return true;
}

export function getSameOriginPath(anchor: HTMLAnchorElement) {
	const href = anchor.getAttribute('href');
	if (!href) {
		return null;
	}

	const url = new URL(href, document.baseURI);
	if (url.origin !== window.location.origin) {
		return null;
	}

	return url.pathname + url.search + url.hash;
}

export function findAnchor(event: MouseEvent): HTMLAnchorElement | null {
	for (const node of event.composedPath()) {
		if (node instanceof HTMLAnchorElement) {
			return node;
		}
	}
	return null;
}

export function installInternalLinkHandler(router: Router): () => void {
	const onClick = (event: MouseEvent) => {
		const anchor = findAnchor(event);
		if (!shouldHandleAnchorClick(anchor, event)) {
			return;
		}

		const path = getSameOriginPath(anchor);
		if (!path) {
			return;
		}

		event.preventDefault();
		void router.push(path);
	};

	document.addEventListener('click', onClick);
	return () => document.removeEventListener('click', onClick);
}

import { describe, expect, test } from 'vitest';

import { getSameOriginPath, shouldHandleAnchorClick } from '../src/linkHandler.js';

const leftClick = {
	button: 0,
	metaKey: false,
	ctrlKey: false,
	shiftKey: false,
	altKey: false,
	defaultPrevented: false,
};

function makeAnchor(href: string, attrs: Record<string, string> = {}) {
	const anchor = document.createElement('a');
	anchor.setAttribute('href', href);
	for (const [key, value] of Object.entries(attrs)) {
		anchor.setAttribute(key, value);
	}
	return anchor;
}

describe('link handler helpers', () => {
	test('handles plain same-origin anchor clicks', () => {
		const anchor = makeAnchor('/news');
		expect(shouldHandleAnchorClick(anchor, leftClick)).toBe(true);
		expect(getSameOriginPath(anchor)).toBe('/news');
	});

	test('ignores router-ignore anchors', () => {
		const anchor = makeAnchor('/accounts/login?next=/news', { 'router-ignore': '' });
		expect(shouldHandleAnchorClick(anchor, leftClick)).toBe(false);
	});

	test('ignores modified clicks', () => {
		const anchor = makeAnchor('/news');
		expect(shouldHandleAnchorClick(anchor, { ...leftClick, ctrlKey: true })).toBe(false);
		expect(shouldHandleAnchorClick(anchor, { ...leftClick, metaKey: true })).toBe(false);
	});

	test('ignores links that open in a new tab', () => {
		const anchor = makeAnchor('/news', { target: '_blank' });
		expect(shouldHandleAnchorClick(anchor, leftClick)).toBe(false);
	});

	test('external links are not routed through the SPA', () => {
		const anchor = makeAnchor('https://example.com/news');
		expect(shouldHandleAnchorClick(anchor, leftClick)).toBe(true);
		expect(getSameOriginPath(anchor)).toBeNull();
	});

	test('ignores hash-only and protocol links', () => {
		expect(shouldHandleAnchorClick(makeAnchor('#section'), leftClick)).toBe(false);
		expect(shouldHandleAnchorClick(makeAnchor('mailto:test@example.com'), leftClick)).toBe(false);
		expect(shouldHandleAnchorClick(makeAnchor('javascript:void(0)'), leftClick)).toBe(false);
	});

	test('resolves relative links against the current origin', () => {
		const anchor = makeAnchor('news');
		expect(getSameOriginPath(anchor)).toBe('/news');
	});
});

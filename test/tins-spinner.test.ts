/**
 * @vitest-environment jsdom
 */

import { expect, test } from 'vitest';
// import { TinsSecretSanta } from "../src/pages/tins-my-secret-santa.js";
import TinsSpinner from "../src/components/tins-spinner.ce.vue";
import { defineCustomElement } from 'vue';

test('custom elements in JSDOM', async () => {
	
	// customElements.define('tins-my-secret-santa', TinsSecretSanta);
	// document.body.innerHTML = `<tins-my-secret-santa></tins-my-secret-santa>`;
	// expect(document.body.innerHTML).toContain('It works!');

	customElements.define('tins-spinner', defineCustomElement(TinsSpinner));

	const { document } = window;
	const element = document.createElement("tins-spinner");
	document.body.appendChild(element);

	const renderedText = document.body.querySelector("tins-spinner").shadowRoot.innerHTML;

	expect(renderedText).toContain('svg');
});

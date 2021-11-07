import { test, expect } from '@jest/globals';
// import { TinsSecretSanta } from "../src/pages/tins-my-secret-santa.js";
import { TinsSpinner } from "../src/components/tins-spinner.js";

test('custom elements in JSDOM', async () => {
	
	// customElements.define('tins-my-secret-santa', TinsSecretSanta);
	// document.body.innerHTML = `<tins-my-secret-santa></tins-my-secret-santa>`;
	// expect(document.body.innerHTML).toContain('It works!');

	customElements.define('tins-spinner', TinsSpinner);

	const { document } = window;
	const element = document.createElement("tins-spinner");
	document.body.appendChild(element);
	await element.updateComplete;

	const renderedText = document.body.querySelector("tins-spinner").shadowRoot.innerHTML;

	expect(renderedText).toContain('svg');
});

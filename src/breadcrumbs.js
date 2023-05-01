import { html } from 'lit';
import { join } from 'lit/directives/join.js';

export function breadCrumbs(..._pairs) {
	const pairs = [ { title: "TINS", url: '/', routerIgnore: true }, ..._pairs ];
	const links = pairs.map(a => a.url
		? (a.routerIgnore 
			? html`<a href="${a.url}" router-ignore>${a.title}</a>`
			: html`<a href="${a.url}">${a.title}</a>`)
		: html`${a.title}`);
	return html`<div class="breadcrumbs">${join(links, ' » ')}</div>`;
}

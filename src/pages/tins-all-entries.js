import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { TinsFrame } from '../components/tins-frame';
import { TinsRichText } from '../components/tins-richtext-control';
import { asyncFetchJSON } from '../util';
import { repeat } from 'lit-html/directives/repeat.js';
import { TinsSpinner } from '../components/tins-spinner';
import { TinsEntryThumbnail } from '../components/tins-entry-thumbnail';

export class TinsAllEntries extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-frame': TinsFrame,
			'tins-richtext': TinsRichText,
			'tins-spinner': TinsSpinner,
			'tins-entry-thumbnail': TinsEntryThumbnail,
		};
	}

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			data: { type: Object },
		};
	}

	constructor() {
		super();
		this.data = {};
		this.error = "";
		this.loading = false;
	}

	async connectedCallback() {
		super.connectedCallback();
		const data = await asyncFetchJSON(`/api/v1/entries/allByCompo`, this);
		if (data) {
			this.data = data;
		}
	}

	renderEntry(e, compo) {
		return html`<a href="/entry/${e.id}"><tins-entry-thumbnail .entry=${e}></tins-entry-thumbnail></a>`;
	}

	renderContents() {
		return html`
		${repeat(this.data.result, i => i.competition.short, 
			i => html`<h2>${i.competition.title}</h2>
			<div class="entry-list">${repeat(i.entries, e => this.renderEntry(e, i.competition))}</div>`
		)}`;
	}

	renderError() {
		return this.error ? html`<div class="error">${this.error}</div>`:'';
	}
	
	render() {
		return html`<tins-frame>
			${this.loading 
			? html`<tins-spinner class="spinner"></tins-spinner>` 
			: this.error 
				? html`${this.renderError()}`
				: html`${this.renderContents()}`
			}</tins-frame>`;
	}

	static get styles() {
		return css`
			:host {
			}

			.entry-list {
				display: flex;
				flex-flow: row wrap;
			}

			.richtext {
				width: 100%;
			}
		`;
	}

}


import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import { TinsSpinner } from '../components/tins-spinner.js';
import { TinsFaIcon } from '../components/tins-fa-icon.js';
import { asyncFetchJSON } from '../util.js';

export class TinsResults extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-spinner': TinsSpinner,
			'tins-fa-icon': TinsFaIcon,
		};
	}

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			data: { type: String }
		};
	}

	constructor() {
		super();
		this.data = '';
		this.error = "";
		this.loading = false;
	}

	async connectedCallback() {
		super.connectedCallback();
		const compoId = this.location.params.compoId;
		const data = await asyncFetchJSON(`/api/v1/compo/${compoId}/results`, this);
		if (data) {
			this.data = data.result;
		}
	}

	renderContents() {
		const data = this.data || '';
		if (!data) return ''; // loading or error...
		return html`<h1>Results</h1>
		<div>${unsafeHTML(data)}</div>
		`;
	}

	render() {
		return html`<tins-status-helper 
				error="${this.error}" ?loading=${this.loading}
			>${this.renderContents()}</tins-status-helper>`;
	}

	static get styles() {
		return css`
			:host {
			}

		`;
	}

}

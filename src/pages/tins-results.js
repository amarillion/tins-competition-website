import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import { TinsSpinner } from '../components/tins-spinner.js';
import { TinsFaIcon } from '../components/tins-fa-icon.js';
import { asyncFetchJSON } from '../util.js';
import { breadCrumbs } from '../breadcrumbs.js';

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

	renderBreadCrumbs() {
		const compoId = this.location.params.compoId;
		return breadCrumbs(
			{ url: `/${compoId}/`, title: compoId },
			{ title: 'Results' }
		);
	}

	render() {
		return html`${this.renderBreadCrumbs()}
<tins-status-helper 
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

import { LitElement, html, css } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { TinsSpinner } from './tins-spinner.js';

export class TinsStatusHelper extends ScopedElementsMixin(LitElement) {

	static get properties() {
		return {
			error: { type: String },
			loading: { type: Boolean }
		};
	}

	static get scopedElements() {
		return {
			'tins-spinner': TinsSpinner
		};
	}

	constructor() {
		super();
		this.loading = false;
		this.error = "";
	}

	renderError() {
		return this.error ? html`<div class="error">${this.error}</div>` : '';
	}

	render() {
		return html`
			${this.loading 
			? html`<tins-spinner class="spinner"></tins-spinner>` 
			: this.error 
				? html`${this.renderError()}`
				: html`<slot></slot>`
			}`;

	}

	static get styles() {
		return css`
		:host {
			display: block; // solves text selection issues
		}

		.error {
			width: 100%;
			color: red;
		}
		`;
	}
}

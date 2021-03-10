import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { TinsFrame } from '../components/tins-frame.js';
import { TinsRichTextView } from '../components/tins-richtext-view.js';
import { asyncFetchJSON, postOrThrow } from '../util.js';
import { TinsSpinner } from '../components/tins-spinner.js';
import { TinsFaIcon } from '../components/tins-fa-icon.js';
import { TinsLogForm } from '../components/tins-log-form.js';
import { TinsLogPost } from '../components/tins-log-post.js';

export class TinsLogEdit extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-frame': TinsFrame,
			'tins-log-post': TinsLogPost,
			'tins-spinner': TinsSpinner,
			'tins-fa-icon': TinsFaIcon,
			'tins-log-form': TinsLogForm,
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
		this.error = {};
		this.loading = false;
	}

	async connectedCallback() {
		super.connectedCallback();
		const { compoId }  = this.location.params;
		const data = await asyncFetchJSON(`/api/v1/log/event/${compoId}/myLatest`, this);
		
		if (data) {
			this.data = data;
		}
	}

	async submit(formData) {
		const { compoId }  = this.location.params;
			
		try {
			this.loading = true;
			const response = await postOrThrow(`/api/v1/log/event/${compoId}/myLatest`, formData);
			this.data = await response.json();
		}
		catch (e) {
			this.error = e.message;
		}
		finally {
			this.loading = false;
		}
	}
	
	renderForm(competition) {
		return html`<hr>

<p>You are now editing your most recent post. <a href="/${competition.short}/log/">Click here to add a new post instead</a>
	</p>

	<tins-log-form 
		.prefill=${this.data.post} 
		.submitCallback=${(formData) => this.submit(formData)}
	></tins-log-form>

<hr>`;
	}

	renderPost(post, competition) {
		return html`<tins-log-post .post=${post} .competition=${competition}></tins-log-post>`;
	}

	renderContents() {
		const { post, competition, msgPostEnabled } = this.data;
		return html`
			${msgPostEnabled ? this.renderForm(competition) : ''}
			<table border="1" width="100%">
				${this.renderPost(post, competition)}
			</table>
		`;
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

			.error {
				width: 100%;
				color: red;
			}

			.authorbox {
				color: grey;
			}

			.downloadbox {
				background: lightgrey;
				border: 2px dashed grey;
				padding: 10px;
			}
	
			.edit-image {
				width: 100%;
				background: lightgrey;
			}

			.floatright {
				float: right;
			}

			.color {
				width: 100%;
				background: red;
			}

			.richtext {
				width: 100%;
			}

			img {
				max-width: 100%;
			}
		`;
	}

}


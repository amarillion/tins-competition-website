import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { TinsFrame } from '../components/tins-frame.js';
import { TinsRichTextView } from '../components/tins-richtext-view.js';
import { asyncFetchJSON, postOrThrow } from '../util.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { TinsSpinner } from '../components/tins-spinner.js';
import { TinsFaIcon } from '../components/tins-fa-icon.js';
import { TinsLogForm } from '../components/tins-log-form.js';
import { TinsLogPost } from '../components/tins-log-post.js';

export class TinsLogs extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-frame': TinsFrame,
			'tins-richtext-view': TinsRichTextView,
			'tins-spinner': TinsSpinner,
			'tins-fa-icon': TinsFaIcon,
			'tins-log-form': TinsLogForm,
			'tins-log-post': TinsLogPost,
		};
	}

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			data: { type: Object },
			page: { type: Number },
		};
	}

	constructor() {
		super();
		this.data = {};
		this.error = '';
		this.loading = false;
		this.page = 1;
	}

	async refreshData() {
		const { postId, compoId, entrantId }  = this.location.params;
		this.page = this.location.params.page || 1;
		
		let data;
		if (postId) {
			data = await asyncFetchJSON(`/api/v1/log/id/${postId}`, this);
		}
		else if (entrantId) {
			data = await asyncFetchJSON(`/api/v1/log/entrant/${entrantId}?page=${this.page}`, this);
		}
		else if (compoId) { 
			data = await asyncFetchJSON(`/api/v1/log/event/${compoId}?page=${this.page}`, this);
		}
		
		if (data) {
			this.data = data;
			this.requestUpdateInternal();
		}
	}

	connectedCallback() {
		super.connectedCallback();
		this.refreshData();
	}
	
	async submit(formData) {
		const { competition } = this.data;
		
		try {
			this.loading = true;
			const response = await postOrThrow(`/api/v1/log/event/${competition.short}`, formData);
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
<p>Add a message to your log <a href="${competition.short}/log/edit">(click here to edit your previous post)</a>
<p>
<tins-log-form .submitCallback=${(formData) => this.submit(formData)}></tins-log-form>
</p>
<hr>`;
	}

	renderPost(post, competition) {
		return html`<tins-log-post .post=${post} .competition=${competition}></tins-log-post>`;
	}

	renderPageNav() {
		const { numPages } = this.data;
		const { postId, compoId, entrantId }  = this.location.params;
		if (postId) { return ''; /* no nav bar needed */ }
		
		let url;
		if (entrantId) {
			url = `/${compoId}/log/entrant/${entrantId}`
		}
		else {
			url = `/${compoId}/log`;
		}

		const page = Number(this.page);
		return html`${page > 1 ? html`<a href="${url}/page/${page-1}">previous</a>` : ''}
		<span class="current">
			Page ${page} of ${numPages}
		</span>
		${this.page < numPages ? html`<a href="${url}/page/${page+1}">next</a>` : ''}`;
	}

	renderContents() {
		const { posts, competition, msgPostEnabled } = this.data;
		return html`
			${msgPostEnabled ? this.renderForm(competition) : ''}
			${this.renderPageNav()}
			${repeat(posts || [], p => p.id, p => this.renderPost(p, competition))}
			${this.renderPageNav()}
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
		`;
	}

}


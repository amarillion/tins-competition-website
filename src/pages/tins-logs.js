import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { TinsFrame } from '../components/tins-frame';
import { TinsRichTextView } from '../components/tins-richtext-view.js';
import { asyncFetchJSON, postOrThrow } from '../util';
import { repeat } from 'lit-html/directives/repeat.js';
import { TinsSpinner } from '../components/tins-spinner';
import { TinsFaIcon } from '../components/tins-fa-icon.js';
import { TinsLogForm } from '../components/tins-log-form';

export class TinsLogs extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-frame': TinsFrame,
			'tins-richtext-view': TinsRichTextView,
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
		const { postId, compoId, entrantId }  = this.location.params;
		let data;
		if (postId) {
			data = await asyncFetchJSON(`/api/v1/log/id/${postId}`, this);
		}
		else if (entrantId) {
			data = await asyncFetchJSON(`/api/v1/log/entrant/${entrantId}`, this);
		}
		else if (compoId) { 
			data = await asyncFetchJSON(`/api/v1/log/event/${compoId}`, this);
		}
		
		if (data) {
			this.data = data;
		}
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
		return html`
<tr id="${post.id}">
	<td>
		<a href="/${competition.short}/log/${post.entrant.id}">${post.entrant.name}</a>
		${new Date(post.date).toLocaleString([], { dateStyle:'full', timeStyle: 'short'})}
	</td>
</tr>
<tr>
	<td>
		<tins-richtext-view text="${post.text}"></tins-richtext-view>
	</td>
</tr>
	${post.image ? html`
<tr>
	<td>
		<img src="/upload/${post.image}">
	</td>
</tr>` : ''}`;
	}

	renderContents() {
		const { posts, competition, msgPostEnabled } = this.data;
		return html`
			${msgPostEnabled ? this.renderForm(competition) : ''}
			<table border="1" width="100%">
				${repeat(posts || [], p => this.renderPost(p, competition))}
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


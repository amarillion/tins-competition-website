import { LitElement, html, css } from 'lit';

import { asyncFetchJSON, postOrThrow } from '../util.js';

export class TinsLogEdit extends LitElement {

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
			this.requestUpdate();
		}
		catch (e) {
			this.error = e.message;
		}
		finally {
			this.loading = false;
		}
	}
	
	renderForm(competition) {
		return html`
<p>You are now editing your most recent post. <a href="/${competition.short}/log/">Click here to add a new post instead</a>
	</p>
	<tins-log-form 
		.text=${this.data.post.text}
		.image=${this.data.post.image}
		.spoiler=${this.data.post.spoiler}
		.submitCallback=${(formData) => this.submit(formData)}
	></tins-log-form>

<hr>`;
	}

	renderPost(post, competition) {
		return html`<tins-log-post .post=${post} .competition=${competition}></tins-log-post>`;
	}

	renderContents() {
		const { post, competition, canPostAndAuthenticated } = this.data;
		if (!(post || competition)) { return ''; }
		return html`
			${canPostAndAuthenticated ? this.renderForm(competition) : ''}
			<table border="1" width="100%">
				${this.renderPost(post, competition)}
			</table>
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


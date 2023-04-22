import { LitElement, html, css } from 'lit';

import { TinsRichTextView } from '../components/tins-richtext-view.js';
import { asyncFetchJSON, postOrThrow } from '../util.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { TinsFaIcon } from '../components/tins-fa-icon.js';
import { TinsLogForm } from '../components/tins-log-form.js';
import { TinsLogPost } from '../components/tins-log-post.js';
import { canPostSelector } from '../data/currentEvent.js';
import { currentUserSelector } from '../data/currentUser.js';
import { StoreSubscriberMixin } from '../data/storeSubscriberMixin.js';
import { TinsStatusHelper } from '../components/tins-status-helper.js';
import { breadCrumbs } from '../breadcrumbs.js';

export class TinsLogs extends StoreSubscriberMixin(LitElement) {

	get selectors() {
		const { compoId }  = this.location.params;
		return {
			canPost: canPostSelector(compoId),
			username: currentUserSelector
		};
	}

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			data: { type: Object },
			page: { type: Number },
			canPost: { type: Boolean },
			username: { type: String },
		};
	}

	constructor() {
		super();
		this.data = {};
		this.error = '';
		this.loading = false;
		this.page = 1;
		this.canVote = false;
		this.username = null;
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
		const loggedIn = !!this.username;
		const canPost = loggedIn && this.canPost;
		if (!(competition && canPost)) { return ''; }
		return html`
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
			url = `/${compoId}/log/entrant/${entrantId}`;
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
		const competition = this.data.competition || {};
		const posts = this.data.posts || [];
		const { title } = competition;

		return html`
			${this.renderForm(competition)}
			<h1>${title} logs</h1>
			${this.renderPageNav()}
			${posts.length 
			? html`<table>
				${repeat(posts, p => p.id, p => html`<tr><td>${this.renderPost(p, competition)}</td></tr>`)}
				</table>` 
			: html`<p>Nothing posted yet...</p>`
			}
			${this.renderPageNav()}
		`;
	}

	renderBreadCrumbs() {
		const compoId = this.location.params.compoId;
		return breadCrumbs(
			{ url: `/${compoId}/`, title: compoId },
			{ title: 'log' }
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

			a 			{ font-weight: bold; text-decoration: none; }
			a:link 		{ color: #600; }
			a:hover 	{ text-decoration: underline; }
			a:active 	{ text-decoration: underline; }

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

			table, tr, td {
				border-collapse: collapse;
				border: 1px solid grey;
			}
		`;
	}

}


import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { TinsFrame } from '../components/tins-frame';
import { TinsRichTextControl } from '../components/tins-richtext-control.js';
import { asyncFetchJSON, formatBytes, formatErrorResponse } from '../util';
import { repeat } from 'lit-html/directives/repeat.js';
import { TinsSpinner } from '../components/tins-spinner';
import Cookies from 'js-cookie';
import gamepadIcon from '@fortawesome/fontawesome-free/svgs/solid/gamepad.svg';
import downloadIcon from '@fortawesome/fontawesome-free/svgs/solid/download.svg';
import { TinsFaIcon } from '../components/tins-fa-icon.js';
import { clearCurrentUser } from '../data/currentUser';
import { dispatch } from '../store';

export class TinsEntry extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-frame': TinsFrame,
			'tins-richtext': TinsRichTextControl,
			'tins-spinner': TinsSpinner,
			'tins-fa-icon': TinsFaIcon,
		};
	}

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			entry: { type: Object },
		};
	}

	constructor() {
		super();
		this.entry = {};
		this.error = {};
		this.loading = false;
	}

	async connectedCallback() {
		super.connectedCallback();
		const entryId = this.location.params.entryId;
		const data = await asyncFetchJSON(`/api/v1/entry/${entryId}`, this);
		if (data) {
			this.entry = data;
		}
	}

	renderContents() {
		const { entrants, tags, competition } = this.entry;
		return html`
			<div class="icons">
				${repeat(tags, t => html`<img src="/upload/${t.icon}" title="${t.desc}"/>`)}
			</div>

			<h1><tins-fa-icon src="${gamepadIcon}" size="2rem"></tins-fa-icon> ${this.entry.title}</h1>
			
			<p class="authorbox">
				Event: <a href="/${competition.short}" router-ignore>${competition.title}</a><br>
				Game by: ${repeat(entrants, e => html`${e.name} <a href='${competition.short}/log/${e.id}' router-ignore>log (${e.logCount})</a>`)}
			</p>

			${this.entry.imagefile ? html`<img src="/upload/${this.entry.imagefile}"/>` : html`<hr>`}

			<p>
				<tins-richtext class="richtext" .submitCallback=${(data) => this.submitText(data)} ?readOnly=${!this.entry.editable} text="${this.entry.text}"></tins-richtext>
			</p>
			${this.entry.lastSubmission ? html`
			<div class="downloadbox">
				<tins-fa-icon src="${downloadIcon}" color="gray" size="2rem"></tins-fa-icon>
				<a href="/upload/${this.entry.lastSubmission.url}" router-ignore>${this.entry.title}<a>
				${formatBytes(this.entry.lastSubmission.size)}
			</div>` : ''}
			<p><a href="/${competition.short}/reviews/entry/${this.entry.id}/" router-ignore>Reviews (${this.entry.reviewCount})</a>
		`;
	}
	
	async submitText(unsafeText) {
		const entryId = this.location.params.entryId;
		// being able to access the cookie proves that this code is running in the proper domain
		const csrftoken = Cookies.get('csrftoken');
		const response = await fetch(
			`/api/v1/entry/${entryId}/text`, { 
				method: 'POST', 
				body: JSON.stringify({ text: unsafeText }),
				headers: { 'X-CSRFToken': csrftoken }
			}
		);
		if (response.ok) {
			// parse json only if response is OK. Error state may contain invalid json.
			const data = await response.json(); 
			// clear loading flag AFTER awaiting data.
			return data.text;
		}
		else {
			if (response.status === 401) {
				dispatch(clearCurrentUser());
			}
			throw new Error(await formatErrorResponse(response));
		}
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

			.icons {
					
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

			.icons {
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


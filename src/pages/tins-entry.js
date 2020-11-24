import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { TinsFrame } from '../components/tins-frame';
import { TinsRichText } from '../components/tins-richtext';
import { asyncFetchJSON } from '../util';
import { repeat } from 'lit-html/directives/repeat.js';
import { TinsSpinner } from '../components/tins-spinner';
import Cookies from 'js-cookie';

export class TinsEntry extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-frame': TinsFrame,
			'tins-richtext': TinsRichText,
			'tins-spinner': TinsSpinner
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
		this.entry = "";
		this.error = "";
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
		return html`
			<div class="icons">
				${repeat(this.entry.tags, t => html`<img src="${t.url} title="${t.desc}/>`)}
			</div>
			<h1>Entry Detail for: ${this.entry.title}</h1>
			<p>Author(s): ${repeat(this.entry.entrants, e => html`${e.name} (<a href='${this.entry.competition}/log/${e.id}' router-ignore>log</a>)`)}</p>
			<tins-richtext class="richtext" .submitCallback=${(data) => this.submitText(data)} ?readOnly=${!this.entry.editable} text="${this.entry.text}"></tins-richtext>
			<p>Download: <a href="/upload/${this.entry.lastSubmission.url}" router-ignore>${this.entry.title}<a>
			<p>
			<img src="/upload/${this.entry.imagefile}"/>
			</p>
			<p><a href="/${this.entry.competition}/reviews/entry/${this.entry.id}/" router-ignore>Reviews</a>
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
		else throw new Error((await response.text()).substr(0, 250));
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

			.color {
				width: 100%;
				background: red;
			}

			.richtext {
				width: 100%;
			}
		`;
	}

}


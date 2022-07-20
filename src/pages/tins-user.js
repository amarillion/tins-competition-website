import { LitElement, html, css } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { TinsRichTextControl } from '../components/tins-richtext-control.js';
import { asyncStateFlags, fetchJSONOrThrow } from '../util.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { TinsSpinner } from '../components/tins-spinner.js';
import { TinsEntryThumbnail } from '../components/tins-entry-thumbnail.js';
import personIcon from '@fortawesome/fontawesome-free/svgs/solid/id-card.svg';
import globeIcon from '@fortawesome/fontawesome-free/svgs/solid/globe-europe.svg';
import { TinsFaIcon } from '../components/tins-fa-icon.js';

export class TinsUser extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-richtext': TinsRichTextControl,
			'tins-spinner': TinsSpinner,
			'tins-entry-thumbnail': TinsEntryThumbnail,
			'tins-fa-icon': TinsFaIcon,
		};
	}

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			entries: { type: Array },
			profile: { type: Object },
		};
	}

	constructor() {
		super();
		this.entries = [];
		this.profile = {};
		this.error = "";
		this.loading = false;
	}

	async connectedCallback() {
		super.connectedCallback();
		const userId = this.location.params.userId;
		
		const data = await asyncStateFlags(async () =>
			Promise.all([
				fetchJSONOrThrow(`/api/v1/user/${userId}`),
				fetchJSONOrThrow(`/api/v1/entries/user/${userId}`)
			]), this
		);

		if (data) {
			this.profile = data[0];
			this.entries = data[1].result;
		}
	}

	renderEntry(e) {
		return html`<a href="/entry/${e.id}">
			<tins-entry-thumbnail .entry=${e} footer="${e.competition.title}">
			</tins-entry-thumbnail>
		</a>`;
	}

	renderEditLink() {
		if (!this.profile.editable) return '';
		return html`<div class="topright"><a href="/profile" router-ignore>Edit Profile</a></div>`;
	}

	renderContents() {
		return html`
			<h1><tins-fa-icon src="${personIcon}" size="2rem"></tins-fa-icon> ${this.profile.username}</h1>
			${this.renderEditLink()}
			<p><tins-fa-icon src="${globeIcon}" size="1rem"></tins-fa-icon> ${this.profile.location}
			${this.profile.email ? html`<br><a href="mailto:${this.profile.email}">${this.profile.email}</a>` : ''}
			</p><p>
			<tins-richtext 
				class="richtext" 
				?readOnly=${true} text="${this.profile.info}">
			</tins-richtext>
			<div class="entry-list">${repeat(this.entries, e => this.renderEntry(e, e.competition))}</div>
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
				display: block; // solves text selection issues
			}

			.icons {
					
			}

			.entry-list {
				display: flex;
				flex-flow: row wrap;
			}

			.topright {
				float: right;
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

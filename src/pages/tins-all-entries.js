import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { TinsFrame } from '../components/tins-frame';
import { TinsRichText } from '../components/tins-richtext-control';
import { asyncFetchJSON } from '../util';
import { repeat } from 'lit-html/directives/repeat.js';
import { TinsSpinner } from '../components/tins-spinner';
import { TinsEntryThumbnail } from '../components/tins-entry-thumbnail';

export class TinsAllEntries extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-frame': TinsFrame,
			'tins-richtext': TinsRichText,
			'tins-spinner': TinsSpinner,
			'tins-entry-thumbnail': TinsEntryThumbnail,
		};
	}

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			data: { type: Object },
			groupBy: { type: String }
		};
	}

	constructor() {
		super();
		this.data = {};
		this.error = "";
		this.sort = 'byUser';
		this.loading = false;
	}

	get byCompo() {
		if (!this._byCompo) {
			const byCompo = {};
			for(const entry of this.data.result) {
				const { short } = entry.competition;
				if (!(short in byCompo)) {
					byCompo[short] = {
						entries: [ entry ],
						competition: entry.competition,
					};
				}
				else {
					byCompo[short].entries.push( entry );
				}
			}
			this._byCompo = Object.values(byCompo).sort(
				(a, b) => b.competition.competitionStart - a.competition.competitionStart
			);
		}
		return this._byCompo;
	}

	get byUser() {
		if (!this._byUser) {
			const byUser = {};
			for(const entry of this.data.result) {
				for (const entrant of entry.entrants) {
					const { name, id } = entrant;
					if (!(name in byUser)) {
						byUser[name] = {
							entries: [ entry ],
							user: { name, id },
						};
					}
					else {
						byUser[name].entries.push( entry );
					}
				}
			}

			this._byUser = Object.values(byUser);
		}
		return this._byUser;
	}

	async connectedCallback() {
		super.connectedCallback();
		const data = await asyncFetchJSON(`/api/v1/entries/all`, this);
		if (data) {
			this.data = data;
			this._byCompoSorted = null;
			this._byUser = null;
		}
	}

	renderEntry(e, footer) {
		return html`<a href="/entry/${e.id}">
			<tins-entry-thumbnail 
				.entry=${e}
				footer="${footer}"
			></tins-entry-thumbnail></a>`;
	}

	renderContents() {
		return html`
		<div class="buttons">
			<button @click=${() => this.groupBy = 'byEvent'}>by&nbsp;event</button>
			<button @click=${() => this.groupBy = 'byUser'}>by&nbsp;user</button>
		</div>

		${this.groupBy == 'byEvent'
			? html`${repeat(this.byCompo, i => i.competition.short, 
				i => html`<h2>${i.competition.title}</h2>
				<div class="entry-list">${repeat(i.entries, e => this.renderEntry(e, e.team))}</div>`
			)}` 
			: html`${repeat(this.byUser, i => i.user.id, 
				i => html`<h2>${i.user.name}</h2>
				<div class="entry-list">${repeat(i.entries, e => this.renderEntry(e, e.competition.title))}</div>`
			)}`
		}`;
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

			.entry-list {
				display: flex;
				flex-flow: row wrap;
				justify-content: center;
			}

			.richtext {
				width: 100%;
			}

			.buttons {
				float: right;
			}
	
			button {
				padding: 0.5rem;
				border: 2px solid black;
				width: 5rem;
				background: #FF8;
				color: black;
			}
	
			button:hover {
				background: #CC0;
				transition: 0.1s
			}
	
		`;
	}

}


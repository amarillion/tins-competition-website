import { LitElement, html, css } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { repeat } from 'lit-html/directives/repeat.js';
import commentIcon from '@fortawesome/fontawesome-free/svgs/regular/comment.svg';
import gamepadIcon from '@fortawesome/fontawesome-free/svgs/solid/gamepad.svg';
import reviewIcon from '@fortawesome/fontawesome-free/svgs/solid/vote-yea.svg';
import { TinsFaIcon } from '../components/tins-fa-icon.js';
import { TinsStatusHelper } from '../components/tins-status-helper.js';
import { asyncFetchJSON } from '../util.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { renderRichText } from '../util.js';

export class TinsEntrants extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-status-helper': TinsStatusHelper,
			'tins-fa-icon': TinsFaIcon,
		};
	}

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			data: { type: Array },
		};
	}

	constructor() {
		super();
		this.data = [];
		this.error = {};
		this.loading = false;
	}

	async connectedCallback() {
		super.connectedCallback();
		const compoId = this.location.params.compoId;
		const data = await asyncFetchJSON(`/api/v1/compo/${compoId}/entrants`, this);
		if (data) {
			this.data = data.result;
		}
	}
	
	renderEntrant(entrant, compoId) {
		const { username, info, location, numPosts, entrantId, numReviews, entryId } = entrant;
		
		return html`
		<div class="entrant">
			<p>
				<b>Name:</b> <a href="/user/${username}">${username}</a> <br>
				<b>From:</b> ${location}
			</p><p>
			<p>${unsafeHTML(renderRichText(info))}</p>
			<p>
				<a href="/${compoId}/log/entrant/${entrantId}"><tins-fa-icon src="${commentIcon}"></tins-fa-icon> log (${numPosts})</a> 
				${numReviews > 0 ? html`<a router-ignore href="/${compoId}/reviews/entrant/${entrantId}"><tins-fa-icon src="${reviewIcon}"></tins-fa-icon> reviews (${numReviews})</a>` : ''} 
				${entryId ? html`<a href="/entry/${entryId}"><tins-fa-icon src="${gamepadIcon}"></tins-fa-icon> submission</a>`: ''} 
			</p>
		</div>`;
	}

	renderContents() {
		if (this.loading) return;
		const entrants = this.data;
		const compoId = this.location.params.compoId;
		return html`
		<h1>Entrants</h1>
		<p>
			At this moment, ${entrants.length} people have registered for the competition.
		</p>
		${repeat(entrants, e => e.entrantId, e => this.renderEntrant(e, compoId))}
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

			div.entrant {
				display: block;
				border-top: 1px solid black;
				line-height: 1.5rem;
			}
			div.entrant img {
				max-width: 100%;
			}

			a 			{ font-weight: bold; text-decoration: none; }
			a:link 		{ color: #600; }
			a:hover 	{ text-decoration: underline; }
			a:active 	{ text-decoration: underline; }
		`;
	}

}

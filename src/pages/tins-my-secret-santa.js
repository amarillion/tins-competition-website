import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { TinsFrame } from '../components/tins-frame.js';
import { TinsInlineCountDown } from '../components/tins-inline-count-down.js';
import { registerEventListener, asyncFetchJSON } from '../util.js';
import { TinsStatusHelper } from '../components/tins-status-helper.js';

export class TinsSecretSanta extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-frame': TinsFrame,
			'tins-status-helper': TinsStatusHelper,
			'tins-inline-count-down': TinsInlineCountDown
		};
	}

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			timeCompetitionStart: { type: Number },
			competitionStarted: { type: Boolean },
			compoShort : { type: String },
			secretSanta: { type: Object },
		};
	}

	constructor() {
		super();
		this.unsubscribe = [];
		this.reset();
	}

	reset() {
		this.loading = false;
		this.error = "";
		this.countDown = 0;
		this.competition = null;
		this.secretSanta = null;
		this.competitionStarted = false;
		this.joinedCompetition = false;
	}

	async refresh() {
		this.reset();
		const data = await asyncFetchJSON('/api/v1/mySecretSanta', this);
		if (data) {
			this.competitionStarted = data.competitionStarted;
			this.secretSanta = data.secretSanta;
			this.competition = data.competition;
			this.joinedCompetition = data.joinedCompetition;
		}
	}

	connectedCallback() {
		super.connectedCallback();
		this.refresh();

		this.unsubscribe = [ registerEventListener(this.shadowRoot, 'countdownZero',
			() => setTimeout(() => this.refresh(), 2000)
		) ];
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.unsubscribe.forEach(unsub => unsub());
	}

	static get styles() {
		return css`
			a 			{ font-weight: bold; text-decoration: none; }
			a:link 		{ color: #600; }
			a:hover 	{ text-decoration: underline; }
			a:active 	{ text-decoration: underline; }
		`;
	}

	renderTitle() {
		return this.competition
			? html`<h2>Your Secret Santa for ${this.competition.title}</h2>`
			: html`<h2>Secret Santa</h2>`;
	}

	renderNotJoined() {
		return html`<p>You haven't signed up for this competition. 
			${this.competition.canJoin 
			? html`You can still <a href="/join" router-ignore>sign up</a>.`
			: html`Unfortunately, registration is closed...`
			}</p>`;
	}

	renderContents() {
		if (!this.competition) {
			return html`<p>There is no competition going on today. Come back later!</p>`;
		}
		if (!this.joinedCompetition) {
			return this.renderNotJoined();
		}
		if (!this.competitionStarted) {
			return html`
				Please be patient! 
				Your secret santa will be revealed in 
				<tins-inline-count-down epochMillis="${this.competition.competitionStart}"></tins-inline-count-down>
			`;
		}
		if (!this.secretSanta) {
			// NOTE that absence of secretSanta info is only a problem after start of competition!
			return html`<p>There is no secret santa information available for the current competition.</p>`;
		}

		return html`
			<p>Hello ${this.secretSanta.giver.name},</p>
			<p>
			Santa has decided that you will give a gift to ${this.secretSanta.receiver.name}!
			</p>
			<p>
			You can find their wishlist on 
			<a href="/${this.competition.short}/log/${this.secretSanta.receiver.entrantId}/">their log</a>
			</p>
			`;
	}

	render() {
		return html`<tins-status-helper 
				error="${this.error}" ?loading=${this.loading}
			>${this.renderTitle()}${this.renderContents()}</tins-status-helper>`;
	}
}

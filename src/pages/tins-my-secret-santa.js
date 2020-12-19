import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { TinsFrame } from '../components/tins-frame';
import { TinsSpinner } from '../components/tins-spinner';
import { TinsInlineCountDown } from '../components/tins-inline-count-down';
import registerEventListener from '../util';

export class TinsSecretSanta extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-frame': TinsFrame,
			'tins-spinner': TinsSpinner,
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
		this.unsubscribe = () => {};
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
		this.loading = true;
		const response = await fetch('/api/v1/mySecretSanta');
		if (response.ok) {
			// parse json only if response is OK. Error state may contain invalid json.
			const data = await response.json(); 

			// clear loading flag AFTER awaiting data.
			this.loading = false; 

			this.competitionStarted = data.competitionStarted;
			this.secretSanta = data.secretSanta;
			this.competition = data.competition;
			this.joinedCompetition = data.joinedCompetition;
		}
		else {
			this.loading = false;
			if (response.status === 401) {
				this.error = 'Access denied: you must be logged in';
			}
			else {
				this.error = 'Error: could not fetch data';
			}
		}
	}

	connectedCallback() {
		super.connectedCallback();
		this.refresh();

		this.unsubscribe = registerEventListener(this.shadowRoot, 'countdownZero',
			() => setTimeout(() => this.refresh(), 2000)
		);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.unsubscribe();
	}

	static get styles() {
		return css`
			a 			{ font-weight: bold; text-decoration: none; }
			a:link 		{ color: #600; }
			a:hover 	{ text-decoration: underline; }
			a:active 	{ text-decoration: underline; }

			.spinner {
				width: 100%;
				height: 100%;
			}
		`;
	}

	renderError() {
		return this.error ? html`<div background="red">${this.error}</div>`:'';
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
		if (!this.joinedCompetition) {
			return this.renderNotJoined();
		}
		if (this.competitionStarted) {
			if (!this.secretSanta) {
				return html`<p>There is no secret santa information available for the current competition.</p>`;
			}
			else {
				return html`
				${this.renderTitle()}
				<p>Hello ${this.secretSanta.giver.name},</p>
				<p>
				Santa has decided that you will give a gift to ${this.secretSanta.receiver.name}!
				</p>
				<p>
				You can find their wishlist on 
				<a href="/${this.competition.short}/log/${this.secretSanta.receiver.entrantId}/" router-ignore >their log</a>
				</p>
				`;
			}
		}
		else {
			return html`
				Please be patient! 
				Your secret santa will be revealed in 
				<tins-inline-count-down epochMillis="${this.competition.competitionStart}"></tins-inline-count-down>
			`;
		}

	}

	render() {
		return html`<tins-frame>
			${this.loading 
			? html`<tins-spinner class="spinner"></tins-spinner>` 
			: this.error 
				? html`${this.renderError()}`
				: html`${this.renderTitle()}${this.renderContents()}`
			}</tins-frame>`;

	}
}

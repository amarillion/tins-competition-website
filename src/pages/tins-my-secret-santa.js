import { LitElement, html, css } from 'lit';

import { registerEventListener, asyncFetchJSON } from '../util.js';
import sleighIcon from '@fortawesome/fontawesome-free/svgs/solid/sleigh.svg';

export class TinsSecretSanta extends LitElement {

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
		this.competitionEnded = false;
		this.reverse = {};
	}

	async refresh() {
		this.reset();
		const data = await asyncFetchJSON('/api/v1/mySecretSanta', this);
		if (data) {
			this.competitionStarted = data.competitionStarted;
			this.competitionEnded = data.competitionEnded;
			this.secretSanta = data.secretSanta;
			this.competition = data.competition;
			this.joinedCompetition = data.joinedCompetition;
			this.reverse = data.reverse;
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

	renderEndLetter() {
		const formattedDate = new Date(this.competition.competitionEnd)
			.toLocaleDateString([], { dateStyle:'long' });
		return html`
		<div class="letter">
			<p class="right">North Pole, ${formattedDate}</p>
			<div style="float: right;">
				<tins-fa-icon src="${sleighIcon}" color="crimson" size="4rem"><tins-fa-icon>
			</div>
			<p>Hello ${this.secretSanta.giver.name},</p>
			<p>
			Did you already receive your gift from ${this.reverse.name}?
			</p>
			<p>
			Check their 
			${this.reverse.entryId ? html`<a href="/entry/${this.reverse.entryId}/">entry page</a> and `: ''}
			<a href="/${this.competition.short}/log/entrant/${this.reverse.entrantId}/">their log</a>
			to see if they uploaded something for you!
			</p>
			<br>
			<p>Best wishes, </p>
			<p class="indent">Santa.</p>
		</div>`;
	}

	renderStartLetter() {
		const formattedDate = new Date(this.competition.competitionStart)
			.toLocaleDateString([], { dateStyle:'long' });
		return html`
		<div class="letter">
			<p class="right">North Pole, ${formattedDate}</p>
			<div style="float: right;">
				<tins-fa-icon src="${sleighIcon}" color="crimson" size="4rem"><tins-fa-icon>
			</div>
			<p>Hello ${this.secretSanta.giver.name},</p>
			<p>
			I have decided that you will give a gift to ${this.secretSanta.receiver.name}!
			</p>
			<p>
			You can find their wishlist on 
			<a href="/${this.competition.short}/log/entrant/${this.secretSanta.receiver.entrantId}/">their log</a>
			</p>
			<br>
			<p>Best wishes, </p>
			<p class="indent">Santa.</p>
		</div>`;
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
			${this.competitionEnded ? this.renderEndLetter() : ''}
			${this.renderStartLetter()}
		`;
	}

	render() {
		return html`<tins-status-helper 
				error="${this.error}" ?loading=${this.loading}
			>${this.renderTitle()}${this.renderContents()}</tins-status-helper>`;
	}

	static get styles() {
		return css`
			a 			{ font-weight: bold; text-decoration: none; }
			a:link 		{ color: #600; }
			a:hover 	{ text-decoration: underline; }
			a:active 	{ text-decoration: underline; }

			.letter {
				margin: 3rem;
				padding: 3rem;
				border: 1px solid black;
				box-shadow: 10px 10px 10px black;
			}

			.right {
				text-align: right;
			}

			.indent {
				padding-left: 6rem;
			}
		`;
	}
}

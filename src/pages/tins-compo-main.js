import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { TinsCurrentEvent } from '../components/tins-current-event.js';
import { TinsFaIcon } from '../components/tins-fa-icon.js';
import { StoreSubscriberMixin } from '../data/storeSubscriberMixin.js';

import calendarIcon from '@fortawesome/fontawesome-free/svgs/solid/calendar-alt.svg';
import joinIcon from '@fortawesome/fontawesome-free/svgs/regular/hand-point-right.svg';
import rulesIcon from '@fortawesome/fontawesome-free/svgs/solid/book.svg';
import logsIcon from '@fortawesome/fontawesome-free/svgs/solid/comments.svg';
import gamepadIcon from '@fortawesome/fontawesome-free/svgs/solid/gamepad.svg';
import voteIcon from '@fortawesome/fontawesome-free/svgs/solid/vote-yea.svg';
import trophyIcon from '@fortawesome/fontawesome-free/svgs/solid/trophy.svg';
import liveIcon from '@fortawesome/fontawesome-free/svgs/solid/heartbeat.svg';
import { TinsCountDown } from '../components/tins-count-down.js';
import { asyncFetchJSON } from '../util.js';

export class TinsCompoMain extends ScopedElementsMixin(LitElement) {

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			compo: { type: Object },
		};
	}

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			compo: { type: Object },
		};
	}

	constructor() {
		super();
		this.compo = {};
		this.error = {};
		this.loading = false;
	}

	async connectedCallback() {
		super.connectedCallback();
		const compoId = this.location.params.compoId;
		const data = await asyncFetchJSON(`/api/v1/event/${compoId}`, this);
		if (data) {
			this.compo = data;
		}
	}

	static get scopedElements() {
		return {
			'tins-current-event': TinsCurrentEvent,
			'tins-fa-icon': TinsFaIcon,
			'tins-count-down': TinsCountDown,
		};
	}

	renderRulesBlock(compo) {
		const { title, competitionStart, competitionEnd, votingEnd, canJoin, numEntrants, canPost, short, serverTime } = compo;
		return html`
		<div class="block">
			<h3><tins-fa-icon class="icon" src="${rulesIcon}" size="2rem"></tins-fa-icon>Rules</h3>
			<p><a href="${short}/rules" router-ignore>Read the rules</a></p>
			<tins-count-down label="Special rules will be announced in"       epochMillis=${competitionStart}></tins-count-down>
		</div>`;
	}

	renderJoinBlock(compo) {
		const { title, competitionStart, competitionEnd, votingEnd, canJoin, numEntrants, canPost, short, joinedCompetition } = compo;
		if (!canJoin) return '';
		return html`
		<div class="block">
			<h3><tins-fa-icon class="icon" src="${joinIcon}" size="2rem"></tins-fa-icon>Sign up!</h3>
			</p>
			<p>There are ${numEntrants} participants.</p>
			${joinedCompetition
				? html`You signed up successfully! <a href="/join/" router-ignore>Click to modify</a>`
				: html`<a href="/join/" router-ignore>Click to join</a>!` 
			}
			</p>
		</div>`;
	}

	renderVoteBlock(compo) {
		const { title, competitionStart, competitionEnd, votingEnd, canJoin, numEntrants, canPost, canVote, short } = compo;
		if (!canVote) return '';
		return html`
		<div class="block">
			<h3><tins-fa-icon class="icon" src="${voteIcon}" size="2rem"></tins-fa-icon>Voting</h3>
			<tins-count-down label="Voting ends" epochMillis=${votingEnd}></tins-count-down>
			<p>Voting is now active. <a href="/${short}/vote">Cast your vote!</a></p>
		</div>`
	}

	renderLiveBlock(compo) {
		const { title, competitionStart, competitionEnd, votingEnd, canJoin, numEntrants, canPost, canVote, short, serverTime } = compo;
		if (serverTime > competitionEnd || serverTime < competitionStart) return '';
		return html`
		<div class="block">
			<h3><tins-fa-icon class="icon" src="${liveIcon}" size="2rem"></tins-fa-icon>${title} is live</h3>
			<tins-count-down label="Finish"      epochMillis=${competitionEnd}></tins-count-down>
			<p><a href="/${short}/upload" router-ignore>Upload here</a></p>
		</div>`;
	}

	renderResultsBlock(compo) {
		const { title, competitionStart, competitionEnd, votingEnd, canJoin, numEntrants, canPost, canVote, short, hasResults } = compo;
		if (!hasResults) return '';
		return html`
		<div class="block">
			<h3><tins-fa-icon class="icon" src="${trophyIcon}" size="2rem"></tins-fa-icon>Results</h3>
			<p><a href="/${short}/results" router-ignore>Click here to see the results</a>
		</div>`;
	}

	renderCalendarBlock(compo) {
		const { title, competitionStart, competitionEnd, votingEnd, canJoin, numEntrants, canPost, short, serverTime } = compo;
		if (serverTime > competitionStart) return '';

		const formatDate = d => new Date(d).toLocaleDateString('en-GB', { month: 'short', day: 'numeric'});
		if (!canJoin) return '';
		return html`
		<div class="block">
			<h3><tins-fa-icon class="icon" src="${calendarIcon}" size="2rem"></tins-fa-icon>Important dates</h3>
			<p>
			${title} will be held from <b>${formatDate(competitionStart)}</b> to <b>${formatDate(competitionEnd)}</b>. Mark your calendar!
			</p>
		</div>`
	}

	renderLogsBlock(compo) {
		const { title, competitionStart, competitionEnd, votingEnd, canJoin, numEntrants, canPost, short, numLogs, joinedCompetition } = compo;
		if (!(canPost || numLogs)) return '';

		const message = (canPost && joinedCompetition) ? 'Add or update your log' : `View logs (${numLogs} posts)`;
		return html`
		<div class="block">
			<h3><tins-fa-icon class="icon" src="${logsIcon}" size="2rem"></tins-fa-icon>Log messages</h3>
			<p><a href="/${short}/log/">${message}</a></p>
		</div>`;
	}

	renderEntriesBlock(compo) {
		const { numReviews, numEntries, short } = compo;
		if (!numEntries) return '';
		return html`
		<div class="block">
			<h3><tins-fa-icon class="icon" src="${gamepadIcon}"></tins-fa-icon>Entries</h3>
			${numEntries ? html`<p>${numEntries} submissions. <a href="${short}/entries" router-ignore>Download and try them out!</a></p>` : ''}
			${numReviews ? html`<p><a href="/${short}/reviews" router-ignore>Read reviews</a></p>` : ''}
		</div>`;
	}

	render() {
		const compo = this.compo || {};
		const { title, competitionStart, competitionEnd, votingEnd, canJoin, numEntrants, canPost, short } = compo;
		return html`<h1>${title}</h1>
		<div class="container">
			${this.renderResultsBlock(compo)}
			${this.renderEntriesBlock(compo)}
			${this.renderCalendarBlock(compo)}
			${this.renderJoinBlock(compo)}
			${this.renderRulesBlock(compo)}
			${this.renderLiveBlock(compo)}
			${this.renderLogsBlock(compo)}
			${this.renderVoteBlock(compo)}
		</div>
		`;
	}

	static get styles() {
		return css`
			a 			{ font-weight: bold; text-decoration: none; }
			a:link 		{ color: #600; }
			a:hover 	{ text-decoration: underline; }
			a:active 	{ text-decoration: underline; }

			.block {
				border: 2px dashed black;
				width: 100%;
				padding: 1rem;
				box-sizing: border-box;

				display: inline-block;
				margin-bottom: 1rem;
			}

			.icon {
				margin-right: 0.5rem;
			}

			.block h3 {
				color: teal;
				margin-top: 0;
			}

			@media (min-width: 1024px) {
				.container {
					column-count: 2;
				}
			}

		`;
	}

}

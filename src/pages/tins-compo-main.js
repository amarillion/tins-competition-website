import { LitElement, html, css } from 'lit';

import calendarIcon from '@fortawesome/fontawesome-free/svgs/solid/calendar.svg';
import joinIcon from '@fortawesome/fontawesome-free/svgs/regular/hand-point-right.svg';
import rulesIcon from '@fortawesome/fontawesome-free/svgs/solid/book.svg';
import logsIcon from '@fortawesome/fontawesome-free/svgs/solid/comments.svg';
import gamepadIcon from '@fortawesome/fontawesome-free/svgs/solid/gamepad.svg';
import voteIcon from '@fortawesome/fontawesome-free/svgs/solid/check-to-slot.svg';
import trophyIcon from '@fortawesome/fontawesome-free/svgs/solid/trophy.svg';
import liveIcon from '@fortawesome/fontawesome-free/svgs/solid/heart-pulse.svg';
import { asyncFetchJSON } from '../util.js';

export class TinsCompoMain extends LitElement {

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
		this.loading = true;
	}

	async connectedCallback() {
		super.connectedCallback();
		const compoId = this.location.params.compoId;
		const data = await asyncFetchJSON(`/api/v1/compo/${compoId}`, this);
		if (data) {
			this.compo = data;
		}
	}

	renderRulesBlock(compo) {
		const { competitionStart, short } = compo;
		return html`
		<div class="block">
			<h3><tins-fa-icon class="icon" src="${rulesIcon}" size="2rem"></tins-fa-icon>Rules</h3>
			<p><a href="${short}/rules">Read the rules</a></p>
			<tins-count-down label="Find out your extra rules in"       epochMillis=${competitionStart}></tins-count-down>
		</div>`;
	}

	renderJoinBlock(compo) {
		const { canJoin, numEntrants, joinedCompetition } = compo;
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
		const { votingEnd, canVote, short, joinedCompetition } = compo;
		if (!(canVote && joinedCompetition)) return '';
		return html`
		<div class="block">
			<h3><tins-fa-icon class="icon" src="${voteIcon}" size="2rem"></tins-fa-icon>Voting</h3>
			<tins-count-down label="Voting ends" epochMillis=${votingEnd}></tins-count-down>
			<p>Voting is now active. <a href="/${short}/vote">Cast your vote!</a></p>
		</div>`;
	}

	renderLiveBlock(compo) {
		const { title, competitionStart, competitionEnd, short, serverTime } = compo;
		if (serverTime > competitionEnd || serverTime < competitionStart) return '';
		return html`
		<div class="block">
			<h3><tins-fa-icon class="icon" src="${liveIcon}" size="2rem"></tins-fa-icon>${title} is live</h3>
			<tins-count-down label="Finish"      epochMillis=${competitionEnd}></tins-count-down>
			<p><a href="/${short}/upload" router-ignore>Upload here</a></p>
		</div>`;
	}

	renderResultsBlock(compo) {
		const { short, hasResults } = compo;
		if (!hasResults) return '';
		return html`
		<div class="block">
			<h3><tins-fa-icon class="icon" src="${trophyIcon}" size="2rem"></tins-fa-icon>Results</h3>
			<p><a href="/${short}/results">Click here to see the results</a>
		</div>`;
	}

	renderCalendarBlock(compo) {
		const { title, competitionStart, competitionEnd, canJoin, serverTime } = compo;
		if (serverTime > competitionStart) return '';

		const formatDate = d => new Date(d).toLocaleDateString('en-GB', { month: 'short', day: 'numeric'});
		if (!canJoin) return '';
		return html`
		<div class="block">
			<h3><tins-fa-icon class="icon" src="${calendarIcon}" size="2rem"></tins-fa-icon>Important dates</h3>
			<p>
			${title} will be held from <b>${formatDate(competitionStart)}</b> to <b>${formatDate(competitionEnd)}</b>. Mark your calendar!
			</p>
		</div>`;
	}

	renderLogsBlock(compo) {
		const { canPost, short, numLogs, joinedCompetition } = compo;
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

	renderContents() {
		const compo = this.compo || {};
		if (!compo) return ''; // loading or error...
		const { title } = compo;
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

	renderBreadCrumbs() {
		const compoId = this.location.params.compoId;
		return html`<tins-breadcrumbs .data=${[{ title: compoId }]}></tins-breadcrumbs>`;
	}

	render() {
		return html`${this.renderBreadCrumbs()}
			<tins-status-helper 
				error="${this.error}" ?loading=${this.loading}
			>${this.renderContents()}</tins-status-helper>`;
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

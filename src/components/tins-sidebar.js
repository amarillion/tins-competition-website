import { LitElement, html, css } from 'lit-element';
import { dispatch } from '../store.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { refreshCurrentEvent } from '../data/currentEvent.js';
import { StoreSubscriberMixin } from '../data/storeSubscriberMixin.js';
import { currentUserSelector } from '../data/currentUser.js';

export class TinsSideBar extends StoreSubscriberMixin(LitElement) {

	static get properties() {
		return {
			isStaff: { type: Boolean },
			username: { type: String },
			currentEvent: { type: Object },
		};
	}

	constructor() {
		super();
		this.isStaff = false;
		this.username = null;
		this.curentEvent = {};
	}

	get selectors() {
		return {
			isStaff: s => s.currentUser.data && s.currentUser.data.isStaff,
			username: currentUserSelector,
			currentEvent: s=> s.currentEvent.data && s.currentEvent.data.currentEvent
		};
	}
	
	connectedCallback() {
		super.connectedCallback();
		dispatch(refreshCurrentEvent());
	}

	renderCurrentEvent() {
		const currentEvent = this.currentEvent || {};
		const { short, title, joinedCompetition, canJoin, competitionStart, competitionEnd, serverTime, canVote } = currentEvent;
		const afterStart = serverTime > competitionStart;
		const afterEnd = serverTime > competitionEnd;
		return html`<div class="toc">
			<a href="/${short}/">${title}</a>
			<hr>
			${canJoin ? html`<a href="/join" router-ignore>Join</a>` : ''}
			<a href="/2021/rules" router-ignore>Rules</a>
			<a href="/2021/entrants" router-ignore>Entrants</a>
			${(afterStart) ? html`<a href="/2021/entries" router-ignore>Entries</a>` : ''}
			${(afterEnd) ? html`<a href="/2021/results" router-ignore>Results</a>` : ''}
			${(afterEnd) ? html`<a href="/2021/reviews" router-ignore>Reviews</a>` : ''}
			<a href="/2021/log">Logs</a>
			${(joinedCompetition && afterStart) ? html`<a href="/2021/upload" router-ignore>Upload</a>` : ''}
			${(joinedCompetition && canVote) ? html`<a href="/2021/vote" router-ignore>Vote</a>` : ''}
		</div>`;
	}

	render() {
		return html`
		<nav id="rightcontent">

			<div class="toc">

				<a href="/news">News</a>
				<a href="/about">About</a>
				<a href="/support">Support TINS</a>
				<a href="/faq">FAQ</a>
				<a href="/history">History</a>
		
			${this.username ? html`
				<a href="/user/${this.username}">My Profile</a>
				<a href="/accounts/password/change" router-ignore>Change password</a>
			` : ''}
				${this.isStaff ? html`<hr><a href="/admin/" router-ignore>admin</a>` : '' }
			</div>
			
			${this.renderCurrentEvent()}
		</nav>
		
		`;
	}

	
	static get styles() {
		return css`

		a 			{ font-weight: bold; text-decoration: none; }
		a:link 		{ color: #600; }
		a:visited 	{	}
		a:hover 	{ text-decoration: underline; }
		a:active 	{ text-decoration: underline; }

		nav {
			display: flex;
		}
		
		@media (max-width: 1023px) {
			nav {
				flex-direction: row;
				flex-wrap: wrap;
			}
			
			.toc {
				flex: 1 1 auto;
			}
		}
		
		@media (min-width: 1024px) {
			nav {
				flex-direction: column;
				align-items: stretch;
				flex-wrap: nowrap;
			}
		
			.toc {
				flex: 0 0 auto;
			}
		}
		
		.toc {
			background-color: #ff8;
			border: 4px dashed #cc0;
			padding: 10px 20px 10px 20px;
			margin: 20px 40px;
		}
		
		.toc a {
			color: #00f;
			font-size: small;
			white-space: nowrap;
			padding-right: 20px;
			display: block;
		}
		
		`;
	}

}

customElements.define('tins-sidebar', TinsSideBar);
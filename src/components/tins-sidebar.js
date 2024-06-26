import { LitElement, html, css } from 'lit';
import { dispatch } from '../store.js';
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
		this.latestEvent = {};
	}

	get selectors() {
		return {
			isStaff: s => s.currentUser.data && s.currentUser.data.isStaff,
			username: currentUserSelector,
			currentEvent: s => s.currentEvent.data && s.currentEvent.data.currentEvent,
			latestEvent: s => s.currentEvent.data && s.currentEvent.data.events[0],
		};
	}
	
	connectedCallback() {
		super.connectedCallback();
		dispatch(refreshCurrentEvent());
	}

	renderCurrentEvent() {
		const currentEvent = this.currentEvent || {};
		const latestEvent = this.latestEvent || {};
		const { short, title, afterStart, afterEnd } = latestEvent;
		const { joinedCompetition, canJoin, canVote, hasSecretSanta } = currentEvent;
		return html`<div class="toc">
			<a href="/${short}/">${title}</a>
			<hr>
			${(afterStart && !afterEnd && hasSecretSanta) ? html`<a href="/secretsanta">My Secret Santa</a>` : ''}
			${canJoin ? html`<a href="/join" router-ignore>Join</a>` : ''}
			<a href="/${short}/rules">Rules</a>
			<a href="/${short}/entrants">Entrants</a>
			${(afterStart) ? html`<a href="/${short}/entries" router-ignore>Entries</a>` : ''}
			${(afterEnd) ? html`<a href="/${short}/results">Results</a>` : ''}
			${(afterEnd) ? html`<a href="/${short}/reviews" router-ignore>Reviews</a>` : ''}
			<a href="/${short}/log">Logs</a>
			${(joinedCompetition && afterStart) ? html`<a href="/${short}/upload" router-ignore>Upload</a>` : ''}
			${(joinedCompetition && afterStart) ? html`<a href="/${short}/myEntry">My entry</a>` : ''}
			${(joinedCompetition && canVote) ? html`<a href="/${short}/vote" router-ignore>Vote</a>` : ''}
		</div>`;
	}

	render() {
		return html`
		<nav id="rightcontent">

			<div class="toc">

				<a href="/news">News</a>
				<a href="/about">About</a>
				<a href="/support">Shop &amp; Support</a>
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

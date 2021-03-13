import { LitElement, html, css } from 'lit-element';
import { StoreSubscriberMixin } from '../data/storeSubscriberMixin.js';

import { TinsCountDown } from './tins-count-down.js';
customElements.define('tins-count-down', TinsCountDown);

export class TinsCurrentEvent extends StoreSubscriberMixin(LitElement) {

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			currenEvent: { type: Object },
			hidden: { type: Boolean, reflect: true },
		};
	}

	get selectors() {
		return {
			currentEvent: s => s.currentEvent.data && s.currentEvent.data.currentEvent,
			loading: s => s.currentEvent.loading,
			error: s => s.currentEvent.error
		}
	}

	constructor() {
		super();
		this.hidden = true;
		this.currentEvent = {};
	}

	updated(changedProperties) {
		if (changedProperties.has('currentEvent')) {
			this.hidden = !currentEvent;
		}
	}

	render() {
		if (!this.currentEvent) return '';
		const { title, competitionStart, competitionEnd, votingEnd, canJoin, numEntrants, canPost, short } = this.currentEvent;
		return html`
			Current event:
			<h1>${title}</h1>
			<div class="datelist">
			<tins-count-down label="Start"       epochMillis=${competitionStart}></tins-count-down>
			<tins-count-down label="Finish"      epochMillis=${competitionEnd}></tins-count-down>
			<tins-count-down label="Voting ends" epochMillis=${votingEnd}></tins-count-down>
			</div>
			${canJoin
			? html`Already ${numEntrants} signed up. <a href="/join/" router-ignore>Click to join</a>!` 
			: ''}
			${canPost
				? html`<br><a href="/${short}/log/">View the latest logs</a>.`
				: ''}
		`;
	}

	static get styles() {
		return css`
			:host {
				display: block;
				background: #FFEEDD;
				padding: 10px;
				color: black;
				margin-bottom: 1rem;
			}

			:host([hidden]) {
				display: none;
			}

			h1 {
				margin: 0;
				color: teal;
				font-size: 24px;
			}

			a        { font-weight: bold; text-decoration: none; }
			a:link   { color: #600; }
			a:hover  { text-decoration: underline; }
			a:active { text-decoration: underline; }

		`;
	}

}

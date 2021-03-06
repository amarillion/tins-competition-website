import { LitElement, html, css } from 'lit-element';
import { subscribe } from '../store';

import { TinsCountDown } from './tins-count-down.js';
customElements.define('tins-count-down', TinsCountDown);

export class TinsCurrentEvent extends LitElement {

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			currenEvent: { type: Object },
			hidden: { type: Boolean, reflect: true },
		};
	}

	constructor() {
		super();
		this.hidden = true;
		this.currentEvent = {};
	}

	connectedCallback() {
		super.connectedCallback();

		this.unsubscribe = [
			subscribe(s => s.currentEvent.data && s.currentEvent.data.currentEvent, currentEvent => { 
				this.currentEvent = currentEvent || {};
				this.hidden = !currentEvent;
			}),
			subscribe(s => s.currentEvent.loading, loading => { this.loading = loading || []; }),
			subscribe(s => s.currentEvent.error, error => { this.error = error || []; }),
		];
	}

	disconnectedCallback() {
		this.unsubscribe.forEach(unsub => unsub());
	}

	render() {
		return html`
			Current event:
			<h1>${this.currentEvent.title}</h1>
			<div class="datelist">
			<tins-count-down label="Start"       epochMillis=${this.currentEvent.competitionStart}></tins-count-down>
			<tins-count-down label="Finish"      epochMillis=${this.currentEvent.competitionEnd}></tins-count-down>
			<tins-count-down label="Voting ends" epochMillis=${this.currentEvent.votingEnd}></tins-count-down>
			</div>
			${this.currentEvent.canJoin
			? html`Already ${this.currentEvent.numEntrants} signed up. <a href="/join/" router-ignore>Click to join</a>!` 
			: ''}
			${this.currentEvent.canPost
				? html`<br><a href="/${this.currentEvent.short}/log/">View the latest logs</a>.`
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

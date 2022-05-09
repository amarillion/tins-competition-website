import { LitElement, html, css } from 'lit';
import { StoreSubscriberMixin } from '../data/storeSubscriberMixin.js';
import { asyncFetchJSON } from '../util.js';

import { TinsCountDown } from './tins-count-down.js';
customElements.define('tins-count-down', TinsCountDown);

export class TinsCurrentEvent extends StoreSubscriberMixin(LitElement) {

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			currentEvent: { type: Object },
			hidden: { type: Boolean, reflect: true },
			posts: { type: Array }
		};
	}

	get selectors() {
		return {
			currentEvent: s => s.currentEvent.data && s.currentEvent.data.currentEvent,
			loading: s => s.currentEvent.loading,
			error: s => s.currentEvent.error
		};
	}

	constructor() {
		super();
		this.hidden = true;
		this.posts = null;
		this.currentEvent = {};
	}

	connectedCallback() {
		super.connectedCallback();
		this.refreshLogs();
	}

	async refreshLogs() {
		if (!this.currentEvent) return;
		if (this.posts != null) return; // already loaded...
		
		const { short } = this.currentEvent;
		const data = await asyncFetchJSON(`/api/v1/log/event/${short}`, this);
		if (data) {
			this.posts = data.posts;
		}
	}

	updated(changedProperties) {
		if (changedProperties.has('currentEvent')) {
			this.hidden = !this.currentEvent;
			this.refreshLogs();
		}
	}

	formatRelativeTime(millis) {
		try {
			const rtf = new Intl.RelativeTimeFormat("en", {
				style: "long", // other values: "long", "short" or "narrow"
			});
			const deltaMillis = new Date(millis) - Date.now();
			const deltaMinutes = Math.round(deltaMillis / 60000);
			if (Math.abs(deltaMinutes) < 60) {
				return rtf.format(deltaMinutes, "minute");
			}
			else if (Math.abs(deltaMinutes) < 60*24) {
				const deltaHours = Math.round(deltaMinutes / 60);
				return rtf.format(deltaHours, "hour");
			}
			else {
				const deltaDays = Math.round(deltaMinutes / (60*24));
				return rtf.format(deltaDays, "day");
			}
		}
		catch (e) {
			// Intl.RelatvieTimeFormat not supported
			return '';
		}
	}

	renderLastPost() {
		if (!this.posts) return;
		const [ post ] = this.posts;
		
		const relativeText = this.formatRelativeTime(post.date);

		const stripped = new DOMParser().parseFromString(post.text, 'text/html').body.textContent;
		const fragment = stripped.split(" ").slice(0, 15).join(" ") + "...";
		return html`
			<div class="latestPost">
			<i>${fragment}</i>
			<span style="color: grey;">posted ${relativeText} by ${post.entrant.name}</span>.
			</div>
		`;
	}

	renderLogs() {
		const { canPost, short } = this.currentEvent;
		if (!canPost) return '';
		
		return html`
			<hr>
			<a href="/${short}/log/">View the latest logs</a>.
			${this.renderLastPost()}
		`;
	}

	render() {
		if (!this.currentEvent) return '';
		const { title, competitionStart, competitionEnd, votingEnd, canJoin, numEntrants } = this.currentEvent;
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
			${this.renderLogs()}
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

			.latestPost {
				padding: 10px;
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

import { LitElement, html, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat.js';
import { subscribe } from '../store';
import twitterIcon from '@fortawesome/fontawesome-free/svgs/brands/twitter.svg';
 
export class TinsUpcoming extends LitElement {

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			upcoming: { type: Array },
			hidden: { type: Boolean, reflect: true },
		};
	}

	constructor() {
		super();
		this.hidden = true;
		this.upcoming = [];
	}

	static get styles() {
		return css`
			:host {
				display: block;
				border: 2px dashed grey;
				padding: 10px;
				color: black;
				background: lightgrey;
			}

			:host([hidden]) {
				display: none;
			}

			h1 {
				margin: 0;
				color: teal;
			}

			a        { font-weight: bold; text-decoration: none; }
			a:link   { color: #600; }
			a:hover  { text-decoration: underline; }
			a:active { text-decoration: underline; }
		`;
	}

	connectedCallback() {
		super.connectedCallback();

		this.unsubscribe = [
			subscribe(s => s.currentEvent.data && s.currentEvent.data.upcoming, upcoming => { 
				this.upcoming = upcoming || [];
				this.hidden = this.upcoming.length == 0;
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
			<h1>Coming up</h1>
			<p><i>Mark these events in your calendar!</i></p>
			${repeat(this.upcoming, u => html`<b>${u.dateStr}</b> <span>${u.title}</span><br>`)}
			<hr>
			Stay informed! To get notified of upcoming events, <a href="https://groups.google.com/d/forum/tinscompetition">join our google group</a><br> 
			<tins-fa-icon src="${twitterIcon}" size="1rem"></tins-fa-icon><a href="https://twitter.com/mpvaniersel">@mpvaniersel</a>
		`;
	}
}

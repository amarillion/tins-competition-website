import { LitElement, html, css } from 'lit-element';
import { subscribe } from '../store';

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

	renderIfFuture(label, epochMillis) {
		
		const d = new Date(epochMillis);
		const now = Date.now();

		const deltaSec = Math.floor((d - now) / 1000);
		if (deltaSec < 0) return ''; // time in past is not displayed

		const sec = deltaSec % 60;
		const min = Math.floor(deltaSec / 60) % 60;
		const hours = Math.floor(deltaSec / 3600) % 24;
		const days = Math.floor(deltaSec / 86400);

		let numbers, labels;
		if (days > 0) {
			numbers = [ days, hours ];
			labels = [ "days", "hours" ];
		}
		else if (hours > 0) {
			numbers = [ hours, min ];
			labels = [ "hours", "min" ];
		}
		else {
			numbers = [ min, sec ];
			labels = [ "min", "sec" ];
		}

		return html`
			<div>${label}:</div> 
			<div class="countdown">
				<div class="numbers">${numbers[0]}</div><div class="labels">${labels[0]}</div>
				<div class="numbers">${numbers[1]}</div><div class="labels">${labels[1]}</div>
			</div>`;
	}

	render() {
		return html`
			Current event:
			<h1>${this.currentEvent.title}</h1>
			<div class="datelist">
			${this.renderIfFuture("Start", this.currentEvent.competitionStart)}
			${this.renderIfFuture("Finish", this.currentEvent.competitionEnd)}
			${this.renderIfFuture("Voting ends", this.currentEvent.votingEnd)}
			</div>
			Already ${this.currentEvent.numEntrants} signed up. <a href="/join/">Click to join</a>!
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

			.datelist {
				display: grid;
				grid-template-columns: 1fr 1fr;
				margin: 1rem 0;
				justify-items: end;
				align-items: center;
			}

			.countdown {
				display: grid;
				grid-auto-flow: column;
				grid-template-columns: 4rem 4rem;
				grid-template-rows: 3rem 1rem;
			}

			.numbers {
				background: #ff9000;
				color: white;
				margin: 4px;
				text-align: center;
				font-size: 32px;
				box-shadow: 3px 3px 6px grey;
				border-radius: 3px;
				font-weight: bold;
			}

			.labels {
				color: grey;
				text-align: center;
			}
		`;
	}

}

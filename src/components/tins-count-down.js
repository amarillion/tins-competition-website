import { LitElement, html, css } from 'lit-element';

export class TinsCountDown extends LitElement {

	static get properties() {
		return {
			epochMillis: { type: Number },
			label: { type: String },
			hidden: { type: Boolean, reflect: true },
		};
	}

	constructor() {
		super();
		this.label = "";
		this.hidden = true;
		this.epochMillis = 0;
	}

	getDeltaSec() {
		const d = new Date(this.epochMillis);
		const now = Date.now();

		const deltaSec = Math.floor((d - now) / 1000);
		return deltaSec;
	}

	updated(/* changedProperties */) {
		this.hidden = !(this.epochMillis && this.getDeltaSec() >= 0);
	}

	render() {
		const deltaSec = this.getDeltaSec();
		if (deltaSec < 0) return ''; // time in past is not displayed

		const sec = deltaSec % 60;
		const min = Math.floor(deltaSec / 60) % 60;
		const hours = Math.floor(deltaSec / 3600) % 24;
		const days = Math.floor(deltaSec / 86400);

		let numbers, labels;
		if (days > 0) {
			numbers = [ days, hours ];
			labels = [ "days", "hours" ];
			setTimeout(() => this.requestUpdate(), 60*60*1000);
		}
		else 
		if (hours > 0) {
			numbers = [ hours, min ];
			labels = [ "hours", "min" ];
			setTimeout(() => this.requestUpdate(), 60*1000);
		}
		else {
			numbers = [ min, sec ];
			labels = [ "min", "sec" ];
			setTimeout(() => this.requestUpdate(), 1000);
		}

		return html`
			<div>${this.label}:</div> 
			<div class="countdown">
				<div class="numbers">${numbers[0]}</div><div class="labels">${labels[0]}</div>
				<div class="numbers">${numbers[1]}</div><div class="labels">${labels[1]}</div>
			</div>`;
	}

	static get styles() {
		return css`
			:host {
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

			:host([hidden]) {
				display: none;
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
